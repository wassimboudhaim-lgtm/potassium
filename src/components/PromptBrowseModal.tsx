import React, { useState } from 'react';
import { X, Search, Sparkles, Code, PenTool, Brain, Database, ArrowRight, Gamepad2 } from 'lucide-react';
import { PotassiumLogo } from './PotassiumLogo';

interface PromptBrowseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  theme?: 'light' | 'dark';
}

interface PromptCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  prompts: {
    title: string;
    description: string;
    prompt: string;
  }[];
}

const CATEGORIES: PromptCategory[] = [
  {
    id: 'roblox',
    name: 'Roblox Studio & Systems (DeepSeek-V3)',
    icon: Gamepad2,
    prompts: [
      {
        title: 'Modern Draggable Neon GUI (TweenService)',
        description: 'Complete ScreenGui with butter-smooth dragging, UICorner, UIStroke, and button hover tweens.',
        prompt: 'Write a complete, modern Roblox Luau script for a draggable dark-neon ScreenGui. Include butter-smooth dragging using UserInputService, UICorner (rounded borders), UIStroke (cyan glow), and animated buttons with TweenService. Specify exact script hierarchy for Roblox Studio.',
      },
      {
        title: 'Client-Server Combat & Hit Detection',
        description: 'Secure melee weapon system with RemoteEvents in ReplicatedStorage and cooldowns.',
        prompt: 'Create a full Roblox Luau combat script with a sword slash animation, client-server RemoteEvent communication, server-side hitbox verification, cooldown debounce, and sound effects.',
      },
      {
        title: 'Auto-Saving Leaderstats & DataStore',
        description: 'ServerScriptService script for persistent player Coins & Level with pcall error handling.',
        prompt: 'Write a robust, production-ready ServerScriptService script for player Leaderstats (Coins & Gems) using DataStoreService with automatic saving on player leave and server shutdown, protected by pcall.',
      },
      {
        title: 'Interactive In-Game Shop / Upgrade GUI',
        description: 'ScrollingFrame with item cards, purchase verification, and balance checks.',
        prompt: 'Write a complete Roblox Luau shop interface with a ScrollingFrame, item purchase buttons, client-server currency deduction verification, and instant UI update.',
      },
    ],
  },
  {
    id: 'writing',
    name: 'Copywriting & Writing',
    icon: PenTool,
    prompts: [
      {
        title: 'Compelling Product Launch Copy',
        description: 'Create high-converting landing page headlines and value propositions.',
        prompt: 'Write compelling, high-converting launch copy for a modern AI application called POTASSIUM, highlighting precision, speed, and intelligence.',
      },
      {
        title: 'Executive Summary',
        description: 'Condense complex reports or documents into high-level strategic summaries.',
        prompt: 'Summarize the core takeaways and actionable action items from the following proposal in a structured executive brief.',
      },
      {
        title: 'Professional Email Drafter',
        description: 'Draft articulate, polished correspondence for clients or partners.',
        prompt: 'Draft a polite and clear email proposing a strategic partnership meeting with an engineering team next week.',
      },
    ],
  },
  {
    id: 'image',
    name: 'Image & Vector Art',
    icon: Sparkles,
    prompts: [
      {
        title: 'Geometric Falcon Emblem',
        description: 'Generate high-precision monochrome vector artwork.',
        prompt: 'draw a vector of a geometric falcon in flight with sharp origami facets inside a diamond wireframe',
      },
      {
        title: 'Obsidian Cyber Core',
        description: 'Vector schematic of a cybernetic obsidian core.',
        prompt: 'draw a vector of a cybernetic processor core with circuit lines and geometric symmetry',
      },
      {
        title: 'Origami Lotus Flower',
        description: 'Clean line art origami flower illustration.',
        prompt: 'draw a vector of a minimalist origami lotus flower with high-contrast sharp angles',
      },
    ],
  },
  {
    id: 'coding',
    name: 'Software & Architecture',
    icon: Code,
    prompts: [
      {
        title: 'Clean Python Calculator Class',
        description: 'Production-ready object-oriented Python implementation.',
        prompt: 'Write a clean, production-ready Python calculator class with basic arithmetic, history tracking, and comprehensive unit tests.',
      },
      {
        title: 'TypeScript React Hook',
        description: 'Custom React hook for debouncing and async fetch caching.',
        prompt: 'Write a robust TypeScript React custom hook `useDebounce` with full type safety and cleanup logic.',
      },
      {
        title: 'SQL Schema & Query Optimizer',
        description: 'Normalized database schema with indexing strategy.',
        prompt: 'Design a high-performance PostgreSQL schema for an e-commerce platform with orders, inventory, and users with optimal indexes.',
      },
    ],
  },
  {
    id: 'reasoning',
    name: 'Reasoning & Science',
    icon: Brain,
    prompts: [
      {
        title: 'Step-by-Step Mental Math',
        description: 'Calculate multi-digit arithmetic with breakdown.',
        prompt: 'What is 847 × 36? Explain the step-by-step arithmetic breakdown clearly.',
      },
      {
        title: 'Quantum Entanglement Explained',
        description: 'Intuitive breakdown of quantum mechanics.',
        prompt: 'Explain quantum entanglement and Bell inequalities in clear, intuitive terms suitable for an inquisitive engineer.',
      },
      {
        title: 'First-Principles Root Cause Analysis',
        description: 'Systematic deduction for technical failure modes.',
        prompt: 'Walk through a first-principles root-cause analysis framework for diagnosing intermittent database connection pool exhaustion.',
      },
    ],
  },
];

export const PromptBrowseModal: React.FC<PromptBrowseModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  theme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('writing');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const isDark = true; // Always dark cyan-black mode

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  const filteredPrompts = searchQuery.trim()
    ? CATEGORIES.flatMap((c) => c.prompts).filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory.prompts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
          isDark
            ? 'bg-neutral-950 border-neutral-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-inherit">
          <div className="flex items-center gap-2.5">
            <PotassiumLogo size={24} />
            <div>
              <h3 className="font-bold text-sm">Browse Prompt Library</h3>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Handpicked prompts for POTASSIUM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-800'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-inherit">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
              isDark
                ? 'bg-neutral-900/60 border-neutral-800 focus-within:border-neutral-600'
                : 'bg-slate-50 border-slate-200 focus-within:border-blue-500'
            }`}
          >
            <Search size={15} className={isDark ? 'text-neutral-500' : 'text-slate-400'} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by keyword..."
              className="w-full bg-transparent text-xs focus:outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs opacity-60 hover:opacity-100">
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Categories Tab (if no search) */}
          {!searchQuery && (
            <div className={`w-48 border-r overflow-y-auto p-2 space-y-1 border-inherit ${
              isDark ? 'bg-neutral-900/30' : 'bg-slate-50/50'
            }`}>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      isSelected
                        ? isDark
                          ? 'bg-neutral-800 text-white font-semibold'
                          : 'bg-white text-blue-600 shadow-xs font-semibold'
                        : isDark
                        ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Prompts List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredPrompts.length === 0 ? (
              <div className="py-8 text-center text-xs opacity-60">No prompts found matching your search.</div>
            ) : (
              filteredPrompts.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectPrompt(item.prompt);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer group transition-all ${
                    isDark
                      ? 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 hover:border-neutral-700'
                      : 'border-slate-200/80 bg-white hover:bg-blue-50/50 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span>{item.title}</span>
                    <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
