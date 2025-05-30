import { ZhToEn } from "../index.js";
import Assets from "cn-poe-export-db";

import items from "./items.json" with {type: "json"};
import passiveSkills from "./passive_skills.json" with {type: "json"};

import { writeFileSync } from "node:fs";
import { Items, PassiveSkills } from "../type/json.js";

const factory = new ZhToEn.TranslatorFactory(Assets);
const jsonTranslator = factory.getJsonTranslator();

test("json translation", () => {
    jsonTranslator.transItems(items as unknown as Items);
    jsonTranslator.transPassiveSkills(
        passiveSkills as unknown as PassiveSkills,
    );
    writeFileSync("src/__test__/items_js.json", JSON.stringify(items));
    writeFileSync(
        "src/__test__/passive_skills_js.json",
        JSON.stringify(passiveSkills),
    );
});
