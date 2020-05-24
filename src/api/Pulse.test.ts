jest.mock("axios");

import axios, { AxiosRequestConfig } from "axios";
import PulseApi, { LOGIN_URL, LOGIN_ERROR, ADD_LEAVE_URL, CAN_APPLY_LEAVE_URL, ADD_TIME_LOG } from "./Pulse";

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

        let reason = "sick";
        let startTime = "start-time";
        let endTime = "end-time"

        await pulseApi.addLeave({
            reason,
            startTime,
            endTime
        });

        expect(axios).toHaveBeenLastCalledWith({
            url: ADD_LEAVE_URL,
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: `application/json, text/plain, */*`,
                "Content-Type": `application/json;charset=utf-8`
            },
            data: {
                userId,
                reason,
                startTime,
                endTime
            }
        } as AxiosRequestConfig)
    });


    it("Add Time Logs: should be able to add time logs", async () => {
        let startTime = 17777770000;
        let endTime = 17777773600;
        let duration = 3600;

        await pulseApi.addTime([{
            startTime,
            endTime,
            duration,
            logType: "WORK"
        }]);

        expect(axios).toHaveBeenLastCalledWith({
            url: ADD_TIME_LOG,
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: `application/json, text/plain, */*`,
                "Content-Type": `application/json;charset=utf-8`
            },
            data: [{
                startTime,
                endTime,
                duration,
                userId,
                logType: "WORK"
            }]
        } as AxiosRequestConfig)
    });

});