interface Lap {
    duration: number;
    startTime: number;
    endTime: number;
}


export default class Timer {
    private _isRunning = false;
    private _milliseconds = 0;
    private _timerId!: NodeJS.Timeout;
    private _startTime = 0;
    private _laps: Lap[] = [];

    get laps() {
        return this._laps;
    }

    get milliseconds() {
        return this._milliseconds;
    }

    get isRunning() {
        return this._isRunning;
    }

    get lapsTotal() {
        let total = 0;
        this.laps.forEach(lap => total += lap.duration);
        return total;
    }

    get totalTime() {
        return this.lapsTotal + this._milliseconds;
    }

    start() {
        if (this.isRunning) return;

        this._isRunning = true;
        this._startTime = Date.now();
        this.startTicking();
    }

    stop() {
        if (!this.isRunning) return;

        this._isRunning = false;
        clearTimeout(this._timerId);

        this.laps.push({
            duration: this._milliseconds,
            startTime: this._startTime,
            endTime: +new Date(this._startTime + this._milliseconds)
        });

        this._milliseconds = 0;
    }

    private startTicking = () => {
        this._timerId = setTimeout(() => {
            this._milliseconds = Date.now() - this._startTime;
            this.startTicking();
        }, 100);
    }

}
