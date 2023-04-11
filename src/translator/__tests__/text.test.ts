import { TranslatorFactory } from "../../index";

const factory = TranslatorFactory.Default();
const textTranslator = factory.getTextTranslator();

const itemTranslationTestCases: string[] = [];
const itemTranslationTestCaseAnswers: string[] = [];

itemTranslationTestCases.push(
    `物品类别: 腰带
稀 有 度: 稀有
劲风 束灵
忆境 饰布腰带
--------
品质（属性词缀）: +20% (augmented)
--------
需求:
等级: 66
--------
物品等级: 100
--------
击中被你恐惧的敌人时，该次击中的法术暴击率提高 50% (enchant)
--------
力量提高 18% (implicit)
敏捷提高 18% (implicit)
智慧提高 18% (implicit)
物品卖的钱更多 (implicit)
--------
+99 最大生命
+68 最大魔力
药剂充能使用降低 20%
药剂效果的持续时间延长 33%
冷却回复速度提高 16%
伤害提高 17% (crafted)
--------
忆境物品
--------
出售获得通货:非绑定`
);

itemTranslationTestCaseAnswers.push(
    `Item Class: Belts
Rarity: Rare
Item
Synthesised Cloth Belt
--------
Quality (Attribute Modifiers): +20% (augmented)
--------
Requirements: 
Level: 66
--------
Item Level: 100
--------
Hits against Enemies Unnerved by you have 50% increased Spell Critical Strike Chance (enchant)
--------
18% increased Strength (implicit)
18% increased Dexterity (implicit)
18% increased Intelligence (implicit)
Item sells for much more to vendors (implicit)
--------
+99 to maximum Life
+68 to maximum Mana
20% reduced Flask Charges used
33% increased Flask Effect Duration
16% increased Cooldown Recovery Rate
17% increased Damage (crafted)
--------
Synthesised Item
--------
出售获得通货:非绑定`
);

test("item translation", () => {
    for (let i = 0; i < itemTranslationTestCases.length; i++) {
        const testCase = itemTranslationTestCases[i];
        const answer = itemTranslationTestCaseAnswers[i];

        const result = textTranslator.translate(testCase);

        expect(result).toEqual(answer);
    }
});
