import React from 'react';
import { RotateCcw, QrCode, Zap } from 'lucide-react';

export const SystemInfoCards: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: 자동 노쇼 해제 시스템 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E8EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#006C4A] flex items-center justify-center shrink-0 mt-0.5">
          <RotateCcw className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-[14px] text-[#191F28] tracking-tight">
            자동 노쇼 해제 시스템
          </h4>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            예약 시작 후 10분 동안 미사용 시 자동으로 빈 슬롯으로 복구됩니다.
          </p>
        </div>
      </div>

      {/* Card 2: 현장 도어락 QR 지원 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E8EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#F2F4F6] text-[#191F28] flex items-center justify-center shrink-0 mt-0.5">
          <QrCode className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-[14px] text-[#191F28] tracking-tight">
            현장 도어락 QR 지원
          </h4>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            회의실 문 앞 태그를 스마트폰으로 태그하면 즉시 이 화면으로 진입합니다.
          </p>
        </div>
      </div>

      {/* Card 3: 원터치 반납/퇴실 */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E8EB] shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0 mt-0.5">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-[14px] text-[#191F28] tracking-tight">
            원터치 반납/퇴실
          </h4>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            일찍 종료된 회의는 슬롯을 다시 탭하여 즉시 다른 동료에게 양도하세요.
          </p>
        </div>
      </div>
    </section>
  );
};
