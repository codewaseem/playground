// @ts-ignore
import desktopIdle from "desktop-idle";

class IdleTimeTracker {

    private _prevIdleTime = 0;
    private _currentIdleTime = 0;
    private _totalIdleTime = 0;

    constructor() {
        this._currentIdleTime = desktopIdle.getIdleTime();

        const startTimer = () => setTimeout(() => {
            this._currentIdleTime = desktopIdle.getIdleTime();

            if (this._isNewIdleState()) {
                this._totalIdleTime += this._prevIdleTime;
                this._prevIdleTime = 0;
            } else {
                this._prevIdleTime = this._currentIdleTime;
            }

            startTimer();

        }, 10000);

        startTimer();
    }

    getTotalIdleTime() {
        return this._totalIdleTime + this._currentIdleTime;
    }

    private _isNewIdleState() {
        return this._prevIdleTime > this._currentIdleTime;
    }


}


const idleTimeTracker = new IdleTimeTracker();


let totalTime = 0;
setInterval(() => {
    totalTime += 5000;
    console.log(`totalIdleTime: ${idleTimeTracker.getTotalIdleTime()}`);
    console.log(`totalTime:${totalTime}`);
}, 5000);