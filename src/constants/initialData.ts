import { Reservation, Resource } from '../types';

export const MEETING_ROOMS: Resource[] = [
  {
    id: 'room-1',
    name: '대회의실 A (10인 권장)',
    category: 'meeting_room',
    categoryLabel: '회의실',
    subtitle: '85인치 전자칠판 · 화상 룸킷 · 음향 흡음',
    capacity: '최대 12명 (기준 10인)',
    location: '본관 4층 Executive Lounge',
    specs: ['85인치 전자칠판', 'Zoom Rooms', 'STC 45 방음'],
    iconName: 'Users',
  },
  {
    id: 'room-6',
    name: '중회의실 B (6인실)',
    category: 'meeting_room',
    categoryLabel: '회의실',
    subtitle: '75인치 TV · 화상회의 지원',
    capacity: '최대 6명',
    location: '4층 서편 회의존',
    specs: ['75인치 TV', '화상 솔루션', '화이트보드'],
    iconName: 'DoorClosed',
  },
  {
    id: 'room-2',
    name: '소회의실 A (4인실)',
    category: 'meeting_room',
    categoryLabel: '회의실',
    subtitle: '55인치 모니터 · 대형 화이트보드',
    capacity: '최대 4명',
    location: '3층 우측 회의존',
    specs: ['55인치 모니터', '화이트보드', 'HDMI'],
    iconName: 'DoorClosed',
  },
  {
    id: 'room-3',
    name: '소회의실 B (4인실)',
    category: 'meeting_room',
    categoryLabel: '회의실',
    subtitle: '모션데스크 화상 · 4구 멀티탭',
    capacity: '최대 4명',
    location: '3층 좌측 회의존',
    specs: ['모션데스크', '화이트보드', '멀티탭 4구'],
    iconName: 'DoorClosed',
  },
  {
    id: 'room-4',
    name: '포커스룸 1 (1인실)',
    category: 'meeting_room',
    categoryLabel: '회의실',
    subtitle: '방음 부스 · Type-C 충전',
    capacity: '1인 전용',
    location: '3층 안쪽 폰부스존',
    specs: ['방음 부스', 'Type-C 충전', '모션데스크'],
    iconName: 'Headphones',
  },
  {
    id: 'room-5',
    name: '포커스룸 2 (1인실)',
    category: 'meeting_room',
    categoryLabel: '회의실',
    subtitle: '방음 부스 · 화상면접 링라이트',
    capacity: '1인 전용',
    location: '3층 안쪽 폰부스존',
    specs: ['방음 부스', '화상면접용 링라이트', '독립 환기'],
    iconName: 'Headphones',
  },
  {
    id: 'room-7',
    name: '크리에이티브 룸 (8인실)',
    category: 'meeting_room',
    categoryLabel: '회의실',
    subtitle: '4K 빔프로젝터 · 다채널 전원',
    capacity: '최대 8명',
    location: '4층 동편 워크숍존',
    specs: ['4K 프로젝터', '전면 화이트보드', '모듈형 테이블'],
    iconName: 'DoorClosed',
  },
];

export const EQUIPMENT_ASSETS: Resource[] = [
  {
    id: 'asset-1',
    name: '32인치 4K 모니터 거치대',
    category: 'equipment',
    categoryLabel: '공용 비품',
    subtitle: 'LG UltraFine 이동 카트',
    capacity: '1대',
    location: '3층 디자인 스튜디오 #A1',
    specs: ['LG UltraFine', '이동식 카트', 'Type-C 원케이블'],
    iconName: 'Monitor',
  },
  {
    id: 'asset-2',
    name: '4K 촬영 장비 세트 (Sony A7M4)',
    category: 'equipment',
    categoryLabel: '공용 비품',
    subtitle: '24-70mm GM 렌즈 · 삼각대 포함',
    capacity: '1세트',
    location: '비품실 미디어 락커 A',
    specs: ['24-70mm GM 렌즈', '카본 삼각대', '배터리 2개'],
    iconName: 'Camera',
  },
  {
    id: 'asset-3',
    name: '무선 마이크 세트 (DJI Mic 2)',
    category: 'equipment',
    categoryLabel: '공용 비품',
    subtitle: '송신기 2대 · 수신기 세트',
    capacity: '2채널',
    location: '비품실 미디어 락커 B',
    specs: ['송신기 2대', '수신기', '마그네틱 클립'],
    iconName: 'Mic',
  },
  {
    id: 'asset-4',
    name: '무선 화상회의 패키지 A',
    category: 'equipment',
    categoryLabel: '공용 비품',
    subtitle: '4K 웹캠 · 지향성 마이크 · USB 허브',
    capacity: '1세트',
    location: '인포데스크 비품 수납함',
    specs: ['4K 웹캠', '지향성 마이크', 'USB 허브'],
    iconName: 'Camera',
  },
  {
    id: 'asset-5',
    name: '이동식 4K 빔프로젝터',
    category: 'equipment',
    categoryLabel: '공용 비품',
    subtitle: '초단초점 3,000안시 · 휴대용 스크린',
    capacity: '1대',
    location: '비품실 1번 선반',
    specs: ['초단초점 3,000안시', '휴대용 스크린', 'HDMI'],
    iconName: 'Projector',
  },
];

