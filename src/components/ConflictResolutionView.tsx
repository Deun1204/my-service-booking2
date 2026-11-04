import React, { useState } from 'react';
import { AppView, ConfirmedDetails } from '../types';

interface ConflictResolutionViewProps {
  onNavigate: (view: AppView) => void;
  onSelectSlot: (slot: string) => void;
  onBookAlternative: (resourceName: string, location: string) => void;
}

export const ConflictResolutionView: React.FC<ConflictResolutionViewProps> = ({
  onNavigate,
  onSelectSlot,
  onBookAlternative,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('15:30 ~ 17:00');

  const handleSelectSlotChange = (slot: string) => {
    setSelectedSlot(slot);
    onSelectSlot(slot);
  };

  const scrollAlternatives = (direction: number) => {
    const el = document.getElementById('altScrollContainer');
    if (el) {
      el.scrollBy({ left: direction * 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-5 sm:gap-6">
      {/* Breadcrumb & Status Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#45474b]">
          <button
            onClick={() => onNavigate('meeting-rooms')}
            className="hover:text-[#191c1e] transition-colors"
          >
            회의실 예약
          </button>
          <span className="material-symbols-outlined text-[14px]">arrow_forward_ios</span>
          <span className="text-[#191c1e] font-bold">충돌 해결 및 대안 선택</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ffdad6]/60 rounded-full text-[#ba1a1a] text-xs font-semibold border border-[#ba1a1a]/20">
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
          <span>스케줄 충돌 감지됨</span>
        </div>
      </div>

      {/* 1순위: Conflict Alert Card */}
      <section className="w-full bg-white rounded-2xl shadow-md overflow-hidden relative border border-[#e6e8ea]">
        {/* Top Alert Color Accent Strip */}
        <div className="h-2 w-full bg-gradient-to-r from-[#ba1a1a] via-[#fc3559] to-[#150002]"></div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5 min-w-0">
            {/* Prominent Warning Badge */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined material-symbols-fill text-[32px] md:text-[36px]">
                event_busy
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
                  예약 불가
                </span>
                <span className="text-[11px] text-[#75777c]">실시간 스케줄 대조 완료</span>
              </div>

              <h1 className="text-[26px] md:text-[30px] font-extrabold text-[#191c1e] mt-1 tracking-tight">
                선택하신 시간에는 이미 예약이 있어요
              </h1>

              {/* Conflicting details subtext */}
              <p className="text-xs md:text-sm text-[#45474b] mt-1 flex flex-wrap items-center gap-x-2">
                <span className="font-bold text-[#191c1e]">대회의실 A</span>
                <span className="text-[#c5c6cb]">•</span>
                <span>2025. 02. 25 (화) 14:00 ~ 15:30</span>
                <span className="text-[#c5c6cb]">•</span>
                <span className="inline-flex items-center text-[#ba1a1a] font-semibold bg-[#ffdad6]/60 px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[15px] mr-1">group</span>
                  마케팅팀 주간 싱크 미팅과 중복
                </span>
              </p>
            </div>
          </div>

          {/* Quick Summary Mini-Card */}
          <div className="w-full md:w-auto shrink-0 flex items-center gap-4 p-4 bg-[#f2f4f6] rounded-xl border border-[#e6e8ea]">
            <div className="flex flex-col text-right md:text-left min-w-[110px]">
              <span className="text-[11px] text-[#45474b]">요청 이용 시간</span>
              <span className="text-[17px] font-bold text-[#191c1e]">90분 (1.5시간)</span>
            </div>
            <div className="h-8 w-px bg-[#c5c6cb]/50"></div>
            <div className="flex flex-col text-right md:text-left min-w-[80px]">
              <span className="text-[11px] text-[#45474b]">수용 인원</span>
              <span className="text-[17px] font-bold text-[#191c1e]">최대 16인</span>
            </div>
          </div>
        </div>

        {/* Live Timeline Conflict Strip */}
        <div className="px-6 md:px-8 pb-6">
          <div className="p-4 bg-[#eceef0] rounded-xl flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-[#45474b]">
              <span className="font-semibold text-[#191c1e]">대회의실 A 당일 타임라인 (12:00 ~ 18:30)</span>
              <span className="flex items-center gap-1.5 text-[#ba1a1a] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                충돌 발생 구간
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1 h-9 rounded-lg overflow-hidden p-1 bg-[#e6e8ea]">
              <div className="bg-white text-[#45474b] rounded flex items-center justify-center text-[11px] font-mono border border-[#e6e8ea]">
                12:30 ~ 14:00
              </div>
              <div className="col-span-2 bg-[#ba1a1a] text-white font-bold rounded flex items-center justify-center text-[11px] shadow-sm animate-pulse">
                14:00 ~ 15:30 [충돌] 마케팅팀
              </div>
              <div className="col-span-2 bg-[#006c4a] text-white font-bold rounded flex items-center justify-center text-[11px] shadow-sm">
                15:30 ~ 17:00 [추천 바로 뒤]
              </div>
              <div className="bg-white text-[#45474b] rounded flex items-center justify-center text-[11px] font-mono border border-[#e6e8ea]">
                17:00 ~ 18:30
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2순위: Alternative Time Slots for Same Resource */}
      <section className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#02060e] text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="text-[18px] font-bold text-[#191c1e]">
              대회의실 A 다른 시간대로 예약하기
            </h2>
            <span className="text-xs text-[#45474b] ml-1">
              장소 변경 없이 시간만 유연하게 조정할 수 있어요
            </span>
          </div>
        </div>

        {/* Alternative Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Slot 1: 12:30 ~ 14:00 */}
          <div
            onClick={() => handleSelectSlotChange('12:30 ~ 14:00')}
            className={`bg-white p-6 rounded-2xl shadow-xs transition-all flex flex-col justify-between cursor-pointer border ${
              selectedSlot === '12:30 ~ 14:00'
                ? 'ring-2 ring-[#02060e] border-[#02060e]'
                : 'border-[#e6e8ea] hover:border-[#c5c6cb]'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold">
                  이전 시간대
                </span>
                <span className="material-symbols-outlined text-[#c5c6cb]">check_circle</span>
              </div>
              <div className="mt-4">
                <div className="text-[20px] font-bold text-[#191c1e]">12:30 ~ 14:00</div>
                <div className="text-xs text-[#006c4a] font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                  1.5h 이용 가능 (점심 직후)
                </div>
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-6 py-3 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-semibold text-xs hover:bg-[#e6e8ea] transition-colors"
            >
              이 시간으로 선택
            </button>
          </div>

          {/* Slot 2: 15:30 ~ 17:00 (PRIMARY RECOMMENDED) */}
          <div
            onClick={() => handleSelectSlotChange('15:30 ~ 17:00')}
            className={`relative bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between cursor-pointer border ring-2 ring-[#02060e] border-[#02060e]`}
          >
            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#02060e] text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined material-symbols-fill text-[13px]">star</span>
              최적 추천 슬롯
            </div>

            <div>
              <div className="flex justify-between items-start mt-1">
                <span className="px-2.5 py-0.5 rounded bg-[#82f5c1] text-[#00714e] text-[11px] font-bold">
                  추천 바로 뒤 시간대
                </span>
                <span className="material-symbols-outlined material-symbols-fill text-[#02060e]">
                  check_circle
                </span>
              </div>
              <div className="mt-4">
                <div className="text-[22px] font-extrabold text-[#191c1e]">15:30 ~ 17:00</div>
                <div className="text-xs text-[#006c4a] font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  기존 회의 종료 즉시 사용 가능
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-6 py-3.5 rounded-xl bg-[#02060e] text-white text-xs font-bold shadow-md hover:bg-[#191f28] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>이 시간으로 변경하기</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* Slot 3: 17:00 ~ 18:30 */}
          <div
            onClick={() => handleSelectSlotChange('17:00 ~ 18:30')}
            className={`bg-white p-6 rounded-2xl shadow-xs transition-all flex flex-col justify-between cursor-pointer border ${
              selectedSlot === '17:00 ~ 18:30'
                ? 'ring-2 ring-[#02060e] border-[#02060e]'
                : 'border-[#e6e8ea] hover:border-[#c5c6cb]'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 rounded bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold">
                  늦은 오후
                </span>
                <span className="material-symbols-outlined text-[#c5c6cb]">check_circle</span>
              </div>
              <div className="mt-4">
                <div className="text-[20px] font-bold text-[#191c1e]">17:00 ~ 18:30</div>
                <div className="text-xs text-[#45474b] mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">wb_twilight</span>
                  1.5h 이용 가능 (퇴근 전 집중)
                </div>
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-6 py-3 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-semibold text-xs hover:bg-[#e6e8ea] transition-colors"
            >
              이 시간으로 선택
            </button>
          </div>
        </div>
      </section>

      {/* 3순위: Exact Time Available Alternatives */}
      <section className="w-full flex flex-col gap-3 mt-2 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#e6e8ea] text-[#45474b] flex items-center justify-center text-xs font-bold">
              3
            </span>
            <div>
              <h3 className="text-[18px] font-bold text-[#191c1e]">
                동일 시간대 이용 가능한 다른 회의실 & 비품
              </h3>
              <p className="text-xs text-[#45474b]">
                원래 일정(14:00 ~ 15:30)을 변경하지 않고 바로 쓸 수 있는 공간입니다
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollAlternatives(-1)}
              className="w-8 h-8 rounded-full bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => scrollAlternatives(1)}
              className="w-8 h-8 rounded-full bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Row */}
        <div
          id="altScrollContainer"
          className="flex gap-4 overflow-x-auto py-2 no-scrollbar scroll-smooth"
        >
          {/* Alt Item 1: 중회의실 B */}
          <div className="min-w-[320px] max-w-[340px] bg-white rounded-2xl shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between shrink-0 border border-[#e6e8ea]">
            <div>
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-[#f2f4f6]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7bc0nHhxRsVa0FVWQ9mLMK_Mf1C8Qb4MVpA3CRsl8vTXMOjpIJwtgXNi7XIf4FEfUrfuwY3RMdxnCf1p9ChWm2DryP2zRzrxcB4gkVlUs6qicTaJp-4xgeQuGCDEsuVcNX7wq_rydQ9O4hY4FUSuMYwWZXqdWWEEmYYmXvGSC7gJo4cWtrsesxeVUCbRyfbQIypRHVxSSFaKqzLaiFcqqC5BbaX-tPXXu6ce3ZZ7j"
                  alt="중회의실 B"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur text-[#006c4a] text-[11px] font-bold flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                  예약 가능
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-[#191c1e]">중회의실 B</h4>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#f2f4f6] text-[#45474b]">
                  4층 서편
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-[#45474b] text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">groups</span>6인실
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">tv</span>75인치 TV
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">video_call</span>화상회의
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f2f4f6] flex items-center justify-between gap-2">
              <div className="text-[#191c1e] text-xs font-bold font-mono">14:00 ~ 15:30</div>
              <button
                type="button"
                onClick={() => onBookAlternative('중회의실 B', '4층 서편')}
                className="px-4 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] hover:bg-[#02060e] hover:text-white text-xs font-semibold transition-all active:scale-95"
              >
                이 장소로 예약
              </button>
            </div>
          </div>

          {/* Alt Item 2: 포커스룸 1 */}
          <div className="min-w-[320px] max-w-[340px] bg-white rounded-2xl shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between shrink-0 border border-[#e6e8ea]">
            <div>
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-[#f2f4f6]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNrX3xA7GwAjT3jeevjnDrtaDUZOtkMCQBbznH7voesgJthcddPQJkrgVswQNweMedcfJYaRN8K5neptArKAcxacKf5zOqdQwalJ6nfz_oLEUJ2zIImACNGv-98AI86luWUdriRlsOkIFZNdN4Jz-RXyvYiCxalrl6E40NEgARBeBhcoRG3MY6OXpsrhNwHVNBZ2-ewkSGKp2ANF8x9Qr4pG2QG6YNw5RmY6dv2BOT"
                  alt="포커스룸 1"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur text-[#006c4a] text-[11px] font-bold flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                  예약 가능
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-[#191c1e]">포커스룸 1</h4>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#f2f4f6] text-[#45474b]">
                  5층 라운지
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-[#45474b] text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">groups</span>4인실
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">hearing</span>방음 부스
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">draw</span>화이트보드
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f2f4f6] flex items-center justify-between gap-2">
              <div className="text-[#191c1e] text-xs font-bold font-mono">14:00 ~ 15:30</div>
              <button
                type="button"
                onClick={() => onBookAlternative('포커스룸 1', '5층 라운지')}
                className="px-4 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] hover:bg-[#02060e] hover:text-white text-xs font-semibold transition-all active:scale-95"
              >
                이 장소로 예약
              </button>
            </div>
          </div>

          {/* Alt Item 3: 크리에이티브 룸 */}
          <div className="min-w-[320px] max-w-[340px] bg-white rounded-2xl shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between shrink-0 border border-[#e6e8ea]">
            <div>
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-[#f2f4f6]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtmczOnJkZRwtgvd1rnQ_AHF-4VGcAPh8AhuZCAkzn9O8EhRDT9M7WkpeBSDswPRKar8Dxwh557JWLthqbs78HbqtilwVAexFRDxPd_vZS_nCJqCqeag2Smwj5Fyl-4SD4hYHsJuGbP3XznFp5q2GzuPebClUd5nNpSY6qz-6NBOe7gQGFp_oji_-mPQ0gVnQFuxUfIVMp9xG77ZkkHwcJ5CVkBcLHxYjmrraAsekx"
                  alt="크리에이티브 룸"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur text-[#006c4a] text-[11px] font-bold flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                  예약 가능
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-[#191c1e]">크리에이티브 룸</h4>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#f2f4f6] text-[#45474b]">
                  4층 동편
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-[#45474b] text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">groups</span>8인실
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">videocam</span>4K 빔프로젝터
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">power</span>다채널 전원
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f2f4f6] flex items-center justify-between gap-2">
              <div className="text-[#191c1e] text-xs font-bold font-mono">14:00 ~ 15:30</div>
              <button
                type="button"
                onClick={() => onBookAlternative('크리에이티브 룸', '4층 동편')}
                className="px-4 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] hover:bg-[#02060e] hover:text-white text-xs font-semibold transition-all active:scale-95"
              >
                이 장소로 예약
              </button>
            </div>
          </div>

          {/* Alt Item 4: 무선 화상회의 패키지 A */}
          <div className="min-w-[320px] max-w-[340px] bg-white rounded-2xl shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between shrink-0 border border-[#e6e8ea]">
            <div>
              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-[#f2f4f6]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUCCp8VU_uJ3i59rpmnNLFLXTy0TAx7wkUnyBwUgCh98vwp47ytZCETUIrKPzJacngIql8B2J_kgweLhpWCyU3B_L1fRhQNPio991kx8aQGLLn-BxTb88J1fWRQp3jp_ddDluRZdHkRelrzHh1LJPqMmKw-xfABjOaUmYlhhNUw53YnfaOWbg4d_wRhd7ZNxqqaTO2s_Hzp9dWyk4dLRvnAGaPA010q_FHmi7N8Y2u"
                  alt="무선 화상회의 패키지 A"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur text-[#006c4a] text-[11px] font-bold flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                  비품 즉시 대여
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-[#191c1e]">무선 화상회의 패키지 A</h4>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#f2f4f6] text-[#45474b]">
                  인포데스크
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-[#45474b] text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">camera</span>4K 웹캠
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">mic</span>지향성 마이크
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">laptop</span>USB 허브
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f2f4f6] flex items-center justify-between gap-2">
              <div className="text-[#191c1e] text-xs font-bold font-mono">14:00 ~ 15:30</div>
              <button
                type="button"
                onClick={() => onBookAlternative('무선 화상회의 패키지 A', '인포데스크')}
                className="px-4 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] hover:bg-[#02060e] hover:text-white text-xs font-semibold transition-all active:scale-95"
              >
                이 비품으로 예약
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
