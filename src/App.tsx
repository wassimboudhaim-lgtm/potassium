import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, Attachment } from './types';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { ChatArea } from './components/ChatArea';
import { MessageInput } from './components/MessageInput';
import { SettingsModal } from './components/SettingsModal';
import { ImageToolModal } from './components/ImageToolModal';
import { PromptBrowseModal } from './components/PromptBrowseModal';
import { AuthModal } from './components/AuthModal';
import {
  subscribeToAuth,
  subscribeToUserConversations,
  saveUserConversation,
  deleteUserConversation,
  logoutUser,
} from './firebase';
import { User } from 'firebase/auth';

const STORAGE_KEY = 'potassium_conversations_v1';
const THEME_KEY = 'potassium_theme_v1';

export default function App() {
  // Always dark cyan-black mode (light mode removed)
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  // User Authentication & Cloud Sync
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Dynamic JS Color Engine: smoothly shifts between greenish-cyan, cyan, and deep cyber black
  const [dynamicColorMode, setDynamicColorMode] = useState<'flow' | 'mint' | 'cyan' | 'teal'>('flow');
  const [dynamicHue, setDynamicHue] = useState<number>(0);

  useEffect(() => {
    if (dynamicColorMode !== 'flow') {
      if (dynamicColorMode === 'mint') setDynamicHue(-22); // Greenish cyan
      else if (dynamicColorMode === 'cyan') setDynamicHue(0); // Electric cyan
      else if (dynamicColorMode === 'teal') setDynamicHue(22); // Deep cyber cyan
      return;
    }

    let frameId: number;
    const startTime = Date.now();

    const animateHue = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      // Oscillate smoothly between -25deg (mint greenish-cyan) and +25deg (electric cyan)
      const current = Math.sin(elapsed * 0.4) * 24;
      setDynamicHue(current);
      frameId = requestAnimationFrame(animateHue);
    };

    frameId = requestAnimationFrame(animateHue);
    return () => cancelAnimationFrame(frameId);
  }, [dynamicColorMode]);

  const handleCycleDynamicColor = () => {
    setDynamicColorMode((prev) => {
      if (prev === 'flow') return 'mint';
      if (prev === 'mint') return 'cyan';
      if (prev === 'cyan') return 'teal';
      return 'flow';
    });
  };

  const dynamicColorLabel = {
    flow: 'Dynamic Flow',
    mint: 'Greenish Cyan',
    cyan: 'Electric Cyan',
    teal: 'Cyber Teal',
  }[dynamicColorMode];

  const [engineMode, setEngineMode] = useState<string>('deepseek-v3');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<string>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(false);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImageToolOpen, setIsImageToolOpen] = useState(false);
  const [isPromptBrowseOpen, setIsPromptBrowseOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  // Load and subscribe to conversations based on auth state
  useEffect(() => {
    if (!currentUser) {
      // Guest mode: load from browser storage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setConversations(JSON.parse(saved));
        } else {
          setConversations([]);
        }
      } catch (e) {
        console.error('Failed to load guest conversations from storage:', e);
      }
      return;
    }

    // Authenticated mode: subscribe to user's private Firestore conversations
    const unsubscribe = subscribeToUserConversations(
      currentUser.uid,
      (cloudConvs) => {
        if (cloudConvs && cloudConvs.length > 0) {
          setConversations(cloudConvs);
        } else {
          // If first time logging in and user had local guest conversations, migrate them to their cloud account
          const localSaved = localStorage.getItem(STORAGE_KEY);
          if (localSaved) {
            try {
              const localConvs: Conversation[] = JSON.parse(localSaved);
              if (localConvs.length > 0) {
                localConvs.forEach((c) => saveUserConversation(currentUser.uid, c));
                localStorage.removeItem(STORAGE_KEY);
              }
            } catch (err) {}
          }
        }
      },
      (err) => {
        console.warn('Could not sync cloud conversations:', err);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Sync guest conversations to localStorage
  useEffect(() => {
    if (!currentUser) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      } catch (e) {
        console.error('Failed to save guest conversations:', e);
      }
    }
  }, [conversations, currentUser]);

  // Set default active conversation if none exists
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  // Keyboard shortcut: ⌘ K / Ctrl K to open prompt search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPromptBrowseOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeId);
  const currentMessages = activeConversation?.messages || [];

  // Create New Chat
  const handleNewChat = () => {
    if (activeConversation && activeConversation.messages.length === 0) {
      return;
    }

    const newConv: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: 'New Project',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setActiveView('chat');

    if (currentUser) {
      saveUserConversation(currentUser.uid, newConv).catch(console.error);
    }
  };

  // Delete Conversation
  const handleDeleteConversation = (id: string) => {
    if (currentUser) {
      deleteUserConversation(currentUser.uid, id).catch(console.error);
    }
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (activeId === id) {
        setActiveId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  };

  // Rename Conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c
      );
      if (currentUser) {
        const target = updated.find((c) => c.id === id);
        if (target) saveUserConversation(currentUser.uid, target).catch(console.error);
      }
      return updated;
    });
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logoutUser();
      setConversations([]);
      setActiveId(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Clear All History
  const handleClearAllHistory = () => {
    setConversations([]);
    setActiveId(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Export History
  const handleExportHistory = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(conversations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `potassium-chat-history-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Stop Generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // Check if prompt is a vector graphic request
  const isVectorGenerationRequest = (text: string): boolean => {
    const lower = text.trim().toLowerCase();
    return (
      lower.startsWith('draw a vector') ||
      lower.startsWith('create a vector') ||
      lower.startsWith('generate a vector') ||
      lower.startsWith('generate an svg') ||
      lower.startsWith('create an svg') ||
      lower.startsWith('draw an svg') ||
      lower.startsWith('design a vector') ||
      lower.startsWith('make a vector') ||
      lower.startsWith('/vector') ||
      lower.startsWith('/svg')
    );
  };

  // Check if prompt is an in-chat image generation request
  const isImageGenerationRequest = (rawText: string): boolean => {
    const text = rawText.trim().toLowerCase();
    if (
      text.startsWith('/image') ||
      text.startsWith('/draw') ||
      text.startsWith('/img') ||
      text.startsWith('/pic') ||
      text.startsWith('/photo')
    ) {
      return true;
    }

    const hasVisualNoun = /\b(image|picture|photo|illustration|artwork|drawing|painting|wallpaper|avatar|visual|graphic|portrait|render|sketch)\b/i.test(text);
    const hasCreationVerb = /\b(generate|create|gcreate|make|draw|paint|render|produce|synthesize|show|give|design|output)\b/i.test(text);

    if (hasVisualNoun && hasCreationVerb) return true;
    if (/\b(image|picture|photo|illustration|drawing|portrait|sketch|artwork)\s+(of|for|about|depicting|showing)\s+/i.test(text)) return true;
    if (/^(can you\s+)?(please\s+)?(draw|paint|sketch)\s+(me\s+)?(a|an|the|some)?\s+/i.test(text)) return true;
    return false;
  };

  const extractImagePrompt = (rawText: string): string => {
    let prompt = rawText.trim();
    prompt = prompt.replace(/^\/(image|draw|img|pic|photo|paint|sketch)\s*/i, '');
    prompt = prompt.replace(
      /^(can you\s+)?(please\s+)?(generate|create|gcreate|make|draw|paint|render|produce|design|synthesize|show me|give me)\s+(an?\s+)?(image|picture|photo|illustration|artwork|drawing|painting|portrait|wallpaper|render)\s+(of|for|about|depicting|showing)?\s*/i,
      ''
    );
    prompt = prompt.replace(/^(an?\s+)?(image|picture|photo|illustration|drawing)\s+(of|for|about|depicting|showing)\s*/i, '');
    prompt = prompt.replace(/^(can you\s+)?(please\s+)?(draw|paint|sketch)\s+(me\s+)?(a|an|the)?\s*/i, '');
    return prompt.trim() || rawText.trim();
  };

  // Insert from Image Tool
  const handleInsertFromImageTool = (
    content: string,
    imageUrl?: string,
    svgContent?: string
  ) => {
    let targetConvId = activeId;
    let targetConv = activeConversation;

    if (!targetConvId || !targetConv) {
      const newConv: Conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: 'Artwork Project',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(newConv.id);
      targetConvId = newConv.id;
    }

    const assistantMessage: Message = {
      id: `msg_tool_${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
      imageUrl,
      svgContent,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          return {
            ...c,
            updatedAt: Date.now(),
            messages: [...c.messages, assistantMessage],
          };
        }
        return c;
      })
    );
  };

  // Send Message
  const handleSendMessage = async (
    text: string,
    attachments: Attachment[] = [],
    enableSearch: boolean = false
  ) => {
    if (isLoading) return;

    let targetConvId = activeId;
    let targetConv = activeConversation;

    // Create a new conversation if none active
    if (!targetConvId || !targetConv) {
      const newConv: Conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: text.slice(0, 35) || 'New Project',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(newConv.id);
      targetConvId = newConv.id;
      targetConv = newConv;
    }

    const userMessage: Message = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      attachments,
    };

    const assistantPlaceholderId = `msg_a_${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    // Update conversation with user message and placeholder
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          const isFirstMessage = c.messages.length === 0;
          return {
            ...c,
            title: isFirstMessage ? text.slice(0, 35) || 'New Project' : c.title,
            updatedAt: Date.now(),
            messages: [...c.messages, userMessage, assistantMessage],
          };
        }
        return c;
      })
    );

    setIsLoading(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Check for vector graphic intent
    if (isVectorGenerationRequest(text)) {
      try {
        const response = await fetch('/api/generate-vector', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text }),
          signal: abortController.signal,
        });

        const data = await response.json();

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map((m) => {
                  if (m.id === assistantPlaceholderId) {
                    if (data.success && data.svg) {
                      return {
                        ...m,
                        content: `Here is the generated vector graphic for: "${text}"`,
                        svgContent: data.svg,
                      };
                    } else {
                      return {
                        ...m,
                        content: data.message || 'Failed to render vector graphic.',
                      };
                    }
                  }
                  return m;
                }),
              };
            }
            return c;
          })
        );
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === targetConvId) {
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantPlaceholderId
                      ? { ...m, content: 'Error rendering vector graphic. Please try again.' }
                      : m
                  ),
                };
              }
              return c;
            })
          );
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
      return;
    }

    // Check for in-chat image generation intent
    if (isImageGenerationRequest(text)) {
      const cleanPrompt = extractImagePrompt(text);

      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: cleanPrompt }),
          signal: abortController.signal,
        });

        const data = await response.json();

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map((m) => {
                  if (m.id === assistantPlaceholderId) {
                    if (data.success && (data.imageUrl || data.svgContent)) {
                      return {
                        ...m,
                        content:
                          data.caption ||
                          `✨ Here is your generated image for: **"${cleanPrompt}"**`,
                        imageUrl: data.imageUrl,
                        svgContent: data.svgContent,
                      };
                    } else {
                      return {
                        ...m,
                        content:
                          data.message ||
                          `I attempted to synthesize an image for "${cleanPrompt}", but encountered an issue. Please try again.`,
                      };
                    }
                  }
                  return m;
                }),
              };
            }
            return c;
          })
        );
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === targetConvId) {
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantPlaceholderId
                      ? {
                          ...m,
                          content:
                            'Encountered an issue generating the visual. Please try again with a revised prompt.',
                        }
                      : m
                  ),
                };
              }
              return c;
            })
          );
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
      return;
    }

    // Standard Chat Streaming Request
    try {
      const priorMessages = targetConv?.messages || [];
      const messagesPayload = [...priorMessages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          attachments,
          useSearch: enableSearch,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to read stream');
      }

      const decoder = new TextDecoder();
      let accumulatedText = '';
      let citations: any[] = [];
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawData = line.substring(6).trim();
            if (!rawData) continue;
            try {
              const parsed = JSON.parse(rawData);

              if (parsed.type === 'chunk') {
                accumulatedText += parsed.text;
                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id === targetConvId) {
                      return {
                        ...c,
                        messages: c.messages.map((m) =>
                          m.id === assistantPlaceholderId
                            ? { ...m, content: accumulatedText }
                            : m
                        ),
                      };
                    }
                    return c;
                  })
                );
              } else if (parsed.type === 'citations') {
                citations = parsed.citations || [];
                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id === targetConvId) {
                      return {
                        ...c,
                        messages: c.messages.map((m) =>
                          m.id === assistantPlaceholderId
                            ? { ...m, citations }
                            : m
                        ),
                      };
                    }
                    return c;
                  })
                );
              } else if (parsed.type === 'image') {
                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id === targetConvId) {
                      return {
                        ...c,
                        messages: c.messages.map((m) =>
                          m.id === assistantPlaceholderId
                            ? {
                                ...m,
                                imageUrl: parsed.imageUrl,
                                svgContent: parsed.svgContent,
                              }
                            : m
                        ),
                      };
                    }
                    return c;
                  })
                );
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error);
              }
            } catch (err: any) {
              console.warn('Error parsing SSE event:', err);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMsg =
          err.message || 'An unexpected error occurred while communicating with POTASSIUM.';
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantPlaceholderId
                    ? {
                        ...m,
                        error: errorMsg,
                        content: m.content || 'POTASSIUM encountered an error completing your request.',
                      }
                    : m
                ),
              };
            }
            return c;
          })
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      if (currentUser) {
        setConversations((latest) => {
          const target = latest.find((c) => c.id === targetConvId);
          if (target) {
            saveUserConversation(currentUser.uid, target).catch(console.error);
          }
          return latest;
        });
      }
    }
  };

  // Regenerate last response
  const handleRegenerate = () => {
    if (isLoading || !activeConversation || activeConversation.messages.length < 2) return;

    const msgs = activeConversation.messages;
    const lastUserMsgIndex = [...msgs].reverse().findIndex((m) => m.role === 'user');
    if (lastUserMsgIndex === -1) return;

    const actualUserIndex = msgs.length - 1 - lastUserMsgIndex;
    const userMsg = msgs[actualUserIndex];

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: c.messages.slice(0, actualUserIndex),
          };
        }
        return c;
      })
    );

    handleSendMessage(userMsg.content, userMsg.attachments, useSearch);
  };

  const handleRetry = () => {
    handleRegenerate();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-black text-white">
      {/* Hidden file uploader for documents */}
      <input
        type="file"
        ref={fileUploadRef}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleSendMessage(`Please inspect and summarize this uploaded document: "${file.name}"`);
          }
        }}
      />

      {/* Left Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          if (v === 'templates') setIsPromptBrowseOpen(true);
          if (v === 'projects') setIsRightSidebarOpen(true);
        }}
        onNewChat={handleNewChat}
        onOpenSearch={() => setIsPromptBrowseOpen(true)}
        onOpenImageTool={() => setIsImageToolOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsSettingsOpen(true)}
        onUploadDocument={() => fileUploadRef.current?.click()}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userName={currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : '')}
        userEmail={currentUser?.email || ''}
        isLoggedIn={!!currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Center Chat Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <ChatArea
          messages={currentMessages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onRegenerate={handleRegenerate}
          onRetry={handleRetry}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenImageTool={() => setIsImageToolOpen(true)}
          onToggleRightSidebar={() => setIsRightSidebarOpen((prev) => !prev)}
          isRightSidebarOpen={isRightSidebarOpen}
          conversationTitle={activeConversation?.title || 'Welcome to Potassium'}
          useSearch={useSearch}
          dynamicHue={dynamicHue}
          onCycleDynamicColor={handleCycleDynamicColor}
          dynamicColorLabel={dynamicColorLabel}
          userName={currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : '')}
          isLoggedIn={!!currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          engineMode={engineMode}
          onChangeEngineMode={(m) => setEngineMode(m)}
        />

        {/* Floating Message Input Card */}
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStopGeneration={handleStopGeneration}
          useSearch={useSearch}
          onToggleSearch={() => setUseSearch((prev) => !prev)}
          onOpenImageTool={() => setIsImageToolOpen(true)}
          onOpenBrowsePrompts={() => setIsPromptBrowseOpen(true)}
          dynamicHue={dynamicHue}
        />
      </div>

      {/* Right Sidebar (Projects / Recent Chats) */}
      <RightSidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={(id) => {
          setActiveId(id);
          setActiveView('chat');
        }}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isOpen={isRightSidebarOpen}
        onToggle={() => setIsRightSidebarOpen((prev) => !prev)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearAllHistory={handleClearAllHistory}
        onExportHistory={handleExportHistory}
      />

      {/* Image Studio Modal */}
      <ImageToolModal
        isOpen={isImageToolOpen}
        onClose={() => setIsImageToolOpen(false)}
        onInsertToChat={handleInsertFromImageTool}
      />

      {/* Prompt Browse Modal */}
      <PromptBrowseModal
        isOpen={isPromptBrowseOpen}
        onClose={() => setIsPromptBrowseOpen(false)}
        onSelectPrompt={(p) => handleSendMessage(p, [], useSearch)}
      />

      {/* Auth Modal for Visitors to Sign In and Save Chats Privately */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