export const INITIAL_RESOURCES: Resource[] = [
  ...MEETING_ROOMS,
  ...EQUIPMENT_ASSETS,
];

/**
 * Resolves unified, canonical resourceId for places (room-X) and assets (asset-X).
 * Backward-compatible with previous 'eq-X' or mismatched fallback IDs.
 */
export function getCanonicalResourceId(resourceId?: string, resourceName?: string): string {
  if (resourceName) {
    if (resourceName.includes('모니터')) return 'asset-1';
    if (resourceName.includes('촬영') || resourceName.includes('A7M4')) return 'asset-2';
    if (resourceName.includes('마이크') || resourceName.includes('Mic')) return 'asset-3';
    if (resourceName.includes('화상회의 패키지')) return 'asset-4';
    if (resourceName.includes('빔프로젝터') || resourceName.includes('프로젝터')) return 'asset-5';

    if (resourceName.includes('대회의실 A')) return 'room-1';
    if (resourceName.includes('소회의실 A')) return 'room-2';
    if (resourceName.includes('소회의실 B')) return 'room-3';
    if (resourceName.includes('포커스룸 1')) return 'room-4';
    if (resourceName.includes('포커스룸 2')) return 'room-5';
    if (resourceName.includes('중회의실 B')) return 'room-6';
    if (resourceName.includes('크리에이티브')) return 'room-7';
  }

  if (resourceId) {
    if (resourceId === 'eq-3' || resourceId === 'asset-1') return 'asset-1';
    if (resourceId === 'eq-1' || resourceId === 'asset-2') return 'asset-2';
    if (resourceId === 'eq-2' || resourceId === 'asset-3') return 'asset-3';
    if (resourceId === 'eq-4' || resourceId === 'asset-4') return 'asset-4';
    if (resourceId === 'eq-5' || resourceId === 'asset-5') return 'asset-5';
    if (resourceId.startsWith('room-') || resourceId.startsWith('asset-')) return resourceId;
  }

  const directMatch = INITIAL_RESOURCES.find((r) => r.id === resourceId || r.name === resourceName);
  if (directMatch) return directMatch.id;

  return resourceId || 'room-1';
}

export function generateInitialReservations(): Reservation[] {
  return [
    {
      id: 'res-1',
      resourceId: 'room-1',
      resourceName: '대회의실 A (10인 권장)',
      location: '본관 4층 Executive Lounge',
      date: '2026-10-25',
      startTime: '14:00',
      endTime: '15:30',
      purpose: '전사 제품 스프린트 리뷰',
      userName: '김민준',
      userDept: '프로덕트 디자인팀',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'res-2',
      resourceId: 'room-4',
      resourceName: '포커스룸 1 (1인실)',
      location: '3층 안쪽 폰부스존',
      date: '2026-10-25',
      startTime: '13:30',
      endTime: '14:30',
      purpose: '1:1 집중 인터뷰',
      userName: '이서연',
      userDept: '피플앤컬처팀',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 3000000).toISOString(),
      updatedAt: new Date(Date.now() - 3000000).toISOString(),
    },
    {
      id: 'res-3',
      resourceId: 'asset-1',
      resourceName: '32인치 4K 모니터 거치대',
      location: '3층 디자인 스튜디오 #A1',
      date: '2026-10-25',
      startTime: '14:00',
      endTime: '17:00',
      purpose: '디자인 스프린트 검수',
      userName: '박지훈',
      userDept: 'UX 리서치팀',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 2500000).toISOString(),
      updatedAt: new Date(Date.now() - 2500000).toISOString(),
    },
    {
      id: 'res-4',
      resourceId: 'room-3',
      resourceName: '소회의실 B (4인실)',
      location: '3층 좌측 회의존',
      date: '2026-10-25',
      startTime: '15:00',
      endTime: '16:00',
      purpose: '기획팀 주간 회의',
      userName: '최도현',
      userDept: '서비스 기획팀',
      status: 'reserved',
      createdAt: new Date(Date.now() - 1000000).toISOString(),
      updatedAt: new Date(Date.now() - 1000000).toISOString(),
    },
    {
      id: 'res-5',
      resourceId: 'asset-2',
      resourceName: '4K 촬영 장비 세트 (Sony A7M4)',
      location: '비품실 미디어 락커 A',
      date: '2026-10-25',
      startTime: '16:00',
      endTime: '18:00',
      purpose: '사내 세미나 영상 촬영',
      userName: '윤지원',
      userDept: '마케팅팀',
      status: 'reserved',
      createdAt: new Date(Date.now() - 500000).toISOString(),
      updatedAt: new Date(Date.now() - 500000).toISOString(),
    },
  ];
}
