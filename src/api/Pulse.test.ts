jest.mock("axios");

import axios, { AxiosRequestConfig } from "axios";
import PulseApi, { LOGIN_URL, ADD_LEAVE_URL, ADD_TIME_LOG, TimeLog } from "./Pulse";

const VALID_DATA = {
    userName: "taj@aptask.com",
    password: "Aptask123"
};


(axios as jest.Mocked<any>).mockImplementation(({ url, data, method }: AxiosRequestConfig) => {
    if (url == LOGIN_URL && method == "POST") {
        if (data.userName == VALID_DATA.userName && data.password == VALID_DATA.password) {
            return Promise.resolve({
                data: {
                    data: {
                        email: data.userName
                    }
                }
            });
        } else {
            return Promise.reject();
        }
    }
});


describe("PulseApi", () => {

    let pulseApi: PulseApi;

    beforeEach(() => {
        pulseApi = PulseApi.getInstance();
    });

    let token = `token`;
    let userId = `1`;

    let authHeaders = {
        Authorization: `Bearer ${token}`,
        Accept: `application/json, text/plain, */*`,
        "Content-Type": `application/json;charset=utf-8`
    };

    let leaveData = {
        reason: "sick",
        startTime: "start-time",
        endTime: "end-time"
    }

    let timeData: TimeLog = {
        startTime: 17777770000,
        endTime: 17777773600,
        duration: 3600,
        logType: "WORK",
    };

    it("Login: should resolve given correct username and password", async () => {

        let userData = await pulseApi.login(VALID_DATA.userName, VALID_DATA.password);
        expect(axios).toHaveBeenCalledWith({
            url: LOGIN_URL,
            method: 'POST',
            data: {
                userName: VALID_DATA.userName,
                password: VALID_DATA.password
            }
        });

        expect(userData.email).toBe(VALID_DATA.userName);
    });

    it("Login: invalid data should reject", async () => {
        expect(pulseApi.login("badusername", "password")).rejects.toMatchSnapshot()
    });

    it("should be able to set auth token and userId to the pulseApi instance", () => {

        pulseApi.setAuthInfo({
            token,
            userId
        });

        expect(pulseApi.getAuthInfo()).toMatchObject({
            token,
            userId
        });
    })

    it("Add Leave: should be able to add leave", async () => {

        await pulseApi.addLeave(leaveData);

        expect(axios).toHaveBeenLastCalledWith({
            url: ADD_LEAVE_URL,
            method: "POST",
            headers: authHeaders,
            data: {
                userId,
                ...leaveData
            }
        } as AxiosRequestConfig)
    });


    it("Add Time Logs: should be able to add time logs", async () => {

        await pulseApi.addTime([timeData]);

        expect(axios).toHaveBeenLastCalledWith({
            url: ADD_TIME_LOG,
            method: "POST",
            headers: authHeaders,
            data: [{
                ...timeData,
                userId,
            }]
        } as AxiosRequestConfig)
    });

    it("Add Manual TimeLog: should be able to add manual time log", async () => {

        let manual = true;

        await pulseApi.addTime([{
            ...timeData,
            manual
        }]);

        expect(axios).toHaveBeenLastCalledWith({
            url: ADD_TIME_LOG,
            method: "POST",
            headers: authHeaders,
            data: [{
                ...timeData,
                manual,
                userId,
            }]
        } as AxiosRequestConfig)
    });

    it("calling add leave without setting authInfo should reject", async () => {
        pulseApi.setAuthInfo({} as any);
        expect(pulseApi.addLeave(leaveData)).rejects.toMatchSnapshot();
    });

    it("calling add time without setting authInfo should", () => {
        pulseApi.setAuthInfo({} as any);
        expect(pulseApi.addTime([timeData])).rejects.toMatchSnapshot();
    });
});