import React, { useState } from 'react';
import {
  STANDARD_START_TIMES,
  FIRST_BOOKING_TIME,
  calculateDurationText,
  generateEndTimesForStart,
  timeToMinutes,
  minutesToTime,
} from '../utils/time';

interface BookingModalProps {
  isOpen: boolean;
  resourceName: string;
  initialSlot?: string;
  onClose: () => void;
  onConfirm: (slot: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  resourceName,
  initialSlot = '09:00 ~ 10:00',
  onClose,
  onConfirm,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(initialSlot);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02060e]/30 backdrop-blur-xs transition-all animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150 border border-[#e6e8ea]">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a]"></span>
            <span className="text-[11px] text-[#006c4a] font-bold uppercase tracking-wider">
              간편 즉시 예약
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2f4f6] hover:bg-[#eceef0] flex items-center justify-center text-[#45474b] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Target Resource Display */}
        <div className="bg-[#f2f4f6] p-4 rounded-2xl flex flex-col gap-1 border border-[#e6e8ea]">
          <span className="text-[11px] text-[#45474b] font-medium">선택된 자원</span>
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-[#191c1e]">{resourceName}</h3>
            <span className="material-symbols-outlined text-[#02060e] text-[24px]">meeting_room</span>
          </div>
        </div>

        {/* Slot Options */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#45474b]">예약 시간 슬롯 선택</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedSlot('09:00 ~ 10:00')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 shadow-xs ${
                selectedSlot === '09:00 ~ 10:00'
                  ? 'bg-[#02060e] text-white'
                  : 'bg-[#f2f4f6] text-[#191c1e] hover:bg-[#eceef0]'
              }`}
            >
              <span className="font-bold text-sm">09:00 ~ 10:00</span>
              <span className="text-[11px] opacity-80">첫 슬롯 (1시간)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSlot('10:00 ~ 11:00')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 shadow-xs ${
                selectedSlot === '10:00 ~ 11:00'
                  ? 'bg-[#02060e] text-white'
                  : 'bg-[#f2f4f6] text-[#191c1e] hover:bg-[#eceef0]'
              }`}
            >
              <span className="font-bold text-sm">10:00 ~ 11:00</span>
              <span className="text-[11px] text-[#45474b]">다음 슬롯 (1시간)</span>
            </button>
          </div>
        </div>

        {/* Frictionless Rule Banner */}
        <div className="p-3 rounded-xl bg-[#82f5c1]/25 flex items-center gap-2 border border-[#82f5c1]/40">
          <span className="material-symbols-outlined text-[#00714e] text-[18px]">verified_user</span>
          <p className="text-xs text-[#00714e] leading-tight font-medium">
            로그인이나 회의 목적 입력 없이 버튼 클릭 1회로 즉시 확정됩니다.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => onConfirm(selectedSlot)}
            className="w-full h-13 py-3.5 rounded-xl bg-[#02060e] hover:bg-[#191f28] text-white text-[15px] font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{selectedSlot} 예약 확정</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-[#45474b] hover:text-[#191c1e] text-xs font-semibold transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

interface CustomScheduleModalProps {
  isOpen: boolean;
  resourceName: string;
  onClose: () => void;
  onConfirm: (date: string, startTime: string, endTime: string) => void;
}

export const CustomScheduleModal: React.FC<CustomScheduleModalProps> = ({
  isOpen,
  resourceName,
  onClose,
  onConfirm,
}) => {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const getDateOption = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const m = d.getMonth() + 1;
    const date = d.getDate();
    const day = daysOfWeek[d.getDay()];
    const yyyy = d.getFullYear();
    const label = offsetDays === 0 ? '오늘' : offsetDays === 1 ? '내일' : `${day}요일`;
    return {
      label,
      sub: `${m}/${date} (${day})`,
      value: `${yyyy}. ${String(m).padStart(2, '0')}. ${String(date).padStart(2, '0')} (${label})`,
    };
  };

