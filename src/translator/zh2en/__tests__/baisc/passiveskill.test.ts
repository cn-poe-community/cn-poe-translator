import { expect, test } from 'vitest';

import { ZhToEn } from "../../../../index.js";
import Assets from "cn-poe-export-db";

const factory = new ZhToEn.TranslatorFactory(Assets);
const basic = factory.getBasicTranslator();

test("ascendants translation", () => {
    const testcases = ["自然之怒"];
    const expecteds = ["Fury of Nature"];

    for (let i = 0; i < testcases.length; i++) {
        const testcase = testcases[i];
        const expected = expecteds[i];
        const translation = basic.transAscendant(testcase);
        expect(translation).toEqual(expected);
    }
});
