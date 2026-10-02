import React, { useRef, useState, useEffect } from 'react';
import {
  Paperclip,
  Mic,
  MicOff,
  Square,
  X,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Calculator,
  RotateCcw,
  Lightbulb,
  Globe2,
  Gamepad2,
  Cpu,
} from 'lucide-react';
import { Attachment } from '../types';
import { processUploadedFile, SUPPORTED_EXTENSIONS } from '../utils/fileExtractor';

interface MessageInputProps {
  onSendMessage: (text: string, attachments: Attachment[], useSearch: boolean) => void;
  isLoading: boolean;
  onStopGeneration: () => void;
  useSearch: boolean;
  onToggleSearch: () => void;
  onOpenImageTool: () => void;
  onOpenBrowsePrompts?: () => void;
  theme?: 'light' | 'dark';
  dynamicHue?: number;
}

const MATH_SYMBOLS = [
  { label: 'π', insert: 'π' },
  { label: '√', insert: '√' },
  { label: '∫', insert: '∫' },
  { label: '∑', insert: '∑' },
  { label: '∏', insert: '∏' },
  { label: '∞', insert: '∞' },
  { label: '±', insert: '±' },
  { label: '≈', insert: '≈' },
  { label: '≠', insert: '≠' },
  { label: '≤', insert: '≤' },
  { label: '≥', insert: '≥' },
  { label: '∂', insert: '∂' },
  { label: '∇', insert: '∇' },
  { label: '×', insert: '×' },
  { label: '÷', insert: '÷' },
  { label: 'α', insert: 'α' },
  { label: 'β', insert: 'β' },
  { label: 'γ', insert: 'γ' },
  { label: 'θ', insert: 'θ' },
  { label: 'λ', insert: 'λ' },
  { label: 'μ', insert: 'μ' },
  { label: 'σ', insert: 'σ' },
  { label: 'φ', insert: 'φ' },
  { label: 'ω', insert: 'ω' },
  { label: 'Δ', insert: 'Δ' },
  { label: 'Ω', insert: 'Ω' },
  { label: '∀', insert: '∀' },
  { label: '∃', insert: '∃' },
  { label: '∈', insert: '∈' },
  { label: '⊂', insert: '⊂' },
  { label: '∪', insert: '∪' },
  { label: '∩', insert: '∩' },
  { label: '∧', insert: '∧' },
  { label: '∨', insert: '∨' },
  { label: '¬', insert: '¬' },
  { label: '⇒', insert: '⇒' },
  { label: '⇔', insert: '⇔' },
  { label: '→', insert: '→' },
];

