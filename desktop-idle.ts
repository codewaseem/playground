import IdleTimeTracker from "./src/activity-tracker/IdleTimeTracker";


let totalTime = 0;
let idleTimeTracker = new IdleTimeTracker();
setInterval(() => {
    totalTime += 5000;
    console.log(`totalIdleTime: ${idleTimeTracker.getTotalIdleTime()}`);
    console.log(`totalTime:${totalTime}`);
}, 5000);