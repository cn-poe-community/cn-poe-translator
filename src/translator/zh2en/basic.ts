import { AttributeProvider } from "../../provider/attribute.js";
import { BaseTypeProvider } from "../../provider/basetype.js";
import { GemProvider } from "../../provider/gem.js";
import { PassiveSkillProvider } from "../../provider/passiveskill.js";
import { PropertyProvider } from "../../provider/property.js";
import { RequirementProvider } from "../../provider/requirement.js";
import { StatProvider } from "../../provider/stat.js";
import { BaseType, Unique } from "../../type/base_type.js";
import { Stat } from "../../type/stat.js";
import { getTextBody, LINE_SEPARATOR, Template } from "../../util/stat.js";

const ZH_SUPERIOR_PREFIX = "精良的 ";
const SUPERIOR_PREFIX = "Superior ";
const ZH_SYNTHESISED_PREFIX = "忆境 ";
const SYNTHESISED_PREFIX = "Synthesised ";

const DEFAULT_RARY_ITEM_NAME = "Item";

const GEM_PROPERTY_MAP = new Map([
    ["等级", "Level"],
    ["品质", "Quality"],
]);

const ZH_ANOINTED_MOD_REGEXP = /^配置 (.+)$/;
const ZH_FORBIDDEN_FLAME_MOD_REGEXP = /^禁断之火上有匹配的词缀则配置 (.+)$/;
const ZH_FORBIDDEN_FLESH_MOD_REGEXP = /^禁断之肉上有匹配的词缀则配置 (.+)$/;

const ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE = "有一个传奇怪物出现在你面前：";
const EN_UNIQUE_ENEMY_IN_YOUR_PRESENCE =
    "While a Unique Enemy is in your Presence, ";
const ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE =
    "有一个异界图鉴最终首领出现在你面前：";
const EN_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE =
    "While a Pinnacle Atlas Boss is in your Presence, ";

/**
 * BasicTranslator 提供了最基础、最底层的中文翻译为英文的功能，为更上层的 JSONTranslator 和 TextTranslator 提供支持。
 */
export class BasicTranslator {
    constructor(
        private readonly attributeProvider: AttributeProvider,
        private readonly baseTypeProvider: BaseTypeProvider,
        private readonly gemProvider: GemProvider,
        private readonly passiveSkillProvider: PassiveSkillProvider,
        private readonly propertyProvider: PropertyProvider,
        private readonly requirementProvider: RequirementProvider,
        private readonly statProvider: StatProvider,
    ) {}

    /**
     * 翻译 attribute.
     */
    public transAttr(
        name: string,
        value?: string,
    ): { name: string; value?: string } | undefined {
        const attr = this.attributeProvider.provideByZh(name);
        if (attr) {
            const en = attr.en;
            if (value && attr.values) {
                for (const v of attr.values) {
                    if (value === v.zh) {
                        return {
                            name: en,
                            value: v.en,
                        };
                    }
                }
            }

            return {
                name: en,
                value: undefined,
            };
        }
        return undefined;
    }

    /**
     * 翻译 attribute name.
     */
    public transAttrName(name: string): string | undefined {
        return this.transAttr(name, undefined)?.name;
    }

    /**
     * 翻译 name 和 basetype。
     *
     * 对于传奇物品、稀有物品，name 和 basetype 是同时存在的，但是所有稀有物品的 name 目前不支持翻译，统一返回默认值`Item`。
     * 对于魔法和普通物品，其 json 数据的 name 为 `""`，因此这里也返回空字符串；其 json 数据包括basetype。
     * 对于魔法和普通物品，其 text 数据不包括 name 和 basetype，参考`transTypeLine()`的文档说明。
     *
     * 可能存在同名的 basetype，传奇物品可以使用使用 name 来进行鉴别，否则返回第一个。
     */
    public transNameAndBaseType(
        name: string,
        baseType: string,
    ): { name: string; baseType: string } | undefined {
        const baseTypes = this.baseTypeProvider.provideByZh(baseType);
        if (baseTypes === undefined) {
            return undefined;
        }

        if (name.length > 0) {
            const result = this.findUnique(baseTypes, name);
            if (result) {
                return { name: result.u.en, baseType: result.b.en };
            }
            // rare
            return { name: DEFAULT_RARY_ITEM_NAME, baseType: baseTypes[0].en };
        }
        //magic or normal
        return { name, baseType: baseTypes[0].en };
    }

    findUnique(
        baseTypes: BaseType[],
        name: string,
    ): { b: BaseType; u: Unique } | undefined {
        for (const b of baseTypes) {
            if (b.uniques) {
                for (const u of b.uniques) {
                    if (u.zh === name) {
                        return { b, u };
                    }
                }
            }
        }
        return undefined;
    }

