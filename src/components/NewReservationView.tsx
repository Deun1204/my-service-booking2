import React, { useState } from 'react';
import { AppView, ConfirmedDetails } from '../types';
import { MEETING_ROOMS } from '../constants/initialData';
import { addReservation } from '../services/storage';
import {
  getTodayDateString,
  formatKoreanDateString,
  isToday,
  STANDARD_START_TIMES,
  FIRST_BOOKING_TIME,
  calculateDurationText,
  generateEndTimesForStart,
  timeToMinutes,
  minutesToTime,
} from '../utils/time';

interface NewReservationViewProps {
  onNavigate: (view: AppView) => void;
  onConfirmSuccess: (details: ConfirmedDetails) => void;
  onSimulateConflict: () => void;
}

export const NewReservationView: React.FC<NewReservationViewProps> = ({
  onNavigate,
  onConfirmSuccess,
  onSimulateConflict,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState('room-1');
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateString());
  const [startTime, setStartTime] = useState(FIRST_BOOKING_TIME);
  const [endTime, setEndTime] = useState('10:30');
  const [purpose, setPurpose] = useState('전사 제품 스프린트 리뷰');
  const [userName, setUserName] = useState('김민준');
  const [userDept, setUserDept] = useState('프로덕트 디자인팀');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRoom = MEETING_ROOMS.find((r) => r.id === selectedRoomId) || MEETING_ROOMS[0];

  const handleSubmit = async (triggerConflict: boolean = false) => {
    if (triggerConflict) {
      onSimulateConflict();
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanPurpose = purpose.trim() || '사내 업무 회의';
      const cleanUserName = userName.trim() || '김민준';
      const cleanUserDept = userDept.trim() || '프로덕트 디자인팀';

      // Save directly to Firebase Firestore
      const res = await addReservation({
        resourceId: selectedRoom.id,
        resourceName: selectedRoom.name,
        location: selectedRoom.location,
        date: selectedDate,
        startTime,
        endTime,
        purpose: cleanPurpose,
        userName: cleanUserName,
        userDept: cleanUserDept,
      });

      setIsSubmitting(false);

      onConfirmSuccess({
        reservationId: res.reservation.id,
        resourceId: res.reservation.resourceId,
        resourceName: selectedRoom.name,
        location: selectedRoom.location,
        date: selectedDate,
        timeRange: `${startTime} ~ ${endTime}`,
        durationText: `총 ${calculateDurationText(startTime, endTime)} 사용`,
        userName: cleanUserName,
        userDept: cleanUserDept,
        purpose: cleanPurpose,
        status: res.reservation.status,
        createdAt: res.reservation.createdAt,
      });
    } catch (err) {
      console.error('Failed to submit reservation:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 md:px-8 py-3 sm:py-6 flex flex-col gap-5 sm:gap-6 max-w-7xl mx-auto">
      {/* Top Action Breadcrumb & Title Context */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#45474b] text-[11px] tracking-wide">
            <span>회의실 예약</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#02060e] font-semibold text-xs">신규 회의실 예약</span>
          </div>
          <h1 className="text-[22px] sm:text-[28px] font-bold text-[#191c1e] tracking-tight">회의실 예약</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#f2f4f6] px-3 py-1.5 rounded-full shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a] animate-pulse"></span>
            <span className="text-[11px] text-[#45474b] font-medium">실시간 점유 엔진 가동 중</span>
          </div>

          <button
            type="button"
            onClick={onSimulateConflict}
            className="text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6]/50 hover:bg-[#ffdad6] px-3 py-1.5 rounded-full border border-[#ba1a1a]/20 transition-colors"
          >
            스케줄 충돌 화면 보기
          </button>
        </div>
      </div>

      {/* 1순위: Unified Primary Reservation Card */}
      <div className="w-full bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 relative overflow-hidden border border-[#e6e8ea]">
        {/* Ambient decorative gradient backdrop accent */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#006c4a]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-[#dde3ef]/40 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
          {/* Form Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 bg-[#f2f4f6]/60 p-3 sm:p-4 rounded-xl gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-[#02060e] flex items-center justify-center text-white shadow-md shrink-0">
                <span className="material-symbols-outlined text-[22px] sm:text-[26px]">meeting_room</span>
              </div>
              <div>
                <h2 className="text-[17px] sm:text-[20px] font-bold text-[#191c1e] tracking-tight">
                  회의실 일정 및 대상 지정
                </h2>
                <p className="text-[11px] sm:text-xs text-[#45474b] mt-0.5">
                  최대 30분 단위로 즉시 슬롯이 배정되며 팀 캘린더와 동기화됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-[#e0e3e5] px-3 py-1.5 rounded-lg text-[#191c1e] text-[11px] font-semibold self-start sm:self-auto shrink-0">
              <span className="material-symbols-outlined text-[15px] text-[#006c4a]">verified_user</span>
              <span>중복 예약 방지 잠금 활성</span>
            </div>
          </div>

          {/* 4-Column Reservation Matrix Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Column 1: 회의실 선택 */}
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[13px] font-semibold text-[#191c1e] flex items-center gap-1.5 h-5">
                <span className="material-symbols-outlined text-[16px] text-[#006c4a]">domain</span>
                <span>회의실 선택</span>
              </label>
              <div className="relative">
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full h-14 pl-4 pr-10 bg-[#f2f4f6] text-[#191c1e] font-bold text-[15px] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#02060e] appearance-none cursor-pointer shadow-xs transition-all border border-[#e6e8ea]"
                >
                  {MEETING_ROOMS.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.location})
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#45474b] pointer-events-none text-[20px]">
                  unfold_more
                </span>
              </div>
            </div>

            {/* Column 2: 이용 희망 날짜 */}
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[13px] font-semibold text-[#191c1e] flex items-center justify-between h-5">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006c4a]">calendar_today</span>
                  <span>이용 희망 날짜</span>
                </span>
                {isToday(selectedDate) && (
                  <span className="text-[11px] text-[#006c4a] font-semibold">오늘</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-14 px-4 bg-[#f2f4f6] text-[#191c1e] font-bold text-[15px] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#02060e] shadow-xs cursor-pointer transition-all border border-[#e6e8ea]"
                />
              </div>
            </div>

            {/* Column 3: 시작 시간 */}
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[13px] font-semibold text-[#191c1e] flex items-center gap-1.5 h-5">
                <span className="material-symbols-outlined text-[16px] text-[#006c4a]">schedule</span>
                <span>시작 시간</span>
              </label>
              <div className="relative">
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
                  className="w-full h-14 pl-4 pr-10 bg-[#f2f4f6] text-[#191c1e] font-bold text-[15px] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#02060e] appearance-none cursor-pointer shadow-xs transition-all border border-[#e6e8ea]"
                >
                  {STANDARD_START_TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#45474b] pointer-events-none text-[20px]">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* Column 4: 종료 시간 */}
            <div className="flex flex-col gap-1.5 group">
              <label className="text-[13px] font-semibold text-[#191c1e] flex items-center justify-between h-5">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006c4a]">update</span>
                  <span>종료 시간</span>
                </span>
                <span className="text-[11px] text-[#006c4a] font-semibold">
                  총 {calculateDurationText(startTime, endTime)} 이용
                </span>
              </label>
              <div className="relative">
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-14 pl-4 pr-10 bg-[#f2f4f6] text-[#191c1e] font-bold text-[15px] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#02060e] appearance-none cursor-pointer shadow-xs transition-all border border-[#e6e8ea]"
                >
                  {generateEndTimesForStart(startTime).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#45474b] pointer-events-none text-[20px]">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: 이용 목적 및 예약자 정보 (Firebase 저장 대상) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-[#f2f4f6]/60 border border-[#e6e8ea]">
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#191c1e] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006c4a]">edit_note</span>
                  이용 목적 (회의 주제)
                </span>
                <span className="text-[11px] text-[#45474b]">Firebase에 실시간 저장</span>
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="예: 전사 제품 스프린트 리뷰 및 기획 회의"
                maxLength={200}
                className="w-full h-12 px-4 bg-white text-[#191c1e] font-semibold text-sm rounded-xl focus:ring-2 focus:ring-[#006c4a] shadow-xs transition-all border border-[#e6e8ea]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#191c1e] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006c4a]">person</span>
                  예약자 및 부서
                </span>
                <span className="text-[11px] text-[#006c4a] font-semibold">사내 구성원</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="성함"
                  maxLength={50}
                  className="w-1/2 h-12 px-3 bg-white text-[#191c1e] font-semibold text-sm rounded-xl focus:ring-2 focus:ring-[#006c4a] shadow-xs transition-all border border-[#e6e8ea]"
                />
                <input
                  type="text"
                  value={userDept}
                  onChange={(e) => setUserDept(e.target.value)}
                  placeholder="부서명"
                  maxLength={50}
                  className="w-1/2 h-12 px-3 bg-white text-[#191c1e] font-semibold text-sm rounded-xl focus:ring-2 focus:ring-[#006c4a] shadow-xs transition-all border border-[#e6e8ea]"
                />
              </div>
            </div>
          </div>

          {/* Real-time Horizontal Timeline Ribbon */}
          <div className="bg-[#f2f4f6] p-4 rounded-xl flex flex-col gap-2 border border-[#e6e8ea]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#191c1e]">선택 당일 시간대별 예약 현황</span>
              <div className="flex items-center gap-4 text-[#45474b]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs border border-[#e6e8ea]"></span>
                  선택가능
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#02060e]"></span>
                  내 예약 구간
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e0e3e5]"></span>
                  기예약 마감
                </span>
              </div>
            </div>

            {/* 30-min Block Grid Scrubber (Horizontal scroll on mobile, starts from 09:00) */}
            <div className="overflow-x-auto pb-2 -mx-1 px-1 sm:mx-0 sm:px-0">
              <div className="min-w-[680px] flex items-center gap-1.5 w-full select-none py-1">
                {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'].map((slotTime) => {
                  const sMin = timeToMinutes(slotTime);
                  const startMin = timeToMinutes(startTime);
                  const endMin = timeToMinutes(endTime);
                  const isSelected = sMin >= startMin && sMin < endMin;

                  return (
                    <button
                      key={slotTime}
                      type="button"
                      onClick={() => {
                        setStartTime(slotTime);
                        if (endMin <= sMin) {
                          setEndTime(minutesToTime(sMin + 90));
                        }
                      }}
                      className={`h-9 px-2.5 rounded-lg flex items-center justify-center text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#02060e] text-white font-bold shadow-md ring-2 ring-[#006c4a]'
                          : 'bg-white hover:bg-[#eceef0] text-[#45474b] border border-[#e6e8ea] shadow-xs'
                      }`}
                      title={`${slotTime} 시작 슬롯 선택`}
                    >
                      {slotTime}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-[#006c4a] font-semibold flex items-center gap-1.5 pl-0.5">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>
                  선택 확정 구간: <strong className="text-[#191c1e]">{startTime} ~ {endTime}</strong> ({calculateDurationText(startTime, endTime)} 이용)
                </span>
              </div>
            </div>
          </div>

          {/* 2순위: Prominent CTA Section */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#45474b]">
              <span className="material-symbols-outlined text-[#006c4a] text-[22px]">notifications_active</span>
              <span>
                예약 완료 시 등록된 팀 슬랙 채널(#hq-meeting-sync)로 캘린더 초대장이 자동 발송됩니다.
              </span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="w-full sm:w-auto min-w-[280px] h-14 px-8 bg-[#006c4a] hover:bg-[#00714e] text-white font-bold text-[17px] rounded-xl flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">check_circle</span>
              <span>{isSubmitting ? '예약 처리 중...' : '예약 확정하기'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Underneath Reference Summary Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Asset Specs & Visual Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 border border-[#e6e8ea]">
          <div className="w-full md:w-5/12 h-56 md:h-auto rounded-xl overflow-hidden relative shadow-inner">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBxRTYClC0cAUwE04Gda6M0EPBcvYK0Zkfo2o3lus6Yh-Ax9TKEqy5aFBaKrfaKXyqoEk12_09Kjtd-HiBR2o1jMLg8Drhdci6JE_F7qKg5Z8iKWnYdOF8LxUjmhaNKaOX4S6zmb24tlKDsht0qxdTphM2MXvDGX8GXjNj8c74CWRkFEqyDbcjfNOpaGWrT6f9ZrDCuLahOneeokdq3gL8wYvrTs98V5CUtRW4oBBh"
              alt="회의실 전경"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#02060e]/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
              <span>정상 가동 중</span>
            </div>
          </div>

          <div className="w-full md:w-7/12 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#006c4a] uppercase tracking-wider font-bold">
                  Room Specifications
                </span>
                <span className="text-[11px] bg-[#e6e8ea] px-2 py-0.5 rounded text-[#45474b] font-mono">
                  Room ID: {selectedRoom.id.toUpperCase()}
                </span>
              </div>
              <h3 className="text-[20px] font-bold text-[#191c1e] mt-1">
                {selectedRoom.name}
              </h3>
              <p className="text-xs text-[#45474b] mt-1 leading-relaxed">
                {selectedRoom.subtitle}. 고화질 하이브리드 미팅 및 팀 프로젝트 회의에 최적화되어 있습니다.
              </p>
            </div>

            {/* Specs Matrix */}
            <div className="grid grid-cols-2 gap-3 bg-[#f2f4f6] p-4 rounded-xl border border-[#e6e8ea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45474b] text-[18px]">group</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#45474b]">수용 인원</span>
                  <span className="text-xs font-semibold text-[#191c1e]">{selectedRoom.capacity || '4인~10인'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45474b] text-[18px]">wifi</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#45474b]">네트워크</span>
                  <span className="text-xs font-semibold text-[#191c1e]">전용 Wi-Fi 6E (1Gbps)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45474b] text-[18px]">power</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#45474b]">전원 공급</span>
                  <span className="text-xs font-semibold text-[#191c1e]">테이블 빌트인 콘센트 + Type-C</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#45474b] text-[18px]">meeting_room</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#45474b]">방음 등급</span>
                  <span className="text-xs font-semibold text-[#191c1e]">STC 45 (음향 흡음 패널)</span>
                </div>
              </div>
            </div>

            {/* 구비 비품 태그 */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-[#45474b] font-medium">구비 회의 지원 시설</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRoom.specs.map((spec) => (
                  <span key={spec} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e6e8ea] text-[#191c1e] text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-[#006c4a]">check_circle</span> {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: 이용 가이드 & 정책 */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between gap-4 border border-[#e6e8ea]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6e8ea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4a] text-[20px]">info</span>
                <h3 className="text-[17px] font-bold text-[#191c1e]">회의실 이용 수칙</h3>
              </div>
              <span className="text-[11px] bg-[#82f5c1] text-[#00714e] px-2 py-0.5 rounded font-bold">
                자동 취소 10분전
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3 p-3 rounded-xl bg-[#f2f4f6] items-start">
                <span className="w-6 h-6 rounded-full bg-[#e0e3e5] flex items-center justify-center text-xs font-bold text-[#191c1e] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="text-xs font-bold text-[#191c1e]">노쇼 방지 자동 체크인</p>
                  <p className="text-[11px] text-[#45474b] mt-0.5 leading-relaxed">
                    예약 시작 시간 후 10분 이내 도어 패드에 사원증을 태그하지 않으면 예약이 자동 해제됩니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-xl bg-[#f2f4f6] items-start">
                <span className="w-6 h-6 rounded-full bg-[#e0e3e5] flex items-center justify-center text-xs font-bold text-[#191c1e] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="text-xs font-bold text-[#191c1e]">원터치 화상 솔루션</p>
                  <p className="text-[11px] text-[#45474b] mt-0.5 leading-relaxed">
                    테이블 위 컨트롤 패널에서 Zoom / Google Meet 터치 한 번으로 즉시 회의 세션에 진입합니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-xl bg-[#f2f4f6] items-start">
                <span className="w-6 h-6 rounded-full bg-[#e0e3e5] flex items-center justify-center text-xs font-bold text-[#191c1e] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="text-xs font-bold text-[#191c1e]">정리 및 조명 자동 소등</p>
                  <p className="text-[11px] text-[#45474b] mt-0.5 leading-relaxed">
                    회의 종료 5분 전 알림음이 울리며, 퇴실 후 센서가 비어있음을 감지하면 빔프로젝터가 꺼집니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Assistance Widget */}
          <div className="bg-[#191f28] text-white p-4 rounded-xl flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#85f8c4]">support_agent</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold">운영 지원 헬프데스크</span>
                <span className="text-[11px] text-[#818792]">내선 4110 / Slack #facility-ops</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert('운영팀 헬프데스크(내선 4110)로 연결합니다.')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              문의
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
