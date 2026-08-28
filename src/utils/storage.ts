/**
 * Local persistence using IndexedDB with fallback to localStorage
 */

const DB_NAME = 'MemoryBlocksDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

interface StoredData {
  photo?: string;
  bestScore?: number;
  usedRewardIds?: string[];
  cooldownUntil?: number;
}

// In-memory fallback
const memoryStore: Record<string, unknown> = {};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

export async function getStoredItem<T>(key: keyof StoredData, defaultValue: T): Promise<T> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        if (req.result !== undefined && req.result !== null) {
          resolve(req.result as T);
        } else {
          // Check localStorage as fallback
          try {
            const lsVal = localStorage.getItem(`mb_${key}`);
            if (lsVal !== null) {
              resolve(JSON.parse(lsVal) as T);
              return;
            }
          } catch {
            // ignore
          }
          resolve(defaultValue);
        }
      };

      req.onerror = () => {
        resolve(defaultValue);
      };
    });
  } catch {
    // IndexedDB failed, try localStorage
    try {
      const lsVal = localStorage.getItem(`mb_${key}`);
      if (lsVal !== null) {
        return JSON.parse(lsVal) as T;
      }
    } catch {
      // ignore
    }
    if (key in memoryStore) {
      return memoryStore[key] as T;
    }
    return defaultValue;
  }
}

export async function setStoredItem<T>(key: keyof StoredData, value: T): Promise<void> {
  memoryStore[key] = value;

  // Also save to localStorage as backup
  try {
    localStorage.setItem(`mb_${key}`, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Could not save to IndexedDB, fallback used:', err);
  }
}

export async function clearStoredPhoto(): Promise<void> {
  await setStoredItem('photo', null);
}