    /**
     * 翻译 basetype。
     *
     * 可能存在同名的 basetype，返回第一个。
     */
    public transBaseType(baseType: string): string | undefined {
        if (!baseType) {
            return undefined;
        }
        return this.baseTypeProvider.provideByZh(baseType)?.[0].en;
    }

    /**
     * 根据 typeline 推测并返回 BaseType。
     *
     * name 用于匹配传奇，如果没有，返回首个匹配的 BaseType。
     */
    findBaseTypeByTypeLine(
        typeLine: string,
        name?: string,
    ): BaseType | undefined {
        if (typeLine.startsWith(ZH_SUPERIOR_PREFIX)) {
            typeLine = typeLine.substring(ZH_SUPERIOR_PREFIX.length);
        }

        if (typeLine.startsWith(ZH_SYNTHESISED_PREFIX)) {
            typeLine = typeLine.substring(ZH_SYNTHESISED_PREFIX.length);
        }

        let firstMatch: BaseType | undefined = undefined;

        const match = (baseTypes: BaseType[]) => {
            if (!firstMatch) {
                firstMatch = baseTypes[0];
            }

            if (name) {
                const result = this.findUnique(baseTypes, name);
                if (result) {
                    return result.b;
                }
            } else {
                return baseTypes[0];
            }
        };

        //不带前缀的 typeline 可能是 basetype
        const baseTypes = this.baseTypeProvider.provideByZh(typeLine);
        if (baseTypes) {
            const result = match(baseTypes);
            if (result) {
                return result;
            }
        }

        //处理修饰词存在的情况:
        //如“显著的幼龙之大型星团珠宝”，其修饰词为：“显著的”、“幼龙之”，其zhBaseType为“大型星团珠宝”。
        //
        //修饰词以`的`、`之`结尾，但`的`、`之`同时可能出现在 basetype 中，如`潜能之戒`。
        //我们可以逐步去除修饰词，来检测剩余部分是否是一个 basetype 。
        const pattern = /.+?[之的]/gu;
        if (pattern.test(typeLine)) {
            //因为之前使用了 pattern.test()，需要重置 pattern 的状态
            pattern.lastIndex = 0;

            let lastIndex = 0;
            while (lastIndex < typeLine.length) {
                const matches = pattern.exec(typeLine);
                if (matches) {
                    lastIndex = pattern.lastIndex;
                    const possible = typeLine.substring(lastIndex);
                    const baseTypes =
                        this.baseTypeProvider.provideByZh(possible);
                    if (baseTypes) {
                        const result = match(baseTypes);
                        if (result) {
                            return result;
                        }
                    }
                } else {
                    const possible = typeLine.substring(pattern.lastIndex);
                    const baseTypes =
                        this.baseTypeProvider.provideByZh(possible);
                    if (baseTypes) {
                        const result = match(baseTypes);
                        if (result) {
                            return result;
                        }
                    }
                    break;
                }
            }
        }

        return firstMatch;
    }

    /**
     * 翻译 name 和 typeline。
     *
     * typeline 是 basetype 加上一些修饰词。修饰词可以分为两类，一类是 `意境` 和 `精良的`，一类是与物品词缀相关的修饰词。
     *
     * 第一类修饰词出现在所有相关物品上，不区分稀有度，第二类修饰词仅出现在魔法物品上。
     *
     * 由于第二类修饰词对于POB而言是没有什么作用的，且维护比较麻烦，这里仅支持第一类修饰词的翻译。
     *
     * 该方法仅用于文本翻译，用于传奇物品和稀有物品的翻译。翻译魔法和普通物品，使用 tranTypeLine 方法。
     *
     * @returns {name, typeline} 翻译结果。
     * @returns undefined，没有匹配的 basetype。
     */
    public transNameAndTypeLine(
        name: string,
        typeLine: string,
    ): { name: string; typeLine: string } | undefined {
        let typeLinePrefix = "";
        if (typeLine.startsWith(ZH_SUPERIOR_PREFIX)) {
            typeLine = typeLine.substring(ZH_SUPERIOR_PREFIX.length);
            typeLinePrefix += SUPERIOR_PREFIX;
        }

        if (typeLine.startsWith(ZH_SYNTHESISED_PREFIX)) {
            typeLine = typeLine.substring(ZH_SYNTHESISED_PREFIX.length);
            typeLinePrefix += SYNTHESISED_PREFIX;
        }

        const baseType = this.findBaseTypeByTypeLine(typeLine, name);
        if (baseType) {
            if (baseType.uniques) {
                for (const u of baseType.uniques) {
                    if (u.zh === name) {
                        return {
                            name: u.en,
                            typeLine: typeLinePrefix + baseType.en,
                        };
                    }
                }
            }
            return {
                name: DEFAULT_RARY_ITEM_NAME,
                typeLine: typeLinePrefix + baseType.en,
            };
        }

        return undefined;
    }

