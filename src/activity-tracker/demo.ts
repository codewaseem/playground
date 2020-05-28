import Tracker from "./index";
import LogStorage from "./LogStorage";

(async () => {
    const tracker = new Tracker(new LogStorage());

    tracker.start();
})();