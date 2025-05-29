const dbName = 'AchelAppDB';
const dbVersion = 1;
let db;

export function openDatabase() {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);

        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log('IndexedDB open success');
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            console.log('IndexedDB upgrade needed');
            db = event.target.result;
            if (!db.objectStoreNames.contains('stories')) {
                const store = db.createObjectStore('stories', { keyPath: 'id', autoIncrement: true });
                store.createIndex('title', 'title', { unique: false });
            }
        };
    });
}

export async function saveStory(story) {
    if (!db) await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('stories', 'readwrite');
        const store = transaction.objectStore('stories');
        const request = store.add(story);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

export async function getAllStories() {
    if (!db) await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('stories', 'readonly');
        const store = transaction.objectStore('stories');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

export async function deleteStory(id) {
    if (!db) await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction('stories', 'readwrite');
        const store = transaction.objectStore('stories');
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
}