    public transTypeLine(typeLine: string): string | undefined {
        let typeLinePrefix = "";
        if (typeLine.startsWith(ZH_SUPERIOR_PREFIX)) {
            typeLine = typeLine.substring(ZH_SUPERIOR_PREFIX.length);
            typeLinePrefix += SUPERIOR_PREFIX;
        }

        if (typeLine.startsWith(ZH_SYNTHESISED_PREFIX)) {
            typeLine = typeLine.substring(ZH_SYNTHESISED_PREFIX.length);
            typeLinePrefix += SYNTHESISED_PREFIX;
        }

        const baseType = this.findBaseTypeByTypeLine(typeLine, undefined);
        if (baseType) {
            return typeLinePrefix + baseType.en;
        }

        return undefined;
    }

    formatGemZh(zh: string): string {
        return zh.replace("(", "（").replace(")", "）");
    }

    public transGem(name: string): string | undefined {
        return this.gemProvider.provideSkill(this.formatGemZh(name))?.en;
    }

    public transGemProp(name: string): string | undefined {
        return GEM_PROPERTY_MAP.get(name);
    }

    public transNotable(name: string): string | undefined {
        return this.passiveSkillProvider.provideNotableByZh(name)?.en;
    }

    public transKeystone(name: string): string | undefined {
        return this.passiveSkillProvider.provideKeystoneByZh(name)?.en;
    }

    public transAscendant(zh: string): string | undefined {
        return this.passiveSkillProvider.provideAscendantByZh(zh)?.en;
    }

    /**
     * 翻译 property 。
     */
    public transProp(
        name: string,
        value: string,
    ): { name: string; value?: string } | undefined {
        const prop = this.propertyProvider.provideProperty(name);
        if (prop) {
            if (prop.values) {
                for (const v of prop.values) {
                    if (value === v.zh) {
                        return {
                            name: prop.en,
                            value: v.en,
                        };
                    }
                }
            }
            return {
                name: prop.en,
            };
        }

        return undefined;
    }

    /**
     * 翻译 property name.
     *
     * 这个方法目前主要用于文本翻译，这是因为这个方法引入了 `动态` property name的概念。
     *
     * 比如`武器范围：1.3 米`，这个文本片段使用了中文符号`：`，而一般的 name:value 的分隔符为英文符号`:`。
     * 因此相比将其解析为 `name:value`，还不如将其整体解析为一个 name 省事。
     *
     * 其中 `1.3` 是动态值，因此这个文本片段需要动态翻译为英文。
     *
     * json 数据不存在类似的概念，这个例子在 json 中的数据是这样：
     *
     * {name: "武器范围：{0} 米", values: [["1.1", 0]], displayMode: 3, type: 14}
     *
     * name和value是分隔的，只需要静态翻译 name。
     */
    public transPropName(name: string): string | undefined {
        const prop = this.propertyProvider.provideProperty(name);
        if (prop) {
            return prop.en;
        }

        const props = this.propertyProvider.provideVariablePropertiesByZhBody(
            getTextBody(name),
        );
        if (props) {
            for (const prop of props) {
                const zhTmpl = new Template(prop.zh);
                const posParams = zhTmpl.parseParams(name);
                //does not match
                if (posParams === undefined) {
                    continue;
                }

                const enTmpl = new Template(prop.en);
                return enTmpl.render(posParams);
            }
        }

        return undefined;
    }

    /**
     * 翻译 requirement。
     */
    public transReq(
        name: string,
        value: string,
    ): { name: string; value?: string } | undefined {
        const r = this.requirementProvider.provideByZh(name);
        if (r) {
            if (r.values) {
                for (const v of r.values) {
                    if (v.zh === value) {
                        return { name: r.en, value: v.en };
                    }
                }
            }
            return {
                name: r.en,
            };
        }

        return undefined;
    }

    /**
     * 翻译 requirement name。
     */
    public transReqName(zhName: string): string | undefined {
        const r = this.requirementProvider.provideByZh(zhName);
        return r?.en;
    }

    /**
     * 翻译 requirement suffix。
     */
    public transReqSuffix(suffix: string): string | undefined {
        const s = this.requirementProvider.provideSuffixByZh(suffix);
        return s?.en;
    }

    /**
     * 翻译词缀
     */
    public transMod(zhMod: string): string | undefined {
        if (this.isAnointedMod(zhMod)) {
            return this.transAnointedMod(zhMod);
        }

        if (this.isForbiddenFlameMod(zhMod)) {
            return this.transForbiddenFlameMod(zhMod);
        }

        if (this.isForbiddenFleshMod(zhMod)) {
            return this.transForbiddenFleshMod(zhMod);
        }

        if (this.isEldritchImplicitMod(zhMod)) {
            return this.transEldritchImplicitMod(zhMod);
        }

        return this.transModInner(zhMod);
    }

