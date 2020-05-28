import activeWin from "active-win";

export interface ActivityLog {
    id: string,
    appName: string,
    appTitle: string,
    timeSpent: number,
    processId: number,
}

export interface TrackerLogData {
    [key: string]: {
        [key: string]: number
    }
}

export interface TrackerLogStorage {
    save(data: ActivityLog): Promise<ActivityLog>
}

export default class Tracker {

    static DEFAULT_TIME_INTERVAL = 5000;

    private _timerId!: NodeJS.Timeout;
    private _isTracking: boolean = false;
    private _trackerLogStorage: TrackerLogStorage;
    private _trackingData: TrackerLogData = {};

    constructor(trackerLogStorage: TrackerLogStorage) {
        this._trackerLogStorage = trackerLogStorage;
    }

    private set timerId(id: NodeJS.Timeout) {
        this._timerId = id;
    }

    private _startTracking() {
        this.timerId = setTimeout(() => {
            this._startTracking();
            this.saveActiveWindowData();
        }, Tracker.DEFAULT_TIME_INTERVAL);
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
