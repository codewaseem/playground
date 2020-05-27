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

    constructor(initialState?: {
        isRunning?: boolean,
        laps?: Lap[],
        milliseconds?: number,
        startTime?: number,
    }) {
        if (initialState) {
            this._laps = initialState.laps || [];
            this._isRunning = initialState.isRunning || false;
            this._milliseconds = initialState.milliseconds || 0;

            if (this._isRunning) {
                this._startTime = initialState.startTime || (Date.now() - this._milliseconds);
                this.stop();
                this.start();
            }
        }
    }

    get laps() {
        // return a copy
        return this._laps.slice();
    }

    get milliseconds() {
        return this._milliseconds;
    }

    get isRunning() {
        return this._isRunning;
    }

    get totalLaps() {
        return this._laps.length;
    }

    get lapsTotal() {
        let total = 0;
        this._laps.forEach(lap => total += lap.duration);
        return total;
    }

    get totalTime() {
        return this.lapsTotal + this._milliseconds;
    }

    start() {
        if (this._isRunning) return;

        this._isRunning = true;
        this._startTime = Date.now();
        this.startTicking();
    }

    stop() {
        if (!this.isRunning) return;

        this._isRunning = false;
        clearTimeout(this._timerId);

        this._laps.push({
            duration: this._milliseconds,
            startTime: this._startTime,
            endTime: +new Date(this._startTime + this._milliseconds)
        });

        this._milliseconds = 0;
    }

    reset() {
        if (this._timerId) clearTimeout(this._timerId);

        this._isRunning = false;
        this._laps = [];
        this._milliseconds = 0;
    }

    private startTicking = () => {
        this._timerId = setTimeout(() => {
            this._milliseconds = Date.now() - this._startTime;
            this.startTicking();
        }, 100);
    }

}
