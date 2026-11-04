import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { Reservation, ReservationStatus } from '../types';
import { generateInitialReservations, INITIAL_RESOURCES, getCanonicalResourceId } from '../constants/initialData';
import { minutesToTime, timeToMinutes } from '../utils/time';
import { db, handleFirestoreError, OperationType } from './firebase';

const STORAGE_KEY = 'room_on_air_reservations_v2';
const COLLECTION_PATH = 'reservations';

// In-memory cache for fast synchronous access
let memoryCache: Reservation[] = [];

export function getCachedReservations(): Reservation[] {
  if (memoryCache.length > 0) return memoryCache;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        memoryCache = JSON.parse(raw);
        return memoryCache;
      }
    } catch (e) {
      console.warn('Failed to parse cached reservations:', e);
    }
  }
  return generateInitialReservations();
}

function updateLocalCache(reservations: Reservation[]): void {
  memoryCache = reservations;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }
}

/**
 * Real-time subscription to Firebase Firestore reservations collection.
 * Automatically seeds default reservations if the database is initially empty.
 */
export function subscribeToReservations(
  onUpdate: (reservations: Reservation[]) => void
): () => void {
  const colRef = collection(db, COLLECTION_PATH);

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Initial bootstrap: seed initial demo records to Firestore
        const defaults = generateInitialReservations();
        try {
          for (const item of defaults) {
            await setDoc(doc(db, COLLECTION_PATH, item.id), item);
          }
        } catch (seedErr) {
          console.warn('Failed to seed initial reservations to Firestore:', seedErr);
        }
        updateLocalCache(defaults);
        onUpdate(defaults);
        return;
      }

      const list: Reservation[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Reservation;
        const canonicalResourceId = getCanonicalResourceId(data.resourceId, data.resourceName);
        list.push({
          ...data,
          id: docSnap.id,
          resourceId: canonicalResourceId,
        });
      });

      // Sort by creation or start time
      list.sort((a, b) => {
        const timeA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt || 0);
        const timeB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt || 0);
        return timeB - timeA;
      });

      updateLocalCache(list);
      onUpdate(list);
    },
    (error) => {
      console.error('Firestore onSnapshot subscription error:', error);
      // Fallback to cache if permission or network issue
      onUpdate(getCachedReservations());
      handleFirestoreError(error, OperationType.LIST, COLLECTION_PATH);
    }
  );

  return unsubscribe;
}

/**
 * Add / Save a new reservation to Firebase Firestore
 */
export async function addReservation(params: {
  resourceId: string;
  resourceName?: string;
  location?: string;
  date?: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  userName?: string;
  userDept?: string;
  status?: ReservationStatus;
}): Promise<{ success: boolean; reservation: Reservation }> {
  const id = `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const nowIso = new Date().toISOString();

  // Find unified, canonical resourceId and matching resource details
  const canonicalResourceId = getCanonicalResourceId(params.resourceId, params.resourceName);
  const matchedResource = INITIAL_RESOURCES.find((r) => r.id === canonicalResourceId);
  const resourceName = params.resourceName || matchedResource?.name || '공용 회의실 / 비품';
  const location = params.location || matchedResource?.location || '본사';
  const date = params.date || '2026-10-25';
  const purpose = params.purpose || '사내 업무 및 협업';
  const userName = params.userName || '김민준';
  const userDept = params.userDept || '프로덕트 디자인팀';

  // Determine active vs reserved status
  let status: ReservationStatus = params.status || 'reserved';
  if (!params.status) {
    const currentMin = 14 * 60 + 15; // 14:15 reference
    const startMin = timeToMinutes(params.startTime);
    const endMin = timeToMinutes(params.endTime);
    if (currentMin >= startMin && currentMin < endMin) {
      status = 'in_progress';
    }
  }

  const newReservation: Reservation = {
    id,
    resourceId: canonicalResourceId,
    resourceName,
    location,
    date,
    startTime: params.startTime,
    endTime: params.endTime,
    purpose,
    userName,
    userDept,
    status,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  try {
    const docRef = doc(db, COLLECTION_PATH, id);
    await setDoc(docRef, newReservation);
  } catch (error) {
    console.error('Failed to save reservation to Firestore:', error);
    // Maintain local state if Firestore call is interrupted
    const current = getCachedReservations();
    updateLocalCache([newReservation, ...current]);
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_PATH}/${id}`);
  }

  return { success: true, reservation: newReservation };
}

/**
 * Cancel a reservation (sets status to 'cancelled' or deletes)
 */
export async function cancelReservation(reservationId: string): Promise<boolean> {
  const nowIso = new Date().toISOString();
  try {
    const docRef = doc(db, COLLECTION_PATH, reservationId);
    await updateDoc(docRef, {
      status: 'cancelled',
      updatedAt: nowIso,
    });
    return true;
  } catch (error) {
    console.error('Failed to cancel reservation in Firestore:', error);
    // Local fallback update
    const current = getCachedReservations();
    const updated = current.map((r) =>
      r.id === reservationId ? { ...r, status: 'cancelled' as ReservationStatus, updatedAt: nowIso } : r
    );
    updateLocalCache(updated);
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_PATH}/${reservationId}`);
  }
}

/**
 * Check-out / Early return a reservation (sets status to 'completed')
 */
export async function checkOutReservation(reservationId: string): Promise<boolean> {
  const nowIso = new Date().toISOString();
  try {
    const docRef = doc(db, COLLECTION_PATH, reservationId);
    await updateDoc(docRef, {
      status: 'completed',
      updatedAt: nowIso,
    });
    return true;
  } catch (error) {
    console.error('Failed to checkout reservation in Firestore:', error);
    const current = getCachedReservations();
    const updated = current.map((r) =>
      r.id === reservationId ? { ...r, status: 'completed' as ReservationStatus, updatedAt: nowIso } : r
    );
    updateLocalCache(updated);
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_PATH}/${reservationId}`);
  }
}

/**
 * Extend a reservation by N minutes
 */
export async function extendReservation(reservationId: string, minutes: number = 15): Promise<boolean> {
  const nowIso = new Date().toISOString();
  const current = getCachedReservations();
  const target = current.find((r) => r.id === reservationId);

  if (!target) return false;

  const currentEndMin = timeToMinutes(target.endTime);
  const newEndMin = Math.min(19 * 60, currentEndMin + minutes);
  const newEndTime = minutesToTime(newEndMin);

  try {
    const docRef = doc(db, COLLECTION_PATH, reservationId);
    await updateDoc(docRef, {
      endTime: newEndTime,
      updatedAt: nowIso,
    });
    return true;
  } catch (error) {
    console.error('Failed to extend reservation in Firestore:', error);
    const updated = current.map((r) =>
      r.id === reservationId ? { ...r, endTime: newEndTime, updatedAt: nowIso } : r
    );
    updateLocalCache(updated);
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_PATH}/${reservationId}`);
  }
}

export function loadReservations(): Reservation[] {
  return getCachedReservations();
}
