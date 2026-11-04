import React, { useState } from 'react';
import { AppView, Reservation } from '../types';

interface MyBookingsViewProps {
  reservations: Reservation[];
  onNavigate: (view: AppView) => void;
  onCheckOut: (resId: string, name: string) => void;
  onExtend: (resId: string, name: string) => void;
  onCancel: (resId: string, name: string, timeRange?: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  reservations,
  onNavigate,
  onCheckOut,
  onExtend,
  onCancel,
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'reserved' | 'ended'>('all');

  const getResourceTitle = (res: Reservation) => {
    if (res.resourceName) return res.resourceName;
    switch (res.resourceId) {
      case 'room-1':
        return '대회의실 A (10인 권장)';
      case 'room-2':
        return '소회의실 A (4인실)';
      case 'room-3':
        return '소회의실 B (4인실)';
      case 'room-4':
        return '포커스룸 1 (1인실)';
      case 'room-5':
        return '포커스룸 2 (1인실)';
      case 'room-6':
        return '중회의실 B (6인실)';
      case 'room-7':
        return '크리에이티브 룸 (8인실)';
      case 'asset-1':
      case 'eq-3':
        return '32인치 4K 모니터 거치대';
      case 'asset-2':
      case 'eq-1':
        return '4K 촬영 장비 세트 (Sony A7M4)';
      case 'asset-3':
      case 'eq-2':
        return '무선 마이크 세트 (DJI Mic 2)';
      case 'asset-4':
      case 'eq-4':
        return '무선 화상회의 패키지 A';
      case 'asset-5':
      case 'eq-5':
        return '이동식 4K 빔프로젝터';
      default:
        return '공용 회의실 / 비품';
    }
  };

  const getResourceIcon = (res: Reservation) => {
    if (
      res.resourceId?.startsWith('asset') ||
      res.resourceId?.startsWith('eq') ||
      res.resourceName?.includes('모니터') ||
      res.resourceName?.includes('촬영') ||
      res.resourceName?.includes('마이크')
    ) {
      return 'devices_other';
    }
    return 'meeting_room';
  };

  const isCurrentlyActive = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const currentTotal = 14 * 60 + 15;
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    return currentTotal >= startTotal && currentTotal < endTotal;
  };

  const getEffectiveStatus = (res: Reservation): 'in_progress' | 'reserved' | 'completed' | 'cancelled' => {
    if (res.status === 'cancelled') return 'cancelled';
    if (res.status === 'completed') return 'completed';
    if (res.status === 'in_progress' || isCurrentlyActive(res.startTime, res.endTime)) return 'in_progress';
    return 'reserved';
  };

  const formatCreationTime = (createdAt?: number | string) => {
    if (!createdAt) return '';
    try {
      if (typeof createdAt === 'string') {
        const d = new Date(createdAt);
        return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      }
      const d = new Date(createdAt);
      return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const status = getEffectiveStatus(r);
    if (filter === 'all') return status !== 'cancelled';
    if (filter === 'in_progress') return status === 'in_progress';
    if (filter === 'reserved') return status === 'reserved';
    if (filter === 'ended') return status === 'completed' || status === 'cancelled';
    return true;
  });

