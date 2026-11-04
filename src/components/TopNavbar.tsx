import React, { useState } from 'react';
import { Copy, Check, Bell, User, Clock, Menu } from 'lucide-react';

interface TopNavbarProps {
  onCopyLink: () => void;
  onOpenMobileMenu?: () => void;
  currentDateText?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onCopyLink,
  onOpenMobileMenu,
  currentDateText = '2026. 10. 25',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E8EB] px-6 flex items-center justify-between shrink-0">
      {/* Left side info */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#4E5968] hover:bg-[#F2F4F6]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-[17px] font-extrabold text-[#191F28] tracking-tight">
          넥스트스텝 테크놀로지스
        </h1>

        <span className="text-[12px] font-medium text-[#4E5968] bg-[#E5E8EB] px-2 py-0.5 rounded">
          판교 본사
        </span>

        <div className="hidden sm:flex items-center gap-1 text-[13px] text-[#8B95A1] font-mono ml-2">
          <Clock className="w-3.5 h-3.5 text-[#8B95A1]" />
          <span>{currentDateText}</span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* 실시간 공유 링크 복사 */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E8EB] text-xs font-semibold text-[#191F28] hover:bg-[#F8F9FA] transition-colors active:scale-95 shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#059669]" />
              <span className="text-[#059669]">복사 완료</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#4E5968]" />
              <span>실시간 공유 링크 복사</span>
            </>
          )}
        </button>

        {/* Notification Bell */}
        <button
          title="알림"
          className="w-9 h-9 rounded-full border border-[#E5E8EB] flex items-center justify-center text-[#4E5968] hover:bg-[#F8F9FA] transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] absolute top-2 right-2"></span>
        </button>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
