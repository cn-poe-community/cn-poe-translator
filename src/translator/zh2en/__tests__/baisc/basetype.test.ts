import { expect, test } from 'vitest';

import { ZhToEn } from "../../../../index.js";
import Assets from "cn-poe-export-db";

const factory = new ZhToEn.TranslatorFactory(Assets);
const basic = factory.getBasicTranslator();

test("丝绸手套 translation", () => {
    const testcases = ["安赛娜丝的安抚之语", "漆黑天顶", "abc"];
    const expecteds = [
        "Silk Gloves",
        "Fingerless Silk Gloves",
        "Fingerless Silk Gloves",
    ];

    for (let i = 0; i < testcases.length; i++) {
        const testcase = testcases[i];
        const expected = expecteds[i];
        const translation = basic.transNameAndBaseType(testcase, "丝绸手套");
        expect(translation?.baseType).toEqual(expected);
    }
});
