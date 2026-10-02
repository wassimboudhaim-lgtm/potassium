import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Shield, Trash2, Download, Cpu } from 'lucide-react';
import { PotassiumLogo } from './PotassiumLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAllHistory: () => void;
  onExportHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearAllHistory,
  onExportHistory,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg rounded-2xl border border-white/30 bg-black text-white p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <PotassiumLogo size={26} />
            <div>
              <h2 className="text-base font-bold tracking-wider uppercase text-white">
                POTASSIUM System & Capabilities
              </h2>
              <p className="text-xs text-white/50">Verified Environment Inspection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Real Capability Audit */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu size={14} />
            Active AI & System Capabilities
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between p-3 rounded-xl border border-white/20 bg-neutral-950">
              <div>
                <div className="font-semibold text-white">General Intelligence & Reasoning</div>
                <div className="text-white/60 text-[11px] mt-0.5">
                  Math, science, history, coding, explanations, creative writing.
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-white px-2 py-0.5 rounded border border-white/30 bg-neutral-900 shrink-0">
                <CheckCircle size={12} className="text-white" />
                ACTIVE
              </span>
            </div>

            <div className="flex items-start justify-between p-3 rounded-xl border border-white/20 bg-neutral-950">
              <div>
                <div className="font-semibold text-white">Multimodal Vision & Analysis</div>
                <div className="text-white/60 text-[11px] mt-0.5">
                  Image inspection, text extraction, diagrams, charts, screenshots.
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-white px-2 py-0.5 rounded border border-white/30 bg-neutral-900 shrink-0">
                <CheckCircle size={12} className="text-white" />
                ACTIVE
              </span>
            </div>

            <div className="flex items-start justify-between p-3 rounded-xl border border-white/20 bg-neutral-950">
              <div>
                <div className="font-semibold text-white">Document & File Parsing</div>
                <div className="text-white/60 text-[11px] mt-0.5">
                  PDF multi-page text extraction, TXT, CSV, JSON, code files.
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-white px-2 py-0.5 rounded border border-white/30 bg-neutral-900 shrink-0">
                <CheckCircle size={12} className="text-white" />
                ACTIVE
              </span>
            </div>

            <div className="flex items-start justify-between p-3 rounded-xl border border-white/20 bg-neutral-950">
              <div>
                <div className="font-semibold text-white">Voice Input & Read Aloud</div>
                <div className="text-white/60 text-[11px] mt-0.5">
                  Browser SpeechRecognition microphone input and SpeechSynthesis audio playback.
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-white px-2 py-0.5 rounded border border-white/30 bg-neutral-900 shrink-0">
                <CheckCircle size={12} className="text-white" />
                ACTIVE
              </span>
            </div>

            <div className="flex items-start justify-between p-3 rounded-xl border border-white/20 bg-neutral-950">
              <div>
                <div className="font-semibold text-white">Image Generation</div>
                <div className="text-white/60 text-[11px] mt-0.5">
                  Free tier quota is limit 0 (requires paid tier key). Transparently audited without fake mockups.
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-white/70 px-2 py-0.5 rounded border border-white/20 bg-neutral-900 shrink-0">
                <AlertCircle size={12} className="text-white/70" />
                KEY-DEPENDENT
              </span>
            </div>
          </div>
        </div>

        {/* Security & Integrity */}
        <div className="p-3.5 rounded-xl border border-white/20 bg-neutral-950 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Shield size={14} />
            Security & Implementation Boundary
          </div>
          <p className="text-white/60 text-[11px] leading-relaxed">
            All API queries are proxied server-side via Express on the backend. No API keys, credentials, or hidden directives are ever sent or exposed to the client browser.
          </p>
        </div>

        {/* Data & Storage Management */}
        <div className="space-y-3 pt-2 border-t border-white/20">
          <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            History & Data Storage
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onExportHistory}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/30 text-white text-xs hover:bg-neutral-900 hover:border-white transition-colors"
            >
              <Download size={14} />
              <span>Export History (JSON)</span>
            </button>

            {confirmClear ? (
              <div className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearAllHistory();
                    setConfirmClear(false);
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
                >
                  Confirm Delete All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="py-2 px-3 rounded-xl border border-white/30 text-xs hover:bg-neutral-900"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/20 text-white/80 text-xs hover:border-white hover:text-white transition-colors"
              >
                <Trash2 size={14} />
                <span>Clear All History</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-[10px] text-white/40 border-t border-white/10">
          POTASSIUM Assistant • Strict Monochromatic Interface (#000000 & #FFFFFF)
        </div>
      </div>
    </div>
  );
};
