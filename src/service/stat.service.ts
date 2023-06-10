import { StatProvider } from "../provider/stat.provider.js";
import { COMPOUNDED_STAT_LINE_SEPARATOR, Stat } from "../type/stat.type.js";
import { StatUtil, Template } from "../util/stat.util.js";
import { PassiveSkillService } from "./passiveskill.service.js";

const ZH_ANOINTED_MOD_REGEXP = /^配置 (.+)$/;
const ZH_FORBIDDEN_FLESH_MOD_REGEXP = /^禁断之火上有匹配的词缀则配置 (.+)$/;
const ZH_FORBIDDEN_FLAME_MOD_REGEXP = /^禁断之肉上有匹配的词缀则配置 (.+)$/;

const ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE = "有一个传奇怪物出现在你面前：";
const EN_UNIQUE_ENEMY_IN_YOUR_PRESENCE = "While a Unique Enemy is in your Presence, ";
const ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENC = "有一个异界图鉴最终首领出现在你面前：";
const EN_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENC = "While a Pinnacle Atlas Boss is in your Presence, ";

export class StatService {
    private readonly passiveSkillService: PassiveSkillService;
    private readonly statProvider: StatProvider;

    constructor(passiveSkillService: PassiveSkillService, statProvider: StatProvider) {
        this.passiveSkillService = passiveSkillService;
        this.statProvider = statProvider;
    }

    public translateMod(zhMod: string): string | undefined {
        if (this.isAnointedMod(zhMod)) {
            return this.translateAnointedMod(zhMod);
        }

        if (this.isForbiddenFlameMod(zhMod)) {
            return this.translateForbiddenFlameMod(zhMod);
        }

        if (this.isForbiddenFleshMod(zhMod)) {
            return this.translateForbiddenFleshMod(zhMod);
        }

        if (this.isEldritchImplicitMod(zhMod)) {
            return this.translateEldritchImplicitMod(zhMod);
        }

        return this.translateModInner(zhMod);
    }

    translateModInner(zhMod: string): string | undefined {
        const body = StatUtil.getBodyOfZhModifier(zhMod);
        const stats = this.statProvider.provideStatsByZhBody(body);

        if (stats !== undefined) {
            for (const stat of stats) {
                const result = this.dotranslateMod(stat, zhMod);
                if (result !== undefined) {
                    return result;
                }
            }
        }

        return undefined;
    }

    isAnointedMod(zhMod: string): boolean {
        return ZH_ANOINTED_MOD_REGEXP.test(zhMod);
    }

    translateAnointedMod(zhMod: string): string | undefined {
        const matches = ZH_ANOINTED_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhNoteable = matches[1];
            const notable = this.passiveSkillService.translateNotable(zhNoteable);
            if (notable !== undefined) {
                return `Allocates ${notable}`;
            }
        }
        return undefined;
    }

    isForbiddenFlameMod(zhMod: string): boolean {
        return ZH_FORBIDDEN_FLAME_MOD_REGEXP.test(zhMod);
    }

    translateForbiddenFlameMod(zhMod: string): string | undefined {
        const matches = ZH_FORBIDDEN_FLAME_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhAscendant = matches[1];
            const ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
            if (ascendant !== undefined) {
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flesh`;
            }
        }

        return undefined;
    }

    isForbiddenFleshMod(zhMod: string): boolean {
        return ZH_FORBIDDEN_FLESH_MOD_REGEXP.test(zhMod);
    }

    translateForbiddenFleshMod(zhMod: string): string | undefined {
        const matches = ZH_FORBIDDEN_FLESH_MOD_REGEXP.exec(zhMod);
        if (matches !== null) {
            const zhAscendant = matches[1];
            const ascendant = this.passiveSkillService.translateAscendant(zhAscendant);
            if (ascendant !== undefined) {
                return `Allocates ${ascendant} if you have the matching modifier on Forbidden Flame`;
            }
        }
        return undefined;
    }

    isEldritchImplicitMod(zhMod: string): boolean {
        return (
            zhMod.startsWith(ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE) ||
            zhMod.startsWith(ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENC)
        );
    }

    translateEldritchImplicitMod(zhMod: string): string | undefined {
        if (zhMod.startsWith(ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE)) {
            const subMod = this.translateMod(
                zhMod.substring(ZH_UNIQUE_ENEMY_IN_YOUR_PRESENCE.length)
            );
            if (subMod !== undefined) {
                return EN_UNIQUE_ENEMY_IN_YOUR_PRESENCE + subMod;
            }
        } else if (zhMod.startsWith(ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENC)) {
            const subMod = this.translateMod(
                zhMod.substring(ZH_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENC.length)
            );
            if (subMod !== undefined) {
                return EN_PINNACLE_ATLAS_BOSS_IN_YOUR_PRESENC + subMod;
            }
        }

        return undefined;
    }

    dotranslateMod(stat: Stat, zhMod: string): string | undefined {
        if (zhMod === stat.zh) {
            return stat.en;
        }

        const zhTpl = new Template(stat.zh);
        const posParams = zhTpl.parseParams(zhMod);
        //does not match
        if (posParams === undefined) {
            return undefined;
        }

        const enTpl = new Template(stat.en);

        return enTpl.render(posParams);
    }

    public getMaxLineSizeOfCompoundedMod(firstLine: string): number {
        const body = StatUtil.getBodyOfZhModifier(firstLine);
        const entry = this.statProvider.providecompoundedStatsByFirstLinesZhBody(body);
        if (entry !== undefined) {
            return entry.maxLineSize;
        }

        return 0;
    }

    /**
     * Translate compounded mod for text item.
     *
     * Caller should use `getMaxLineSizeOfCompoundedMod` before to get the max lines of candidates which has the first line.
     *
     * The method uses the `lines` to infer a compounded mod, returns the translation.
     */
    public translateCompoundedMod(
        lines: string[]
    ): { result: string; lineSize: number } | undefined {
        const body = StatUtil.getBodyOfZhModifier(lines[0]);
        const entry = this.statProvider.providecompoundedStatsByFirstLinesZhBody(body);
        if (entry === undefined) {
            return;
        }

        for (const compoundedStat of entry.stats) {
            const lineSize = compoundedStat.lineSize;
            if (compoundedStat.lineSize > lines.length) {
                continue;
            }
            const stat = compoundedStat.stat;
            const mod = lines.slice(0, lineSize).join(COMPOUNDED_STAT_LINE_SEPARATOR);

            if (StatUtil.getBodyOfZhTemplate(stat.zh) === StatUtil.getBodyOfZhModifier(mod)) {
                const result = this.dotranslateMod(stat, mod);
                if (result !== undefined) {
                    return {
                        result: result,
                        lineSize: lineSize,
                    };
                }
            }
        }

        return undefined;
    }
}
