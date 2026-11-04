import React from 'react';

export const Legend: React.FC = () => {
  return (
    <div className="px-4 mb-3">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm px-3.5 py-2.5 rounded-xl border border-[#E5E8EB] text-xs">
        <span className="font-semibold text-[#8B95A1] text-[11px] tracking-tight">
          상태 범례
        </span>

        <div className="flex items-center gap-3">
          {/* 사용 가능 (색 없음 / 흰색) */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#CBD5E1] shadow-xs inline-block"></span>
            <span className="text-[#4E5968] font-medium text-[11px]">사용 가능</span>
          </div>

          {/* 예약됨 (초록색) */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669] inline-block"></span>
            <span className="text-[#059669] font-medium text-[11px]">예약됨</span>
          </div>

          {/* 지금 쓰는 중 (빨간색) */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E11D48]"></span>
            </span>
            <span className="text-[#E11D48] font-semibold text-[11px]">지금 쓰는 중</span>
          </div>
        </div>
      </div>
    </div>
  );
};
