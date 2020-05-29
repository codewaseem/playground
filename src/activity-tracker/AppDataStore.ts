import { AppsUsageLogger, AppsUsageLogs } from "./AppTracker";
// @ts-ignore
import level from "level";

const DB_NAME = "TRACKER_DB";
const APP_USAGE_DATA_KEY = "AppUsageLogs";

const db = level(DB_NAME);

export default class AppDataStore implements AppsUsageLogger {

    async saveAppUsageLogs(data: AppsUsageLogs): Promise<AppsUsageLogs> {
        let logs: AppsUsageLogs = {};
        try {
            logs = await this.getAppUsageLogs();
        } catch (e) {
            console.log("Key not found! Creating new one.");
        }

        logs = {
            ...logs,
            ...data
        }
        await db.put(APP_USAGE_DATA_KEY, JSON.stringify(logs));
        return data;
    }

    async getAppUsageLogs(): Promise<AppsUsageLogs> {
        const value = await db.get(APP_USAGE_DATA_KEY);
        return JSON.parse(value);
    }
}