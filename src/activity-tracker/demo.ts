import AppTracker from "./AppTracker";
import AppDataStore from "./AppDataStore";

(async () => {
    const tracker = new AppTracker(new AppDataStore());
    tracker.start();

    setInterval(async () => {
        let data = await tracker.getAppsUsageLogs();

        console.log('Current Data');
        console.log(JSON.stringify(data, null, 2));
    }, AppTracker.TIMER_INTERVAL);

})();