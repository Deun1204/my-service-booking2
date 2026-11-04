import React from 'react';
import { formatKoreanDate, formatClockTime } from '../utils/time';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentDate: Date;
  companyName: string;
  onResetDemo: () => void;
  isSimulatedTime: boolean;
  onToggleTimeSimulation: () => void;
  simulatedHour: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  companyName,
  onResetDemo,
  isSimulatedTime,
  onToggleTimeSimulation,
  simulatedHour,
}) => {
  return (
    <header className="pt-6 pb-4 px-4 bg-[#F2F4F6]">
      {/* Top Branding Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Logo & ON AIR Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-[22px] tracking-tight text-[#191F28]">
              룸온에어
            </span>
            <span className="font-medium text-xs text-[#8B95A1] tracking-normal">
              RoomOnAir
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF1F2] border border-[#FECDD3] ml-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
            </span>
            <span className="text-[11px] font-bold text-[#E11D48] tracking-wider uppercase">
              LIVE
            </span>
          </div>
        </div>

        {/* Reset / Demo test button */}
        <button
          onClick={onResetDemo}
          title="초기 예약 데이터로 리셋"
          className="flex items-center gap-1 text-[12px] text-[#8B95A1] hover:text-[#191F28] bg-white border border-[#E5E8EB] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </button>
      </div>

      {/* Company Name & Date / Clock Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E8EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between border-b border-[#F2F4F6] pb-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#191F28]">
              {companyName}
            </span>
            <span className="text-[11px] font-semibold text-[#8B95A1] bg-[#F2F4F6] px-2 py-0.5 rounded-md">
              실시간 현황
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-[#4E5968] block">
              {formatKoreanDate(currentDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#4E5968]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
            <span>운영 시간: <strong className="text-[#191F28] font-semibold tabular-nums">09:00 ~ 19:00</strong></span>
          </div>

          <div className="flex items-center gap-1 text-[#191F28] font-bold tabular-nums text-sm">
            <span className="text-xs font-normal text-[#8B95A1]">현재 시각</span>
            <span className="bg-[#F2F4F6] px-2 py-0.5 rounded font-mono text-[13px] tracking-tight">
              {formatClockTime(currentDate)}
            </span>
          </div>
        </div>

        {/* Time Simulator Pill if user tests outside office hours */}
        <div className="mt-3 pt-2.5 border-t border-[#F2F4F6] flex items-center justify-between text-[11px] text-[#8B95A1]">
          <span>실시간 자동 동기화 중 (로그인 불필요)</span>
          <button
            onClick={onToggleTimeSimulation}
            className={`px-2 py-1 rounded font-medium transition-all ${
              isSimulatedTime
                ? 'bg-[#191F28] text-white'
                : 'bg-[#F2F4F6] text-[#4E5968] hover:text-[#191F28]'
            }`}
          >
            {isSimulatedTime ? `업무시간 모드 (${simulatedHour}:30)` : '실제 시각 기준'}
          </button>
        </div>
      </div>
    </header>
  );
};
