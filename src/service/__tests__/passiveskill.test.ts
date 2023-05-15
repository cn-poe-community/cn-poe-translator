import { BasicTranslatorFactory } from "../../index.js";
import Assets from "cn-poe-export-db";

const factory = new BasicTranslatorFactory(Assets);
const passiveSkillService = factory.getPassiveSkillService();

test("ascendants translation", () => {
    const testcases = ["自然之怒"];
    const expecteds = ["Fury of Nature"];

    for (let i = 0; i < testcases.length; i++) {
        const testcase = testcases[i];
        const expected = expecteds[i];
        const translation = passiveSkillService.translateAscendant(testcase);
        expect(translation).toEqual(expected);
    }
});
