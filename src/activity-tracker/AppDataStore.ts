import { AppsUsageLogger, AppsUsageLogs } from "./AppTracker";
// @ts-ignore
import level from "level";

const DB_NAME = "TRACKER_DB";
const APP_USAGE_DATA_KEY = "AppUsageLogs";

const db = level(DB_NAME);

export default class AppDataStore implements AppsUsageLogger {

    async saveAppUsageLogs(data: AppsUsageLogs): Promise<AppsUsageLogs> {
        let logs: AppsUsageLogs = await this.getAppUsageLogs();


        logs = {
            ...logs,
            ...data
        }
        const dateKey = (new Date()).toLocaleDateString();

        await db.put(APP_USAGE_DATA_KEY, JSON.stringify({
            [dateKey]: logs
        }));
        return data;
    }

    async getAppUsageLogs(): Promise<AppsUsageLogs> {
        const dateKey = (new Date()).toLocaleDateString();
        let value: {
            [key: string]: AppsUsageLogs
        } = `{
            "${dateKey}": {}
        }` as any;
        try {
            value = await db.get(APP_USAGE_DATA_KEY);
        } catch (e) {
            console.log('Key not found! Creating new one');
        }
        console.log(value);
        return JSON.parse(value as any)[dateKey];
    }
}