    transModInner(zhMod: string): string | undefined {
        const body = getTextBody(zhMod);
        const stats = this.statProvider.provideStatsByZhBody(body);

        if (stats) {
            for (const stat of stats) {
                const result = this.doTranslateMod(stat, zhMod);
                if (result) {
                    return result;
                }
            }
        }

        return undefined;
    }

    isAnointedMod(zhMod: string): boolean {
        return ZH_ANOINTED_MOD_REGEXP.test(zhMod);
    }

    transAnointedMod(zhMod: string): string | undefined {
        const matches = ZH_ANOINTED_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhNotable = matches[1];
            const notable = this.transNotable(zhNotable);
            if (notable) {
                return `Allocates ${notable}`;
            }
        }
        return undefined;
    }

    isForbiddenFlameMod(zhMod: string): boolean {
        return ZH_FORBIDDEN_FLAME_MOD_REGEXP.test(zhMod);
    }

    transForbiddenFlameMod(zhMod: string): string | undefined {
        const matches = ZH_FORBIDDEN_FLAME_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhAscendant = matches[1];
            const ascendant = this.transAscendant(zhAscendant);
            if (ascendant) {
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flame`;
            }
        }

        return undefined;
    }

    isForbiddenFleshMod(zhMod: string): boolean {
        return ZH_FORBIDDEN_FLESH_MOD_REGEXP.test(zhMod);
    }

    transForbiddenFleshMod(zhMod: string): string | undefined {
        const matches = ZH_FORBIDDEN_FLESH_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhAscendant = matches[1];
            const ascendant = this.transAscendant(zhAscendant);
            if (ascendant) {
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flesh`;
            }
        }
        return undefined;
    }

    isEldritchImplicitMod(zhMod: string): boolean {
        return (
            zhMod.startsWith(ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE) ||
            zhMod.startsWith(ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE)
        );
    }

    transEldritchImplicitMod(zhMod: string): string | undefined {
        if (zhMod.startsWith(ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE)) {
            const subMod = this.transMod(
                zhMod.substring(ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE.length),
            );
            if (subMod) {
                return EN_UNIQUE_ENEMY_IN_YOUR_PRESENCE + subMod;
            }
        } else if (zhMod.startsWith(ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE)) {
            const subMod = this.transMod(
                zhMod.substring(ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE.length),
            );
            if (subMod) {
                return EN_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENCE + subMod;
            }
        }

        return undefined;
    }

    doTranslateMod(stat: Stat, zhMod: string): string | undefined {
        if (zhMod === stat.zh) {
            return stat.en;
        }

        const zhTmpl = new Template(stat.zh);
        const posParams = zhTmpl.parseParams(zhMod);
        //does not match
        if (posParams === undefined) {
            return undefined;
        }

        const enTmpl = new Template(stat.en);

        return enTmpl.render(posParams);
    }

    public getMaxLinesOfMultilineMod(firstLine: string): number {
        const body = getTextBody(firstLine);
        const entry =
            this.statProvider.provideMultilineStatsByFirstLinesZhBody(body);
        if (entry) {
            return entry.maxLines;
        }

        return 0;
    }

    /**
     * 翻译 multiline mod。
     *
     * 该方法主要用于文本翻译。物品文本无法判断 mulitline mod 的结束行，因此调用者需要先调用 getMaxLinesOfMultilineMod 获得
     * 以目标首行为首的 mulitline mod 的最大可能行数，然后调用时，传递相应行数的 lines。
     *
     * 可能存在一种情况，需要判断的行数小于 getMaxLinesOfMultilineMod 的结果，那么传递剩余的行数即可。
     *
     * 本方法基于贪婪原则，推断 lines 中可能存在的以首行为首的 multiline mod。
     *
     * @returns {result,lines}, result是multiline mod的翻译结果, lines是 multiline mod 的行数。
     * @returns undefined, 没有匹配的 multiline mod。
     */
    public transMultilineMod(
        lines: string[],
    ): { result: string; lineCount: number } | undefined {
        const firstLineBody = getTextBody(lines[0]);
        const entry =
            this.statProvider.provideMultilineStatsByFirstLinesZhBody(
                firstLineBody,
            );
        if (entry === undefined) {
            return;
        }

        for (const multilineStat of entry.stats) {
            const lineSize = multilineStat.lineSize;
            if (multilineStat.lineSize > lines.length) {
                continue;
            }
            const stat = multilineStat.stat;
            const mod = lines.slice(0, lineSize).join(LINE_SEPARATOR);

            if (getTextBody(stat.zh) === getTextBody(mod)) {
                const result = this.doTranslateMod(stat, mod);
                if (result) {
                    return {
                        result: result,
                        lineCount: lineSize,
                    };
                }
            }
        }

        return undefined;
    }
}
