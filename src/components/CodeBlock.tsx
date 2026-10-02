import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  code: string;
  theme?: 'light' | 'dark';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', code, theme }) => {
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div
      className={`my-4 rounded-xl border overflow-hidden font-mono text-xs md:text-sm shadow-sm ${
        isDark
          ? 'border-neutral-800 bg-neutral-950 text-white'
          : 'border-slate-200 bg-slate-950 text-slate-100'
      }`}
    >
      <div
        className={`flex items-center justify-between px-4 py-2 border-b select-none ${
          isDark
            ? 'border-neutral-800 bg-neutral-900 text-neutral-400'
            : 'border-slate-800 bg-slate-900 text-slate-400'
        }`}
      >
        <span className="font-semibold tracking-wider text-xs uppercase text-slate-200">
          {language}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2 py-1 rounded border border-slate-700 text-slate-300 hover:bg-white hover:text-black transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={13} className="stroke-[2.5]" />
              <span className="text-[11px] font-medium">COPIED</span>
            </>
          ) : (
            <>
              <Copy size={13} className="stroke-[2]" />
              <span className="text-[11px] font-medium">COPY</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto leading-relaxed text-slate-100 font-mono">
        <pre className="m-0 font-mono whitespace-pre text-xs md:text-sm">{code}</pre>
      </div>
    </div>
  );
};
