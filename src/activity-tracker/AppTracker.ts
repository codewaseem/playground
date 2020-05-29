import activeWin from "active-win";

export interface TrackerLogData {
    [key: string]: {
        [key: string]: number
    }
}

type Milliseconds = number;

export interface AppDataLog {
    appName: string,
    windowTitle: string,
    timeSpent: Milliseconds,
    id: string,
}

export interface AppDataLogger {
    save(data: AppDataLog): Promise<AppDataLog>;
    getLogs(): Promise<AppDataLog[]>
}

export default class AppTracker {

    static DEFAULT_TIME_INTERVAL = 5000;

    private _timerId!: NodeJS.Timeout;
    private _isTracking: boolean = false;
    private _trackingData: TrackerLogData = {};
    private _logger: AppDataLogger;

    constructor(logger: AppDataLogger) {
        this._logger = logger;
    }

    private set timerId(id: NodeJS.Timeout) {
        this._timerId = id;
    }

    private _startTracking() {
        this.timerId = setTimeout(() => {
            this._startTracking();
            this.saveActiveWindowData();
        }, AppTracker.DEFAULT_TIME_INTERVAL);
    }

    private async saveActiveWindowData() {
        const data = await activeWin();
        if (data) {
            const appName = data.owner.name;
            const windowTitle = data.title;
            if (!this._trackingData[appName]) {
                this._trackingData[appName] = {};
            }
            if (!this._trackingData[appName][windowTitle]) {
                this._trackingData[appName][windowTitle] = 0;
            }
            this._trackingData[appName][windowTitle]++;

            this._logger.save({
                appName,
                windowTitle,
                timeSpent: this._trackingData[appName][windowTitle] * AppTracker.DEFAULT_TIME_INTERVAL,
                id: data.owner.path
            });
        }
    }

    getLogData() {
        return this._trackingData;
    }

    start() {
        if (this._isTracking) return;

        this._isTracking = true;
        this._startTracking();
    }

    stop() {
        if (!this._isTracking) return;
        clearTimeout(this._timerId);
    }
}