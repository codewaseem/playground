import iohook from "iohook";

class IoHookManager {

    private _mouseclicks = 0
    private _keystrokes = 0;

    private subscribers: Function[] = [];

    start() {

        iohook.start();

        iohook.on("keyup", this._incrementKeystrokes);
        iohook.on("mouseup", this._incrementMouseClicks);
        iohook.on("mousewheel", this._incrementMouseClicks);
    }

    stop() {

        iohook.off("keyup", this._incrementKeystrokes);
        iohook.off("mouseup", this._incrementMouseClicks);
        iohook.off("mousewheel", this._incrementMouseClicks);

        iohook.stop();
        iohook.unload();
    }

    private _incrementMouseClicks = () => {
        this._mouseclicks++;
        this._onChange();
    }

    private _incrementKeystrokes = () => {
        this._keystrokes++;
        this._onChange();
    }

    getData() {
        return {
            mouseclicks: this._mouseclicks,
            keystrokes: this._keystrokes
        }
    }

    subscribe(fn: (data: {
        mouseclicks: number,
        keystrokes: number
    }) => void) {
        this.subscribers.push(fn);
    }

    private _onChange() {
        this.subscribers.forEach(fn => fn(this.getData()))
    }
}

const ioHookManager = new IoHookManager();

export default ioHookManager;