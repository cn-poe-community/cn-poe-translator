import { BasicTranslatorFactory } from "../../index.js";
import Assets from "cn-poe-export-db";

const factory = new BasicTranslatorFactory(Assets);
const statService = factory.getStatService();

const zhEldritchImplicitMods = [
    "有一个传奇怪物出现在你面前：法术附加 {0} - {1} 基础物理伤害",
    "有一个异界图鉴最终首领出现在你面前：【冰霜净化】的光环效果提高 {0}%",
];
const enEldritchImplicitMods = [
    "While a Unique Enemy is in your Presence, Adds {0} to {1} Physical Damage to Spells",
    "While a Pinnacle Atlas Boss is in your Presence, Purity of Ice has {0}% increased Aura Effect",
];

test("eldritch implicit mods translations", () => {
    for (let i = 0; i < zhEldritchImplicitMods.length; i++) {
        const zh = zhEldritchImplicitMods[i];
        const en = enEldritchImplicitMods[i];
        const val = statService.translateMod(zh);
        expect(val).toEqual(en);
    }
});
