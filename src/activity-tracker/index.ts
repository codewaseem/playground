import AppTracker from "./AppTracker";
import AppDataStore from "./AppDataStore";

const createAppUsageTracker = (dbPathName: string) => {
    return new AppTracker(new AppDataStore(dbPathName));
}

export default createAppUsageTracker;