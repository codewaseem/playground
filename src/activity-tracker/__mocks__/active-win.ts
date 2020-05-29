import { LogInputData } from "../test.data";

var index = -1;

export default jest.fn().mockImplementation(() => {
    return new Promise((res) => res(LogInputData[index++]));
});