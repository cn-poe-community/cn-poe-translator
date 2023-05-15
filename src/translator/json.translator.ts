import { BaseTypeService } from "../service/basetype.service.js";
import { GemService } from "../service/gem.service.js";
import { ItemService } from "../service/item.service.js";
import { PropertyService } from "../service/property.service.js";
import { RequirementSerivce } from "../service/requirement.service.js";
import { StatService } from "../service/stat.service.js";
import { ZH_PROPERTY_NAME_LIMITED_TO, ZH_PROPERTY_NAME_RADIUS } from "../type/property.type.js";
import { ZH_REQUIREMENT_NAME_CLASS } from "../type/requirement.type.js";

const ZH_THIEFS_TRINKET = "赏金猎人饰品";
export const ZH_FORBIDDEN_FLESH = "禁断之肉";
export const ZH_FORBIDDEN_FLAME = "禁断之火";
export const ZH_PASSIVESKILL_ASCENDANT_ASSASSIN = "暗影";
export const ZH_PASSIVESKILL_ASCENDANT_ASSASSIN_FIXED = "暗影（贵族）";
export const ZH_CLASS_SCION = "贵族";

export class JsonTranslator {
    private readonly baseTypeService: BaseTypeService;
    private readonly itemService: ItemService;
    private readonly requirementService: RequirementSerivce;
    private readonly propertySerivce: PropertyService;
    private readonly gemService: GemService;
    private readonly statService: StatService;

    constructor(
        baseTypeService: BaseTypeService,
        itemService: ItemService,
        requirementService: RequirementSerivce,
        propertySerivce: PropertyService,
        gemService: GemService,
        statService: StatService
    ) {
        this.baseTypeService = baseTypeService;
        this.itemService = itemService;
        this.requirementService = requirementService;
        this.propertySerivce = propertySerivce;
        this.gemService = gemService;
        this.statService = statService;
    }

    preHandleItem(item: any) {
        if (item.name && (item.name === ZH_FORBIDDEN_FLAME || item.name === ZH_FORBIDDEN_FLESH)) {
            if (item.requirements) {
                for (const requirement of item.requirements) {
                    const name = requirement.name;

                    if (name !== ZH_REQUIREMENT_NAME_CLASS) {
                        continue;
                    }

                    const value = requirement.values[0][0];
                    if (value === ZH_CLASS_SCION) {
                        if (item.explicitMods) {
                            for (let i = 0; i < item.explicitMods.length; i++) {
                                const zhStat = item.explicitMods[i] as string;
                                if (zhStat.endsWith(ZH_PASSIVESKILL_ASCENDANT_ASSASSIN)) {
                                    item.explicitMods[i] = zhStat.replace(
                                        ZH_PASSIVESKILL_ASCENDANT_ASSASSIN,
                                        ZH_PASSIVESKILL_ASCENDANT_ASSASSIN_FIXED
                                    );
                                }
                            }
                        }
                    }

                    break;
                }
            }
        }
    }

    translateItems(data: any) {
        const items = data.items;
        const translatedItems = [];
        for (const item of items) {
            //Skip non-build items
            if (item.inventoryId === "MainInventory" || item.baseType === ZH_THIEFS_TRINKET) {
                continue;
            }

            this.translateItem(item);

            translatedItems.push(item);
        }
        data.items = translatedItems;
        return data;
    }

