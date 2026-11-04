import React, { useState } from 'react';
import { AppView, ConfirmedDetails } from '../types';

interface BookingConfirmedViewProps {
  details: ConfirmedDetails;
  onNavigate: (view: AppView) => void;
}

export const BookingConfirmedView: React.FC<BookingConfirmedViewProps> = ({
  details,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    const text = `${details.resourceName} (${details.location}) | ${details.date} ${details.timeRange}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-10 flex flex-col gap-5 sm:gap-6">
      {/* Ambient background glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#85f8c4]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* 1순위: Header & Confirmation Visual */}
      <section className="flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full bg-[#85f8c4] animate-ping opacity-25"></div>
          <div className="w-20 h-20 rounded-full bg-[#82f5c1] flex items-center justify-center shadow-lg relative text-[#00714e]">
            <span className="material-symbols-outlined material-symbols-fill text-[44px]">
              check_circle
            </span>
          </div>
        </div>

        <span className="text-[11px] font-bold text-[#006c4a] uppercase tracking-widest px-3 py-0.5 rounded-full bg-[#82f5c1]/50 mb-2">
          Booking Confirmed
        </span>

        <h1 className="text-[32px] font-extrabold text-[#191c1e] tracking-tight mb-1">
          예약이 확정되었습니다
        </h1>

        <p className="text-[15px] text-[#45474b]">
          사내 구글 캘린더 연동 및 담당자 알림 발송이 정상적으로 완료되었습니다.
        </p>
      </section>

      {/* Summary Card */}
      <div className="w-full bg-white rounded-2xl shadow-md p-6 flex flex-col gap-6 relative overflow-hidden border border-[#e6e8ea]">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#006c4a]"></div>

        {/* Selected Resource Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#f2f4f6] p-4 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#02060e] flex items-center justify-center text-white shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">meeting_room</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#45474b] font-medium">선택 리소스</span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[20px] font-bold text-[#191c1e] tracking-tight">
                  {details.resourceName}
                </span>
                <span className="text-[13px] text-[#006c4a] font-semibold">
                  ({details.location})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            {details.resourceId && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#006c4a]/10 text-xs font-semibold text-[#006c4a] font-mono">
                <span>#{details.resourceId}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0e3e5] text-xs font-semibold text-[#191c1e]">
              <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
              <span>예약번호 #{details.reservationId}</span>
            </div>
          </div>
        </div>

        {/* 3 Columns: Date, Time, User */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col p-4 bg-[#f2f4f6] rounded-xl gap-1">
            <div className="flex items-center gap-1.5 text-[#45474b] text-[11px]">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>예약 일자</span>
            </div>
            <span className="text-[17px] font-bold text-[#191c1e]">{details.date}</span>
            <span className="text-xs text-[#45474b]">선택 일정</span>
          </div>

          <div className="flex flex-col p-4 bg-[#f2f4f6] rounded-xl gap-1">
            <div className="flex items-center gap-1.5 text-[#45474b] text-[11px]">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              <span>이용 시간</span>
            </div>
            <span className="text-[17px] font-bold text-[#191c1e]">{details.timeRange}</span>
            <span className="text-xs text-[#006c4a] font-semibold">{details.durationText}</span>
          </div>

          <div className="flex flex-col p-4 bg-[#f2f4f6] rounded-xl gap-1">
            <div className="flex items-center gap-1.5 text-[#45474b] text-[11px]">
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>예약자 정보</span>
            </div>
            <span className="text-[17px] font-bold text-[#191c1e] truncate">{details.userName}</span>
            <span className="text-xs text-[#45474b] truncate">{details.userDept}</span>
          </div>
        </div>

        {/* Database Saved Metadata Row (Firebase Firestore) */}
        <div className="p-4 rounded-xl bg-[#006c4a]/5 border border-[#006c4a]/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#006c4a]/10 flex items-center justify-center text-[#006c4a] shrink-0">
              <span className="material-symbols-outlined text-[20px]">cloud_done</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#006c4a] uppercase tracking-wider">
                  Firebase Database 저장 완료
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#006c4a]/15 text-[#006c4a] text-[11px] font-semibold">
                  {details.status === 'in_progress' ? '● 지금 쓰는 중' : '● 예약됨'}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#191c1e] mt-0.5">
                이용 목적: {details.purpose || '사내 업무 회의'}
              </span>
            </div>
          </div>

          <div className="text-xs text-[#45474b] flex items-center gap-1 shrink-0 self-start md:self-auto">
            <span className="material-symbols-outlined text-[15px]">history</span>
            <span>
              생성 시점:{' '}
              {details.createdAt
                ? typeof details.createdAt === 'string'
                  ? details.createdAt.replace('T', ' ').slice(0, 19)
                  : new Date(details.createdAt).toLocaleString('ko-KR')
                : '방금 전'}
            </span>
          </div>
        </div>

        {/* Facility preview photo mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
          <div className="relative rounded-xl overflow-hidden h-36 md:col-span-2 group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ5siFRgSv8TFBSA0EREu0RlxSDZTmBVBH238WWHGl2aMwXBfj5L0p8kgMUyDufPYA17IQ5TieJyiX-lttjnwORhUximhWJKnesqG80Hdx3HI6b1jLzKrttSfc4QXqeAduPiSxCTCdtmwdbGghxAK4zLkIlJZI6VWIv6fYlvtKz610-OPP0tvzC6p8fvyYdeeeDAPIuBA27SuBkftg_kIGYWWlsGqIkQwG2Ja2CwgO"
              alt="대회의실 전경"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02060e]/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-semibold text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                본관 4층 대회의실 전경
              </span>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden h-36 md:col-span-1 group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTaAGYtxRfZUZT-UM9HbUQLa_XoyZJaCZkm0dlDXw-iPJgyBzgRyvhq0Kn1beADSe4j9ksQavagqqfMqp25qEPWMaPfZaTn5X2gYud976wQVSKnwuod9THgF9W6ahJQtHgzJdkPWXOJIVwbfb2dNnVGgdc8d2ARcMhE7Mw1jOONNdHbPhEI5m7s8oP4a4OscUZmUKLPoqFOqN7RHGIaf3R05sShqJmMYd0-QaaD6kO"
              alt="디스플레이"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02060e]/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-semibold text-white">
                화상회의 85인치 듀얼 디스플레이
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#f2f4f6] rounded-xl flex flex-col justify-between h-36 border border-[#e6e8ea]">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-[#45474b] font-medium">제공 지원 장비</span>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="text-[10px] bg-[#eceef0] px-2 py-0.5 rounded text-[#191c1e] font-semibold">
                  전자칠판
                </span>
                <span className="text-[10px] bg-[#eceef0] px-2 py-0.5 rounded text-[#191c1e] font-semibold">
                  빔 프로젝터
                </span>
                <span className="text-[10px] bg-[#eceef0] px-2 py-0.5 rounded text-[#191c1e] font-semibold">
                  무선 마이크 4기
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[#45474b] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">groups</span>
              <span>수용인원 최대 24명</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2순위: 액션 버튼 */}
      <section className="flex flex-col sm:flex-row items-center gap-4 w-full pt-1">
        <button
          type="button"
          onClick={() => onNavigate('my-bookings')}
          className="w-full sm:flex-1 h-14 bg-[#02060e] text-white rounded-xl flex items-center justify-center gap-2 text-[15px] font-bold shadow-md hover:bg-[#191f28] active:scale-[0.98] transition-all text-center"
        >
          <span className="material-symbols-outlined text-[22px]">event_available</span>
          <span>내 예약 내역으로 가기</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('meeting-rooms')}
          className="w-full sm:flex-1 h-14 bg-[#f2f4f6] text-[#191c1e] rounded-xl flex items-center justify-center gap-2 text-[15px] font-semibold hover:bg-[#e6e8ea] active:scale-[0.98] transition-all text-center border border-[#e6e8ea]"
        >
          <span className="material-symbols-outlined text-[22px] text-[#45474b]">add_circle</span>
          <span>새 예약하기</span>
        </button>
      </section>

      {/* 3순위: 이용 가이드라인 & 자동 연동 안내 */}
      <footer className="mt-2 pt-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
            <div className="w-9 h-9 rounded-lg bg-[#e0e3e5] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[#45474b] text-[20px]">timer</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#191c1e]">이용 시간 준수</span>
              <p className="text-xs text-[#45474b] mt-0.5 leading-relaxed">
                다음 분을 위해 <strong className="text-[#191c1e]">5분 전 정리</strong> 부탁드립니다. 회의 연장이 필요한 경우 대시보드에서 즉시 연장 가능 여부를 확인하세요.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f2f4f6] border border-[#e6e8ea]">
            <div className="w-9 h-9 rounded-lg bg-[#e0e3e5] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[#45474b] text-[20px]">cleaning_services</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#191c1e]">비품 관리 수칙</span>
              <p className="text-xs text-[#45474b] mt-0.5 leading-relaxed">
                비품은 사용 후 <strong className="text-[#191c1e]">반드시 제자리에 반납</strong>해 주세요. HDMI 젠더, 화이트보드 마커 및 마이크 전원을 꺼주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        {/* QR 체크인 & Google 캘린더 동기화 */}
        <div className="p-4 bg-white rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#e6e8ea]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#82f5c1] flex items-center justify-center text-[#00714e] shrink-0">
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-[#191c1e]">스마트 도어락 QR 체크인</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#82f5c1] text-[#00714e]">
                  출입 연동
                </span>
              </div>
              <span className="text-xs text-[#45474b]">
                시작 10분 전 사원증 태그 또는 모바일 QR 코드로 문이 활성화됩니다.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eceef0] text-xs font-semibold text-[#191c1e]">
              <span className="material-symbols-outlined text-[16px] text-[#006c4a]">cloud_done</span>
              <span>Google 캘린더 연동됨</span>
            </div>
            <button
              type="button"
              onClick={handleCopyText}
              title="일정 텍스트 복사"
              className="p-2 rounded-lg hover:bg-[#f2f4f6] text-[#45474b] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
