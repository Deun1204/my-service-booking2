import React, { useState } from 'react';
import { Copy, Check, Share2, Sparkles } from 'lucide-react';

interface ShareLinkCardProps {
  onCopySuccess: () => void;
}

export const ShareLinkCard: React.FC<ShareLinkCardProps> = ({ onCopySuccess }) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'https://roomonair.app';
  };

  const handleCopy = async () => {
    try {
      const url = getShareUrl();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older environments
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="mx-4 mb-4 bg-gradient-to-br from-[#FFFFFF] to-[#F9FAFB] rounded-2xl p-3.5 border border-[#E5E8EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-[#F2F4F6] flex items-center justify-center text-[#191F28]">
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-[#191F28] flex items-center gap-1">
              전용 공유 링크
              <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.2 rounded-full border border-[#A7F3D0]">
                로그인 불필요
              </span>
            </h3>
          </div>
        </div>

        <span className="text-[11px] text-[#8B95A1] flex items-center gap-0.5">
          <Sparkles className="w-3 h-3 text-[#059669]" />
          원클릭 공유
        </span>
      </div>

      <p className="text-[12px] text-[#6B7280] leading-snug mb-2.5">
        사내 구성원 누구에게나 이 링크를 공유해 주세요. 별도 가입 없이 즉시 실시간 현황을 보고 예약할 수 있습니다.
      </p>

      {/* URL box + Copy Button */}
      <div className="flex items-center gap-2 bg-[#F2F4F6] rounded-xl p-1.5 border border-[#E5E8EB]">
        <div className="flex-1 px-2.5 py-1 text-[12px] font-mono text-[#374151] truncate select-all">
          {getShareUrl()}
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 min-h-[36px] ${
            copied
              ? 'bg-[#059669] text-white shadow-sm'
              : 'bg-[#191F28] text-white hover:bg-[#333D4B]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>복사됨!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>링크 복사</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
