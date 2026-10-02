import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  theme?: 'light' | 'dark';
}

// Preprocess LaTeX math so all standard notations (\[...\], \(...\)) render seamlessly
function preprocessMath(raw: string): string {
  if (!raw) return '';
  // Convert display math \[ ... \] to $$ ... $$
  let processed = raw.replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => `\n$$\n${formula.trim()}\n$$\n`);
  // Convert inline math \( ... \) to $ ... $
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, formula) => `$${formula.trim()}$`);
  return processed;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme }) => {
  const isDark = theme === 'dark';
  const cleanContent = preprocessMath(content);

  return (
    <div
      className={`max-w-none text-sm md:text-base leading-relaxed break-words katex-container ${
        isDark ? 'text-white' : 'text-black font-normal'
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeKatex, { throwOnError: false, errorColor: '#38bdf8', strict: false }],
        ]}
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const isInline = !match && !codeString.includes('\n');

            if (isInline) {
              return (
                <code
                  className={`px-1.5 py-0.5 mx-0.5 rounded font-mono text-xs md:text-sm font-semibold border ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-slate-100 border-slate-300 text-black'
                  }`}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : 'code'}
                code={codeString}
                theme={theme}
              />
            );
          },
          h1: ({ children }) => (
            <h1
              className={`text-xl md:text-2xl font-bold tracking-tight mt-6 mb-3 first:mt-0 border-b pb-2 ${
                isDark ? 'text-white border-neutral-800' : 'text-black border-slate-200'
              }`}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className={`text-lg md:text-xl font-bold tracking-tight mt-5 mb-2.5 first:mt-0 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={`text-base md:text-lg font-bold mt-4 mb-2 first:mt-0 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className={`mb-3 leading-relaxed last:mb-0 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {children}
            </strong>
          ),
          b: ({ children }) => (
            <b className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {children}
            </b>
          ),
          ul: ({ children }) => (
            <ul
              className={`list-disc list-outside ml-5 mb-3 space-y-1 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className={`list-decimal list-outside ml-5 mb-3 space-y-1 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className={`leading-relaxed ${isDark ? 'text-white' : 'text-black'}`}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={`border-l-3 pl-4 my-3 italic ${
                isDark
                  ? 'border-white text-white/95'
                  : 'border-black text-black'
              }`}
            >
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr
              className={`my-6 border-t ${
                isDark ? 'border-neutral-800' : 'border-slate-200'
              }`}
            />
          ),
          table: ({ children }) => (
            <div
              className={`overflow-x-auto my-4 rounded-xl border ${
                isDark ? 'border-neutral-800' : 'border-slate-200'
              }`}
            >
              <table
                className={`min-w-full divide-y text-left text-sm ${
                  isDark
                    ? 'divide-neutral-800 text-white'
                    : 'divide-slate-200 text-black'
                }`}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead
              className={`font-bold ${
                isDark ? 'bg-neutral-900 text-white' : 'bg-slate-100 text-black'
              }`}
            >
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody
              className={`divide-y ${
                isDark ? 'divide-neutral-800' : 'divide-slate-200'
              }`}
            >
              {children}
            </tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th
              className={`px-4 py-2.5 font-bold uppercase tracking-wider text-xs ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className={`px-4 py-2.5 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline font-medium transition-colors ${
                isDark
                  ? 'text-white decoration-white/60 hover:decoration-white'
                  : 'text-blue-600 decoration-blue-400 hover:text-blue-800'
              }`}
            >
              {children}
            </a>
          ),
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};
