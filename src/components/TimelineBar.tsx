import React from 'react';
import { TimeSlot } from '../types';
import {
  BUSINESS_START_HOUR,
  BUSINESS_END_HOUR,
  timeToMinutes,
} from '../utils/time';

interface TimelineBarProps {
  slots: TimeSlot[];
  currentTimeStr: string;
  onSlotClick?: (startTime: string) => void;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({
  slots,
  currentTimeStr,
  onSlotClick,
}) => {
  const currentMinutes = timeToMinutes(currentTimeStr);
  const startMinutes = BUSINESS_START_HOUR * 60;
  const endMinutes = BUSINESS_END_HOUR * 60;
  const totalMinutes = endMinutes - startMinutes;

  // Calculate current time indicator percentage
  const currentPercent = Math.max(
    0,
    Math.min(100, ((currentMinutes - startMinutes) / totalMinutes) * 100)
  );

  const isCurrentTimeInRange = currentMinutes >= startMinutes && currentMinutes <= endMinutes;

  return (
    <div className="w-full">
      {/* Time axis labels */}
      <div className="flex justify-between items-center text-[10px] text-[#8B95A1] font-mono mb-1 px-0.5 tabular-nums">
        <span>09:00</span>
        <span>11:00</span>
        <span>13:00</span>
        <span>15:00</span>
        <span>17:00</span>
        <span>19:00</span>
      </div>

      {/* Track Container */}
      <div className="relative w-full h-8 bg-[#F2F4F6] rounded-lg p-0.5 border border-[#E5E8EB] flex gap-[2px] overflow-hidden select-none">
        {slots.map((slot) => {
          const isAvailable = slot.status === 'available';
          const isInUse = slot.status === 'in_use';
          const isReserved = slot.status === 'reserved';
          const isPast = slot.status === 'past';

          let cellClass = '';
          if (isInUse) {
            cellClass = 'bg-[#E11D48] text-white shadow-xs';
          } else if (isReserved) {
            cellClass = 'bg-[#059669] text-white shadow-xs';
          } else if (isAvailable) {
            cellClass =
              'bg-white hover:bg-[#191F28] hover:text-white border border-[#E5E8EB] text-[#4E5968] cursor-pointer transition-colors';
          } else {
            // Past
            cellClass = 'bg-[#E5E8EB]/60 text-[#9CA3AF] opacity-60';
          }

          return (
            <button
              key={slot.startTime}
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                if (isAvailable && onSlotClick) {
                  onSlotClick(slot.startTime);
                }
              }}
              title={`${slot.startTime} ~ ${slot.endTime} (${
                isInUse
                  ? '지금 사용 중'
                  : isReserved
                  ? '예약됨'
                  : isAvailable
                  ? '사용 가능 (클릭하여 예약)'
                  : '지난 시간'
              })`}
              className={`flex-1 h-full rounded-[4px] flex items-center justify-center text-[9px] font-mono transition-transform active:scale-95 group relative ${cellClass}`}
            >
              {/* Optional tiny tooltip on hover */}
              {isAvailable && (
                <span className="hidden group-hover:block absolute -top-7 left-1/2 -translate-x-1/2 bg-[#191F28] text-white text-[10px] font-sans px-1.5 py-0.5 rounded shadow z-20 whitespace-nowrap">
                  {slot.startTime} 예약
                </span>
              )}
            </button>
          );
        })}

        {/* Real-time Indicator Line */}
        {isCurrentTimeInRange && (
          <div
            style={{ left: `${currentPercent}%` }}
            className="absolute top-0 bottom-0 w-[2px] bg-[#E11D48] z-10 pointer-events-none -translate-x-1/2 flex flex-col items-center shadow-[0_0_6px_rgba(225,29,72,0.8)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] -top-1 absolute shadow-sm" />
          </div>
        )}
      </div>

      {/* Quick explanation below track */}
      <div className="flex items-center justify-between mt-1 text-[10px] text-[#8B95A1]">
        <span>30분 단위 시간표</span>
        <span className="text-[#6B7280]">빈 칸을 눌러도 바로 예약 창이 열립니다</span>
      </div>
    </div>
  );
};
