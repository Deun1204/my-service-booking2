export type ResourceCategory = 'meeting_room' | 'equipment';

export type ResourceStatus = 'available' | 'reserved' | 'in_use';

export type AppView =
  | 'dashboard'
  | 'meeting-rooms'
  | 'assets'
  | 'my-bookings'
  | 'conflict'
  | 'confirmed';

export type ReservationStatus = 'in_progress' | 'reserved' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  resourceId: string;
  resourceName?: string;
  location?: string;
  startTime: string; // HH:mm (e.g. "14:00")
  endTime: string;   // HH:mm (e.g. "15:30")
  date?: string;     // e.g. "2025. 02. 25"
  userName?: string;
  userDept?: string;
  purpose?: string;
  status?: ReservationStatus;
  createdAt: number | string;
  updatedAt?: number | string;
}

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  categoryLabel: string;
  subtitle: string;
  capacity?: string;
  location: string;
  specs: string[];
  iconName: string;
}

export interface ConfirmedDetails {
  reservationId: string;
  resourceId?: string;
  resourceName: string;
  location: string;
  date: string;
  timeRange: string;
  durationText: string;
  userName: string;
  userDept: string;
  purpose?: string;
  status?: ReservationStatus;
  createdAt?: number | string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  status: 'available' | 'reserved' | 'in_use' | 'past';
  reservationId?: string;
}

export interface NotificationItem {
  id: string;
  type: 'upcoming' | 'ending' | 'sync' | 'info';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
}
