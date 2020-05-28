import activeWin from "active-win";

let timerId: NodeJS.Timeout;

(async () => {

    const getActiveWin = async () => {
        const data = await activeWin();
        console.log(data);
        timerId = setTimeout(getActiveWin, 5000);
    }

    getActiveWin();
})();

process.on("exit", () => {
    console.log("clearing timer", timerId);
    clearTimeout(timerId);

});