import { openDatabaseSync } from 'expo-sqlite';

export interface LocationRecord {
    id?: number;
    latitude: number;
    longitude: number;
    altitude?: number | null;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    timestamp: string;
}

class Database {
    db;

    constructor(dbName = 'locations.db') {
        this.db = openDatabaseSync(dbName);
        this.init();
    }


    init() {
        try {
            this.db.execSync(
                `CREATE TABLE IF NOT EXISTS locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                altitude REAL,
                accuracy REAL,
                speed REAL,
                heading REAL,
                timestamp TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );`
            );
            console.log('Database initialized');
        } catch (err) {
            console.error('DB Init Error:', err);
        }
    }

    // location keys dynamic kaise karenge??? 
    insertLocation(loc: LocationRecord) {
        try {
            this.db.runSync(
                `INSERT INTO locations (latitude, longitude, altitude, accuracy, speed, heading, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    loc.latitude,
                    loc.longitude,
                    loc.altitude ?? null,
                    loc.accuracy ?? null,
                    loc.speed ?? null,
                    loc.heading ?? null,
                    loc.timestamp,
                ]
            );
            console.log('Location inserted');
        } catch (err) {
            console.error('Insert Error:', err);
        }
    }

    getLocations(limit = 50): LocationRecord[] {
        try {
            const result = this.db.getAllSync(
                `SELECT * FROM locations ORDER BY id DESC LIMIT ?`,
                [limit]
            );
            return result.map((row: any) => ({
                id: row.id,
                latitude: row.latitude,
                longitude: row.longitude,
                altitude: row.altitude,
                accuracy: row.accuracy,
                speed: row.speed,
                heading: row.heading,
                timestamp: row.timestamp,
            }));
        } catch (err) {
            console.error('Select Error:', err);
            return [];
        }
    }

    clearLocations() {
        try {
            this.db.runSync('DELETE FROM locations');
            console.log('All locations cleared');
        } catch (err) {
            console.error('Clear Error:', err);
        }
    }
}

export const database = new Database();