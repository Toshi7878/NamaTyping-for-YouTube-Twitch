const db = new Dexie('AppDatabase');

db.version(1).stores({notes: "++id"});

