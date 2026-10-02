import React, { useRef, useEffect, useState } from 'react';
import {
  Menu,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Globe,
  ExternalLink,
  Download,
  AlertCircle,
  FileText,
  ArrowDown,
  Image as ImageIcon,
  MoreVertical,
  PanelRight,
  Sparkles,
  Calculator,
  Code2,
  BookOpen,
  Palette,
  ZoomIn,
  X,
  Gamepad2,
  ChevronDown,
  Cpu,
  LogIn,
} from 'lucide-react';
import { Message, Attachment } from '../types';
import { PotassiumLogo } from './PotassiumLogo';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, attachments: Attachment[], useSearch: boolean) => void;
  onRegenerate: () => void;
  onRetry: () => void;
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
  onOpenImageTool: () => void;
  onToggleRightSidebar?: () => void;
  isRightSidebarOpen?: boolean;
  conversationTitle: string;
  useSearch: boolean;
  theme?: 'light' | 'dark';
  dynamicHue?: number;
  onCycleDynamicColor?: () => void;
  dynamicColorLabel?: string;
  userName?: string;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  engineMode?: string;
  onChangeEngineMode?: (mode: string) => void;
}

const PrestigiousReasoningCard: React.FC<{ dynamicHue?: number }> = ({ dynamicHue = 0 }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black border border-cyan-400/50 prestigious-reasoning-card my-2 w-full transition-all duration-500 shadow-2xl">
      {/* Specular White Top Highlight Line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white via-cyan-300 to-transparent shadow-[0_0_14px_#ffffff]" />

      {/* Sweeping Radiant Light Beam in White & Cyan */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -inset-y-full w-28 bg-gradient-to-r from-transparent via-white/25 via-cyan-300/35 to-transparent prestigious-light-sweep" />
      </div>

      {/* Ambient Radial Glowing Auras (Pure White Core + Electric Cyan Glow) */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-cyan-300/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
        {/* Luminous Logo Orb - Matching the Majestic Start Screen */}
        <div className="relative flex items-center justify-center shrink-0 my-1">
          {/* Intense Pure White Center Aura */}
          <div className="absolute w-24 h-24 rounded-full bg-white/30 blur-xl animate-pulse pointer-events-none" />
          {/* Electric Cyan Radial Halo */}
          <div
            className="absolute w-36 h-36 rounded-full blur-2xl pointer-events-none transition-all duration-700 animate-pulse"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(0, 240, 255, 0.4) 45%, rgba(0, 210, 255, 0.15) 70%, transparent 85%)`,
            }}
          />

          {/* Clockwise Celestial Orbital Ring with white starlight pip */}
          <div className="absolute w-28 h-28 rounded-full border border-dashed border-cyan-400/50 prestigious-orbit-ring-cw pointer-events-none">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
          </div>

          {/* Counter-Clockwise Outer Thin Ring with cyan starlight pip */}
          <div className="absolute w-34 h-34 rounded-full border border-cyan-300/30 prestigious-orbit-ring-ccw pointer-events-none">
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f0ff]" />
          </div>

          {/* Glowing Center Potassium Logo (Animated like the start hero) */}
          <div className="relative z-10 p-3.5 rounded-full bg-neutral-950/90 border border-cyan-400/70 shadow-[0_0_28px_rgba(0,240,255,0.7),0_0_14px_rgba(255,255,255,0.9)]">
            <PotassiumLogo size={46} glow={true} animated={true} />
          </div>
        </div>

        {/* Content Block */}
        <div className="flex-1 text-center sm:text-left">
          {/* Prestigious Tag / Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-950/90 via-neutral-900 to-cyan-950/90 border border-cyan-400/60 text-[10px] font-mono tracking-widest text-cyan-200 uppercase shadow-[0_0_18px_rgba(0,240,255,0.35)] mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
            <span className="text-white font-extrabold">FRONTIER REASONING SYNTHESIS</span>
            <span className="text-cyan-400">•</span>
            <span className="text-cyan-300">ACTIVE</span>
          </div>

          {/* Title: Pure White & Cyan Luminescence */}
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2 mb-1.5">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(0,240,255,0.75)]">
              Potassium is Reasoning
            </span>
            <Sparkles size={16} className="text-cyan-300 animate-pulse" />
          </h3>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4 max-w-lg">
            Synthesizing mathematical rigor, architectural structure, and logic pathways in ultra-low latency...
          </p>

          {/* Radiant White & Cyan Equalizer Beacons */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1">
            {[0, 150, 300, 450, 600, 750].map((delay, idx) => (
              <span
                key={idx}
                className="w-1.5 rounded-full prestigious-equalizer-bar"
                style={{
                  animationDelay: `${delay}ms`,
                  background: 'linear-gradient(to top, #00f0ff 0%, #a5f3fc 60%, #ffffff 100%)',
                  boxShadow: '0 0 10px rgba(0, 240, 255, 0.8), 0 0 4px #ffffff',
                }}
              />
            ))}
            <span className="ml-2.5 text-[11px] font-mono font-medium text-cyan-200/90 tracking-wide">
              DeepSeek-V3 MoE • 671B Frontier Intelligence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onRegenerate,
  onRetry,
  onOpenSidebar,
  onOpenSettings,
  onOpenImageTool,
  onToggleRightSidebar,
  isRightSidebarOpen,
  conversationTitle,
  useSearch,
  dynamicHue = 0,
  onCycleDynamicColor,
  dynamicColorLabel = 'Dynamic Flow',
  userName = '',
  isLoggedIn = false,
  onOpenAuth,
  engineMode = 'deepseek-v3',
  onChangeEngineMode,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Time-based dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Auto-scroll on new message or stream chunk
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleDownloadImage = async (url: string, filename: string = 'potassium-visual.jpg') => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/[*_#`~>]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-black text-white select-text">
      {/* Dynamic Ambient Background Glow Orbs (Cyan mixed with black) */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ambient-aura-1"
        style={{
          background: `radial-gradient(circle, hsla(${180 + dynamicHue}, 100%, 50%, 0.15) 0%, hsla(${160 + dynamicHue}, 100%, 45%, 0.05) 50%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-[380px] h-[380px] rounded-full blur-[120px] pointer-events-none transition-all duration-700 ambient-aura-2"
        style={{
          background: `radial-gradient(circle, hsla(${195 + dynamicHue}, 100%, 45%, 0.12) 0%, hsla(${215 + dynamicHue}, 100%, 40%, 0.04) 60%, transparent 70%)`,
        }}
      />

      {/* Top Header matching Image 1 */}
      <header className="h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 backdrop-blur-md bg-black/40 border-b border-neutral-900/60">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="p-1.5 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 md:hidden transition-colors"
            title="Open sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Top-Left Pill Badge matching Image 1: [Logo] Potassium AI */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-800/90 shadow-sm backdrop-blur-md hover:border-cyan-500/40 transition-colors">
            <PotassiumLogo size={20} glow={true} />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-wide text-white">
                Potassium AI
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.25)]">
                Made by Archer
              </span>
            </div>
          </div>

          {/* Engine Selector: DeepSeek-V3 (Extreme Code & Systems) */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setShowEngineDropdown((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/70 to-neutral-900 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:border-cyan-400 hover:text-white transition-all shadow-[0_0_12px_rgba(0,240,255,0.15)] active:scale-95"
              title="Active Frontier AI Engine"
            >
              <Cpu size={13} className="text-cyan-400" />
              <span className="truncate max-w-[190px]">
                {engineMode === 'deepseek-v3'
                  ? 'DeepSeek-V3 (Extreme Code)'
                  : engineMode === 'potassium-pro'
                  ? 'Potassium Cyber Pro'
                  : 'Deep Reasoning Engine'}
              </span>
              <ChevronDown size={12} className="text-neutral-400" />
            </button>

            {showEngineDropdown && (
              <div
                className="absolute left-0 mt-2 w-80 rounded-2xl border border-neutral-800 bg-neutral-950/98 p-2 shadow-2xl backdrop-blur-xl z-50 text-xs"
                onClick={() => setShowEngineDropdown(false)}
              >
                <div className="px-2 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Frontier AI Engine
                </div>
                <button
                  type="button"
                  onClick={() => onChangeEngineMode?.('deepseek-v3')}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors ${
                    engineMode === 'deepseek-v3'
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200'
                      : 'hover:bg-neutral-900 text-neutral-300'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 shrink-0">
                    <Cpu size={15} />
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-1.5 text-white">
                      <span>DeepSeek-V3 (Extreme Code &amp; MoE)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-400 text-black font-extrabold">ACTIVE</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                      671B MoE frontier intelligence for extreme coding, complex algorithms, systems architecture, and Roblox Luau.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeEngineMode?.('potassium-pro')}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors mt-1 ${
                    engineMode === 'potassium-pro'
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200'
                      : 'hover:bg-neutral-900 text-neutral-300'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-neutral-900 text-neutral-300 shrink-0">
                    <Code2 size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-white">Potassium Cyber Pro</div>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                      General frontier intelligence for full-stack engineering, math, and vision.
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {conversationTitle && conversationTitle !== 'Welcome to Potassium' && (
            <span className="hidden md:inline-block text-xs text-neutral-400 font-normal truncate max-w-xs pl-2 border-l border-neutral-800">
              {conversationTitle}
            </span>
          )}
        </div>

        {/* Top-Right Actions */}
        <div className="flex items-center gap-2 relative">
          {/* Sign In Button for Guests */}
          {!isLoggedIn && onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/80 via-neutral-900 to-cyan-950/80 border border-cyan-400/50 hover:border-cyan-300 text-xs font-semibold text-cyan-200 hover:text-white transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] active:scale-95 cursor-pointer"
              title="Sign in with your email to save your chats"
            >
              <LogIn size={13} className="text-cyan-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Dynamic Color Cycle Pill */}
          {onCycleDynamicColor && (
            <button
              type="button"
              onClick={onCycleDynamicColor}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-950/80 text-[11px] font-medium text-neutral-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all active:scale-95"
              title="Change Dynamic Color Palette (Cyan / Mint / Cyber Black)"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: `hsl(${180 + dynamicHue}, 100%, 55%)`,
                  boxShadow: `0 0 8px hsl(${180 + dynamicHue}, 100%, 55%)`,
                }}
              />
              <span className="hidden sm:inline">{dynamicColorLabel}</span>
            </button>
          )}

          {/* Toggle History Chat Panel button */}
          {onToggleRightSidebar && (
            <button
              onClick={onToggleRightSidebar}
              className={`p-2 rounded-full border transition-colors ${
                isRightSidebarOpen
                  ? 'border-cyan-500/50 bg-neutral-900 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Toggle History Chat"
            >
              <PanelRight size={16} />
            </button>
          )}

          {/* Three Dots Button (Image 1 Top-Right icon) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenuDropdown((prev) => !prev)}
              className="w-8 h-8 rounded-full border border-neutral-800 bg-neutral-950/80 text-neutral-300 hover:text-white hover:border-neutral-700 flex items-center justify-center transition-colors"
              title="Options"
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown Menu */}
            {showMenuDropdown && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-2xl border border-neutral-800 bg-neutral-950/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 text-xs"
                onClick={() => setShowMenuDropdown(false)}
              >
                <button
                  onClick={onCycleDynamicColor}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <Palette size={14} className="text-cyan-400" />
                  <span>Cycle Dynamic Colors</span>
                </button>
                <button
                  onClick={onOpenImageTool}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <ImageIcon size={14} className="text-cyan-400" />
                  <span>Image Studio</span>
                </button>
                <button
                  onClick={onOpenSettings}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                >
                  <Sparkles size={14} className="text-cyan-400" />
                  <span>Settings &amp; Info</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Chat Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth z-10"
      >
        {messages.length === 0 ? (
          // HERO VIEW MATCHING IMAGE 1:
          // Centered glowing Potassium Eye Logo, Dynamic Greeting, and refined minimalist layout
          <div className="min-h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 px-4 select-none">
            {/* Center Glowing Logo Orb */}
            <div className="relative mb-4 flex items-center justify-center">
              {/* Radial aura behind the center eye */}
              <div
                className="absolute w-36 h-36 rounded-full blur-2xl pointer-events-none transition-all duration-700 animate-pulse"
                style={{
                  background: `radial-gradient(circle, hsla(${180 + dynamicHue}, 100%, 55%, 0.35) 0%, hsla(${160 + dynamicHue}, 100%, 45%, 0.1) 60%, transparent 80%)`,
                }}
              />
              <PotassiumLogo size={76} glow={true} animated={true} />
            </div>

            {/* Creator Badge: Made by Archer */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-xs mb-4 shadow-[0_0_14px_rgba(0,240,255,0.2)]">
              <span className="text-cyan-300 font-medium">Potassium AI</span>
              <span className="text-neutral-500">•</span>
              <span className="text-white font-semibold">Made by Archer</span>
            </div>

            {/* Dynamic Greeting */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
              {userName
                ? `${getGreeting()}, ${userName}! How can I assist you?`
                : `${getGreeting()}! How can I assist you today?`}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed mb-8">
              Experience precision reasoning, LaTeX mathematical proofs, full-stack code synthesis, and intelligent search.
            </p>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
              {[
                {
                  label: '🎮 Roblox Draggable GUI & Luau Script',
                  prompt: 'Write a complete, modern Roblox Luau script for a draggable dark-neon ScreenGui. Include butter-smooth dragging using UserInputService, UICorner (rounded borders), UIStroke (cyan glow), and animated buttons with TweenService. Specify exact script hierarchy for Roblox Studio.',
                  icon: Gamepad2,
                },
                {
                  label: '⚔️ Roblox Combat & RemoteEvents',
                  prompt: 'Create a full Roblox Luau combat script with a weapon slash animation, client-server RemoteEvent communication, server-side hitbox verification, cooldown debounce, and sound effects.',
                  icon: Gamepad2,
                },
                {
                  label: 'Solve Riemann zeta function with LaTeX',
                  prompt: 'Explain the Riemann zeta function, its analytic continuation, Euler product formula, and non-trivial zeros using standard LaTeX equations.',
                  icon: Calculator,
                },
                {
                  label: 'Full-stack React & TypeScript code',
                  prompt: 'Write a complete, responsive React component in TypeScript and Tailwind for an interactive real-time data visualizer with animations.',
                  icon: Code2,
                },
                {
                  label: 'Draw a futuristic vector icon',
                  prompt: 'Draw a vector SVG icon of a quantum core engine with glowing geometric circuitry.',
                  icon: Sparkles,
                },
                {
                  label: 'Quantum mechanics & Schrödinger equation',
                  prompt: 'Formulate the time-dependent Schrödinger equation in LaTeX, solve the 1D infinite square well, and show the energy quantization derivation step-by-step.',
                  icon: BookOpen,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSendMessage(item.prompt, [], useSearch)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-neutral-800/80 bg-neutral-950/70 hover:bg-neutral-900 hover:border-cyan-500/40 text-neutral-300 hover:text-white text-xs transition-all shadow-sm active:scale-95 group"
                  >
                    <Icon size={13} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Messages List
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const isLast = index === messages.length - 1;
              const isThinkingThisMessage = isLoading && isLast && !isUser;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                >
                  {/* Assistant Avatar Header with New Logo */}
                  {!isUser && (
                    <div className="flex items-center gap-2 mb-2 select-none">
                      <PotassiumLogo size={18} glow={true} />
                      <span className="font-extrabold text-xs tracking-wider uppercase text-cyan-400">
                        POTASSIUM
                      </span>
                      <span className="text-[10px] text-cyan-200/90 font-medium px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30">
                        Made by Archer
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`relative rounded-2xl p-4 sm:p-5 max-w-[92%] sm:max-w-[85%] leading-relaxed ${
                      isUser
                        ? 'bg-neutral-900 border border-neutral-700/80 text-white font-normal shadow-md'
                        : isThinkingThisMessage
                        ? 'bg-gradient-to-b from-neutral-950 via-neutral-900/90 to-neutral-950 text-white border border-cyan-400/50 w-full shadow-[0_0_35px_rgba(0,240,255,0.2),0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-300'
                        : 'bg-neutral-950/80 text-white border border-neutral-900 w-full shadow-md backdrop-blur-sm'
                    }`}
                  >
                    {/* User Attachments Display */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-white text-xs"
                          >
                            {att.mimeType.startsWith('image/') ? (
                              att.previewUrl ? (
                                <img
                                  src={att.previewUrl}
                                  alt={att.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-inherit"
                                />
                              ) : null
                            ) : (
                              <FileText size={16} className="text-cyan-400" />
                            )}
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="truncate font-semibold max-w-[150px]">
                                {att.name}
                              </span>
                              <span className="text-[10px] opacity-70">
                                {(att.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    {isUser ? (
                      <div className="whitespace-pre-wrap text-xs sm:text-sm md:text-base break-words font-sans">
                        {msg.content}
                      </div>
                    ) : (
                      <>
                        {/* Prestigious White & Cyan Reasoning Card when thinking and no content yet */}
                        {isThinkingThisMessage && !msg.content && (
                          <PrestigiousReasoningCard dynamicHue={dynamicHue} />
                        )}

                        {/* Active prestigious reasoning ribbon while actively streaming */}
                        {isThinkingThisMessage && msg.content && (
                          <div className="relative overflow-hidden flex items-center justify-between mb-4 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-950/80 via-neutral-900/95 to-cyan-950/80 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] select-none">
                            {/* Specular White Top Highlight */}
                            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white via-cyan-300 to-transparent shadow-[0_0_8px_#ffffff]" />

                            <div className="flex items-center gap-2.5">
                              <div className="relative flex items-center justify-center">
                                <div className="absolute w-4 h-4 rounded-full bg-cyan-400/50 blur-sm animate-pulse" />
                                <PotassiumLogo size={16} glow={true} animated={true} />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                                  POTASSIUM REASONING STREAM
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-ping" />
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {[0, 150, 300].map((delay, idx) => (
                                <span
                                  key={idx}
                                  className="w-1 h-3 rounded-full bg-gradient-to-t from-cyan-400 to-white animate-pulse"
                                  style={{
                                    animationDelay: `${delay}ms`,
                                    boxShadow: '0 0 8px rgba(0,240,255,0.9), 0 0 2px #fff',
                                  }}
                                />
                              ))}
                              <span className="text-[10px] font-mono text-cyan-200/90 ml-1 hidden sm:inline">
                                Streaming Live
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Render Markdown Content with LaTeX math support */}
                        {msg.content && (
                          <MarkdownRenderer content={msg.content} theme="dark" />
                        )}

                        {/* Prestigious Streaming Cursor if active and last message */}
                        {isLoading && isLast && msg.content && (
                          <span className="inline-flex items-center justify-center align-middle ml-1.5 mb-0.5">
                            <span className="w-2.5 h-4.5 rounded-xs bg-gradient-to-b from-white via-cyan-200 to-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.9),0_0_4px_#ffffff] animate-pulse" />
                          </span>
                        )}

                        {/* Citations if any */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-neutral-800">
                            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Globe size={13} />
                              Verified Sources &amp; Citations
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {msg.citations.map((cite, cIdx) => (
                                <a
                                  key={cIdx}
                                  href={cite.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-800 bg-neutral-900 text-white hover:border-cyan-500/50 text-xs font-medium transition-colors"
                                >
                                  <span className="truncate max-w-[200px]">
                                    {cite.title}
                                  </span>
                                  <ExternalLink size={11} className="shrink-0 opacity-60" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* In-Chat Generated Visual Image Card */}
                        {(msg.imageUrl || msg.svgContent) && (
                          <div className="mt-4 pt-3 border-t border-neutral-800">
                            <div className="rounded-2xl border border-cyan-500/35 bg-neutral-900/90 p-3 sm:p-4 max-w-full md:max-w-2xl shadow-2xl transition-all group/img hover:border-cyan-400/70">
                              {/* Engine Header Badge */}
                              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-neutral-800/80">
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-[10px] sm:text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                                    <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                                    <span>FLUX.1 Ultra-HD Visual Engine</span>
                                  </span>
                                  <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
                                    1024×1024 • 8K Photorealistic
                                  </span>
                                </div>
                                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>Rendered in Chat</span>
                                </span>
                              </div>

                              {/* Main Visual Display */}
                              <div
                                onClick={() =>
                                  setPreviewImage({
                                    url: msg.imageUrl || '',
                                    title: msg.content.slice(0, 80),
                                  })
                                }
                                className="relative rounded-xl overflow-hidden cursor-pointer bg-black/90 flex items-center justify-center border border-neutral-800 group/img min-h-[220px]"
                              >
                                {msg.imageUrl ? (
                                  <img
                                    src={msg.imageUrl}
                                    alt={msg.content || 'Generated Visual Image'}
                                    loading="eager"
                                    decoding="async"
                                    className="w-full max-h-[500px] object-contain transition-transform duration-300 group-hover/img:scale-[1.01]"
                                  />
                                ) : msg.svgContent ? (
                                  <div
                                    className="w-full max-h-[460px] flex items-center justify-center p-3"
                                    dangerouslySetInnerHTML={{ __html: msg.svgContent }}
                                  />
                                ) : null}

                                {/* Hover Zoom Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                                  <div className="px-3.5 py-2 rounded-full bg-neutral-950/90 border border-cyan-400 text-cyan-300 text-xs font-semibold flex items-center gap-2 shadow-2xl scale-95 group-hover/img:scale-100 transition-transform">
                                    <ZoomIn size={15} />
                                    <span>Click to View Fullscreen (8K)</span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Row */}
                              <div className="mt-3 flex items-center justify-between gap-2">
                                <span className="text-[11px] text-neutral-400 truncate max-w-[240px] flex items-center gap-1.5">
                                  <span className="text-cyan-400 font-medium">Click image to inspect in full 8K</span>
                                </span>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPreviewImage({
                                        url: msg.imageUrl || '',
                                        title: msg.content.slice(0, 80),
                                      })
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-200 hover:text-white hover:border-cyan-400 text-xs font-semibold transition-all"
                                  >
                                    <ZoomIn size={13} className="text-cyan-400" />
                                    <span>Expand</span>
                                  </button>

                                  {msg.imageUrl && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDownloadImage(msg.imageUrl!, 'flux-ultra-visual.jpg')
                                      }
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/50 bg-cyan-950/70 text-cyan-200 hover:bg-cyan-400 hover:text-black text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                                      title="Save Image"
                                    >
                                      <Download size={13} />
                                      <span>Save Image</span>
                                    </button>
                                  )}

                                  {msg.svgContent && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!msg.svgContent) return;
                                        const blob = new Blob([msg.svgContent], {
                                          type: 'image/svg+xml',
                                        });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'potassium-vector.svg';
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                        URL.revokeObjectURL(url);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white hover:border-cyan-500/50 text-xs font-semibold transition-colors"
                                      title="Download Vector SVG"
                                    >
                                      <span>SVG</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Error Message */}
                        {msg.error && (
                          <div className="mt-3 p-3 rounded-xl border border-red-500/40 bg-neutral-900 text-red-300 text-xs space-y-2">
                            <div className="flex items-center gap-2 font-bold text-red-400">
                              <AlertCircle size={14} />
                              <span>Request encountered an error</span>
                            </div>
                            <p>{msg.error}</p>
                            <button
                              onClick={onRetry}
                              className="px-2.5 py-1 rounded-lg border border-red-500/50 bg-red-950/40 text-red-200 hover:bg-red-900/50 transition-colors font-semibold"
                            >
                              Retry Request
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {/* Action Toolbar on Hover */}
                    <div
                      className={`flex items-center gap-1 pt-2 mt-2 border-t border-neutral-900 text-xs select-none opacity-80 group-hover:opacity-100 transition-opacity ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check size={13} className="text-cyan-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>

                      {!isUser && (
                        <>
                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors"
                            title={speakingId === msg.id ? 'Stop reading' : 'Read aloud'}
                          >
                            {speakingId === msg.id ? (
                              <VolumeX size={13} className="text-cyan-400" />
                            ) : (
                              <Volume2 size={13} />
                            )}
                          </button>

                          {isLast && !isLoading && (
                            <button
                              onClick={onRegenerate}
                              className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors"
                              title="Regenerate response"
                            >
                              <RotateCcw size={13} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 z-30 p-2.5 rounded-full bg-neutral-900 border border-cyan-500/50 text-white shadow-xl hover:bg-neutral-800 transition-all hover:scale-105"
          title="Scroll to bottom"
        >
          <ArrowDown size={16} />
        </button>
      )}

      {/* Lightbox Modal for Generated In-Chat Images */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full flex flex-col items-center bg-neutral-950 border border-neutral-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
          >
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
              <span className="text-sm font-semibold text-cyan-300 truncate max-w-md">
                {previewImage.title || 'Generated Visual Image'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleDownloadImage(previewImage.url, 'potassium-visual-hd.jpg')
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700 bg-neutral-800 text-white hover:bg-white hover:text-black text-xs font-semibold transition-colors"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="w-full flex items-center justify-center max-h-[70vh] overflow-hidden rounded-2xl bg-black/80 p-2">
              <img
                src={previewImage.url}
                alt="Enlarged Visual"
                referrerPolicy="no-referrer"
                className="max-h-[68vh] max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
