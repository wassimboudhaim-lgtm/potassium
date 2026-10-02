export interface Attachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  data?: string; // Base64 string for images (without data:image/*;base64, prefix)
  textContent?: string; // Text content for txt, csv, pdf, code
  previewUrl?: string;
}

export interface Citation {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  citations?: Citation[];
  imageUrl?: string;
  svgContent?: string;
  isImageGeneration?: boolean;
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  pinned?: boolean;
  archived?: boolean;
}

export interface Capabilities {
  textAndReasoning: boolean;
  vision: boolean;
  fileAnalysis: boolean;
  speechRecognition: boolean;
  speechSynthesis: boolean;
  webSearch: boolean;
  imageGeneration: boolean;
}
