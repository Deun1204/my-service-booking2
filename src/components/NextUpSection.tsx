import React from 'react';
import { Resource, Reservation } from '../types';
import { DoorClosed, Camera, Sparkles, Send } from 'lucide-react';

interface NextUpSectionProps {
  resources: Resource[];
  reservations: Reservation[];
}

export const NextUpSection: React.FC<NextUpSectionProps> = ({
  resources,
  reservations,
}) => {
  // Items matching the screenshot
  const nextItems = [
    {
      id: 'next-1',
      resourceName: '소회의실 B (4인실)',
      subtitle: '예약 시간: 15:00 ~ 16:00 · 모션데스크 화상',
      badgeText: '15:00 예정',
      icon: <DoorClosed className="w-5 h-5 text-[#191F28]" />,
    },
    {
      id: 'next-2',
      resourceName: '4K 촬영 장비 세트 (Sony A7M4)',
      subtitle: '예약 시간: 16:00 ~ 18:00 · 삼각대 포함',
      badgeText: '16:00 예정',
      icon: <Camera className="w-5 h-5 text-[#191F28]" />,
    },
  ];

  return (
    <section className="mb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="text-[#006C4A]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-extrabold text-[16px] text-[#191F28] tracking-tight">
            곧 시작될 다음 예약 (Next Up)
          </h2>
          <span className="bg-[#85F8C4]/50 text-[#005137] text-xs font-bold px-2 py-0.5 rounded-md">
            오늘 예정
          </span>
        </div>

        <span className="text-xs text-[#8B95A1]">
          시작 10분 전 사전 알림 발송 완료
        </span>
      </div>

      {/* Cards List in Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nextItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#E5E8EB] flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E8EB] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-[#191F28]">
                  {item.resourceName}
                </h4>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <span className="bg-[#85F8C4]/70 text-[#005137] font-bold text-xs px-3 py-1.5 rounded-lg shrink-0">
              {item.badgeText}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