  const dateOptions = [0, 1, 2, 3].map(getDateOption);
  const [selectedDateLabel, setSelectedDateLabel] = useState(() => dateOptions[0].value);
  const [startTime, setStartTime] = useState(FIRST_BOOKING_TIME);
  const [endTime, setEndTime] = useState('10:30');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02060e]/30 backdrop-blur-xs transition-all animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150 border border-[#e6e8ea]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e6e8ea]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#006c4a]/15 flex items-center justify-center text-[#006c4a]">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#191c1e]">대여 일자 & 자유 시간표 설정</h3>
              <span className="text-[11px] text-[#45474b]">원하는 날짜와 시작·종료 시간을 지정하여 예약합니다</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2f4f6] hover:bg-[#eceef0] flex items-center justify-center text-[#45474b] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Target resource */}
        <div className="bg-[#f2f4f6] p-4 rounded-2xl flex flex-col gap-1 border border-[#e6e8ea]">
          <span className="text-[11px] text-[#45474b]">예약 대상 자원</span>
          <div className="flex items-center justify-between">
            <h4 className="text-[17px] font-bold text-[#191c1e]">{resourceName}</h4>
            <span className="px-2.5 py-0.5 rounded-full bg-[#82f5c1] text-[#00714e] text-[11px] font-bold">
              실시간 예약 가능
            </span>
          </div>
        </div>

        {/* 1. Date selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#191c1e] flex items-center justify-between">
            <span>1. 대여 일자 선택</span>
            <span className="text-[11px] text-[#006c4a] font-normal">당일 및 이번 주 자유 예약 가능</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {dateOptions.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setSelectedDateLabel(d.value)}
                className={`p-2 rounded-xl flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                  selectedDateLabel === d.value
                    ? 'bg-[#02060e] text-white shadow-xs font-bold'
                    : 'bg-[#f2f4f6] text-[#191c1e] hover:bg-[#eceef0]'
                }`}
              >
                <span className="text-[10px] opacity-80">{d.label}</span>
                <span className="text-xs font-bold">{d.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Times dropdowns */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#191c1e]">2. 시작 시간 ~ 종료 시간 설정</label>
            <span className="text-[11px] text-[#45474b]">
              총 이용 시간: <strong className="text-[#006c4a] font-bold">{calculateDurationText(startTime, endTime)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#f2f4f6] p-4 rounded-2xl border border-[#e6e8ea]">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#45474b]">대여 시작</span>
              <select
                value={startTime}
                onChange={(e) => {
                  const newStart = e.target.value;
                  setStartTime(newStart);
                  const startMin = timeToMinutes(newStart);
                  const currentEndMin = timeToMinutes(endTime);
                  if (currentEndMin <= startMin) {
                    setEndTime(minutesToTime(startMin + 90));
                  }
                }}
                className="w-full h-11 px-3 bg-white text-[#191c1e] font-semibold text-xs rounded-xl border border-[#e6e8ea] shadow-xs cursor-pointer"
              >
                {STANDARD_START_TIMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#45474b]">대여 종료</span>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full h-11 px-3 bg-white text-[#191c1e] font-semibold text-xs rounded-xl border border-[#e6e8ea] shadow-xs cursor-pointer"
              >
                {generateEndTimesForStart(startTime).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Verification banner */}
        <div className="p-3 rounded-xl bg-[#82f5c1]/25 flex items-center gap-2 border border-[#82f5c1]/40">
          <span className="material-symbols-outlined text-[#00714e] text-[18px]">verified</span>
          <p className="text-xs text-[#00714e] leading-tight">
            선택한 시간표 구간에 기존 예약 충돌이 없는 상태입니다. 바로 예약 확정이 가능합니다.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => onConfirm(selectedDateLabel, startTime, endTime)}
            className="w-full h-13 py-3.5 rounded-xl bg-[#02060e] hover:bg-[#191f28] text-white text-[15px] font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">event_available</span>
            <span>선택한 일정으로 즉시 예약 확정</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-[#45474b] hover:text-[#191c1e] text-xs font-semibold transition-all"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
