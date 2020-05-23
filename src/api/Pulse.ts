import axios from "axios";

export const BASE_PULSE_URL = "https://api.dev.aptask.com";
export const PULSE_AUTH_URL = "/api/v1/users/pulse-two/login";
export const LOGIN_URL = BASE_PULSE_URL + PULSE_AUTH_URL;

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
}