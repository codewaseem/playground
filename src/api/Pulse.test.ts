jest.mock("axios");

import axios from "axios";
import PulseApi, { LOGIN_URL } from "./Pulse";


describe("PulseApi", () => {

    let pulseApi = PulseApi.getInstance();

    it("it should have a login method", () => {
        expect(pulseApi.login).toBeInstanceOf(Function);
    });

    it("should call fetch with given username and password", async () => {

        (axios as jest.MockedFunction<any>).mockReturnValue(Promise.resolve({ data: { data: { email: "taj@aptask.com" } } }))
        let userData = await pulseApi.login("taj@aptask.com", "Aptask123");
        expect(axios).toHaveBeenCalledWith({
            url: LOGIN_URL,
            method: 'POST',
            data: {
                userName: "taj@aptask.com",
                password: "Aptask123"
            }
        })
        expect(userData.email).toBe("taj@aptask.com");

    });
});