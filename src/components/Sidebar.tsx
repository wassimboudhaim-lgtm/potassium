import React from 'react';
import {
  Search,
  MessageSquare,
  FolderKanban,
  FileCode2,
  FileText,
  Sparkles,
  History as HistoryIcon,
  Settings as SettingsIcon,
  HelpCircle,
  Plus,
  X,
  Image as ImageIcon,
  User as UserIcon,
  LogIn,
  LogOut,
} from 'lucide-react';
import { PotassiumLogo } from './PotassiumLogo';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  onNewChat: () => void;
  onOpenSearch: () => void;
  onOpenImageTool: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onUploadDocument: () => void;
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: (theme: 'light' | 'dark') => void;
  userName?: string;
  userEmail?: string;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  onNewChat,
  onOpenSearch,
  onOpenImageTool,
  onOpenSettings,
  onOpenHelp,
  onUploadDocument,
  isOpen,
  onClose,
  userName = '',
  userEmail = '',
  isLoggedIn = false,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Left Sidebar - Strictly Dark Cyan-Black */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-neutral-900 bg-neutral-950 text-white transition-all duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand / Logo Section with New Logo */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <PotassiumLogo size={28} glow={true} />
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-sm leading-tight uppercase font-sans text-white">
                POTASSIUM
              </span>
              <span className="text-[10px] tracking-wide text-cyan-300 font-semibold flex items-center gap-1">
                <span>Made by Archer</span>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md md:hidden hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar (⌘ K) */}
        <div className="p-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-neutral-800/80 bg-neutral-900/60 text-xs text-neutral-400 hover:border-cyan-500/40 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-cyan-400" />
              <span>Search prompts</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono border bg-neutral-800 border-neutral-700 text-neutral-300">
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {/* AI Chat (Primary active tab) */}
          <button
            type="button"
            onClick={() => {
              onSelectView('chat');
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeView === 'chat'
                ? 'bg-neutral-900 border border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                activeView === 'chat'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'bg-neutral-900 text-neutral-400'
              }`}
            >
              <MessageSquare size={14} className="stroke-[2.5]" />
            </div>
            <span>AI Chat</span>
          </button>

          {/* Image Studio */}
          <button
            type="button"
            onClick={() => {
              onOpenImageTool();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900/60 transition-colors"
          >
            <div className="p-1 rounded-lg bg-neutral-900 text-cyan-400">
              <ImageIcon size={14} />
            </div>
            <span>Image Studio</span>
          </button>

          {/* Projects */}
          <button
            type="button"
            onClick={() => {
              onSelectView('projects');
              if (window.innerWidth < 768) onClose();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeView === 'projects'
                ? 'bg-neutral-900 border border-cyan-500/50 text-cyan-300'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <div className="p-1 rounded-lg bg-neutral-900 text-neutral-400">
              <FolderKanban size={14} />
            </div>
            <span>History &amp; Projects</span>
          </button>

          {/* Templates */}
          <button
            type="button"
            onClick={() => {
              onSelectView('templates');
              if (window.innerWidth < 768) onClose();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeView === 'templates'
                ? 'bg-neutral-900 border border-cyan-500/50 text-cyan-300'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <div className="p-1 rounded-lg bg-neutral-900 text-neutral-400">
              <Sparkles size={14} />
            </div>
            <span>Prompt Templates</span>
          </button>

          {/* Section Divider */}
          <div className="pt-3 pb-1 px-3">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Workflows
            </span>
          </div>

          {/* Quick Action: New Conversation */}
          <button
            type="button"
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/60 transition-colors"
          >
            <Plus size={14} className="text-cyan-400" />
            <span>New Chat</span>
          </button>

          {/* Quick Action: Upload Document */}
          <button
            type="button"
            onClick={onUploadDocument}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/60 transition-colors"
          >
            <FileText size={14} className="text-cyan-400" />
            <span>Upload Document</span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => {
              onOpenSettings();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/60 transition-colors"
          >
            <SettingsIcon size={14} className="text-neutral-400" />
            <span>Settings</span>
          </button>

          {/* Help */}
          <button
            type="button"
            onClick={() => {
              onOpenHelp();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/60 transition-colors"
          >
            <HelpCircle size={14} className="text-neutral-400" />
            <span>Help &amp; Documentation</span>
          </button>
        </div>

        {/* Footer Area: Dark Mode Identity Badge & Profile Card */}
        <div className="p-3 border-t border-neutral-900 shrink-0 space-y-2.5">
          {/* Cyan-Black Edition Badge (Replacing removed light/dark mode switch) */}
          <div className="px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
              <span className="text-neutral-300 font-medium text-[11px]">Cyan-Black Dark Edition</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">v1.3</span>
          </div>

          {/* User Profile / Auth Area */}
          {isLoggedIn ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-xs shrink-0 shadow-xs">
                  {(userName || userEmail || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate leading-tight text-white">
                    {userName || userEmail.split('@')[0]}
                  </div>
                  <div className="text-[10px] truncate leading-tight text-cyan-300/80">
                    {userEmail}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors ml-1 shrink-0"
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/70 via-neutral-900 to-neutral-900 text-left hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors shrink-0">
                  <UserIcon size={14} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white group-hover:text-cyan-200 transition-colors">
                    Sign in to save chats
                  </div>
                  <div className="text-[10px] text-cyan-400/80 truncate">
                    Free • Private across devices
                  </div>
                </div>
              </div>
              <LogIn size={14} className="text-cyan-400 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
