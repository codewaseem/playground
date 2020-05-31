// @ts-ignore
import desktopIdle from "desktop-idle";

class IdleTimeTracker {

    private _prevIdleTime = desktopIdle.getIdleTime();
    private _currentIdleTime = this._prevIdleTime;
    private _newTotalIdleTime = 0;
    private _totalIdleTime = 0;

    getTotalIdleTime() {
        this._currentIdleTime = desktopIdle.getIdleTime();
        this._totalIdleTime = this._newTotalIdleTime + this._prevIdleTime;

        if (this._isNewIdleState()) {
            this._newTotalIdleTime += this._prevIdleTime;
            this._prevIdleTime = 0;
        } else {
            this._prevIdleTime = this._currentIdleTime;
        }

        return this._totalIdleTime;
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