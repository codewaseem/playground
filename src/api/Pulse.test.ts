jest.mock("axios");

import axios, { AxiosRequestConfig } from "axios";
import PulseApi, { LOGIN_URL, LOGIN_ERROR, ADD_LEAVE_URL } from "./Pulse";

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

    let pulseApi = PulseApi.getInstance();


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

    it("Add Leave: should be able to add leave", async () => {
        let token = "token";
        let userId = `1`;
        let reason = "sick";
        let startTime = "start-time";
        let endTime = "end-time"

        await pulseApi.addLeave(token, userId, {
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
    })
});