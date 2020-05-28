import activeWin from "active-win";

const APP_ONE = 'Google Chrome';
const APP_TWO = "VS Code";
const APP_THREE = "AiMonitor";

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


export const LogInputData = [appOneTabOne, appOneTabTwo, appOneTabTwo, appOneTabTwo,
    appOneTabThree, appTwoTabOne, appThreeTabOne];

export const LogOutputData = {
    [APP_ONE]: {
        [appOneTabOne.title]: 1,
        [appOneTabTwo.title]: 3,
        [appOneTabThree.title]: 1
    },
    [APP_TWO]: {
        [appOneTabOne.title]: 1
    },
    [APP_THREE]: {
        [appOneTabOne.title]: 1
    }
}