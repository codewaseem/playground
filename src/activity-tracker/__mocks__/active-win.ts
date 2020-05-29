import { LogInputData } from "../__testdata__/test.data";

var index = -1;

export default jest.fn().mockImplementation(() => {
    let data = LogInputData[index++] || LogInputData[0];

    return new Promise((res) => res(data));
});