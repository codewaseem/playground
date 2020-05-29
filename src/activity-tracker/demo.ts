import AppTracker from "./AppTracker";

(async () => {
    const tracker = new AppTracker({
        save: (data): any => { },
        getLogs: (): any => { }

    });
    tracker.start();

    setInterval(() => {
        console.log(tracker.getLogData());
    }, AppTracker.DEFAULT_TIME_INTERVAL);

})();