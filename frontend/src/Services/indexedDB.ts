import { IDeviceToStorage } from "../Models/IDeviceToStorage";

const DATABASE_NAME = 'DevicesDB';
const DATABASE_VERSION = 2;

let dbPromise: Promise<IDBDatabase> | null = null;

const getDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('deviceInfo')) {
        db.createObjectStore('deviceInfo', { keyPath: 'DeviceId' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject(`Database error: ${(event.target as IDBOpenDBRequest).error}`);
    };
  });

  return dbPromise;
};

const getDevice = async (): Promise<IDeviceToStorage | null> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['deviceInfo'], 'readonly');
    const store = transaction.objectStore('deviceInfo');
    const getRequest = store.getAll();

    getRequest.onsuccess = (event) => {
      const result = (event.target as IDBRequest).result;
      resolve(result?.[0] ?? null);
    };

    getRequest.onerror = (error) => reject(error);
  });
};

const addNewDevice = async (item: IDeviceToStorage): Promise<IDeviceToStorage> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['deviceInfo'], 'readwrite');
    const store = transaction.objectStore('deviceInfo');
    const addRequest = store.add(item);

    addRequest.onsuccess = () => resolve(item);
    addRequest.onerror = (error) => reject(error);
  });
};

const deleteDevice = async (deviceId: string): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['deviceInfo'], 'readwrite');
    const store = transaction.objectStore('deviceInfo');
    const deleteRequest = store.delete(deviceId);

    deleteRequest.onsuccess = () => resolve();
    deleteRequest.onerror = (error) => reject(error);
  });
};


export { addNewDevice, getDevice, deleteDevice };