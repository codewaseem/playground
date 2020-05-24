import axios from "axios";

export const BASE_URL = "https://api.dev.aptask.com";
export const PULSE_AUTH_URL = "/api/v1/users/pulse-two/login";

export const LOGIN_URL = BASE_URL + PULSE_AUTH_URL;
export const LOGIN_ERROR = "LOGIN_ERROR";

export const MONITOR_API_URL = `${BASE_URL}/api/v1/apps/monitor`;
export const ADD_LEAVE_URL = `${MONITOR_API_URL}/leaves`;
export const CAN_APPLY_LEAVE_URL = `${MONITOR_API_URL}/can-apply-leave`;
export const ADD_TIME_LOG = `${MONITOR_API_URL}/logs`


export interface Leave {
    reason: string,
    startTime: string | number,
    endTime: string | number,
}

export interface AuthUserInfo {
    token: string,
    userId: string
}

export interface TimeLog {
    logType: "WORK" | "COFFEE" | "LUNCH",
    startTime: number,
    endTime: number,
    duration: number,
}

export default class PulseApi {

    private static instance: PulseApi | null = null;
    private authInfo!: AuthUserInfo;

    private constructor() {

    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new PulseApi();
        }
        return this.instance;
    }

    setAuthInfo(info: AuthUserInfo) {
        this.authInfo = info;
    }

    getAuthInfo(): AuthUserInfo {
        return this.authInfo;
    }

    login(userName: string, password: string) {
        return axios({
            url: LOGIN_URL,
            method: 'POST',
            data: {
                userName,
                password
            }
        }).then(r => r.data.data)
    }

    addLeave(leave: Leave) {
        return axios({
            url: ADD_LEAVE_URL,
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.authInfo.token}`,
                Accept: `application/json, text/plain, */*`,
                "Content-Type": `application/json;charset=utf-8`
            },
            data: { userId: this.authInfo.userId, ...leave }
        })
    }

    addTime(timeLogs: TimeLog[]) {

        timeLogs.forEach(log => (log as TimeLog & { userId: string }).userId = this.authInfo.userId);

        return axios({
            url: ADD_TIME_LOG,
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.authInfo.token}`,
                Accept: `application/json, text/plain, */*`,
                "Content-Type": `application/json;charset=utf-8`
            },
            data: timeLogs
        });
    }

}