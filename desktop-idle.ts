// @ts-ignore
import desktopIdle from "desktop-idle";

let prevIdleTime = desktopIdle.getIdleTime();
let currentIdleTime = prevIdleTime;
let totalIdleTime = currentIdleTime;
let totalTime = 0;

const isNewIdleTime = () => prevIdleTime > currentIdleTime;

function trackIdleTime() {
    setTimeout(() => {
        currentIdleTime = desktopIdle.getIdleTime();

        if (isNewIdleTime()) {
            totalIdleTime += prevIdleTime;
            prevIdleTime = 0;
        }
        else {
            prevIdleTime = currentIdleTime;
        }

        totalTime += 10 * 1000;
        console.log(`${''.padStart(80, '=')}`);
        console.log(`prevIdleTime: ${prevIdleTime}`);
        console.log(`currentIdleTime: ${currentIdleTime}`);
        console.log(`totalIdleTime: ${totalIdleTime}`);
        console.log(`totalTime: ${totalTime / 1000}`);
        console.log(`${''.padStart(80, '=')}`);



        trackIdleTime();

    }, 10 * 1000);
}

trackIdleTime();