import Tracker from "./index";
import LogStorage from "./LogStorage";

(async () => {
    const tracker = new Tracker(new LogStorage());
    tracker.start();

    setInterval(() => {
        console.log(tracker.getLogData());
    }, Tracker.DEFAULT_TIME_INTERVAL);

})();