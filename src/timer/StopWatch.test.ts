import StopWatch from "./StopWatch";

let delay = (ms: number) => new Promise(r => setTimeout(r, ms));


describe("StopWatch", () => {

    let stopWatch: StopWatch;

    beforeEach(() => {
        stopWatch = new StopWatch();
        jest.useFakeTimers();
    });


    it("should have correct initial state", () => {
        expect(stopWatch.isRunning).toBe(false);
        expect(stopWatch.milliseconds).toBe(0);

    });

    it("isRunning should set to true when timer is started", () => {
        expect(stopWatch.isRunning).toBe(false);
        stopWatch.start();
        expect(stopWatch.isRunning).toBe(true);
    });

    it("isRunning should set back to false after stopping the timer", () => {
        expect(stopWatch.isRunning).toBe(false);
        stopWatch.start();
        expect(stopWatch.isRunning).toBe(true);
        stopWatch.stop();
        expect(stopWatch.isRunning).toBe(false);
    });

    it("calling start should call setTimeout", () => {
        stopWatch.start();
        expect(setTimeout).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);

    });

    it("after 100ms the timer has started, milliseconds should have been set", () => {
        stopWatch.start();

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);

        let callback = jest.spyOn(stopWatch as any, 'startTicking')

        // (but not any new timers that get created during that process)
        jest.advanceTimersByTime(100);

        expect(callback).toBeCalled();

        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);
    });

    it("stopping the timer should clear the pending timer ", () => {
        stopWatch.start();
        stopWatch.stop();

        let callback = jest.spyOn(stopWatch as any, 'startTicking');
        jest.advanceTimersByTime(100);

        expect(callback).not.toBeCalled();
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);


    });

    it("after stopping the timer it should push the current lap details to laps", () => {
        expect(stopWatch.laps.length).toBe(0);
        stopWatch.start();
        jest.advanceTimersByTime(100);
        stopWatch.stop();
        expect(stopWatch.laps.length).toBe(1);
        expect(stopWatch.laps).toMatchObject([{
            duration: expect.any(Number),
            startTime: expect.any(Number),
            endTime: expect.any(Number)
        }]);

    });


    it("should return early when starting a already started timer without calling Date.now", () => {
        let dateNow = jest.spyOn(global.Date, "now");
        stopWatch.start();
        expect(dateNow).toHaveBeenCalledTimes(1);
        stopWatch.start();
        expect(dateNow).toHaveBeenCalledTimes(1);
    });

    it("should return early when trying to stop already stopped timer to prevent data pushing to laps", () => {
        stopWatch.start();
        stopWatch.stop();
        expect(stopWatch.laps.length).toBe(1);
        stopWatch.stop();
        expect(stopWatch.laps.length).toBe(1);
    });

    it("can get total time in previous laps", async () => {
        jest.useRealTimers();

        stopWatch.start();
        await delay(100);
        stopWatch.stop();

        stopWatch.start();
        await delay(100);
        stopWatch.stop();

        stopWatch.start();
        await delay(100);
        stopWatch.stop();

        expect(stopWatch.lapsTotal).toBeGreaterThan(295);
        expect(stopWatch.milliseconds).toBe(0);
    });

    it("it should set milliseconds back to zero after stopping", async () => {
        jest.useRealTimers();
        stopWatch.start();
        await delay(100);
        expect(stopWatch.milliseconds).toBeGreaterThan(95);

        stopWatch.stop();
        expect(stopWatch.milliseconds).toBe(0);

    })

    it("can get total time (running+lapsTotal)", async () => {
        jest.useRealTimers();
        stopWatch.start();
        await delay(100);
        stopWatch.stop();

        stopWatch.start();

        await delay(100);
        expect(stopWatch.totalTime).toBeGreaterThanOrEqual(195);

        await delay(100);
        expect(stopWatch.totalTime).toBeGreaterThanOrEqual(295);

        stopWatch.stop();
    });

    it("should get total laps count", () => {
        expect(stopWatch.totalLaps).toBe(0);
        stopWatch.start();
        stopWatch.stop();
        expect(stopWatch.totalLaps).toBe(1);
        stopWatch.start();
        stopWatch.stop();
        stopWatch.start();
        stopWatch.stop();
        expect(stopWatch.totalLaps).toBe(3);

    });

    it("should reset the stopwatch", async () => {
        jest.useRealTimers();

        stopWatch.start();
        await delay(100);

        expect(stopWatch.isRunning).toBe(true);
        expect(stopWatch.milliseconds).toBeGreaterThan(95);


        stopWatch.stop();

        expect(stopWatch.totalLaps).toBe(1);
        expect(stopWatch.lapsTotal).toBeGreaterThan(95);

        stopWatch.reset();

        expect(stopWatch.milliseconds).toBe(0);
        expect(stopWatch.totalLaps).toBe(0);
        expect(stopWatch.totalTime).toBe(0);
        expect(stopWatch.isRunning).toBe(false);
        expect(stopWatch.lapsTotal).toBe(0);
    });

    it("calling reset when stopwatch is running should call the clearTimeout", async () => {
        stopWatch.start();

        stopWatch.reset();

        expect(clearTimeout).toHaveBeenCalled();
    });

    it("calling reset when stopwatch is stopped should not call the clearTimeout", () => {
        stopWatch.start();
        stopWatch.stop();

        expect(clearTimeout).toHaveBeenCalledTimes(1); // clear timer is also called in stop
        expect(clearTimeout).not.toHaveBeenCalledTimes(2);
    });

    it("should be able to set initial state and continue from it", () => {
        const initialState = {
            isRunning: false,
            laps: [{
                startTime: Date.now(),
                duration: 100,
                endTime: Date.now() + 100
            }]
        }
        let stopWatch2 = new StopWatch(initialState);
        expect(stopWatch2.totalLaps).toBe(1);
        expect(stopWatch2.isRunning).toBe(false);

        stopWatch2.start();
        stopWatch2.stop();

        expect(stopWatch2.totalLaps).toBe(2);

        stopWatch2.start();
        stopWatch2.stop();

        expect(stopWatch2.totalLaps).toBe(3);

    });

    it("should be able to resume from an initial state when isRunning is true", () => {
        const testStartTime = Date.now() - 100;
        const initialState = {
            isRunning: true,
            startTime: testStartTime,
            milliseconds: 100,
            laps: [{
                startTime: Date.now(),
                endTime: Date.now() + 100,
                duration: 100
            }]
        }

        let stopWatch3: StopWatch | null = null;


        stopWatch3 = new StopWatch(initialState);

        // if the initial state of the stopwatch is isRunning = true
        // then it should call stop method to avoid data corruption.
        // and then the current state should be pushed to laps.
        // so there should be 2 items in the laps by now

        expect(stopWatch3.totalLaps).toBe(2);
        let lastLap = stopWatch3.laps.pop();
        expect(lastLap?.startTime).toBe(testStartTime);
        expect(lastLap?.duration).toBe(initialState.milliseconds);
        expect(lastLap?.endTime).toBe(testStartTime + initialState.milliseconds);

        // then it should have started the timer back
        expect(stopWatch3.isRunning).toBe(true);
        expect(stopWatch3.lapsTotal).toBe(200);

    });

    it("toJSON, toObject  should return the an object containing isRunning, milliseconds, and laps", () => {
        const struct = {
            isRunning: expect.any(Boolean),
            milliseconds: expect.any(Number),
            laps: expect.any(Array)
        };

        expect(stopWatch.toJSON()).toMatchObject(struct);

        expect(stopWatch.toObject()).toMatchObject(struct);

        expect(JSON.stringify(stopWatch)).toMatch(`{"milliseconds":0,"laps":[],"isRunning":false}`);
    });
});

