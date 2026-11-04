import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
}) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#ffffff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between border-r border-[#eceef0] select-none">
      <div className="flex flex-col">
        {/* Brand Header: Unified NextStep */}
        <div className="h-16 px-6 flex items-center gap-2.5 border-b border-[#f2f4f6]">
          <div className="w-8 h-8 rounded-lg bg-[#02060e] flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] text-[#02060e] leading-tight tracking-tight">
              NextStep
            </span>
            <span className="text-[11px] text-[#45474b] font-medium">
              공용 공간 · 자산 관리
            </span>
          </div>
        </div>

        {/* Menu Section Label */}
        <div className="px-4 py-2 mt-1">
          <span className="px-2 font-semibold text-xs text-[#191c1e] tracking-normal">
            룸온에어 메뉴
          </span>
        </div>

        {/* Navigation list */}
        <nav className="px-2 space-y-1">
          {/* Big Green Primary CTA: 새 예약하기 */}
          <button
            type="button"
            onClick={() => onNavigate('meeting-rooms')}
            className="w-full flex items-center justify-between px-4 py-3 my-1.5 rounded-xl bg-[#006c4a] text-white font-bold text-[15px] shadow-sm hover:bg-[#007a53] transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">add_circle</span>
              <span>새 예약하기</span>
            </div>
            <span className="material-symbols-outlined text-[18px] opacity-80">arrow_forward</span>
          </button>

          {/* 1. 대시보드 */}
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'dashboard'
                ? 'bg-[#191f28] text-white shadow-xs'
                : 'text-[#45474b] hover:bg-[#e6e8ea] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            <span>대시보드</span>
          </button>

          {/* 2. 회의실 예약 */}
          <button
            type="button"
            onClick={() => onNavigate('meeting-rooms')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'meeting-rooms'
                ? 'bg-[#191f28] text-white shadow-xs'
                : 'text-[#45474b] hover:bg-[#e6e8ea] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">meeting_room</span>
            <span>회의실 예약</span>
          </button>

          {/* 3. 자산 예약 */}
          <button
            type="button"
            onClick={() => onNavigate('assets')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'assets'
                ? 'bg-[#191f28] text-white shadow-xs'
                : 'text-[#45474b] hover:bg-[#e6e8ea] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">devices_other</span>
            <span>자산 예약</span>
          </button>

          {/* 4. 내 예약 내역 */}
          <button
            type="button"
            onClick={() => onNavigate('my-bookings')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'my-bookings' || currentView === 'confirmed'
                ? 'bg-[#191f28] text-white shadow-xs'
                : 'text-[#45474b] hover:bg-[#e6e8ea] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">bookmark_check</span>
            <span>내 예약 내역</span>
          </button>
        </nav>
      </div>

      {/* Sidebar Footer: Unified Realtime Integration Badge */}
      <div className="p-3">
        <div className="p-3 bg-[#f2f4f6] rounded-xl border border-[#e6e8ea]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-[#006c4a] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006c4a] inline-block animate-pulse"></span>
              실시간 연동
            </span>
            <span className="text-[10px] text-[#45474b] font-mono">v2.4.0</span>
          </div>
          <p className="text-[11px] text-[#45474b] leading-tight">
            슬랙 봇 연동 대기중 (@nextstep-bot)
          </p>
        </div>
      </div>
    </aside>
  );
};
