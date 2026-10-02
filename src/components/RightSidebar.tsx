import React, { useMemo } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, PanelRightClose } from 'lucide-react';
import { Conversation } from '../types';

interface RightSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  theme?: 'light' | 'dark';
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  isOpen,
  onToggle,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  const handleStartRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  // Group conversations chronologically like Image 1 (Today, 5 Days Ago, 7 Days Ago, Older)
  const groupedConversations = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const groups: { [key: string]: Conversation[] } = {
      Today: [],
      '5 Days Ago': [],
      '7 Days Ago': [],
      Older: [],
    };

    conversations.forEach((conv) => {
      const diffDays = Math.floor((now - (conv.updatedAt || conv.createdAt)) / oneDay);
      if (diffDays <= 0) {
        groups['Today'].push(conv);
      } else if (diffDays <= 5) {
        groups['5 Days Ago'].push(conv);
      } else if (diffDays <= 7) {
        groups['7 Days Ago'].push(conv);
      } else {
        groups['Older'].push(conv);
      }
    });

    return groups;
  }, [conversations]);

  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 z-30 flex flex-col border-l border-neutral-900/80 transition-all duration-300 ease-in-out bg-black/90 backdrop-blur-2xl text-white ${
        isOpen
          ? 'w-72 sm:w-80 translate-x-0'
          : 'w-0 translate-x-full lg:w-0 lg:translate-x-0 overflow-hidden border-none'
      }`}
    >
      {/* Header matching Image 1: "History Chat" with "+ New Chat" pill button */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <h3 className="font-semibold text-base tracking-tight text-white/95">History Chat</h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700/80 text-white text-xs font-medium hover:border-cyan-400/60 hover:bg-neutral-800 transition-all shadow-sm active:scale-95"
            title="Start New Chat"
          >
            <Plus size={13} className="text-cyan-400 stroke-[2.5]" />
            <span>New Chat</span>
          </button>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            title="Close sidebar"
          >
            <PanelRightClose size={16} />
          </button>
        </div>
      </div>

      {/* History Items list grouped by timeline */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-5">
        {conversations.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            No history chats yet.
            <br />
            Click &ldquo;+ New Chat&rdquo; to start.
          </div>
        ) : (
          Object.entries(groupedConversations).map(([groupTitle, convList]) => {
            if (convList.length === 0) return null;

            return (
              <div key={groupTitle} className="space-y-2">
                <div className="text-[11px] font-medium tracking-wide text-neutral-400 px-1 select-none">
                  {groupTitle}
                </div>

                <div className="space-y-1.5">
                  {convList.map((conv) => {
                    const isActive = conv.id === activeId;
                    const isEditing = conv.id === editingId;
                    const lastMsg = conv.messages[conv.messages.length - 1];
                    const previewText = conv.title || (lastMsg ? lastMsg.content : 'New chat');

                    return (
                      <div
                        key={conv.id}
                        onClick={() => {
                          if (!isEditing) onSelectConversation(conv.id);
                        }}
                        className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                          isActive
                            ? 'bg-neutral-900/90 border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-white'
                            : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-700/80 hover:bg-neutral-900/50 text-neutral-300'
                        }`}
                      >
                        {/* Chat Icon pill matching photo */}
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-neutral-900 text-neutral-400 group-hover:text-white'
                          }`}
                        >
                          <MessageSquare size={14} className="stroke-[1.75]" />
                        </div>

                        {/* Title / Content */}
                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(conv.id, e);
                                  if (e.key === 'Escape') setEditingId(null);
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                className="w-full px-2 py-0.5 rounded text-xs focus:outline-none border bg-black border-cyan-500/60 text-white"
                              />
                              <button
                                onClick={(e) => handleSaveRename(conv.id, e)}
                                className="p-1 hover:text-cyan-400 text-neutral-400"
                              >
                                <Check size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingId(null);
                                }}
                                className="p-1 hover:text-red-400 text-neutral-400"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <p className="truncate font-normal text-xs leading-snug">
                              {previewText}
                            </p>
                          )}
                        </div>

                        {/* Quick actions on hover */}
                        {!isEditing && (
                          <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleStartRename(conv, e)}
                              className="p-1 rounded text-neutral-400 hover:text-cyan-300 transition-colors"
                              title="Rename"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conv.id);
                              }}
                              className="p-1 rounded text-neutral-400 hover:text-rose-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
