import activeWin from "active-win";
import AppTracker, { AppDataLogger, AppDataLog } from "../AppTracker";
import { delay } from "../../utils";
import { LogInputData, LogOutputData } from "../__testdata__/test.data";

AppTracker.DEFAULT_TIME_INTERVAL = 10;


describe("AppTracker", () => {

    let tracker: AppTracker;
    let logger: AppDataLogger;

    let testLogs: AppDataLog[] = [];

    const save = jest.fn((data) => testLogs.push(data)) as any;
    const getLogs = jest.fn(() => testLogs) as any;

    beforeEach(() => {
        testLogs = [];
        logger = {
            save,
            getLogs
        }

        tracker = new AppTracker(logger);
        jest.useFakeTimers();

    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it("calling start should setup the timer-interval", () => {

        const timerIdSet = jest.spyOn(tracker as any, "timerId", "set");

        tracker.start();

        expect(timerIdSet).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), AppTracker.DEFAULT_TIME_INTERVAL);

    });

    it("should not call setTimeout again if the tracker is already started", async () => {

        tracker.start();
        tracker.start();

        expect(setTimeout).toHaveBeenCalledTimes(1);


    });

    it("should call activeWindow repeatedly after timeout when the tracker has started", () => {


        tracker.start();

        expect(activeWin).not.toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledTimes(1);

        jest.runOnlyPendingTimers();

        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(activeWin).toHaveBeenCalledTimes(1);

    });

    it("calling stop should clear the timer", async () => {
        tracker.start();

        expect(activeWin).not.toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledTimes(1);

        tracker.stop();
        jest.runOnlyPendingTimers();

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(activeWin).not.toHaveBeenCalled();

    });

    it("should be able to track active window data correctly", async () => {
        jest.useRealTimers();

        tracker.start();

        await delay(AppTracker.DEFAULT_TIME_INTERVAL * (LogInputData.length + 1));

        expect(tracker.getLogData()).toMatchObject(LogOutputData);

        tracker.stop();
    });

    it("should be able to log the data", async () => {

        jest.useRealTimers();
        tracker.start();

        await delay(AppTracker.DEFAULT_TIME_INTERVAL);

        expect(save).toHaveBeenCalledWith({
            windowTitle: 'Unicorns - Google Search',
            appName: 'Google Chrome',
            id: '/Applications/Google Chrome.app',
            timeSpent: AppTracker.DEFAULT_TIME_INTERVAL,
        } as AppDataLog);

        tracker.stop();
    });

    it("should be able to read saved log", async () => {

        jest.useRealTimers();
        tracker.start();

        await delay(AppTracker.DEFAULT_TIME_INTERVAL);


        expect(await logger.getLogs()).toMatchObject([{
            windowTitle: 'Unicorns - Google Search',
            appName: 'Google Chrome',
            id: '/Applications/Google Chrome.app',
            timeSpent: AppTracker.DEFAULT_TIME_INTERVAL,
        }]);

        tracker.stop();
    });
});