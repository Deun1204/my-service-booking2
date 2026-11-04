import React from 'react';
import { Zap } from 'lucide-react';

interface SubHeaderBarProps {
  timeReferenceText: string;
}

export const SubHeaderBar: React.FC<SubHeaderBarProps> = ({
  timeReferenceText = '오늘 10월 24일 · 14:15 기준',
}) => {
  return (
    <div className="bg-white border-b border-[#E5E8EB] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left items */}
      <div className="flex flex-wrap items-center gap-4 text-[#4E5968]">
        {/* 실시간 동기화 ON */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
          <span className="font-semibold text-[#191F28]">실시간 동기화 ON</span>
          <span className="text-[#8B95A1]">|</span>
          <span className="text-[#6B7280] font-medium">{timeReferenceText}</span>
        </div>

        {/* 로그인 없이 슬롯 터치 1초 즉시 점유 */}
        <div className="hidden sm:flex items-center gap-1 text-[#006C4A] font-medium">
          <Zap className="w-3.5 h-3.5 fill-[#006C4A]" />
          <span>로그인 없이 슬롯 터치 1초 즉시 점유</span>
        </div>
      </div>

      {/* Right legend */}
      <div className="flex items-center gap-3 text-[#6B7280]">
        <span className="hidden md:inline font-mono">{timeReferenceText}</span>
        
        {/* 예약됨 (초록색) */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#006C4A]"></span>
          <span className="font-semibold text-[#191F28]">예약됨</span>
        </div>

        {/* 지금 쓰는 중 (빨간색) */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
          </span>
          <span className="font-semibold text-[#E11D48]">지금 쓰는 중</span>
        </div>
      </div>
    </div>
  );
};
