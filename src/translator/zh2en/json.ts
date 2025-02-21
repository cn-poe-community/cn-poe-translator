import { Item, Items, PassiveSkills, SkillOverride } from "../../type/json.js";
import { BasicTranslator } from "./basic.js";

const ZH_THIEF_TRINKET = "赏金猎人饰品";
export const ZH_FORBIDDEN_FLESH = "禁断之肉";
export const ZH_FORBIDDEN_FLAME = "禁断之火";
export const ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN = "暗影";
export const ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN_FIXED = "暗影（贵族）";
export const ZH_CLASS_SCION = "贵族";

const ZH_REQUIREMENT_NAME_CLASS = "职业：";

export class JsonTranslator {
    constructor(private readonly basic: BasicTranslator) {}

    /**
     * 翻译前预处理 Item。
     *
     * 国服在本地化时，引入了许多错误，这些错误只能通过 hack 的方式进行解决。
     */
    preHandleItem(item: Item) {
        if (
            item.name &&
            (item.name === ZH_FORBIDDEN_FLAME ||
                item.name === ZH_FORBIDDEN_FLESH)
        ) {
            if (item.requirements) {
                for (const requirement of item.requirements) {
                    const name = requirement.name;

                    if (name !== ZH_REQUIREMENT_NAME_CLASS) {
                        continue;
                    }

                    const value = requirement.values[0][0];
                    // 禁断珠宝，其中贵族的升华大点 `暗影` 与暗影的升华大点 `暗影` 中文同名问题。
                    if (value === ZH_CLASS_SCION) {
                        if (item.explicitMods) {
                            for (let i = 0; i < item.explicitMods.length; i++) {
                                const zhStat = item.explicitMods[i] as string;
                                if (
                                    zhStat.endsWith(
                                        ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN,
                                    )
                                ) {
                                    item.explicitMods[i] = zhStat.replace(
                                        ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN,
                                        ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN_FIXED,
                                    );
                                }
                            }
                        }
                    }

                    break;
                }
            }
        }

        // S26 赛季武器附魔引入的中文词缀重复问题
        if (item.enchantMods) {
            for (let i = 0; i < item.enchantMods.length; i++) {
                const mod: string = item.enchantMods[i];
                if (/^元素伤害(提高|降低) \d+%$/.test(mod)) {
                    item.enchantMods[i] = "该武器的" + mod;
                }
            }
        }
    }

    /**
     * 翻译 items json 数据。
     *
     * 本函数采用本地翻译，即修改原始对象。
     */
    public transItems(items: Items) {
        const itemList = items.items;
        const translatedItems: Item[] = [];
        for (const item of itemList) {
            if (this.isPobItem(item)) {
                this.transItem(item);
                translatedItems.push(item);
            }
        }
        items.items = translatedItems;

        this.postHandleItems(items);
    }

    isPobItem(item: Item): boolean {
        return !(
            item.inventoryId === "MainInventory" ||
            item.inventoryId === "ExpandedMainInventory" ||
            item.baseType === ZH_THIEF_TRINKET
        );
    }

