import activeWin from "active-win";
import AppTracker, { AppsUsageLogger, AppsUsageLogs } from "../AppTracker";
import { delay } from "../../utils";
import { LogInputData, LogOutputData, TestIntervalTime, initialAppUsageData } from "../__testdata__/test.data";

AppTracker.TIMER_INTERVAL = TestIntervalTime;


describe("AppTracker", () => {

    let tracker: AppTracker;
    let logger: AppsUsageLogger;

    let testLogs: AppsUsageLogs = {};

    const save = jest.fn((data: AppsUsageLogs) => testLogs = data) as any;
    const getLogs = jest.fn(() => Promise.resolve(testLogs)) as any;

    beforeEach(async () => {
        testLogs = {};
        logger = {
            saveAppUsageLogs: save,
            getAppUsageLogs: getLogs
        }

        tracker = new AppTracker(logger);
        await tracker.init();
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
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), AppTracker.TIMER_INTERVAL);

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

        await delay(AppTracker.TIMER_INTERVAL * (LogInputData.length + 1));

        expect(tracker.getCurrentUsageData()).toMatchObject(LogOutputData);

        tracker.stop();
    });

    it("should be able to log the data", async () => {

        jest.useRealTimers();
        tracker.start();

        await delay(AppTracker.TIMER_INTERVAL);

        expect(save).toHaveBeenCalledWith({
            'Google Chrome': {
                'Unicorns - Google Search': {
                    timeSpent: AppTracker.TIMER_INTERVAL,
                    idleTime: expect.any(Number),
                    keystrokes: expect.any(Number),
                    mouseclicks: expect.any(Number)
                }
            }
        } as AppsUsageLogs);

        tracker.stop();
    });

    it("should be able to read saved log", async () => {

        jest.useRealTimers();
        tracker.start();

        await delay(AppTracker.TIMER_INTERVAL);


        expect(await tracker.getAppsUsageLogs()).toMatchObject({
            'Google Chrome': {
                'Unicorns - Google Search': {
                    timeSpent: AppTracker.TIMER_INTERVAL
                }
            }
        });

        tracker.stop();
    });

    it("should be able to resume from an initial data", async () => {
        const initialData = ({
            [initialAppUsageData.owner.name]: {
                [initialAppUsageData.title]: {
                    timeSpent: AppTracker.TIMER_INTERVAL * 2
                }
            }
        } as AppsUsageLogs);

        logger.getAppUsageLogs = jest.fn(() => Promise.resolve(initialData))

        const tracker2 = new AppTracker(logger);
        await tracker2.init();

        jest.useRealTimers();

        tracker2.start();
        await delay(AppTracker.TIMER_INTERVAL);


        expect(await tracker2.getCurrentUsageData()).toMatchObject({
            [initialAppUsageData.owner.name]: {
                [initialAppUsageData.title]: {
                    timeSpent: AppTracker.TIMER_INTERVAL * 3
                }
            }
        });

        tracker2.stop();
    });
});