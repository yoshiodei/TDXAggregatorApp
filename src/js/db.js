import Dexie from 'dexie';

export const db = new Dexie('localDatabase');
db.version(1).stores({
  users: '++id, firstname, lastname, challenge, hashedkey, mobile, community_id', // Auto-incrementing ID
  commodities: '++id, name', 
  silos: '++id, location',
  milestones: '++id, location',
});