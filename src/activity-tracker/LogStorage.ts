import { TrackerLogStorage, ActivityLog } from ".";

export default class LogStorage implements TrackerLogStorage {
    save(data: ActivityLog): Promise<ActivityLog> {
        return Promise.resolve(data);
    }
}