  return (
    <div className="w-full px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#45474b] text-[11px]">
            <span>내 예약 내역</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#02060e] font-semibold text-xs">신청 목록 관리</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-[28px] font-bold text-[#191c1e] tracking-tight">
              내 예약 내역
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006c4a]/10 text-[#006c4a] text-xs font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#006c4a] animate-pulse"></span>
              Firebase 동기화 중
            </span>
          </div>
          <p className="text-xs text-[#45474b] mt-0.5">
            내가 신청한 회의실 및 자산 예약의 일정, 목적, 상태, 생성 시점을 클라우드 데이터베이스에서 관리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('meeting-rooms')}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#006c4a] hover:bg-[#00714e] text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>새 예약하기</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#f2f4f6] p-1 rounded-xl self-start text-xs font-semibold">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#45474b] hover:text-[#191c1e]'
          }`}
        >
          전체 유효 예약 ({reservations.filter((r) => r.status !== 'cancelled').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('in_progress')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'in_progress'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#45474b] hover:text-[#191c1e]'
          }`}
        >
          지금 쓰는 중 ({reservations.filter((r) => getEffectiveStatus(r) === 'in_progress').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('reserved')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'reserved'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#45474b] hover:text-[#191c1e]'
          }`}
        >
          예약됨 ({reservations.filter((r) => getEffectiveStatus(r) === 'reserved').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('ended')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'ended'
              ? 'bg-white text-[#191c1e] shadow-xs'
              : 'text-[#45474b] hover:text-[#191c1e]'
          }`}
        >
          완료 / 취소 ({reservations.filter((r) => r.status === 'completed' || r.status === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      {filteredReservations.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-[#e6e8ea] text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#f2f4f6] text-[#75777c] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[28px]">event_busy</span>
          </div>
          <h3 className="text-base font-bold text-[#191c1e]">해당 조건의 예약 내역이 없습니다</h3>
          <p className="text-xs text-[#45474b] mt-1 mb-4">
            필요한 회의실이나 공용 비품을 1초 원터치로 간편하게 예약해 보세요.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('meeting-rooms')}
            className="px-4 py-2 rounded-xl bg-[#02060e] text-white text-xs font-bold hover:bg-[#191f28] transition-colors"
          >
            새 예약하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((res) => {
            const title = getResourceTitle(res);
            const icon = getResourceIcon(res);
            const effectiveStatus = getEffectiveStatus(res);
            const createdText = formatCreationTime(res.createdAt);

            return (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-white border border-[#e6e8ea] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#c5c6cb] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">{icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[17px] font-bold text-[#191c1e]">
                        {title}
                      </h3>
                      {res.resourceId && (
                        <span className="text-[11px] font-mono text-[#006c4a] bg-[#006c4a]/10 px-2 py-0.5 rounded-full font-semibold">
                          #{res.resourceId}
                        </span>
                      )}

                      {/* Status Badges strictly unified */}
                      {effectiveStatus === 'in_progress' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] text-[11px] font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                          지금 쓰는 중
                        </span>
                      )}
                      {effectiveStatus === 'reserved' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#006c4a]/10 text-[#006c4a] text-[11px] font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                          예약됨
                        </span>
                      )}
                      {effectiveStatus === 'completed' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#75777c]/15 text-[#45474b] text-[11px] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check</span>
                          반납/완료됨
                        </span>
                      )}
                      {effectiveStatus === 'cancelled' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">block</span>
                          취소됨
                        </span>
                      )}

                      {res.date && (
                        <span className="text-[11px] text-[#75777c] font-medium bg-[#f2f4f6] px-2 py-0.5 rounded">
                          {res.date}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#45474b] mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-[#191c1e]">
                        <span className="material-symbols-outlined text-[16px] text-[#006c4a]">schedule</span>
                        {res.startTime} ~ {res.endTime}
                      </span>
                      <span>•</span>
                      <span>이용 목적: <strong className="text-[#191c1e] font-semibold">{res.purpose || '사내 업무 회의'}</strong></span>
                      {res.userName && (
                        <>
                          <span>•</span>
                          <span>신청자: {res.userName}{res.userDept ? ` (${res.userDept})` : ''}</span>
                        </>
                      )}
                      {createdText && (
                        <>
                          <span>•</span>
                          <span className="text-[#75777c]">등록: {createdText}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons: [+ 15분 연장], [취소], [퇴실 / 반납] */}
                {effectiveStatus !== 'cancelled' && effectiveStatus !== 'completed' ? (
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* 시간 연장 버튼 */}
                    <button
                      type="button"
                      onClick={() => onExtend(res.id, title)}
                      className="px-3.5 py-2 rounded-xl bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 border border-[#e6e8ea]"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#006c4a]">add</span>
                      <span>+ 15분 연장</span>
                    </button>

                    {/* 취소 버튼 */}
                    <button
                      type="button"
                      onClick={() => onCancel(res.id, title, `${res.startTime} ~ ${res.endTime}`)}
                      className="px-3.5 py-2 rounded-xl bg-[#f2f4f6] hover:bg-[#ffdad6]/50 text-[#45474b] hover:text-[#ba1a1a] text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 border border-[#e6e8ea]"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                      <span>취소</span>
                    </button>

                    {/* 퇴실 / 반납 버튼 */}
                    <button
                      type="button"
                      onClick={() => onCheckOut(res.id, title)}
                      className="px-3.5 py-2 rounded-xl bg-[#ffdad6]/60 hover:bg-[#ba1a1a] hover:text-white text-[#ba1a1a] text-xs font-semibold transition-all active:scale-95"
                    >
                      퇴실 / 반납
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-[#75777c] font-medium px-3 py-1 bg-[#f2f4f6] rounded-lg">
                    {effectiveStatus === 'cancelled' ? '취소된 내역' : '종료된 내역'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