    translateItem(item: any) {
        this.preHandleItem(item);

        const zhBaseType = item.baseType;
        const zhName = item.name;
        const zhTypeLine = item.typeLine;

        if (zhName) {
            const res = this.itemService.translateName(zhName, zhBaseType);
            if (res) {
                item.name = res;
            } else {
                console.log(`warning: should be translated: item name, ${zhName}`);
            }
        }

        if (zhBaseType) {
            const res = this.baseTypeService.translateBaseType(zhBaseType, zhName);
            if (res) {
                item.baseType = res;
            } else {
                console.log(`warning: should be translated: base type, ${zhBaseType}`);
            }
        }

        if (zhTypeLine) {
            item.typeLine = item.baseType;
        }

        if (item.requirements) {
            for (const r of item.requirements) {
                const zhName = r.name;
                const res = this.requirementService.translateName(zhName);
                if (res) {
                    r.name = res;
                } else {
                    console.log(`warning: should be translated: requirement name, ${zhName}`);
                }

                if (zhName === ZH_REQUIREMENT_NAME_CLASS) {
                    if (r.values) {
                        for (const v of r.values) {
                            const zhValue = v[0];
                            const result = this.requirementService.translate(zhName, zhValue);
                            if (result && result.value) {
                                v[0] = result.value;
                            } else {
                                console.log(
                                    `warning: should be translated: requirement value, ${zhValue}`
                                );
                            }
                        }
                    }
                }

                if (r.suffix) {
                    const zhSuffix = r.suffix;
                    const res = this.requirementService.translateSuffix(zhSuffix);
                    if (res) {
                        r.suffix = res;
                    } else {
                        console.log(
                            `warning: should be translated: requirement suffix, ${zhSuffix}`
                        );
                    }
                }
            }
        }

        if (item.properties) {
            for (const p of item.properties) {
                const zhName = p.name;
                const enName = this.propertySerivce.translateName(zhName);
                if (enName) {
                    p.name = enName;
                } else {
                    console.log(`warning: should be translated: property name, ${zhName}`);
                }

                if (zhName === ZH_PROPERTY_NAME_LIMITED_TO || zhName === ZH_PROPERTY_NAME_RADIUS) {
                    if (p.values) {
                        for (const v of p.values) {
                            const zhValue = v[0];
                            const res = this.propertySerivce.translate(zhName, zhValue);
                            if (res) {
                                v[0] = res.value;
                            } else {
                                console.log(
                                    `warning: should be translated: property value, ${zhValue}`
                                );
                            }
                        }
                    }
                }
            }
        }

        if (item.socketedItems) {
            for (const si of item.socketedItems) {
                if (si.abyssJewel) {
                    this.translateItem(si);
                } else {
                    this.translateGem(si);
                }
            }
        }

        if (item.enchantMods) {
            for (let i = 0; i < item.enchantMods.length; i++) {
                const zhStat = item.enchantMods[i];
                const res = this.statService.translateMod(zhStat);
                if (res) {
                    item.enchantMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.explicitMods) {
            for (let i = 0; i < item.explicitMods.length; i++) {
                const zhStat = item.explicitMods[i];
                const res = this.statService.translateMod(zhStat);
                if (res) {
                    item.explicitMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.implicitMods) {
            for (let i = 0; i < item.implicitMods.length; i++) {
                const zhStat = item.implicitMods[i];
                const res = this.statService.translateMod(zhStat);
                if (res) {
                    item.implicitMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.craftedMods) {
            for (let i = 0; i < item.craftedMods.length; i++) {
                const zhStat = item.craftedMods[i];
                const res = this.statService.translateMod(zhStat);
                if (res) {
                    item.craftedMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.utilityMods) {
            for (let i = 0; i < item.utilityMods.length; i++) {
                const zhStat = item.utilityMods[i];
                const res = this.statService.translateMod(zhStat);
                if (res) {
                    item.utilityMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.fracturedMods) {
            for (let i = 0; i < item.fracturedMods.length; i++) {
                const zhStat = item.fracturedMods[i];
                const res = this.statService.translateMod(zhStat);
                if (res) {
                    item.fracturedMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.scourgeMods) {
            for (let i = 0; i < item.scourgeMods.length; i++) {
                const zhStat = item.scourgeMods[i];
                const res = this.statService.translateMod(zhStat);
                if (res) {
                    item.scourgeMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }

        if (item.crucibleMods) {
            for (let i = 0; i < item.crucibleMods.length; i++) {
                const zhStat = item.crucibleMods[i];
                const res = this.statService.translateMod(zhStat);

                if (res) {
                    item.crucibleMods[i] = res;
                } else {
                    console.log(`warning: should be translated: stat: ${zhStat}`);
                }
            }
        }
    }

    translateGem(item: any) {
        const zhBaseType = item.baseType;
        const zhTypeLine = item.typeLine;
        if (zhBaseType) {
            const res = this.gemService.translateBaseType(zhBaseType);
            if (res) {
                item.baseType = res;
            } else {
                console.log(`warning: should be translated: gem base type: ${zhBaseType}`);
            }
        }

        if (zhTypeLine) {
            const res = this.gemService.translateTypeLine(zhTypeLine);
            if (res) {
                item.typeLine = res;
            } else {
                console.log(`warning: should be translated: gem type line: ${zhTypeLine}`);
            }
        }

        if (item.hybrid) {
            item.hybrid.baseTypeName = this.gemService.translateTypeLine(item.hybrid.baseTypeName);
        }

        if (item.properties) {
            for (const p of item.properties) {
                const res = this.gemService.translatePropertyName(p.name);
                if (res) {
                    p.name = res;
                }
            }
        }
    }

    public translatePassiveSkills(data: any) {
        if (data.items) {
            for (const item of data.items) {
                this.translateItem(item);
            }
        }
    }
}
