import activeWin from "active-win";
// @ts-ignore
import desktopIdle from "desktop-idle";

type Milliseconds = number;

export interface AppsUsageLogs {
    [key: string]: {
        [key: string]: {
            timeSpent: Milliseconds,
            idleTime: Milliseconds,
            keystrokes: number,
            mouseclicks: number
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
    private _isInitialized: boolean = false;


    constructor(logger: AppsUsageLogger) {
        this._logger = logger;
    }

    async init() {
        this._trackingData = await this._logger.getAppUsageLogs();
        this._isInitialized = true;
    }

    private set timerId(id: NodeJS.Timeout) {
        this._timerId = id;
    }

    private _startTracking() {
        this.timerId = setTimeout(async () => {
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
                    timeSpent: 0,
                    idleTime: desktopIdle.getIdleTime()
                }
            }

            this._trackingData[appName][windowTitle].timeSpent += AppTracker.TIMER_INTERVAL;
            this._trackingData[appName][windowTitle].idleTime += desktopIdle.getIdleTime();

            this._logger.saveAppUsageLogs(this._trackingData);
        }
    }


    getAppsUsageLogs() {
        return this._logger.getAppUsageLogs();
    }

    getCurrentUsageData() {
        return this._trackingData;
    }

    async start() {
        if (this._isTracking) return;

        if (this._isInitialized) {
            this._isTracking = true;
            this._startTracking();
        } else {
            throw new Error('You need to first call init() and await for it to complete');
        }
    }

    stop() {
        if (!this._isTracking) return;
        clearTimeout(this._timerId);
    }
}