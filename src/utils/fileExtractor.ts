import * as pdfjsLib from 'pdfjs-dist';
import { Attachment } from '../types';

// Set up PDF worker using bundled worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export const SUPPORTED_EXTENSIONS = [
  // Images
  '.png', '.jpg', '.jpeg', '.webp', '.gif',
  // Documents
  '.pdf', '.txt', '.md', '.markdown', '.csv', '.json',
  // Code
  '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss',
  '.c', '.cpp', '.h', '.java', '.go', '.rs', '.sql', '.sh', '.yaml', '.yml', '.xml'
];

export async function processUploadedFile(file: File): Promise<Attachment> {
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Image Files
  if (file.type.startsWith('image/')) {
    const base64Data = await readFileAsBase64(file);
    // Strip "data:image/...;base64," prefix
    const cleanBase64 = base64Data.split(',')[1] || base64Data;
    return {
      id,
      name: file.name,
      size: file.size,
      mimeType: file.type || 'image/png',
      data: cleanBase64,
      previewUrl: base64Data,
    };
  }

  // 2. PDF Files
  if (file.type === 'application/pdf' || extension === '.pdf') {
    try {
      const text = await extractTextFromPdf(file);
      return {
        id,
        name: file.name,
        size: file.size,
        mimeType: 'application/pdf',
        textContent: text || '(Empty PDF document)',
      };
    } catch (err: any) {
      console.warn('PDF extraction fallback:', err);
      // Fallback: read as raw text or notice
      return {
        id,
        name: file.name,
        size: file.size,
        mimeType: 'application/pdf',
        textContent: `[PDF File: ${file.name} - ${(file.size / 1024).toFixed(1)} KB]`,
      };
    }
  }

  // 3. Plain Text, Code, CSV, Markdown, JSON
  const isTextLike =
    file.type.startsWith('text/') ||
    [
      '.txt', '.csv', '.json', '.md', '.markdown',
      '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss',
      '.c', '.cpp', '.h', '.java', '.go', '.rs', '.sql', '.sh', '.yaml', '.yml', '.xml'
    ].includes(extension);

  if (isTextLike) {
    const textContent = await readFileAsText(file);
    return {
      id,
      name: file.name,
      size: file.size,
      mimeType: file.type || 'text/plain',
      textContent,
    };
  }

  throw new Error(
    `Unsupported file type "${file.name}". POTASSIUM supports images (PNG, JPG, WEBP, GIF), documents (PDF, TXT, CSV, JSON, MD), and code files.`
  );
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const maxPages = Math.min(pdf.numPages, 30); // Support up to 30 pages
  const textPages: string[] = [];

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageStrings = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    textPages.push(`--- Page ${pageNum} ---\n${pageStrings}`);
  }

  if (pdf.numPages > maxPages) {
    textPages.push(`\n[Note: Document truncated at page ${maxPages} of ${pdf.numPages}]`);
  }

  return textPages.join('\n\n');
}