    /**
     * 翻译 Item。
     *
     * 本函数采用本地翻译，即修改原始对象。
     */
    transItem(item: Item) {
        this.preHandleItem(item);

        const name = item.name;
        const baseType = item.baseType;
        const typeLine = item.typeLine;

        // 传奇物品、稀有物品有name
        // 魔法物品、普通物品的name为""
        if (name) {
            const result = this.basic.transNameAndBaseType(name, baseType);
            if (result) {
                item.name = result.name;
                item.baseType = result.baseType;
            } else {
                console.log(
                    `warning: should be translated: item name, ${name}`,
                );
                console.log(
                    `warning: should be translated: item basetype, ${baseType}`,
                );
            }
        } else {
            if (baseType) {
                const result = this.basic.transBaseType(baseType);
                if (result) {
                    item.baseType = result;
                } else {
                    console.log(
                        `warning: should be translated: base type, ${baseType}`,
                    );
                }
            }
        }

        if (typeLine) {
            item.typeLine = item.baseType;
        }

        if (item.requirements) {
            for (const req of item.requirements) {
                const name = req.name;
                const result = this.basic.transReqName(req.name);
                if (result) {
                    req.name = result;
                } else {
                    console.log(
                        `warning: should be translated: requirement name, ${name}`,
                    );
                }

                if (req.values) {
                    for (const v of req.values) {
                        const value = v[0];
                        const result = this.basic.transReq(name, value);
                        if (result && result.value) {
                            v[0] = result.value;
                        }
                    }
                }

                if (req.suffix) {
                    const suffix = req.suffix;
                    const res = this.basic.transReqSuffix(suffix);
                    if (res) {
                        req.suffix = res;
                    } else {
                        console.log(
                            `warning: should be translated: requirement suffix, ${suffix}`,
                        );
                    }
                }
            }
        }

        if (item.properties) {
            for (const prop of item.properties) {
                const name = prop.name;
                const value = this.basic.transPropName(name);
                if (value) {
                    prop.name = value;
                } else {
                    console.log(
                        `warning: should be translated: property name, ${name}`,
                    );
                }

                if (prop.values) {
                    for (const v of prop.values) {
                        const value = v[0];
                        const result = this.basic.transProp(name, value);
                        if (result && result.value) {
                            v[0] = result.value;
                        }
                    }
                }
            }
        }

        if (item.socketedItems) {
            for (const si of item.socketedItems) {
                if (si.abyssJewel) {
                    this.transItem(si);
                } else {
                    this.translateGem(si);
                }
            }
        }

        if (item.enchantMods) {
            for (let i = 0; i < item.enchantMods.length; i++) {
                const mod = item.enchantMods[i];
                const result = this.basic.transMod(mod);
                if (result) {
                    item.enchantMods[i] = result;
                } else {
                    console.log(`warning: should be translated: stat: ${mod}`);
                }
            }
        }

        if (item.explicitMods) {
            for (let i = 0; i < item.explicitMods.length; i++) {
                const mod = item.explicitMods[i];
                const result = this.basic.transMod(mod);
                if (result) {
                    item.explicitMods[i] = result;
                } else {
                    console.log(`warning: should be translated: stat: ${mod}`);
                }
            }
        }

        if (item.implicitMods) {
            for (let i = 0; i < item.implicitMods.length; i++) {
                const mod = item.implicitMods[i];
                const result = this.basic.transMod(mod);
                if (result) {
                    item.implicitMods[i] = result;
                } else {
                    console.log(`warning: should be translated: stat: ${mod}`);
                }
            }
        }

        if (item.craftedMods) {
            for (let i = 0; i < item.craftedMods.length; i++) {
                const mod = item.craftedMods[i];
                const result = this.basic.transMod(mod);
                if (result) {
                    item.craftedMods[i] = result;
                } else {
                    console.log(`warning: should be translated: stat: ${mod}`);
                }
            }
        }

        if (item.utilityMods) {
            for (let i = 0; i < item.utilityMods.length; i++) {
                const mod = item.utilityMods[i];
                const result = this.basic.transMod(mod);
                if (result) {
                    item.utilityMods[i] = result;
                } else {
                    console.log(`warning: should be translated: stat: ${mod}`);
                }
            }
        }

        if (item.fracturedMods) {
            for (let i = 0; i < item.fracturedMods.length; i++) {
                const mod = item.fracturedMods[i];
                const result = this.basic.transMod(mod);
                if (result) {
                    item.fracturedMods[i] = result;
                } else {
                    console.log(`warning: should be translated: stat: ${mod}`);
                }
            }
        }

        if (item.scourgeMods) {
            for (let i = 0; i < item.scourgeMods.length; i++) {
                const mod = item.scourgeMods[i];
                const result = this.basic.transMod(mod);
                if (result) {
                    item.scourgeMods[i] = result;
                } else {
                    console.log(`warning: should be translated: stat: ${mod}`);
                }
            }
        }

        if (item.crucibleMods) {
            for (let i = 0; i < item.crucibleMods.length; i++) {
                const mod = item.crucibleMods[i];
                const result = this.basic.transMod(mod);

                if (result) {
                    item.crucibleMods[i] = result;
                } else {
                    console.log(`warning: should be translated: stat: ${mod}`);
                }
            }
        }
    }

