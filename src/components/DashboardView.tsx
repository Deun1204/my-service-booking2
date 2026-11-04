import React, { useState } from 'react';
import { AppView, Reservation } from '../types';
import { timeToMinutes } from '../utils/time';

interface DashboardViewProps {
  onNavigate: (view: AppView) => void;
  onOpenBookingModal: (resourceName: string, slot?: string) => void;
  onOpenCustomSchedule: (resourceName: string) => void;
  reservations: Reservation[];
  onCheckOut: (resId: string, name: string) => void;
  onExtend: (resId: string, name: string) => void;
  onNotify: (name: string) => void;
  onCancel?: (resId: string, name: string, timeRange?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenBookingModal,
  onOpenCustomSchedule,
  reservations,
  onCheckOut,
  onExtend,
  onNotify,
  onCancel,
}) => {
  const [filter, setFilter] = useState<'all' | 'rooms' | 'equipment'>('all');

  const currentMin = 14 * 60 + 15; // Reference demo time: 14:15

  // Active reservations: in_progress or current time overlaps slot (not cancelled or completed)
  const activeReservations = reservations.filter((r) => {
    if (r.status === 'cancelled' || r.status === 'completed') return false;
    const isRoom =
      r.resourceId?.startsWith('room') ||
      r.resourceName?.includes('회의실') ||
      r.resourceName?.includes('포커스');
    if (filter === 'rooms' && !isRoom) return false;
    if (filter === 'equipment' && isRoom) return false;

    const startMin = timeToMinutes(r.startTime);
    const endMin = timeToMinutes(r.endTime);
    return r.status === 'in_progress' || (currentMin >= startMin && currentMin < endMin);
  });

  // Next up reservations: scheduled for later today (start time >= currentMin, or status: 'reserved')
  const nextUpReservations = reservations
    .filter((r) => {
      if (r.status === 'cancelled' || r.status === 'completed') return false;
      const startMin = timeToMinutes(r.startTime);
      const isAlreadyActive = activeReservations.some((act) => act.id === r.id);
      return !isAlreadyActive && (startMin >= currentMin || r.status === 'reserved');
    })
    .slice(0, 4);

  const getCardIcon = (res: Reservation) => {
    if (res.resourceId?.startsWith('asset') || res.resourceId?.startsWith('eq') || res.resourceName?.includes('모니터')) return 'desktop_windows';
    if (res.resourceName?.includes('촬영') || res.resourceName?.includes('카메라')) return 'photo_camera';
    if (res.resourceName?.includes('포커스') || res.resourceName?.includes('1인')) return 'headphones';
    return 'groups';
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6">
      {/* Top Control & Status Legend Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2f4f6]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c4a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006c4a]"></span>
            </span>
            <span className="text-[11px] font-semibold text-[#006c4a]">실시간 Firebase 동기화 ON</span>
            <span className="text-[#c5c6cb] text-[11px]">|</span>
            <span className="text-[11px] text-[#45474b]">오늘 {new Date().getMonth() + 1}월 {new Date().getDate()}일 기준</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[#45474b] text-xs px-1">
            <span className="material-symbols-outlined text-[16px] text-[#006c4a]">flash_on</span>
            <span>로그인 없이 슬롯 터치 1초 즉시 점유</span>
          </div>
        </div>

        {/* 3-Color Status Legend */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#f2f4f6] self-start sm:self-auto text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs border border-[#e6e8ea]"></span>
            <span className="text-[11px] text-[#45474b] font-medium">사용 가능</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a]"></span>
            <span className="text-[11px] text-[#006c4a] font-semibold">예약됨</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
            <span className="text-[11px] text-[#ba1a1a] font-semibold">지금 쓰는 중</span>
          </div>
        </div>
      </div>

      {/* Main Section: Currently Active Reservations */}
      <section className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ba1a1a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ba1a1a]"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] text-[#191c1e] font-bold tracking-tight">
                  현재 진행 중인 예약
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] text-[11px] font-semibold">
                  {activeReservations.length}건 지금 쓰는 중
                </span>
              </div>
              <p className="text-xs text-[#45474b] mt-0.5">
                Firebase에 실시간 저장된 진행 중 예약 목록입니다. (총 {activeReservations.length}건 진행 중)
              </p>
            </div>
          </div>

          {/* Filter Pills with Horizontal Scroll on Mobile */}
          <div className="flex items-center gap-1 bg-[#f2f4f6] p-1 rounded-xl self-start sm:self-auto text-xs overflow-x-auto max-w-full no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-[#191c1e] shadow-xs'
                  : 'text-[#45474b] hover:text-[#191c1e]'
              }`}
            >
              전체 ({reservations.filter((r) => r.status !== 'cancelled' && r.status !== 'completed').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('rooms')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                filter === 'rooms'
                  ? 'bg-white text-[#191c1e] shadow-xs'
                  : 'text-[#45474b] hover:text-[#191c1e]'
              }`}
            >
              회의실 ({reservations.filter((r) => r.status !== 'cancelled' && r.status !== 'completed' && (r.resourceId?.startsWith('room') || r.resourceName?.includes('회의실'))).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('equipment')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                filter === 'equipment'
                  ? 'bg-white text-[#191c1e] shadow-xs'
                  : 'text-[#45474b] hover:text-[#191c1e]'
              }`}
            >
              공용 비품 ({reservations.filter((r) => r.status !== 'cancelled' && r.status !== 'completed' && (r.resourceId?.startsWith('asset') || r.resourceId?.startsWith('eq') || !r.resourceName?.includes('회의실'))).length})
            </button>
          </div>
        </div>

        {/* Active Cards Grid */}
        {activeReservations.length === 0 ? (
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-[#e6e8ea] text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-[#75777c] mb-2">event_available</span>
            <p className="text-sm font-bold text-[#191c1e]">현재 진행 중인 예약이 없습니다</p>
            <p className="text-xs text-[#45474b] mt-0.5">회의실이나 공용 비품을 신규 예약하여 일정을 점유해 보세요.</p>
            <button
              type="button"
              onClick={() => onNavigate('meeting-rooms')}
              className="mt-3 px-4 py-2 bg-[#006c4a] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#00714e]"
            >
              새 예약하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {activeReservations.map((res) => {
              const startMin = timeToMinutes(res.startTime);
              const endMin = timeToMinutes(res.endTime);
              const remaining = Math.max(0, endMin - currentMin);
              const totalDuration = Math.max(1, endMin - startMin);
              const progressPct = Math.min(100, Math.max(10, Math.round(((currentMin - startMin) / totalDuration) * 100)));
              const icon = getCardIcon(res);
              const title = res.resourceName || '공용 회의실 / 비품';

              return (
                <div
                  key={res.id}
                  className="p-4 rounded-2xl bg-white border border-[#e6e8ea] shadow-sm flex flex-col justify-between gap-4 hover:border-[#c5c6cb] transition-all"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#e6e8ea] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px] text-[#191c1e]">{icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[15px] text-[#191c1e] font-bold">{title}</span>
                          <span className="text-xs text-[#45474b] truncate">{res.location || '사내 공용 공간'}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] text-[11px] font-semibold flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                        지금 쓰는 중
                      </span>
                    </div>

                    <div className="bg-[#f2f4f6] p-3 rounded-xl flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#191c1e] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-[#006c4a]">schedule</span>
                          {res.startTime} ~ {res.endTime}
                        </span>
                        <span className="text-[#ba1a1a] font-bold">
                          {remaining > 0 ? `종료까지 ${remaining}분 남음` : '이용 종료 예정'}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#e6e8ea] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#ba1a1a] h-1.5 rounded-full" style={{ width: `${progressPct}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between pt-0.5 text-xs text-[#45474b]">
                        <span className="truncate">이용 목적: {res.purpose || '사내 업무 회의'}</span>
                        <span className="shrink-0">{progressPct}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-[#e6e8ea]">
                    <button
                      type="button"
                      onClick={() => onCheckOut(res.id, title)}
                      className="flex-1 py-2 px-2.5 rounded-lg bg-[#e6e8ea] hover:bg-[#ba1a1a] hover:text-white text-[#191c1e] text-[11px] font-semibold transition-all active:scale-95 flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">logout</span>
                      <span>퇴실/반납</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onExtend(res.id, title)}
                      className="py-2 px-2.5 rounded-lg bg-[#f2f4f6] hover:bg-[#eceef0] text-[#191c1e] text-[11px] font-semibold transition-all active:scale-95 flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#006c4a]">add</span>
                      <span>15분 연장</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => (onCancel ? onCancel(res.id, title, `${res.startTime} ~ ${res.endTime}`) : onCheckOut(res.id, title))}
                      className="py-2 px-2.5 rounded-lg bg-[#f2f4f6] hover:bg-[#ffdad6]/60 text-[#45474b] hover:text-[#ba1a1a] text-[11px] font-semibold transition-all active:scale-95 flex items-center justify-center gap-1 border border-[#e6e8ea]"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                      <span>취소</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Next Up List */}
        {nextUpReservations.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#e6e8ea] p-4 shadow-sm mt-2">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e6e8ea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006c4a]">upcoming</span>
                <h3 className="text-[15px] text-[#191c1e] font-bold">곧 시작될 다음 예약 (Next Up)</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#006c4a]/10 text-[#006c4a] text-[11px] font-semibold">
                  오늘 예정 ({nextUpReservations.length}건)
                </span>
              </div>
              <span className="text-xs text-[#45474b]">시작 10분 전 사전 알림 발송 완료</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {nextUpReservations.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f2f4f6] hover:bg-[#eceef0] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#e0e3e5] flex items-center justify-center text-[#191c1e]">
                      <span className="material-symbols-outlined text-[18px]">
                        {res.resourceId?.startsWith('asset') || res.resourceId?.startsWith('eq') ? 'photo_camera' : 'meeting_room'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-[#191c1e] font-semibold">{res.resourceName}</span>
                      <span className="text-xs text-[#45474b]">
                        예약 시간: {res.startTime} ~ {res.endTime} · {res.purpose || '사내 업무'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#006c4a]/10 text-[#006c4a] text-[11px] font-bold shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                    예약됨 ({res.startTime})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Bottom Quick Info Summary & Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 mb-6">
        <div className="p-4 rounded-2xl bg-white shadow-sm flex items-start gap-3 border border-[#e6e8ea]">
          <div className="w-8 h-8 rounded-lg bg-[#006c4a]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#006c4a] text-[20px]">sync</span>
          </div>
          <div>
            <h3 className="text-[13px] text-[#191c1e] font-semibold">자동 노쇼 해제 시스템</h3>
            <p className="text-xs text-[#45474b] mt-0.5 leading-relaxed">
              예약 시작 후 10분 동안 미사용 시 자동으로 빈 슬롯으로 복구됩니다.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow-sm flex items-start gap-3 border border-[#e6e8ea]">
          <div className="w-8 h-8 rounded-lg bg-[#02060e]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#02060e] text-[20px]">qr_code_scanner</span>
          </div>
          <div>
            <h3 className="text-[13px] text-[#191c1e] font-semibold">현장 도어락 QR 지원</h3>
            <p className="text-xs text-[#45474b] mt-0.5 leading-relaxed">
              회의실 문 앞 태그를 스마트폰으로 태그하면 즉시 이 화면으로 진입합니다.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow-sm flex items-start gap-3 border border-[#e6e8ea]">
          <div className="w-8 h-8 rounded-lg bg-[#ba1a1a]/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">bolt</span>
          </div>
          <div>
            <h3 className="text-[13px] text-[#191c1e] font-semibold">원터치 반납/퇴실</h3>
            <p className="text-xs text-[#45474b] mt-0.5 leading-relaxed">
              일찍 종료된 회의는 슬롯을 다시 탭하여 즉시 다른 동료에게 양도하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
