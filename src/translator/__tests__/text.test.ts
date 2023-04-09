import { AttributeProvider } from "../../provider/attribute.provider";
import { BaseTypeProvider } from "../../provider/basetype.provider";
import { GemProvider } from "../../provider/gem.provider";
import { PassiveSkillProvider } from "../../provider/passiveskill.provider";
import { PropertyProvider } from "../../provider/property.provider";
import { RequirementProvider } from "../../provider/requirement.provider";
import { StatProvider } from "../../provider/stat.provider";
import { AttributeService } from "../../service/attribute.service";
import { BaseTypeService } from "../../service/basetype.service";
import { GemService } from "../../service/gem.service";
import { ItemService } from "../../service/item.service";
import { PassiveSkillService } from "../../service/passiveskill.service";
import { PropertyService } from "../../service/property.service";
import { RequirementSerivce } from "../../service/requirement.service";
import { StatService } from "../../service/stat.service";
import { BaseType } from "../../type/basetype.type";
import { TextTranslator } from "../text.translator";
import {
    accessories,
    armour,
    flasks,
    jewels,
    weapons,
    requirements,
    requirementSuffixes,
    properties,
    gems,
    ascendant,
    keystones,
    notables,
    stats,
    attributes,
} from "../../asset/assets";

const baseTypesList: BaseType[][] = [accessories, armour, flasks, jewels, weapons];

const baseTypeProvider = new BaseTypeProvider(baseTypesList);
const baseTypeService = new BaseTypeService(baseTypeProvider);
const itemService = new ItemService(baseTypeProvider);
const requirementProvider = new RequirementProvider(requirements, requirementSuffixes);
const requirementService = new RequirementSerivce(requirementProvider);
const propertyProvider = new PropertyProvider(properties);
const propertySerivce = new PropertyService(propertyProvider);
const gemProvider = new GemProvider(gems);
const gemService = new GemService(gemProvider);
const passiveSkillProvider = new PassiveSkillProvider(notables, keystones, ascendant);
const passiveSkillService = new PassiveSkillService(passiveSkillProvider);
const statProvider = new StatProvider(stats);
const statService = new StatService(passiveSkillService, statProvider);
const attributeProvider = new AttributeProvider(attributes);
const attributeService = new AttributeService(attributeProvider);

const textTranslator = new TextTranslator(
    baseTypeService,
    itemService,
    requirementService,
    propertySerivce,
    gemService,
    statService,
    attributeService
);

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
