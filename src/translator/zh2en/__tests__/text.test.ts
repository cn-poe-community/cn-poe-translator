import { expect, test } from "vitest";

import { ZhToEn } from "../../../index.js";
import Assets from "cn-poe-export-db";

const factory = new ZhToEn.TranslatorFactory(Assets);
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
出售获得通货:非绑定`,
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
出售获得通货:非绑定`,
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
出售获得通货:非绑定`,
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
出售获得通货:非绑定`,
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
`,
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
`,
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
什么独来独往，却又成双成对？`,
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
什么独来独往，却又成双成对？`,
);

itemTranslationTestCases.push(
    `物品类别: 双手剑
稀 有 度: 稀有
魔像 利牙
忆境 残暴巨剑
--------
双手剑
品质: +20% (augmented)
火焰，冰霜，闪电伤害: 410-755 (augmented), 323-601 (augmented), 87-1499 (augmented)
攻击暴击率: 6.25% (augmented)
每秒攻击次数: 2.02 (augmented)
武器范围：1.3 米
--------
需求:
等级: 65
力量: 82
敏捷: 119
--------
插槽: W-W-W-W-W-W 
--------
物品等级: 82
--------
没有物理伤害 (enchant)
元素伤害提高 97% (enchant)
--------
该装备附加 8 - 123 基础闪电伤害 (implicit)
攻击速度加快 8% (implicit)
每击中一名敌人获得 50 点生命 (implicit)
物品卖的钱更多 (implicit)
--------
该装备附加 208 - 383 基础火焰伤害
该装备附加 164 - 305 基础冰霜伤害
该装备附加 36 - 638 基础闪电伤害
攻击速度加快 27%
专注时有 40% 的几率伤害翻倍
+24 力量和智慧 (crafted)
该装备的攻击暴击率提高 25% (crafted)
--------
分裂
--------
忆境物品
--------
出售获得通货:非绑定`,
);

itemTranslationTestCaseAnswers.push(
    `Item Class: Two Hand Swords
Rarity: Rare
Item
Synthesised Reaver Sword
--------
Two Handed Sword
Quality: +20% (augmented)
Elemental Damage: 410-755 (augmented), 323-601 (augmented), 87-1499 (augmented)
Critical Strike Chance: 6.25% (augmented)
Attacks per Second: 2.02 (augmented)
Weapon Range: 1.3 metres
--------
Requirements: 
Level: 65
Str: 82
Dex: 119
--------
Sockets: W-W-W-W-W-W 
--------
Item Level: 82
--------
No Physical Damage (enchant)
Has 97% increased Elemental Damage (enchant)
--------
Adds 8 to 123 Lightning Damage (implicit)
8% increased Attack Speed (implicit)
Grants 50 Life per Enemy Hit (implicit)
Item sells for much more to vendors (implicit)
--------
Adds 208 to 383 Fire Damage
Adds 164 to 305 Cold Damage
Adds 36 to 638 Lightning Damage
27% increased Attack Speed
40% chance to deal Double Damage while Focused
+24 to Strength and Intelligence (crafted)
25% increased Critical Strike Chance (crafted)
--------
Split
--------
Synthesised Item
--------
出售获得通货:非绑定`,
);

test("item translation", () => {
    for (let i = 0; i < itemTranslationTestCases.length; i++) {
        const testCase = itemTranslationTestCases[i];
        const answer = itemTranslationTestCaseAnswers[i];

        const result = textTranslator.trans(testCase);

        expect(result).toEqual(answer);
    }
});
