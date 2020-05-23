import Timer from "./Timer";

describe("Timer", () => {

    let timer: Timer;

    beforeEach(() => {
        timer = new Timer();
        jest.useFakeTimers();
    });


    it("should have correct initial state", () => {
        expect(timer.isRunning).toBe(false);
        expect(timer.milliseconds).toBe(0);

    });

    it("isRunning should set to true when timer is started", () => {
        expect(timer.isRunning).toBe(false);
        timer.start();
        expect(timer.isRunning).toBe(true);
    });

    it("isRunning should set back to false after stopping the timer", () => {
        expect(timer.isRunning).toBe(false);
        timer.start();
        expect(timer.isRunning).toBe(true);
        timer.stop();
        expect(timer.isRunning).toBe(false);
    });

    it("calling start should call setTimeout", () => {
        timer.start();
        expect(setTimeout).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);

    });

    it("after 100ms the timer has started, milliseconds should have been set", () => {
        timer.start();

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);

        let callback = jest.spyOn(timer as any, 'startTicking')

        // (but not any new timers that get created during that process)
        jest.advanceTimersByTime(100);

        expect(callback).toBeCalled();

        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);
    });

    it("stopping the timer should clear the pending timer", () => {
        timer.start();
        timer.stop();

        let callback = jest.spyOn(timer as any, 'startTicking');
        jest.advanceTimersByTime(100);

        expect(callback).not.toBeCalled();
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);

    });

    it("after stopping the timer it should push the current lap details to laps", () => {
        expect(timer.laps.length).toBe(0);
        timer.start();
        jest.advanceTimersByTime(100);
        timer.stop();
        expect(timer.laps.length).toBe(1);
        expect(timer.laps).toMatchObject([{
            duration: expect.any(Number),
            startTime: expect.any(Number),
            endTime: expect.any(Number)
        }]);

    });


    it("should return early when starting a already started timer without calling Date.now", () => {
        let dateNow = jest.spyOn(global.Date, "now");
        timer.start();
        expect(dateNow).toHaveBeenCalledTimes(1);
        timer.start();
        expect(dateNow).toHaveBeenCalledTimes(1);
    });

    it("should return early when trying to stop already stopped timer to prevent data pushing to laps", () => {
        timer.start();
        timer.stop();
        expect(timer.laps.length).toBe(1);
        timer.stop();
        expect(timer.laps.length).toBe(1);
    });

    it("can get total time in previous laps", async () => {
        let delay = (ms: number) => new Promise(r => setTimeout(r, ms));
        jest.useRealTimers();

        timer.start();
        await delay(100);
        timer.stop();

        timer.start();
        await delay(100);
        timer.stop();

        timer.start();
        await delay(100);
        timer.stop();

        expect(timer.lapsTotal - 300).toBeLessThan(5)
    });

});

