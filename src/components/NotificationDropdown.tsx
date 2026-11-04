import React from 'react';
import { NotificationItem } from '../types';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'upcoming':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#82f5c1]/30 text-[#00714e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
          </div>
        );
      case 'ending':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">timer</span>
          </div>
        );
      case 'sync':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#dde3ef] text-[#006c4a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">event_available</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] text-[#45474b] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </div>
        );
    }
  };

  return (
    <>
      {/* Invisible backdrop to dismiss on click outside */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown Card */}
      <div className="absolute right-0 top-12 w-96 max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-2xl border border-[#e6e8ea] z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#f8f9fb] border-b border-[#eceef0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px] text-[#191c1e]">notifications</span>
              <h3 className="font-bold text-[15px] text-[#191c1e] tracking-tight">알림</h3>
            </div>
            {unreadCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
                새 알림 {unreadCount}건
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#e6e8ea] text-[#45474b] text-[11px] font-semibold">
                모두 읽음
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-[12px] font-semibold text-[#006c4a] hover:text-[#005137] hover:underline transition-colors flex items-center gap-1"
                title="모든 알림을 읽음 처리합니다"
              >
                <span className="material-symbols-outlined text-[16px]">done_all</span>
                <span>모두 읽음</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg hover:bg-[#e6e8ea] text-[#75777c] hover:text-[#191c1e] flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#f2f4f6]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center text-[#75777c]">
              <div className="w-12 h-12 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#75777c] mb-2">
                <span className="material-symbols-outlined text-[24px]">notifications_off</span>
              </div>
              <p className="text-xs font-semibold text-[#191c1e]">알림 내역이 없습니다</p>
              <p className="text-[11px] text-[#818792] mt-0.5">새로운 알림이 오면 이곳에 표시됩니다.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                  item.read
                    ? 'bg-white hover:bg-[#f8f9fb] opacity-75'
                    : 'bg-[#f8f9fb] hover:bg-[#f2f4f6]'
                }`}
              >
                {renderIcon(item.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4
                      className={`text-xs truncate ${
                        item.read
                          ? 'font-medium text-[#45474b]'
                          : 'font-bold text-[#191c1e]'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#818792] font-mono shrink-0">
                      {item.timeAgo}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#45474b] leading-relaxed line-clamp-2">
                    {item.message}
                  </p>

                  {!item.read && (
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                      <span className="text-[10px] text-[#006c4a] font-semibold">읽지 않음 · 클릭하여 확인</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2.5 bg-[#f8f9fb] border-t border-[#eceef0] flex items-center justify-between text-[11px]">
            <span className="text-[#818792] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
              실시간 알림 연동 중
            </span>
            {onClearAll && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-[#75777c] hover:text-[#ba1a1a] transition-colors font-medium"
              >
                알림 모두 지우기
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};
