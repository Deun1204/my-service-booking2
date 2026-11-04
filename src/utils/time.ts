import { Reservation, ResourceStatus, TimeSlot } from '../types';

export const BUSINESS_START_HOUR = 9;  // 09:00
export const BUSINESS_END_HOUR = 19;   // 19:00
export const SLOT_DURATION_MINUTES = 30;

export const FIRST_BOOKING_TIME = '09:00';

export const STANDARD_START_TIMES: string[] = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

export function calculateDurationText(startTime: string, endTime: string): string {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
  if (diffMinutes <= 0) return '30분';
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  if (hours > 0 && mins > 0) return `${hours}시간 ${mins}분`;
  if (hours > 0) return `${hours}시간`;
  return `${mins}분`;
}

export function generateEndTimesForStart(start: string): { value: string; label: string }[] {
  const [sh, sm] = start.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const options: { value: string; label: string }[] = [];
  for (let offset = 30; offset <= 240; offset += 30) {
    const endMin = startMin + offset;
    if (endMin > 22 * 60) break;
    const eh = Math.floor(endMin / 60);
    const em = endMin % 60;
    const timeStr = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
    const hours = offset / 60;
    const durationLabel = hours >= 1 ? (hours % 1 === 0 ? `${hours}시간` : `${hours}시간`) : `${offset}분`;
    options.push({
      value: timeStr,
      label: `${timeStr} (${durationLabel})`
    });
  }
  return options;
}

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function generateDayTimeSlots(
  reservations: Reservation[],
  currentTimeStr: string
): TimeSlot[] {
  const currentMinutes = timeToMinutes(currentTimeStr);
  const slots: TimeSlot[] = [];

  const totalSlots = ((BUSINESS_END_HOUR - BUSINESS_START_HOUR) * 60) / SLOT_DURATION_MINUTES;

  for (let i = 0; i < totalSlots; i++) {
    const slotStartMinutes = BUSINESS_START_HOUR * 60 + i * SLOT_DURATION_MINUTES;
    const slotEndMinutes = slotStartMinutes + SLOT_DURATION_MINUTES;
    const startTime = minutesToTime(slotStartMinutes);
    const endTime = minutesToTime(slotEndMinutes);

    // Find if any reservation covers this slot
    const matchingReservation = reservations.find(res => {
      const resStart = timeToMinutes(res.startTime);
      const resEnd = timeToMinutes(res.endTime);
      return Math.max(slotStartMinutes, resStart) < Math.min(slotEndMinutes, resEnd);
    });

    let status: TimeSlot['status'] = 'available';

    if (matchingReservation) {
      const resStart = timeToMinutes(matchingReservation.startTime);
      const resEnd = timeToMinutes(matchingReservation.endTime);
      
      // If current time is currently within this reservation
      if (currentMinutes >= resStart && currentMinutes < resEnd) {
        status = 'in_use';
      } else {
        status = 'reserved';
      }
    } else if (slotEndMinutes <= currentMinutes) {
      status = 'past';
    }

    slots.push({
      startTime,
      endTime,
      status,
      reservationId: matchingReservation?.id,
    });
  }

  return slots;
}

export function getResourceStatus(
  reservations: Reservation[],
  currentTimeStr: string
): {
  status: ResourceStatus;
  currentReservation?: Reservation;
  nextReservation?: Reservation;
} {
  const currentMinutes = timeToMinutes(currentTimeStr);

  // 1. Is it currently in use?
  const currentReservation = reservations.find(res => {
    const resStart = timeToMinutes(res.startTime);
    const resEnd = timeToMinutes(res.endTime);
    return currentMinutes >= resStart && currentMinutes < resEnd;
  });

  if (currentReservation) {
    return {
      status: 'in_use',
      currentReservation,
    };
  }

  // 2. Is there an upcoming reservation today?
  const upcomingReservations = reservations
    .filter(res => timeToMinutes(res.startTime) > currentMinutes)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  if (upcomingReservations.length > 0) {
    return {
      status: 'reserved',
      nextReservation: upcomingReservations[0],
    };
  }

  // 3. Otherwise available
  return {
    status: 'available',
  };
}

export function getTodayDateString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayDateString();
}

export function formatKoreanDate(date: Date): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

export function formatKoreanDateString(dateInput: string | Date): string {
  if (!dateInput) return '';
  let date: Date;
  if (typeof dateInput === 'string') {
    const parts = dateInput.split('-');
    if (parts.length === 3) {
      date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      date = new Date(dateInput);
    }
  } else {
    date = dateInput;
  }
  if (isNaN(date.getTime())) return String(dateInput);
  return formatKoreanDate(date);
}

export function formatClockTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function formatSimpleTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Check if a desired time range conflicts with existing reservations
 */
export function isSlotAvailable(
  reservations: Reservation[],
  startTime: string,
  endTime: string
): boolean {
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);

  return !reservations.some(res => {
    const resStart = timeToMinutes(res.startTime);
    const resEnd = timeToMinutes(res.endTime);
    return Math.max(startMin, resStart) < Math.min(endMin, resEnd);
  });
}

/**
 * Returns available start times for a given duration (in minutes)
 */
export function getAvailableStartTimes(
  reservations: Reservation[],
  durationMinutes: number,
  currentTimeStr: string
): string[] {
  const availableStarts: string[] = [];
  const currentMinutes = timeToMinutes(currentTimeStr);

  const startLimit = BUSINESS_START_HOUR * 60;
  const endLimit = BUSINESS_END_HOUR * 60;

  for (let min = startLimit; min + durationMinutes <= endLimit; min += SLOT_DURATION_MINUTES) {
    // Only allow future or current-minute booking today
    if (min < currentMinutes - 29) {
      continue;
    }

    const testStart = minutesToTime(min);
    const testEnd = minutesToTime(min + durationMinutes);

    if (isSlotAvailable(reservations, testStart, testEnd)) {
      availableStarts.push(testStart);
    }
  }

  return availableStarts;
}