    translateGem(gem: Item) {
        const baseType = gem.baseType;
        const typeLine = gem.typeLine;
        if (baseType) {
            const result = this.basic.transGem(baseType);
            if (result) {
                gem.baseType = result;
            } else {
                console.log(
                    `warning: should be translated: gem baseType: ${baseType}`,
                );
            }
        }

        if (typeLine) {
            const result = this.basic.transGem(typeLine);
            if (result) {
                gem.typeLine = result;
            } else {
                console.log(
                    `warning: should be translated: gem typeLine: ${typeLine}`,
                );
            }
        }

        if (gem.hybrid) {
            const result = this.basic.transGem(gem.hybrid.baseTypeName);
            if (result) {
                gem.hybrid.baseTypeName = result;
            } else {
                console.log(
                    `warning: should be translated: gem hybrid baseTypeName: ${gem.hybrid.baseTypeName}`,
                );
            }
        }

        if (gem.properties) {
            for (const prop of gem.properties) {
                const result = this.basic.transGemProp(prop.name);
                if (result) {
                    prop.name = result;
                }
            }
        }
    }

    postHandleItems(items: Items) {
        // 费内亚赛季，国服的API返回的升华名称存在bug，返回的是旧升华名而非闪回升华名
        // 这里采用临时的解决方案，将旧升华映射到闪回升华
        if (items.character.league.includes("费西亚")) {
            items.character.class = mapToPhreciaCharacterClass(
                items.character.class,
            );
        }
    }

    public transPassiveSkills(skils: PassiveSkills) {
        for (const item of skils.items) {
            this.transItem(item);
        }

        for (const [_, value] of Object.entries<SkillOverride>(
            skils.skill_overrides,
        )) {
            if (value.name) {
                const name = value.name;
                if (value.isKeystone) {
                    const result = this.basic.transKeystone(name);
                    if (result) {
                        value.name = result;
                    } else {
                        console.log(
                            `warning: should be translated: keystone, ${name}`,
                        );
                    }
                } else {
                    const result = this.basic.transBaseType(name);
                    if (result) {
                        value.name = result;
                    } else {
                        console.log(
                            `warning: should be translated: base type, ${name}`,
                        );
                    }
                }
            }
        }
    }
}

const CLASSES = [
    {
        name: "Scion",
        ascendancyList: ["None", "Ascendant"],
        phreciaAscendancyList: ["None", "Scavenger"],
    },
    {
        name: "Marauder",
        ascendancyList: ["None", "Juggernaut", "Berserker", "Chieftain"],
        phreciaAscendancyList: [
            "None",
            "Ancestral Commander",
            "Behemoth",
            "Antiquarian",
        ],
    },
    {
        name: "Ranger",
        ascendancyList: ["None", "Warden", "Deadeye", "Pathfinder"],
        phreciaAscendancyList: [
            "None",
            "Wildspeaker",
            "Whisperer",
            "Daughter of Oshabi",
        ],
    },
    {
        name: "Witch",
        ascendancyList: ["None", "Occultist", "Elementalist", "Necromancer"],
        phreciaAscendancyList: ["None", "Harbinger", "Herald", "Bog Shaman"],
    },
    {
        name: "Duelist",
        ascendancyList: ["None", "Slayer", "Gladiator", "Champion"],
        phreciaAscendancyList: ["None", "Aristocrat", "Gambler", "Paladin"],
    },
    {
        name: "Templar",
        ascendancyList: ["None", "Inquisitor", "Hierophant", "Guardian"],
        phreciaAscendancyList: [
            "None",
            "Architect of Chaos",
            "Puppeteer",
            "Polytheist",
        ],
    },
    {
        name: "Shadow",
        ascendancyList: ["None", "Assassin", "Trickster", "Saboteur"],
        phreciaAscendancyList: [
            "None",
            "Servant of Arakaali",
            "Blind Prophet",
            "Surfcaster",
        ],
    },
];

function mapToPhreciaCharacterClass(characterClass: string): string {
    for (const classData of CLASSES) {
        const ascendancyList = classData.ascendancyList;
        for (let j = 0; j < ascendancyList.length; j++) {
            if (ascendancyList[j] === characterClass) {
                return classData.phreciaAscendancyList[j];
            }
        }
    }
    return characterClass;
}
