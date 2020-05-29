import activeWin from "active-win";

type Milliseconds = number;

export interface AppsUsageLogs {
    [key: string]: {
        [key: string]: {
            timeSpent: Milliseconds,
        }
    }
}

export interface AppsUsageLogger {
    saveAppUsageLogs(data: AppsUsageLogs): Promise<AppsUsageLogs>;
    getAppUsageLogs(): Promise<AppsUsageLogs>;
}

export default class AppTracker {

    static TIMER_INTERVAL = 5000;

    private _timerId!: NodeJS.Timeout;
    private _isTracking: boolean = false;
    private _trackingData: AppsUsageLogs = {};
    private _logger: AppsUsageLogger;

    constructor(logger: AppsUsageLogger) {
        this._logger = logger;
    }

    private set timerId(id: NodeJS.Timeout) {
        this._timerId = id;
    }

    private _startTracking() {
        this.timerId = setTimeout(() => {
            this._startTracking();
            this.saveActiveWindowData();
        }, AppTracker.TIMER_INTERVAL);
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
                this._trackingData[appName][windowTitle] = {
                    timeSpent: 0
                }
            }

            this._trackingData[appName][windowTitle].timeSpent += AppTracker.TIMER_INTERVAL;

            this._logger.saveAppUsageLogs(this._trackingData);
        }
    }


    getAppsUsageLogs() {
        return this._logger.getAppUsageLogs();
    }

    getCurrentUsageData() {
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