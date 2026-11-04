import React from 'react';
import { Resource, Reservation } from '../types';
import {
  generateDayTimeSlots,
  getResourceStatus,
} from '../utils/time';
import { TimelineBar } from './TimelineBar';
import {
  Users,
  DoorClosed,
  Laptop,
  Camera,
  Mic,
  Monitor,
  Projector,
  CalendarPlus,
  MapPin,
  Clock,
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  reservations: Reservation[];
  currentTimeStr: string;
  onOpenBooking: (resource: Resource, initialStartTime?: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  reservations,
  currentTimeStr,
  onOpenBooking,
}) => {
  // Filter reservations for this resource
  const resourceReservations = reservations.filter(
    (res) => res.resourceId === resource.id
  );

  const { status, currentReservation, nextReservation } = getResourceStatus(
    resourceReservations,
    currentTimeStr
  );

  const slots = generateDayTimeSlots(resourceReservations, currentTimeStr);

  // Icon mapping
  const renderIcon = () => {
    const props = { className: 'w-4 h-4' };
    switch (resource.iconName) {
      case 'Users':
        return <Users {...props} />;
      case 'DoorClosed':
        return <DoorClosed {...props} />;
      case 'Laptop':
        return <Laptop {...props} />;
      case 'Camera':
        return <Camera {...props} />;
      case 'Mic':
        return <Mic {...props} />;
      case 'Monitor':
        return <Monitor {...props} />;
      case 'Projector':
        return <Projector {...props} />;
      default:
        return <DoorClosed {...props} />;
    }
  };

  return (
    <article className="bg-white rounded-2xl p-4 border border-[#E5E8EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-3 transition-all hover:border-[#D1D5DB]">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F2F4F6] text-[#191F28] flex items-center justify-center shrink-0 mt-0.5">
            {renderIcon()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[15px] text-[#191F28] tracking-tight">
                {resource.name}
              </h3>
              {/* Status Dot next to name as required by PRD */}
              {status === 'in_use' && (
                <span className="relative flex h-2 w-2" title="현재 사용 중">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
                </span>
              )}
              {status === 'reserved' && (
                <span className="w-2 h-2 rounded-full bg-[#059669] inline-block" title="오늘 예약됨" />
              )}
              {status === 'available' && (
                <span className="w-2 h-2 rounded-full bg-white border border-[#9CA3AF] inline-block" title="사용 가능" />
              )}
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#8B95A1] mt-0.5">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                {resource.location}
              </span>
              {resource.capacity && (
                <>
                  <span>·</span>
                  <span>{resource.capacity}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Semantic Status Badge */}
        <div>
          {status === 'in_use' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
              </span>
              <span>지금 쓰는 중</span>
            </div>
          )}

          {status === 'reserved' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              <span>예약됨</span>
            </div>
          )}

          {status === 'available' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E5E8EB] text-[#4E5968] text-xs font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
              <span>사용 가능</span>
            </div>
          )}
        </div>
      </div>

      {/* Current/Next Reservation Context Helper */}
      <div className="mb-3 text-[12px] text-[#4E5968] bg-[#F8F9FA] px-3 py-1.5 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-[#8B95A1] shrink-0" />
          {status === 'in_use' && currentReservation ? (
            <span className="truncate">
              현재 사용 중: <strong className="text-[#E11D48] font-semibold">{currentReservation.startTime} ~ {currentReservation.endTime}</strong>
            </span>
          ) : status === 'reserved' && nextReservation ? (
            <span className="truncate">
              다음 예약: <strong className="text-[#059669] font-semibold">{nextReservation.startTime} ~ {nextReservation.endTime}</strong>
            </span>
          ) : (
            <span className="text-[#059669] font-medium">지금 바로 사용 가능합니다</span>
          )}
        </div>

        {/* Specs tag */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#8B95A1]">
          {resource.specs.slice(0, 2).join(' · ')}
        </div>
      </div>

      {/* Horizontal Timeline Bar with 30-min blocks */}
      <div className="mb-3">
        <TimelineBar
          slots={slots}
          currentTimeStr={currentTimeStr}
          onSlotClick={(startTime) => onOpenBooking(resource, startTime)}
        />
      </div>

      {/* Action Area: [예약하기] button (prominent when available) */}
      <div className="pt-2 border-t border-[#F2F4F6] flex items-center justify-between">
        <div className="text-[11px] text-[#8B95A1]">
          {resource.categoryLabel}
        </div>

        {/* Direct Booking Button */}
        {status === 'available' ? (
          <button
            onClick={() => onOpenBooking(resource)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#191F28] hover:bg-[#333D4B] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 min-h-[40px]"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>예약하기</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenBooking(resource)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#333D4B] text-xs font-semibold rounded-xl transition-all active:scale-95 min-h-[40px]"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>다른 시간대 예약</span>
          </button>
        )}
      </div>
    </article>
  );
};
