import Dexie from 'dexie';

export const db = new Dexie('localDatabase');
db.version(1).stores({
  friends: '++id, name, age' // Primary key and indexed props
});