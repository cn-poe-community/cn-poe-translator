import { BasicTranslatorFactory } from "../index.js";
import Assets from "cn-poe-export-db";

import items from "./items.json";
import passiveSkills from "./passiveSkills.json";

import { writeFileSync } from "node:fs";

const factory = new BasicTranslatorFactory(Assets);

const jsonTranslator = factory.getJsonTranslator();

test("json translation", () => {
    jsonTranslator.translateItems(items);
    jsonTranslator.translatePassiveSkills(passiveSkills);
    writeFileSync("src/__test__/items_translated.json", JSON.stringify(items));
    writeFileSync("src/__test__/passiveskills_translated.json", JSON.stringify(passiveSkills));
});
