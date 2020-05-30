import activeWin from "active-win";
import AppTracker, { AppsUsageLogs } from "../AppTracker";

const APP_ONE = 'Google Chrome';
const APP_TWO = "VS Code";
const APP_THREE = "AiMonitor";

export const TestIntervalTime = 10;

AppTracker.TIMER_INTERVAL = TestIntervalTime;


const appOneTabOne: activeWin.WindowsResult = {
    platform: "windows",
    title: 'Unicorns - Google Search',
    id: 5762,
    bounds: {
        x: 0,
        y: 0,
        height: 900,
        width: 1440
    },
    owner: {
        name: APP_ONE,
        processId: 310,
        path: '/Applications/Google Chrome.app'
    },
    memoryUsage: 11015432
};

const appOneTabTwo: activeWin.WindowsResult = {
    ...appOneTabOne,
    title: "Facebook - Google Chrome"
};

const appOneTabThree: activeWin.WindowsResult = {
    ...appOneTabOne,
    title: "Twitter - Google Chrome"
}

const appTwoTabOne: activeWin.WindowsResult = {
    ...appOneTabOne,
    owner: {
        ...appOneTabOne.owner,
        name: APP_TWO
    }
}

const appThreeTabOne: activeWin.WindowsResult = {
    ...appOneTabOne,
    owner: {
        ...appOneTabOne.owner,
        name: APP_THREE
    }
}

export const initialAppUsageData = appOneTabOne;


export const LogInputData = [appOneTabOne, appOneTabTwo, appOneTabTwo, appOneTabTwo,
    appOneTabThree, appTwoTabOne, appThreeTabOne];

export const LogOutputData: AppsUsageLogs = {
    [APP_ONE as string]: {
        [appOneTabOne.title]: {
            timeSpent: AppTracker.TIMER_INTERVAL,
            idleTime: expect.any(Number),
            keystrokes: expect.any(Number),
            mouseclicks: expect.any(Number)
        },
        [appOneTabTwo.title]: {
            timeSpent: 3 * AppTracker.TIMER_INTERVAL,
            idleTime: expect.any(Number),
            keystrokes: expect.any(Number),
            mouseclicks: expect.any(Number)

        },
        [appOneTabThree.title]: {
            timeSpent: AppTracker.TIMER_INTERVAL,
            idleTime: expect.any(Number),
            keystrokes: expect.any(Number),
            mouseclicks: expect.any(Number)

        }
    },
    [APP_TWO as string]: {
        [appOneTabOne.title]: {
            timeSpent: AppTracker.TIMER_INTERVAL,
            idleTime: expect.any(Number),
            keystrokes: expect.any(Number),
            mouseclicks: expect.any(Number)

        }
    },
    [APP_THREE as string]: {
        [appOneTabOne.title]: {
            timeSpent: AppTracker.TIMER_INTERVAL,
            idleTime: expect.any(Number),
            keystrokes: expect.any(Number),
            mouseclicks: expect.any(Number)

        }
    }
}