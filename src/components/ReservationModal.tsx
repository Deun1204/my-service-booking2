import React, { useState, useEffect } from 'react';
import { Resource, Reservation } from '../types';
import {
  getAvailableStartTimes,
  minutesToTime,
  timeToMinutes,
} from '../utils/time';
import { X, Check, Clock, Sparkles } from 'lucide-react';

interface ReservationModalProps {
  resource: Resource | null;
  reservations: Reservation[];
  currentTimeStr: string;
  initialStartTime?: string;
  onClose: () => void;
  onConfirmReservation: (resourceId: string, startTime: string, endTime: string) => void;
}

const DURATION_OPTIONS = [
  { label: '30분', minutes: 30 },
  { label: '1시간', minutes: 60 },
  { label: '1시간 30분', minutes: 90 },
  { label: '2시간', minutes: 120 },
];

export const ReservationModal: React.FC<ReservationModalProps> = ({
  resource,
  reservations,
  currentTimeStr,
  initialStartTime,
  onClose,
  onConfirmReservation,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // default 1 hour
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');

  if (!resource) return null;

  // Filter reservations for this resource
  const resourceReservations = reservations.filter(
    (res) => res.resourceId === resource.id
  );

  // Compute available start times for chosen duration
  const availableStarts = getAvailableStartTimes(
    resourceReservations,
    selectedDuration,
    currentTimeStr
  );

  // Set initial start time on open or duration change
  useEffect(() => {
    if (initialStartTime && availableStarts.includes(initialStartTime)) {
      setSelectedStartTime(initialStartTime);
    } else if (availableStarts.length > 0) {
      // Keep selected or pick first available
      if (!selectedStartTime || !availableStarts.includes(selectedStartTime)) {
        setSelectedStartTime(availableStarts[0]);
      }
    } else {
      setSelectedStartTime('');
    }
  }, [selectedDuration, initialStartTime, resource?.id]);

  // Calculate chosen end time
  const selectedEndTime = selectedStartTime
    ? minutesToTime(timeToMinutes(selectedStartTime) + selectedDuration)
    : '';

  const handleConfirm = () => {
    if (!selectedStartTime || !selectedEndTime) return;
    onConfirmReservation(resource.id, selectedStartTime, selectedEndTime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[4px] transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal / Bottom Sheet Panel */}
      <div className="relative w-full max-w-[460px] bg-white rounded-t-[24px] sm:rounded-2xl p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] sm:shadow-2xl z-10 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        {/* Handle bar on mobile */}
        <div className="w-10 h-1 bg-[#E5E8EB] rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header: Selected Item Notice */}
        <div className="flex items-start justify-between pb-3.5 border-b border-[#F2F4F6]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0]">
                {resource.categoryLabel}
              </span>
              <span className="text-xs text-[#8B95A1]">{resource.location}</span>
            </div>
            <h2 className="text-[18px] font-bold text-[#191F28] mt-1 tracking-tight">
              {resource.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F4F6] text-[#4E5968] flex items-center justify-center hover:bg-[#E5E8EB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 overflow-y-auto space-y-4 flex-1">
          {/* Duration Selector Pills */}
          <div>
            <label className="text-xs font-semibold text-[#191F28] mb-2 flex items-center justify-between">
              <span>이용 시간 길이</span>
              <span className="text-[11px] font-normal text-[#8B95A1]">선택 후 시작 시간을 고르세요</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {DURATION_OPTIONS.map((dur) => (
                <button
                  key={dur.minutes}
                  type="button"
                  onClick={() => setSelectedDuration(dur.minutes)}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl transition-all active:scale-95 ${
                    selectedDuration === dur.minutes
                      ? 'bg-[#191F28] text-white shadow-xs'
                      : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Available Times List (오늘 비어 있는 시간대 목록) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#191F28] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#059669]" />
                오늘 비어 있는 시간대 선택
              </label>
              <span className="text-[11px] text-[#8B95A1]">
                {availableStarts.length}개 가능
              </span>
            </div>

            {availableStarts.length === 0 ? (
              <div className="bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] text-xs p-4 rounded-xl text-center">
                선택하신 이용 시간({selectedDuration}분)으로 예약 가능한 빈 시간대가 없습니다. 이용 시간 길이를 줄여보세요.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1">
                {availableStarts.map((startTime) => {
                  const endTime = minutesToTime(
                    timeToMinutes(startTime) + selectedDuration
                  );
                  const isSelected = selectedStartTime === startTime;

                  return (
                    <button
                      key={startTime}
                      type="button"
                      onClick={() => setSelectedStartTime(startTime)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all active:scale-98 ${
                        isSelected
                          ? 'border-[#191F28] bg-[#191F28] text-white shadow-xs'
                          : 'border-[#E5E8EB] bg-[#F8F9FA] text-[#191F28] hover:border-[#CBD5E1] hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold tabular-nums">
                          {startTime} ~ {endTime}
                        </div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? 'text-gray-300' : 'text-[#8B95A1]'
                          }`}
                        >
                          {selectedDuration}분 이용
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white text-[#191F28] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Summary Card */}
          {selectedStartTime && (
            <div className="bg-[#F8F9FA] rounded-xl p-3 border border-[#E5E8EB]">
              <div className="text-[11px] text-[#8B95A1] mb-1">
                최종 예약 내용
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#191F28]">
                  오늘 {selectedStartTime} ~ {selectedEndTime}
                </span>
                <span className="text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                  {selectedDuration}분 확정
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280] mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#059669]" />
                이름이나 목적 입력 없이 원터치로 즉시 예약됩니다.
              </div>
            </div>
          )}
        </div>

        {/* Bottom 2 Buttons strictly matching PRD */}
        <div className="pt-3 border-t border-[#F2F4F6] flex flex-col gap-2">
          {/* 1. 예약 확정 버튼 */}
          <button
            type="button"
            disabled={!selectedStartTime}
            onClick={handleConfirm}
            className="w-full h-[52px] bg-[#191F28] hover:bg-[#333D4B] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
          >
            <Check className="w-5 h-5" />
            <span>예약 확정</span>
          </button>

          {/* 2. 닫기 버튼 */}
          <button
            type="button"
            onClick={onClose}
            className="w-full h-[46px] bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#333D4B] font-semibold text-[14px] rounded-xl flex items-center justify-center transition-all active:scale-[0.98]"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
