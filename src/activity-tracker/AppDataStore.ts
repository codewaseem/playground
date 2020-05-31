import { AppsUsageLogger, AppsUsageLogs } from "./AppTracker";
// @ts-ignore
import level from "level";

const APP_USAGE_DATA_KEY = "AppUsageLogs";

export default class AppDataStore implements AppsUsageLogger {
    private db: any;


    constructor(dbPathName = '__appdata__') {
        this.db = level(dbPathName);
    }


    async saveAppUsageLogs(data: AppsUsageLogs): Promise<AppsUsageLogs> {
        let logs: AppsUsageLogs = await this.getAppUsageLogs();


        logs = {
            ...logs,
            ...data
        }
        const dateKey = (new Date()).toLocaleDateString();

        await this.db.put(APP_USAGE_DATA_KEY, JSON.stringify({
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
            value = await this.db.get(APP_USAGE_DATA_KEY);
        } catch (e) {
            console.log('Key not found! Creating new one');
        }
        console.log(value);
        const data = JSON.parse(value as any)[dateKey];
        return data || {};
    }
}