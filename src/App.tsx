/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppView, ConfirmedDetails, NotificationItem, Reservation, Resource } from './types';
import {
  loadReservations,
  checkOutReservation,
  extendReservation,
  addReservation,
  cancelReservation,
  subscribeToReservations,
} from './services/storage';
import { testConnection } from './services/firebase';
import { getTodayDateString } from './utils/time';
import { INITIAL_RESOURCES, getCanonicalResourceId } from './constants/initialData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { NewReservationView } from './components/NewReservationView';
import { BookingConfirmedView } from './components/BookingConfirmedView';
import { ConflictResolutionView } from './components/ConflictResolutionView';
import { MyBookingsView } from './components/MyBookingsView';
import { AssetsManagementView } from './components/AssetsManagementView';
import { BookingModal, CustomScheduleModal } from './components/BookingModal';
import { CancelConfirmModal } from './components/CancelConfirmModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [cancelModalTarget, setCancelModalTarget] = useState<{
    id: string;
    name: string;
    timeRange?: string;
  } | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'noti-1',
      type: 'upcoming',
      title: '소회의실 B (4인실) 이용 10분 전입니다',
      message: '15:00부터 예약이 시작됩니다. 도어락에 사원증을 태그하거나 QR로 체크인하세요.',
      timeAgo: '5분 전',
      read: false,
    },
    {
      id: 'noti-2',
      type: 'ending',
      title: '포커스룸 1 (1인실) 이용 종료 15분 전입니다',
      message: '14:30에 이용이 종료됩니다. 다음 사용자를 위해 5분 전 정리를 준비해 주세요.',
      timeAgo: '12분 전',
      read: false,
    },
    {
      id: 'noti-3',
      type: 'sync',
      title: '대회의실 A 전사 캘린더 연동 완료',
      message: '구글 캘린더 및 슬랙 #hq-meeting-sync 채널에 초대장이 발송되었습니다.',
      timeAgo: '25분 전',
      read: false,
    },
    {
      id: 'noti-4',
      type: 'info',
      title: '32인치 4K 모니터 거치대 대여 등록',
      message: '3층 디자인 스튜디오 #A1에서 대여 중입니다. 사용 후 제자리에 반납해 주세요.',
      timeAgo: '1시간 전',
      read: true,
    },
  ]);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [modalResourceId, setModalResourceId] = useState('room-2');
  const [modalResourceName, setModalResourceName] = useState('소회의실 A (4인실)');
  const [modalResourceLocation, setModalResourceLocation] = useState('3층 우측 회의존');
  const [modalInitialSlot, setModalInitialSlot] = useState('14:00 ~ 15:00');

  // Confirmed details for Screen 3
  const [confirmedDetails, setConfirmedDetails] = useState<ConfirmedDetails>({
    reservationId: 'RS-250225-88A',
    resourceName: '대회의실 A',
    location: '본관 4층 Executive Lounge',
    date: getTodayDateString(),
    timeRange: '15:30 ~ 17:00',
    durationText: '총 1시간 30분 사용',
    userName: '김민준',
    userDept: '프로덕트 디자인팀',
    purpose: '전사 제품 스프린트 리뷰',
    status: 'reserved',
    createdAt: new Date().toISOString(),
  });

  // Toast state
  const [toast, setToast] = useState<{ title: string; sub?: string } | null>(null);

  useEffect(() => {
    // Initial load
    setReservations(loadReservations());

    // Test Firestore connection on boot (per skill requirement)
    testConnection();

    // Real-time Firestore onSnapshot listener
    const unsubscribe = subscribeToReservations((updatedList) => {
      setReservations(updatedList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showToast = (title: string, sub?: string) => {
    setToast({ title, sub });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('실시간 공유 링크가 복사되었습니다', '사내 메신저나 팀 캘린더에 공유하세요');
  };

  const handleCheckOut = async (resId: string, name: string) => {
    await checkOutReservation(resId);
    showToast(`${name} 반납/퇴실 처리 완료`, 'Firebase 상태가 완료됨으로 갱신되었습니다');
  };

  const handleExtend = async (resId: string, name: string) => {
    await extendReservation(resId, 15);
    showToast(`${name} 15분 연장 완료`, '종료 시간이 Firebase에 15분 연장 반영되었습니다');
  };

  const handleRequestCancel = (resId: string, name: string, timeRange?: string) => {
    setCancelModalTarget({ id: resId, name, timeRange });
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalTarget) return;
    const { id, name } = cancelModalTarget;
    await cancelReservation(id);
    setCancelModalTarget(null);
    showToast(`✓ ${name} 예약이 취소되었습니다`, 'Firebase 상태가 취소됨으로 갱신되었습니다');
  };

  const handleNotify = (name: string) => {
    const newNoti: NotificationItem = {
      id: `noti-${Date.now()}`,
      type: 'ending',
      title: `${name} 이용 종료 안내 알림`,
      message: `${name} 이용 종료 15분 전입니다. 다음 사용자를 위해 정리해 주세요.`,
      timeAgo: '방금 전',
      read: false,
    };
    setNotifications((prev) => [newNoti, ...prev]);
    showToast(`${name} 종료 안내 알림 전송됨`, '알림 목록에 새 알림이 등록되었습니다');
  };

  // Notification actions
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    showToast('모든 알림을 확인했습니다', '알림 배지(빨간 점)가 해제되었습니다');
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showToast('알림 내역을 모두 지웠습니다');
  };

  const handleQuickModalConfirm = async (slot: string) => {
    setBookingModalOpen(false);
    const [start, end] = slot.split(' ~ ');
    const canonicalId = getCanonicalResourceId(modalResourceId, modalResourceName);
    const todayDate = getTodayDateString();

    const res = await addReservation({
      resourceId: canonicalId,
      resourceName: modalResourceName,
      location: modalResourceLocation,
      date: todayDate,
      startTime: start,
      endTime: end,
      purpose: '집중 업무 및 협업',
      userName: '김민준',
      userDept: '프로덕트 디자인팀',
    });

    setConfirmedDetails({
      reservationId: res.reservation.id,
      resourceId: res.reservation.resourceId,
      resourceName: modalResourceName,
      location: modalResourceLocation,
      date: todayDate,
      timeRange: slot,
      durationText: '총 1시간 사용',
      userName: '김민준',
      userDept: '프로덕트 디자인팀',
      purpose: '집중 업무 및 협업',
      status: res.reservation.status,
      createdAt: res.reservation.createdAt,
    });

    // Add confirmation notification
    const newNoti: NotificationItem = {
      id: `noti-${Date.now()}`,
      type: 'sync',
      title: `${modalResourceName} 예약 확정 완료`,
      message: `${slot} 일정이 구글 캘린더 및 팀 채널에 동기화되었습니다.`,
      timeAgo: '방금 전',
      read: false,
    };
    setNotifications((prev) => [newNoti, ...prev]);

    setCurrentView('confirmed');
  };

  const handleCustomModalConfirm = async (dateStr: string, start: string, end: string) => {
    setCustomModalOpen(false);
    const canonicalId = getCanonicalResourceId(modalResourceId, modalResourceName);

    const res = await addReservation({
      resourceId: canonicalId,
      resourceName: modalResourceName,
      location: modalResourceLocation,
      date: dateStr,
      startTime: start,
      endTime: end,
      purpose: '집중 업무 및 협업',
      userName: '김민준',
      userDept: '프로덕트 디자인팀',
    });

    setConfirmedDetails({
      reservationId: res.reservation.id,
      resourceId: res.reservation.resourceId,
      resourceName: modalResourceName,
      location: modalResourceLocation,
      date: dateStr,
      timeRange: `${start} ~ ${end}`,
      durationText: '총 1시간 30분 사용',
      userName: '김민준',
      userDept: '프로덕트 디자인팀',
      purpose: '집중 업무 및 협업',
      status: res.reservation.status,
      createdAt: res.reservation.createdAt,
    });

    const newNoti: NotificationItem = {
      id: `noti-${Date.now()}`,
      type: 'sync',
      title: `${modalResourceName} 예약 완료`,
      message: `${dateStr} ${start} ~ ${end} 일정이 배정되었습니다.`,
      timeAgo: '방금 전',
      read: false,
    };
    setNotifications((prev) => [newNoti, ...prev]);

    setCurrentView('confirmed');
  };

  const handleNewBookingSuccess = (details: ConfirmedDetails) => {
    setConfirmedDetails(details);
    setCurrentView('confirmed');
  };

  const handleAlternativeBook = (name: string, location: string) => {
    setConfirmedDetails({
      reservationId: `RS-${Date.now().toString().slice(-6)}`,
      resourceName: name,
      location,
      date: '2025년 2월 25일 (화)',
      timeRange: '14:00 ~ 15:30',
      durationText: '총 1시간 30분 사용',
      userName: '김민준',
      userDept: '프로덕트 디자인팀',
    });
    setCurrentView('confirmed');
  };

  const handleSelectSlotChangeFromConflict = (slot: string) => {
    setConfirmedDetails({
      reservationId: `RS-250225-88A`,
      resourceName: '대회의실 A',
      location: '본관 4층 Executive Lounge',
      date: '2025년 2월 25일 (화)',
      timeRange: slot,
      durationText: '총 1시간 30분 사용',
      userName: '김민준',
      userDept: '프로덕트 디자인팀',
    });
    showToast(`대회의실 A (${slot}) 시간대 선택됨`, '예약 확정 화면으로 이동합니다');
    setTimeout(() => {
      setCurrentView('confirmed');
    }, 700);
  };

  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] min-h-screen antialiased flex font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#02060e] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700/60 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <span className="material-symbols-outlined text-[#85f8c4] text-[24px]">task_alt</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold">{toast.title}</span>
            {toast.sub && <span className="text-[11px] text-[#e0e3e5]">{toast.sub}</span>}
          </div>
        </div>
      )}

      {/* Screen Navigation Helper Pills (Floating for quick reviewer preview) */}
      <div className="fixed bottom-4 left-68 z-40 bg-[#02060e]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg hidden xl:flex items-center gap-1.5 text-xs border border-white/10">
        <span className="text-[10px] text-[#818792] font-semibold uppercase tracking-wider pl-1">
          화면 전환:
        </span>
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            currentView === 'dashboard' ? 'bg-[#006c4a] text-white' : 'hover:bg-white/15 text-[#c1c7d3]'
          }`}
        >
          1. 대시보드
        </button>
        <button
          onClick={() => setCurrentView('meeting-rooms')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            currentView === 'meeting-rooms' ? 'bg-[#006c4a] text-white' : 'hover:bg-white/15 text-[#c1c7d3]'
          }`}
        >
          2. 회의실 예약
        </button>
        <button
          onClick={() => setCurrentView('assets')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            currentView === 'assets' ? 'bg-[#006c4a] text-white' : 'hover:bg-white/15 text-[#c1c7d3]'
          }`}
        >
          3. 자산 예약
        </button>
        <button
          onClick={() => setCurrentView('my-bookings')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            currentView === 'my-bookings' ? 'bg-[#006c4a] text-white' : 'hover:bg-white/15 text-[#c1c7d3]'
          }`}
        >
          4. 내 예약 내역
        </button>
        <button
          onClick={() => setCurrentView('conflict')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            currentView === 'conflict' ? 'bg-[#ba1a1a] text-white' : 'hover:bg-white/15 text-[#c1c7d3]'
          }`}
        >
          5. 충돌 해결
        </button>
        <button
          onClick={() => setCurrentView('confirmed')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            currentView === 'confirmed' ? 'bg-[#006c4a] text-white' : 'hover:bg-white/15 text-[#c1c7d3]'
          }`}
        >
          6. 예약 확정
        </button>
      </div>

      {/* Sidebar Navigation (Desktop fixed + Mobile slide-over drawer) */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsMobileDrawerOpen(false);
        }}
        isMobileOpen={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 pl-0 flex-1 flex flex-col min-h-screen w-full">
        {/* Top Navbar with Notification Center, Responsive Hamburger & Red Dot */}
        <TopHeader
          currentView={currentView}
          onCopyLink={handleCopyLink}
          brandVariant="nextstep"
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />

        {/* Content View Router with bottom padding for mobile bottom bar */}
        <main className="relative pt-16 bg-[#f8f9fb] flex-1 pb-24 md:pb-16 w-full">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={(view) => setCurrentView(view)}
              onOpenBookingModal={(name, slot) => {
                const canonicalId = getCanonicalResourceId(undefined, name);
                const matched = INITIAL_RESOURCES.find((r) => r.id === canonicalId);
                setModalResourceId(canonicalId);
                setModalResourceName(name);
                setModalResourceLocation(matched?.location || '본사');
                if (slot) setModalInitialSlot(slot);
                setBookingModalOpen(true);
              }}
              onOpenCustomSchedule={(name) => {
                const canonicalId = getCanonicalResourceId(undefined, name);
                const matched = INITIAL_RESOURCES.find((r) => r.id === canonicalId);
                setModalResourceId(canonicalId);
                setModalResourceName(name);
                setModalResourceLocation(matched?.location || '본사');
                setCustomModalOpen(true);
              }}
              reservations={reservations}
              onCheckOut={handleCheckOut}
              onExtend={handleExtend}
              onNotify={handleNotify}
              onCancel={handleRequestCancel}
            />
          )}

          {(currentView === 'meeting-rooms' || (currentView as string) === 'new-reservation') && (
            <NewReservationView
              onNavigate={(view) => setCurrentView(view)}
              onConfirmSuccess={handleNewBookingSuccess}
              onSimulateConflict={() => setCurrentView('conflict')}
            />
          )}

          {currentView === 'confirmed' && (
            <BookingConfirmedView
              details={confirmedDetails}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'conflict' && (
            <ConflictResolutionView
              onNavigate={(view) => setCurrentView(view)}
              onSelectSlot={handleSelectSlotChangeFromConflict}
              onBookAlternative={handleAlternativeBook}
            />
          )}

          {currentView === 'my-bookings' && (
            <MyBookingsView
              reservations={reservations}
              onNavigate={(view) => setCurrentView(view)}
              onCheckOut={handleCheckOut}
              onExtend={handleExtend}
              onCancel={handleRequestCancel}
            />
          )}

          {currentView === 'assets' && (
            <AssetsManagementView
              onNavigate={(view) => setCurrentView(view)}
              onSelectResourceForBooking={(res: Resource) => {
                const canonicalId = getCanonicalResourceId(res.id, res.name);
                setModalResourceId(canonicalId);
                setModalResourceName(res.name);
                setModalResourceLocation(res.location);
                setCustomModalOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on portrait/mobile screens) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeBookingsCount={reservations.filter((r) => r.status === 'in_progress' || r.status === 'reserved').length}
      />

      {/* Modals from Screen 1 */}
      <BookingModal
        isOpen={bookingModalOpen}
        resourceName={modalResourceName}
        initialSlot={modalInitialSlot}
        onClose={() => setBookingModalOpen(false)}
        onConfirm={handleQuickModalConfirm}
      />

      <CustomScheduleModal
        isOpen={customModalOpen}
        resourceName={modalResourceName}
        onClose={() => setCustomModalOpen(false)}
        onConfirm={handleCustomModalConfirm}
      />

      {/* Cancel Confirmation Dialog */}
      <CancelConfirmModal
        isOpen={!!cancelModalTarget}
        resourceName={cancelModalTarget?.name || '예약 항목'}
        timeRange={cancelModalTarget?.timeRange}
        onClose={() => setCancelModalTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
