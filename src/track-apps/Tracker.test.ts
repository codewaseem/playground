import activeWin from "active-win";

jest.mock("active-win");

class Tracker {

    static DEFAULT_TIME_INTERVAL = 5000;

    private _timerId!: NodeJS.Timeout;
    private _isTracking: boolean = false;

    private set timerId(id: NodeJS.Timeout) {
        this._timerId = id;
    }

    private _startTracking() {
        this.timerId = setTimeout(() => {
            activeWin();
            this._startTracking();
        }, Tracker.DEFAULT_TIME_INTERVAL);
    }

    start() {
        if (this._isTracking) return;

        this._isTracking = true;
        this._startTracking();
    }



    stop() {

    }
}

jest.useFakeTimers();

describe("Tracker", () => {

    let tracker: Tracker;

    beforeEach(() => {
        tracker = new Tracker();
    });

    it("should be defined", () => {
        expect(tracker).toBeDefined();
    });

    it("it should have start and stop method", () => {
        expect(tracker.start).toBeInstanceOf(Function);
        expect(tracker.stop).toBeInstanceOf(Function);
    });

    it("calling start should setup the timer-interval", () => {

        const timerIdSet = jest.spyOn(tracker as any, "timerId", "set");

        tracker.start();

        expect(timerIdSet).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), Tracker.DEFAULT_TIME_INTERVAL);

        jest.resetAllMocks();
    });

    it("should not call setTimeout again if the tracker is already started", async () => {

        tracker.start();
        tracker.start();

        expect(setTimeout).toHaveBeenCalledTimes(1);


    });

    it("should call activeWindow repeatedly after timeout when the tracker has started", () => {

        jest.resetAllMocks();

        tracker.start();

        expect(activeWin).not.toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledTimes(1);

        jest.runOnlyPendingTimers();
        expect(activeWin).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledTimes(2);

    });
});