import React, { useState } from 'react';
import { AppView, NotificationItem } from '../types';
import { NotificationDropdown } from './NotificationDropdown';

interface TopHeaderProps {
  currentView: AppView;
  onCopyLink: () => void;
  brandVariant?: 'nextstep' | 'resourcesync';
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAllNotifications: () => void;
  onOpenMobileDrawer?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  onCopyLink,
  brandVariant = 'nextstep',
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAllNotifications,
  onOpenMobileDrawer,
}) => {
  const [copied, setCopied] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCopy = () => {
    onCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const today = new Date();
  const formattedTodayHeader = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-[#f8f9fb]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-3 sm:px-6 md:px-8 border-b border-[#eceef0]">
      {/* Left title and hamburger */}
      <div className="flex items-center gap-2 sm:gap-4">
        {onOpenMobileDrawer && (
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[#191c1e] hover:bg-[#e6e8ea] active:scale-95 transition-all shrink-0"
            aria-label="메뉴 열기"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="font-bold text-[14px] sm:text-[17px] text-[#191c1e] tracking-tight truncate">
            넥스트스텝 테크놀로지스
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#e6e8ea] text-[11px] font-semibold text-[#45474b] shrink-0">
            판교 본사
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-[#45474b] text-xs font-mono">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <span>{formattedTodayHeader}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 relative shrink-0">
        {/* 실시간 공유 링크 복사 (Mobile: Icon only, Desktop: Icon + Text) */}
        <button
          type="button"
          onClick={handleCopy}
          title="실시간 공유 링크 복사"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] font-semibold text-xs rounded-lg transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-[#45474b]">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span className="hidden sm:inline">{copied ? '링크 복사됨!' : '실시간 공유 링크 복사'}</span>
        </button>

        {/* Notifications Icon Button with Dynamic Red Dot */}
        <div className="relative">
          <button
            type="button"
            title="알림"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all relative ${
              isNotificationOpen
                ? 'bg-[#e6e8ea] text-[#191c1e]'
                : 'bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#45474b] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            
            {/* Red dot displayed ONLY when there are unread notifications */}
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onClearAll={onClearAllNotifications}
          />
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-[#02060e] flex items-center justify-center text-white shrink-0">
          <span className="material-symbols-outlined text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
};
