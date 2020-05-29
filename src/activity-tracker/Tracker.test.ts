import activeWin from "active-win";
import Tracker from ".";
import { delay } from "../utils";
import { LogInputData, LogOutputData } from "./test.data";

Tracker.DEFAULT_TIME_INTERVAL = 10;


describe("Tracker", () => {

    let tracker: Tracker;

    beforeEach(() => {
        tracker = new Tracker();
        jest.useFakeTimers();

    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
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

        await delay(Tracker.DEFAULT_TIME_INTERVAL * (LogInputData.length + 1));

        expect(tracker.getLogData()).toMatchObject(LogOutputData);

        tracker.stop();
    });
});