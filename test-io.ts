import ioHookManager from "./src/activity-tracker/IoHookManager";


ioHookManager.start();

ioHookManager.subscribe(console.log)