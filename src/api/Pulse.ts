import axios from "axios";

export const BASE_URL = "https://api.dev.aptask.com";
export const PULSE_AUTH_URL = "/api/v1/users/pulse-two/login";

export const LOGIN_URL = BASE_URL + PULSE_AUTH_URL;
export const LOGIN_ERROR = "LOGIN_ERROR";

export const MONITOR_API_URL = `${BASE_URL}/api/v1/apps/monitor`;
export const ADD_LEAVE_URL = `${MONITOR_API_URL}/leaves`;


export interface Leave {
    reason: string,
    startTime: string | number,
    endTime: string | number
}

export default class PulseApi {

    private static instance: PulseApi | null = null;

    private constructor() {

    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new PulseApi();
        }
        return this.instance;
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

    addLeave(token: string, userId: string, leave: Leave) {
        return axios({
            url: ADD_LEAVE_URL,
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: `application/json, text/plain, */*`,
                "Content-Type": `application/json;charset=utf-8`
            },
            data: {
                userId,
                ...leave
            }
        })
    }

}