import React from 'react';
import { AppView } from '../types';

interface MobileBottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activeBookingsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  activeBookingsCount = 0,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-lg border-t border-[#eceef0] z-50 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      {/* 1. 대시보드 */}
      <button
        type="button"
        onClick={() => onNavigate('dashboard')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors ${
          currentView === 'dashboard'
            ? 'text-[#006c4a]'
            : 'text-[#75777c] hover:text-[#191c1e]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'dashboard' ? 'material-symbols-fill' : ''
          }`}
        >
          grid_view
        </span>
        <span className="text-[10px] font-semibold tracking-tight mt-0.5">대시보드</span>
      </button>

      {/* 2. 회의실 예약 */}
      <button
        type="button"
        onClick={() => onNavigate('meeting-rooms')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors ${
          currentView === 'meeting-rooms'
            ? 'text-[#006c4a]'
            : 'text-[#75777c] hover:text-[#191c1e]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'meeting-rooms' ? 'material-symbols-fill' : ''
          }`}
        >
          meeting_room
        </span>
        <span className="text-[10px] font-semibold tracking-tight mt-0.5">회의실</span>
      </button>

      {/* 3. Center Quick Action: 새 예약하기 (Highlight) */}
      <button
        type="button"
        onClick={() => onNavigate('meeting-rooms')}
        className="flex flex-col items-center justify-center -mt-5 mx-1 focus:outline-none group active:scale-95 transition-transform"
        aria-label="새 예약하기"
      >
        <div className="w-12 h-12 rounded-full bg-[#006c4a] text-white flex items-center justify-center shadow-lg shadow-[#006c4a]/30 border-2 border-white group-hover:bg-[#007a53] transition-colors">
          <span className="material-symbols-outlined text-[26px]">add</span>
        </div>
        <span className="text-[10px] font-bold text-[#006c4a] mt-0.5">빠른 예약</span>
      </button>

      {/* 4. 자산 예약 */}
      <button
        type="button"
        onClick={() => onNavigate('assets')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors ${
          currentView === 'assets'
            ? 'text-[#006c4a]'
            : 'text-[#75777c] hover:text-[#191c1e]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            currentView === 'assets' ? 'material-symbols-fill' : ''
          }`}
        >
          devices_other
        </span>
        <span className="text-[10px] font-semibold tracking-tight mt-0.5">자산</span>
      </button>

      {/* 5. 내 예약 내역 */}
      <button
        type="button"
        onClick={() => onNavigate('my-bookings')}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-colors relative ${
          currentView === 'my-bookings' || currentView === 'confirmed'
            ? 'text-[#006c4a]'
            : 'text-[#75777c] hover:text-[#191c1e]'
        }`}
      >
        <div className="relative">
          <span
            className={`material-symbols-outlined text-[22px] ${
              currentView === 'my-bookings' || currentView === 'confirmed'
                ? 'material-symbols-fill'
                : ''
            }`}
          >
            bookmark_check
          </span>
          {activeBookingsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-1 bg-[#ba1a1a] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-1 ring-white">
              {activeBookingsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold tracking-tight mt-0.5">내 예약</span>
      </button>
    </nav>
  );
};
