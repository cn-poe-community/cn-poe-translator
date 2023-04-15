import { TranslatorFactory } from "../../index";

const factory = TranslatorFactory.Default();
const baseTypeService = factory.getBaseTypeService();

test("丝绸手套 translation", () => {
    const testcases = ["安赛娜丝的安抚之语", "漆黑天顶", "abc"];
    const expecteds = ["Silk Gloves", "Fingerless Silk Gloves", "Silk Gloves"];

    for (let i = 0; i < testcases.length; i++) {
        const testcase = testcases[i];
        const expected = expecteds[i];
        const translation = baseTypeService.translateBaseType("丝绸手套", testcase);
        expect(translation).toEqual(expected);
    }
});