const LATEX_SNIPPETS = [
  { label: 'a/b', insert: '$\\frac{a}{b}$ ' },
  { label: '√x', insert: '$\\sqrt{x}$ ' },
  { label: '∫ f(x)', insert: '$$\\int_{a}^{b} f(x) \\, dx$$ ' },
  { label: '∑ xi', insert: '$$\\sum_{i=1}^{n} x_i$$ ' },
  { label: 'lim', insert: '$$\\lim_{x \\to \\infty} f(x)$$ ' },
  { label: 'x²', insert: '$x^{2}$ ' },
  { label: 'xᵢ', insert: '$x_{i}$ ' },
  { label: 'Matrix', insert: '$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$$ ' },
];

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
  onStopGeneration,
  useSearch,
  onToggleSearch,
  onOpenImageTool,
  dynamicHue = 0,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showMathPalette, setShowMathPalette] = useState(false);
  const [isReasoningActive, setIsReasoningActive] = useState(true);
  const [isImageMode, setIsImageMode] = useState(false);
  const [isRobloxMode, setIsRobloxMode] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleToggleSpeech = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Adjust textarea height dynamically
  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const newHeight = Math.min(Math.max(el.scrollHeight, 44), 160);
    el.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [inputText]);

  // Handle file uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFileError(null);
    setIsProcessingFile(true);

    try {
      const newAttachments: Attachment[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 20 * 1024 * 1024) {
          setFileError(`File "${file.name}" exceeds 20MB limit`);
          continue;
        }

        try {
          const processed = await processUploadedFile(file);
          newAttachments.push(processed);
        } catch (err: any) {
          setFileError(`Failed to process ${file.name}: ${err?.message || 'Unsupported format'}`);
        }
      }

      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err: any) {
      setFileError('Error processing file uploads');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setInputText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleSubmit = () => {
    if (isLoading) return;
    const trimmed = inputText.trim();
    if (!trimmed && attachments.length === 0) return;

    // If image mode is active, prefix prompt with /image
    const finalPrompt =
      isImageMode && !trimmed.toLowerCase().startsWith('/image')
        ? `/image ${trimmed}`
        : trimmed;

    onSendMessage(finalPrompt, attachments, useSearch);
    setInputText('');
    setAttachments([]);
    setShowMathPalette(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInsertSymbol = (str: string) => {
    setInputText((prev) => prev + str);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const canSend = inputText.trim().length > 0 || attachments.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 select-none relative">
      {fileError && (
        <div className="mb-2 p-2.5 rounded-xl border text-xs flex items-center justify-between bg-neutral-900/90 border-red-500/40 text-red-400">
          <span>{fileError}</span>
          <button onClick={() => setFileError(null)} className="p-1 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Math & Symbol Quick Palette Popover */}
      {showMathPalette && (
        <div className="absolute bottom-28 left-4 right-4 z-40 p-4 rounded-2xl border border-cyan-500/30 bg-neutral-950/95 text-white shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300">
              <Calculator size={14} />
              <span>Mathematical & Scientific Symbols</span>
            </div>
            <button
              onClick={() => setShowMathPalette(false)}
              className="p-1 rounded-md text-neutral-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick Symbols Grid */}
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {MATH_SYMBOLS.map((sym, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleInsertSymbol(sym.insert)}
                className="w-7 h-7 rounded-lg border border-neutral-800 bg-neutral-900 text-white font-mono text-xs font-bold transition-all hover:bg-cyan-950 hover:border-cyan-500/50 hover:scale-110 active:scale-95 flex items-center justify-center"
                title={`Insert ${sym.label}`}
              >
                {sym.label}
              </button>
            ))}
          </div>

          {/* LaTeX Snippets */}
          <div className="mt-3 pt-2.5 border-t border-neutral-800 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold text-neutral-500 mr-1 uppercase tracking-wider">LaTeX:</span>
            {LATEX_SNIPPETS.map((snip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleInsertSymbol(snip.insert)}
                className="px-2.5 py-1 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-cyan-500/40 text-neutral-200 font-mono text-[11px] font-medium transition-all"
              >
                {snip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-2">
          {attachments.map((att, idx) => (
            <div
              key={idx}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-neutral-900/90 text-white text-xs backdrop-blur-md shadow-sm"
            >
              {att.mimeType.startsWith('image/') ? (
                <ImageIcon size={14} className="text-cyan-400" />
              ) : (
                <FileText size={14} className="text-cyan-400" />
              )}
              <span className="max-w-[140px] truncate font-medium">{att.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                className="p-0.5 rounded-full hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Floating Input Card inspired by Image 1 */}
      <div
        className="relative rounded-[28px] border border-cyan-500/25 bg-neutral-950/75 backdrop-blur-2xl p-3 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] transition-all duration-300 focus-within:border-cyan-400/60 focus-within:shadow-[0_12px_45px_rgba(0,240,255,0.12)]"
        style={{
          boxShadow: `0 10px 40px rgba(0, 0, 0, 0.7), 0 0 25px hsla(${180 + dynamicHue}, 100%, 50%, 0.08)`,
        }}
      >
        {/* Top Hint Text matching Image 1 */}
        <div className="flex items-center gap-1.5 px-1.5 pb-1 text-[11px] font-medium text-cyan-300/80 select-none">
          {isImageMode ? (
            <>
              <ImageIcon size={12} className="text-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-semibold">
                In-Chat Image Generation: Describe any artwork, visual, scene, or concept...
              </span>
            </>
          ) : isRobloxMode ? (
            <>
              <Cpu size={12} className="text-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-semibold">
                DeepSeek-V3 (Extreme Code &amp; MoE): Specialized in algorithms, systems, Roblox Luau GUIs &amp; architecture.
              </span>
            </>
          ) : (
            <>
              <Sparkles size={12} className="text-cyan-400" />
              <span>Start your request, and let Potassium handle everything.</span>
            </>
          )}
        </div>

        {/* Input Textarea */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isImageMode
              ? 'Describe the image you want Potassium to generate inside chat...'
              : isRobloxMode
              ? 'Ask DeepSeek-V3 for any code, Roblox Luau script with GUI, algorithms, or systems architecture...'
              : 'Ask Potassium anything, write code, solve equations...'
          }
          disabled={isLoading}
          rows={1}
          className="w-full bg-transparent px-1.5 py-1.5 text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none resize-none leading-relaxed min-h-[44px]"
        />

        {/* Bottom Action Row matching Image 1 */}
        <div className="flex items-center justify-between pt-2 mt-1">
          {/* Left pill buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Attachment Circle Pill (🔗) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isProcessingFile}
              className="w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-cyan-500/40 text-neutral-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
              title="Attach File or Document"
            >
              <Paperclip size={15} />
            </button>

            {/* Clear / Reset Pill (↺) */}
            {(inputText.length > 0 || attachments.length > 0) && (
              <button
                type="button"
                onClick={handleClear}
                className="w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 hover:border-cyan-500/40 text-neutral-400 hover:text-white flex items-center justify-center transition-all active:scale-95"
                title="Clear input"
              >
                <RotateCcw size={14} />
              </button>
            )}

            {/* DeepSeek-V3 Extreme Code Pill Button */}
            <button
              type="button"
              onClick={() => setIsRobloxMode((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 ${
                isRobloxMode
                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-300 shadow-[0_0_14px_rgba(0,240,255,0.35)] font-bold'
                  : 'border-neutral-800 bg-neutral-900/70 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
              title="DeepSeek-V3: 671B MoE extreme coding, algorithms & Roblox Luau scripts"
            >
              <Cpu size={13} className={isRobloxMode ? 'text-cyan-400' : ''} />
              <span>DeepSeek-V3 (Code)</span>
            </button>

            {/* Image Gen Pill Button */}
            <button
              type="button"
              onClick={() => setIsImageMode((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 ${
                isImageMode
                  ? 'border-cyan-400 bg-cyan-950/70 text-cyan-300 shadow-[0_0_14px_rgba(0,240,255,0.35)] font-bold'
                  : 'border-neutral-800 bg-neutral-900/70 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
              title="Generate images directly inside the AI Chat"
            >
              <ImageIcon size={13} className={isImageMode ? 'text-cyan-400' : ''} />
              <span>Image Gen</span>
            </button>

            {/* Reasoning Pill Button */}
            <button
              type="button"
              onClick={() => setIsReasoningActive((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 ${
                isReasoningActive
                  ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'border-neutral-800 bg-neutral-900/70 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Lightbulb size={13} className={isReasoningActive ? 'text-cyan-400' : ''} />
              <span>Reasoning</span>
            </button>

            {/* Deep Research / Web Search Pill Button */}
            <button
              type="button"
              onClick={onToggleSearch}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 ${
                useSearch
                  ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'border-neutral-800 bg-neutral-900/70 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Globe2 size={13} className={useSearch ? 'text-cyan-400' : ''} />
              <span>Deep Research</span>
            </button>

            {/* Symbols Palette Toggle */}
            <button
              type="button"
              onClick={() => setShowMathPalette((prev) => !prev)}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-all active:scale-95 ${
                showMathPalette
                  ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300'
                  : 'border-neutral-800 bg-neutral-900/70 text-neutral-400 hover:text-white'
              }`}
              title="Mathematical & Scientific Symbols"
            >
              <Calculator size={13} />
              <span className="font-serif italic font-bold">∑</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 ml-2">
            {/* Mic Button */}
            {speechSupported && (
              <button
                type="button"
                onClick={handleToggleSpeech}
                disabled={isLoading}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
                  isRecording
                    ? 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse'
                    : 'border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-700'
                }`}
                title={isRecording ? 'Stop Recording' : 'Voice Message'}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            {/* SEND BUTTON MATCHING PHOTO 1:
                A circular radiant button with cyan mixed with black dynamic color and diagonal arrow paperplane */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center hover:bg-neutral-800 transition-all shadow-md active:scale-95"
                title="Stop generation"
              >
                <Square size={16} className="fill-current text-cyan-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSend}
                style={{
                  background: canSend
                    ? `linear-gradient(135deg, hsl(${175 + dynamicHue}, 100%, 55%) 0%, hsl(${195 + dynamicHue}, 100%, 48%) 65%, #05141c 100%)`
                    : 'linear-gradient(135deg, #0e2a36 0%, #061117 100%)',
                  boxShadow: canSend
                    ? `0 0 24px hsla(${185 + dynamicHue}, 100%, 50%, 0.55), 0 2px 10px rgba(0,0,0,0.5)`
                    : 'none',
                }}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 group ${
                  canSend
                    ? 'cursor-pointer hover:scale-105 active:scale-95'
                    : 'cursor-not-allowed opacity-50'
                }`}
                title="Send message"
              >
                {/* Arrow Paperplane tilted 45 degrees exactly as in Image 1 */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-5 h-5 transform rotate-45 -translate-x-0.5 translate-y-0.5 transition-transform duration-200 group-hover:translate-x-0 group-hover:-translate-y-0 ${
                    canSend ? 'text-black' : 'text-neutral-500'
                  }`}
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={SUPPORTED_EXTENSIONS.join(',')}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Footer Disclaimer */}
      <p className="mt-2 text-center text-[10px] text-neutral-500 select-none">
        Potassium may produce inaccurate information. Powered by Potassium AI &amp; LaTeX Math Engine.
      </p>
    </div>
  );
};
