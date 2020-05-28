import { TrackerLogStorage, ActivityLog } from ".";

export default class LogStorage implements TrackerLogStorage {
    save(data: ActivityLog): Promise<ActivityLog> {
        console.log(data);
        return Promise.resolve(data);
    }
}