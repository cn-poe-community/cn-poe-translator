import { BasicTranslatorFactory } from "../../index.js";
import Assets from "cn-poe-export-db";

const factory = new BasicTranslatorFactory(Assets);
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
冷却回复速度加快 16%
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

itemTranslationTestCases.push(
    `物品类别: 珠宝
稀 有 度: 传奇
禁断之火
赤红珠宝
--------
仅限: 1
--------
需求:
职业：: 贵族
--------
物品等级: 86
--------
禁断之肉上有匹配的词缀则配置 暗影
--------
被洁净之火彻底看透的人
还在继续做梦，祈求平安……
--------
放置到一个天赋树的珠宝插槽中以产生效果。右键点击以移出插槽。
--------
已腐化
--------
出售获得通货:非绑定`
);

itemTranslationTestCaseAnswers.push(
    `Item Class: Jewels
Rarity: Unique
Forbidden Flame
Crimson Jewel
--------
Limited to: 1
--------
Requirements: 
Class:: Scion
--------
Item Level: 86
--------
Allocates Assassin if you have the matching modifier on Forbidden Flesh
--------
被洁净之火彻底看透的人
还在继续做梦，祈求平安……
--------
放置到一个天赋树的珠宝插槽中以产生效果。右键点击以移出插槽。
--------
Corrupted
--------
出售获得通货:非绑定`
);

itemTranslationTestCases.push(
    `物品类别: 珠宝
稀 有 度: 传奇
无所遁形
翠绿珠宝
--------
仅限: 1
范围: 小
--------
物品等级: 87
--------
狂热誓言范围内的天赋可以在
未连结至天赋树的情况下配置
--------
已腐化
`
);

itemTranslationTestCaseAnswers.push(
    `Item Class: Jewels
Rarity: Unique
Impossible Escape
Viridian Jewel
--------
Limited to: 1
Radius: Small
--------
Item Level: 87
--------
Passives in Radius of Zealot's Oath can be Allocated
without being connected to your tree
--------
Corrupted
`
);

itemTranslationTestCases.push(
    `物品类别: 细剑
稀 有 度: 传奇
悖论
瓦尔细剑
--------
单手剑
物理伤害: 49-194 (augmented)
攻击暴击率: 6.50%
每秒攻击次数: 1.56 (augmented)
武器范围：1.4 米
--------
需求:
等级: 66
敏捷: 212
--------
插槽: G-G 
--------
物品等级: 85
--------
+25% 全域暴击伤害加成 (implicit)
--------
+27 敏捷与智慧
物理伤害提高 123%
攻击速度加快 20%
击中时 23% 的几率造成流血
该武器的攻击伤害翻倍
--------
什么独来独往，却又成双成对？`
);

itemTranslationTestCaseAnswers.push(
    `Item Class: Thrusting One Hand Swords
Rarity: Unique
Paradoxica
Vaal Rapier
--------
One Handed Sword
Physical Damage: 49-194 (augmented)
Critical Strike Chance: 6.50%
Attacks per Second: 1.56 (augmented)
Weapon Range: 1.4 metres
--------
Requirements: 
Level: 66
Dex: 212
--------
Sockets: G-G 
--------
Item Level: 85
--------
+25% to Global Critical Strike Multiplier (implicit)
--------
+27 to Dexterity and Intelligence
123% increased Physical Damage
20% increased Attack Speed
23% chance to cause Bleeding on Hit
Attacks with this Weapon deal Double Damage
--------
什么独来独往，却又成双成对？`
);

test("item translation", () => {
    for (let i = 0; i < itemTranslationTestCases.length; i++) {
        const testCase = itemTranslationTestCases[i];
        const answer = itemTranslationTestCaseAnswers[i];

        const result = textTranslator.translate(testCase);

        expect(result).toEqual(answer);
    }
});
