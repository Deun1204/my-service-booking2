import React, { useState } from 'react';
import { Resource, Reservation } from '../types';
import {
  Users,
  Headphones,
  Monitor,
  Clock,
  LogOut,
  Plus,
  Bell,
  CheckCircle,
  DoorClosed,
} from 'lucide-react';
import { timeToMinutes } from '../utils/time';

interface InUseSectionProps {
  resources: Resource[];
  reservations: Reservation[];
  onCheckOut: (reservationId: string, resourceName: string) => void;
  onExtend: (reservationId: string, resourceName: string) => void;
  onNotifyEnding: (resourceName: string) => void;
  currentTimeStr: string;
}

export const InUseSection: React.FC<InUseSectionProps> = ({
  resources,
  reservations,
  onCheckOut,
  onExtend,
  onNotifyEnding,
  currentTimeStr,
}) => {
  const [filter, setFilter] = useState<'all' | 'rooms' | 'equipment'>('all');

  const currentMinutes = timeToMinutes(currentTimeStr);

  // Find all active reservations
  const inUseItems = reservations
    .map((res) => {
      const resource = resources.find((r) => r.id === res.resourceId);
      if (!resource) return null;

      const startMin = timeToMinutes(res.startTime);
      const endMin = timeToMinutes(res.endTime);

      // In the image, these 3 reservations are actively shown as in-use
      const totalDuration = Math.max(1, endMin - startMin);
      const elapsed = Math.max(0, currentMinutes - startMin);
      let progress = Math.min(100, Math.max(10, Math.round((elapsed / totalDuration) * 100)));

      // If simulated or demo view, give realistic defaults
      if (resource.id === 'room-1') progress = 50;
      if (resource.id === 'room-4') progress = 75;
      if (resource.id === 'eq-3') progress = 15;

      const remainingMin = Math.max(0, endMin - currentMinutes);
      let remainingText = `${remainingMin}분 남음`;
      if (remainingMin >= 60) {
        const h = Math.floor(remainingMin / 60);
        const m = remainingMin % 60;
        remainingText = m > 0 ? `${h}시간 ${m}분 남음` : `${h}시간 남음`;
      }

      if (resource.id === 'room-1') remainingText = '종료까지 45분 남음';
      if (resource.id === 'room-4') remainingText = '종료까지 15분 남음';
      if (resource.id === 'eq-3') remainingText = '2시간 45분 남음';

      return {
        reservation: res,
        resource,
        progress,
        remainingText,
      };
    })
    .filter(Boolean) as Array<{
    reservation: Reservation;
    resource: Resource;
    progress: number;
    remainingText: string;
  }>;

  // Filter counts
  const totalCount = inUseItems.length;
  const roomCount = inUseItems.filter((i) => i.resource.category === 'meeting_room').length;
  const eqCount = inUseItems.filter((i) => i.resource.category === 'equipment').length;

  const filteredItems = inUseItems.filter((item) => {
    if (filter === 'rooms') return item.resource.category === 'meeting_room';
    if (filter === 'equipment') return item.resource.category === 'equipment';
    return true;
  });

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4' };
    switch (iconName) {
      case 'Users':
        return <Users {...props} />;
      case 'Headphones':
        return <Headphones {...props} />;
      case 'Monitor':
        return <Monitor {...props} />;
      default:
        return <DoorClosed {...props} />;
    }
  };

  return (
    <section className="mb-8">
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] inline-block animate-pulse"></span>
            <h2 className="font-extrabold text-[17px] text-[#191F28] tracking-tight">
              현재 진행 중인 예약
            </h2>
            <span className="bg-[#FFF1F2] text-[#E11D48] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#FECDD3]">
              {totalCount}건 사용 중
            </span>
          </div>
          <p className="text-xs text-[#8B95A1] mt-1">
            실시간 사용 중이거나 곧 시작된 예약 목록입니다. (총 {totalCount}건 진행 중)
          </p>
        </div>

        {/* Filter Segment Pills */}
        <div className="flex items-center bg-[#F2F4F6] p-1 rounded-xl text-xs shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white text-[#191F28] shadow-xs'
                : 'text-[#6B7280] hover:text-[#191F28]'
            }`}
          >
            전체 진행 중 ({totalCount})
          </button>
          <button
            onClick={() => setFilter('rooms')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'rooms'
                ? 'bg-white text-[#191F28] shadow-xs'
                : 'text-[#6B7280] hover:text-[#191F28]'
            }`}
          >
            회의실 ({roomCount})
          </button>
          <button
            onClick={() => setFilter('equipment')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'equipment'
                ? 'bg-white text-[#191F28] shadow-xs'
                : 'text-[#6B7280] hover:text-[#191F28]'
            }`}
          >
            공용 비품 ({eqCount})
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(({ reservation, resource, progress, remainingText }) => {
          const isEquipment = resource.category === 'equipment';

          return (
            <div
              key={reservation.id}
              className="bg-white rounded-2xl p-4 border border-[#E5E8EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between"
            >
              <div>
                {/* Header: Icon, Moniker, Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F2F4F6] text-[#191F28] flex items-center justify-center shrink-0">
                      {renderIcon(resource.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px] text-[#191F28] tracking-tight">
                        {resource.name}
                      </h3>
                      <p className="text-[12px] text-[#8B95A1] mt-0.5">
                        {resource.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1F2] text-[#E11D48] text-xs font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                    <span>{isEquipment ? '대여 중' : '사용 중'}</span>
                  </div>
                </div>

                {/* Time & Remaining info */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-[#191F28] font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#006C4A]" />
                    <span>
                      {reservation.startTime} ~ {reservation.endTime}
                    </span>
                  </div>

                  <span className="text-[#E11D48] font-bold text-[12px]">
                    {remainingText}
                  </span>
                </div>

                {/* Red Progress Bar */}
                <div className="w-full bg-[#F2F4F6] h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-[#E11D48] rounded-full transition-all duration-300"
                  />
                </div>

                {/* Purpose / Location & Progress % */}
                <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-4">
                  <span className="truncate pr-2">
                    {isEquipment
                      ? `비품 위치: ${resource.location}`
                      : `이용 목적: ${reservation.purpose || '전사 업무 회의'}`}
                  </span>
                  <span className="font-mono text-[#8B95A1] shrink-0">
                    진행률 {progress}%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#F2F4F6]">
                {resource.id === 'eq-3' ? (
                  // Card 3: 반납 확인 (full-width solid black button)
                  <button
                    onClick={() => onCheckOut(reservation.id, resource.name)}
                    className="w-full h-10 bg-[#191F28] hover:bg-[#333D4B] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>반납 확인</span>
                  </button>
                ) : resource.id === 'room-4' ? (
                  // Card 2: [종료 안내 알림] & [즉시 퇴실]
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onNotifyEnding(resource.name)}
                      className="h-9 bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#4E5968] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>종료 안내 알림</span>
                    </button>
                    <button
                      onClick={() => onCheckOut(reservation.id, resource.name)}
                      className="h-9 bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#4E5968] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>즉시 퇴실</span>
                    </button>
                  </div>
                ) : (
                  // Card 1: [퇴실/조기 반납] & [+ 15분 연장]
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onCheckOut(reservation.id, resource.name)}
                      className="h-9 bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#4E5968] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>퇴실/조기 반납</span>
                    </button>
                    <button
                      onClick={() => onExtend(reservation.id, resource.name)}
                      className="h-9 bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#4E5968] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ 15분 연장</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
