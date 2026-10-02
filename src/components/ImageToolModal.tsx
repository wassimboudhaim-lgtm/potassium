import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Send,
  Upload,
  FileSearch,
  Code,
  Layers,
  Image as ImageIcon,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { PotassiumLogo } from './PotassiumLogo';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ImageToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToChat: (content: string, imageUrl?: string, svgContent?: string) => void;
}

export interface GeneratedAsset {
  id: string;
  type: 'vector' | 'diffusion';
  prompt: string;
  data: string; // SVG string or data:image URL
  timestamp: number;
}

export const ImageToolModal: React.FC<ImageToolModalProps> = ({
  isOpen,
  onClose,
  onInsertToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'analyze' | 'gallery'>('generate');

  // Generation state
  const [prompt, setPrompt] = useState('');
  const [genMode, setGenMode] = useState<'vector' | 'diffusion'>('vector');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [style, setStyle] = useState('Minimalist Monochrome');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [showSvgCode, setShowSvgCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Analysis / Vision state
  const [analysisImage, setAnalysisImage] = useState<string | null>(null);
  const [analysisMimeType, setAnalysisMimeType] = useState('image/png');
  const [analysisMode, setAnalysisMode] = useState<'describe' | 'ocr' | 'diagram' | 'vectorize'>('ocr');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Session gallery
  const [gallery, setGallery] = useState<GeneratedAsset[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenError(null);
    setGeneratedSvg(null);
    setGeneratedImageUrl(null);

    try {
      if (genMode === 'vector') {
        const response = await fetch('/api/generate-vector', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, aspectRatio, style }),
        });

        const data = await response.json();
        if (data.success && data.svg) {
          setGeneratedSvg(data.svg);
          const newAsset: GeneratedAsset = {
            id: `asset_${Date.now()}`,
            type: 'vector',
            prompt,
            data: data.svg,
            timestamp: Date.now(),
          };
          setGallery((prev) => [newAsset, ...prev]);
        } else {
          setGenError(data.message || 'Failed to generate vector artwork.');
        }
      } else {
        // Diffusion
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        if (data.success && data.imageUrl) {
          setGeneratedImageUrl(data.imageUrl);
          const newAsset: GeneratedAsset = {
            id: `asset_${Date.now()}`,
            type: 'diffusion',
            prompt,
            data: data.imageUrl,
            timestamp: Date.now(),
          };
          setGallery((prev) => [newAsset, ...prev]);
        } else {
          setGenError(
            data.message ||
              'Diffusion generation requires a connected model with an active paid billing tier. Free tier limit is 0. Switch to "Vector Graphic" mode to generate instant scalable monochrome artwork.'
          );
        }
      }
    } catch (err: any) {
      setGenError(err.message || 'An unexpected error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySvg = async () => {
    if (!generatedSvg) return;
    try {
      await navigator.clipboard.writeText(generatedSvg);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy SVG:', err);
    }
  };

  const handleDownloadSvg = () => {
    if (!generatedSvg) return;
    const blob = new Blob([generatedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `potassium-${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_') || 'artwork'}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalysisMimeType(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      setAnalysisImage(reader.result as string);
      setAnalysisResult(null);
      setAnalysisError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!analysisImage || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: analysisImage,
          mimeType: analysisMimeType,
          mode: analysisMode,
        }),
      });

      const data = await response.json();
      if (data.success && data.text) {
        setAnalysisResult(data.text);
      } else {
        setAnalysisError(data.message || 'Analysis failed.');
      }
    } catch (err: any) {
      setAnalysisError(err.message || 'An unexpected error occurred during image analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendToChatFromTool = (text: string, imgUrl?: string, svg?: string) => {
    onInsertToChat(text, imgUrl, svg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs select-none">
      <div className="w-full max-w-3xl rounded-2xl border border-white/30 bg-black text-white p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <PotassiumLogo size={26} />
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-wider uppercase text-white flex items-center gap-2">
                <span>POTASSIUM Image Studio</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-white/30 bg-neutral-900 text-white/80">
                  Tool
                </span>
              </h2>
              <p className="text-xs text-white/50">Vector Graphic Generation, Multimodal Vision & OCR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/20 pt-3 shrink-0">
          {[
            { id: 'generate', label: 'Create & Generate', icon: Sparkles },
            { id: 'analyze', label: 'Vision & OCR Inspector', icon: FileSearch },
            { id: 'gallery', label: `Gallery (${gallery.length})`, icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
                  isActive
                    ? 'border-white text-white'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* TAB 1: GENERATE */}
          {activeTab === 'generate' && (
            <div className="space-y-4">
              {/* Mode Selector */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGenMode('vector')}
                  className={`flex-1 p-3 rounded-xl border text-left transition-colors ${
                    genMode === 'vector'
                      ? 'border-white bg-neutral-900 text-white font-medium'
                      : 'border-white/20 bg-neutral-950 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Vector Graphic (SVG)
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-white/30 bg-black">
                      INSTANT • SCALABLE
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-tight">
                    Clean, high-precision monochrome vector art, icons, emblems, and schematics.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setGenMode('diffusion')}
                  className={`flex-1 p-3 rounded-xl border text-left transition-colors ${
                    genMode === 'diffusion'
                      ? 'border-white bg-neutral-900 text-white font-medium'
                      : 'border-white/20 bg-neutral-950 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Diffusion AI Image
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-white/20 bg-black text-white/60">
                      PAID TIER
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-tight">
                    Photorealistic bitmap images via Nano Banana model (requires active paid tier).
                  </p>
                </button>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Prompt Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A minimalist geometric falcon soaring through a diamond wireframe..."
                  rows={2}
                  className="w-full rounded-xl border border-white/20 bg-neutral-950 p-3 text-xs md:text-sm text-white placeholder-white/40 focus:outline-none focus:border-white leading-relaxed resize-none"
                />

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Geometric Falcon Emblem',
                    'Origami Lotus Flower',
                    'Cybernetic Circuit Core',
                    'Architectural Wireframe Grid',
                    'Minimalist Obsidian Totem',
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPrompt(s)}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-neutral-950 text-white/70 hover:border-white hover:text-white transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-1.5 px-2 rounded-lg border text-center font-mono text-[11px] transition-colors ${
                          aspectRatio === ratio
                            ? 'border-white bg-white text-black font-bold'
                            : 'border-white/20 bg-neutral-950 text-white/70 hover:text-white'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1">
                    Aesthetic Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-neutral-950 p-1.5 text-xs text-white focus:outline-none focus:border-white"
                  >
                    <option value="Minimalist Monochrome">Minimalist Monochrome</option>
                    <option value="Geometric Origami">Geometric Origami</option>
                    <option value="Technical Blueprint">Technical Blueprint</option>
                    <option value="Cybernetic High Contrast">Cybernetic High Contrast</option>
                    <option value="Abstract Line Art">Abstract Line Art</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-2.5 rounded-xl border border-white bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Rendering Graphic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="stroke-[2.5]" />
                    <span>Generate Artwork</span>
                  </>
                )}
              </button>

              {/* Error Notice */}
              {genError && (
                <div className="p-3 rounded-xl border border-white/30 bg-neutral-950 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <AlertCircle size={14} />
                    <span>Notice</span>
                  </div>
                  <p className="text-white/80 text-[11px] leading-relaxed">{genError}</p>
                  {genMode === 'diffusion' && (
                    <button
                      type="button"
                      onClick={() => {
                        setGenMode('vector');
                        setGenError(null);
                      }}
                      className="px-2.5 py-1 rounded border border-white bg-white text-black font-semibold text-[11px] hover:bg-neutral-200"
                    >
                      Switch to Vector Graphic Mode
                    </button>
                  )}
                </div>
              )}

              {/* Output Preview */}
              {(generatedSvg || generatedImageUrl) && (
                <div className="border border-white/20 rounded-xl p-4 bg-neutral-950 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-white/20 pb-2">
                    <span className="font-semibold uppercase tracking-wider text-white">
                      Rendered Result
                    </span>
                    <div className="flex items-center gap-1.5">
                      {generatedSvg && (
                        <>
                          <button
                            onClick={() => setShowSvgCode((prev) => !prev)}
                            className="flex items-center gap-1 px-2 py-1 rounded border border-white/20 text-[11px] hover:bg-white hover:text-black transition-colors"
                          >
                            <Code size={12} />
                            <span>{showSvgCode ? 'Hide Code' : 'View Code'}</span>
                          </button>
                          <button
                            onClick={handleCopySvg}
                            className="flex items-center gap-1 px-2 py-1 rounded border border-white/20 text-[11px] hover:bg-white hover:text-black transition-colors"
                          >
                            {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedCode ? 'Copied' : 'Copy SVG'}</span>
                          </button>
                          <button
                            onClick={handleDownloadSvg}
                            className="flex items-center gap-1 px-2 py-1 rounded border border-white/20 text-[11px] hover:bg-white hover:text-black transition-colors"
                          >
                            <Download size={12} />
                            <span>Download</span>
                          </button>
                        </>
                      )}
                      {generatedImageUrl && (
                        <a
                          href={generatedImageUrl}
                          download="potassium-image.png"
                          className="flex items-center gap-1 px-2 py-1 rounded border border-white/20 text-[11px] hover:bg-white hover:text-black transition-colors"
                        >
                          <Download size={12} />
                          <span>Download PNG</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Visual Render */}
                  {generatedSvg && !showSvgCode && (
                    <div
                      className="w-full flex items-center justify-center p-4 bg-black rounded-lg border border-white/20 overflow-hidden"
                      style={{ maxHeight: '320px' }}
                      dangerouslySetInnerHTML={{ __html: generatedSvg }}
                    />
                  )}

                  {/* SVG Code View */}
                  {generatedSvg && showSvgCode && (
                    <pre className="p-3 bg-black border border-white/20 rounded-lg text-[11px] font-mono text-white/90 overflow-x-auto max-h-60 whitespace-pre">
                      {generatedSvg}
                    </pre>
                  )}

                  {/* Diffusion Image View */}
                  {generatedImageUrl && (
                    <div className="w-full flex items-center justify-center p-2 bg-black rounded-lg border border-white/20">
                      <img
                        src={generatedImageUrl}
                        alt="Generated"
                        className="max-h-72 object-contain rounded"
                      />
                    </div>
                  )}

                  {/* Send to Chat Button */}
                  <button
                    type="button"
                    onClick={() =>
                      handleSendToChatFromTool(
                        `Here is the generated vector artwork for: "${prompt}"`,
                        generatedImageUrl || undefined,
                        generatedSvg || undefined
                      )
                    }
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/30 text-white text-xs font-semibold hover:border-white hover:bg-neutral-900 transition-colors"
                  >
                    <Send size={13} />
                    <span>Insert Artwork into Conversation</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VISION & OCR */}
          {activeTab === 'analyze' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {!analysisImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/30 rounded-2xl p-8 text-center cursor-pointer hover:border-white hover:bg-neutral-950 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Upload size={32} className="text-white/60 mb-1" />
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    Click or Drag to Upload Image
                  </div>
                  <p className="text-[11px] text-white/50 max-w-xs">
                    Inspect screenshots, diagrams, documents, handwriting, or artwork.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative border border-white/20 rounded-xl p-2 bg-neutral-950 flex items-center justify-center max-h-56 overflow-hidden">
                    <img
                      src={analysisImage}
                      alt="To inspect"
                      className="max-h-52 object-contain rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setAnalysisImage(null)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black border border-white text-white hover:bg-white hover:text-black transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Action Mode */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                      Inspection Objective
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'ocr', label: 'Extract Text (OCR)' },
                        { id: 'describe', label: 'Visual Analysis' },
                        { id: 'diagram', label: 'Diagram & Chart' },
                        { id: 'vectorize', label: 'Vector Breakdown' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setAnalysisMode(m.id as any)}
                          className={`p-2 rounded-lg border text-center transition-colors text-[11px] ${
                            analysisMode === m.id
                              ? 'border-white bg-white text-black font-semibold'
                              : 'border-white/20 bg-neutral-950 text-white/70 hover:text-white'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-2.5 rounded-xl border border-white bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing Pixels & Geometry...</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} className="stroke-[2.5]" />
                        <span>Run Visual Inspection</span>
                      </>
                    )}
                  </button>

                  {analysisError && (
                    <div className="p-3 rounded-xl border border-white/40 bg-neutral-950 text-xs">
                      {analysisError}
                    </div>
                  )}

                  {analysisResult && (
                    <div className="border border-white/20 rounded-xl p-4 bg-neutral-950 space-y-3">
                      <div className="flex items-center justify-between text-xs border-b border-white/20 pb-2">
                        <span className="font-semibold uppercase tracking-wider text-white">
                          Analysis Findings
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(analysisResult);
                          }}
                          className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/20 text-[10px] hover:bg-white hover:text-black transition-colors"
                        >
                          <Copy size={11} />
                          <span>Copy Text</span>
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto pr-1">
                        <MarkdownRenderer content={analysisResult} />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleSendToChatFromTool(
                            `Analysis Findings (${analysisMode.toUpperCase()}):\n\n${analysisResult}`
                          )
                        }
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/30 text-white text-xs font-semibold hover:border-white hover:bg-neutral-900 transition-colors"
                      >
                        <Send size={13} />
                        <span>Insert Analysis into Chat</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {gallery.length === 0 ? (
                <div className="py-12 text-center text-xs text-white/40">
                  No assets generated yet in this session.
                  <br />
                  Use the Create tab to render vector graphics or diffusion images.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gallery.map((asset) => (
                    <div
                      key={asset.id}
                      className="border border-white/20 rounded-xl p-3 bg-neutral-950 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                          <span className="uppercase">{asset.type}</span>
                          <span>{new Date(asset.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs font-medium text-white truncate">
                          "{asset.prompt}"
                        </p>
                        {asset.type === 'vector' ? (
                          <div
                            className="w-full h-36 bg-black rounded-lg border border-white/10 flex items-center justify-center p-2 overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: asset.data }}
                          />
                        ) : (
                          <img
                            src={asset.data}
                            alt={asset.prompt}
                            className="w-full h-36 object-contain rounded-lg border border-white/10 bg-black"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                        {asset.type === 'vector' ? (
                          <button
                            type="button"
                            onClick={() => {
                              const blob = new Blob([asset.data], { type: 'image/svg+xml' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `potassium-asset.svg`;
                              a.click();
                            }}
                            className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded border border-white/20 text-[10px] hover:bg-white hover:text-black transition-colors"
                          >
                            <Download size={11} />
                            <span>Download SVG</span>
                          </button>
                        ) : (
                          <a
                            href={asset.data}
                            download="potassium-image.png"
                            className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded border border-white/20 text-[10px] hover:bg-white hover:text-black transition-colors"
                          >
                            <Download size={11} />
                            <span>Download PNG</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleSendToChatFromTool(
                              `Here is the generated ${asset.type} artwork for: "${asset.prompt}"`,
                              asset.type === 'diffusion' ? asset.data : undefined,
                              asset.type === 'vector' ? asset.data : undefined
                            )
                          }
                          className="flex items-center justify-center p-1 px-2 rounded border border-white/20 text-[10px] hover:bg-white hover:text-black transition-colors"
                          title="Insert into chat"
                        >
                          <Send size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-white/50 shrink-0">
          <span>POTASSIUM Graphic Engine</span>
          <span>Monochrome Standard (#000000 / #FFFFFF)</span>
        </div>
      </div>
    </div>
  );
};
