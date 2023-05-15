import { GemProvider } from "../provider/gem.provider.js";

const QUALITY_TYPES = new Map([
    ["分歧", "Divergent"],
    ["异常", "Anomalous"],
    ["魅影", "Phantasmal"],
]);

const PROPERTY_NAMES = new Map([
    ["等级", "Level"],
    ["品质", "Quality"],
]);

export class GemService {
    constructor(private readonly gemProvider: GemProvider) {}

    public translateBaseType(zhBaseType: string): string | undefined {
        zhBaseType = zhBaseType.replace("(", "（").replace(")", "）");
        return this.gemProvider.provideSkill(zhBaseType)?.en;
    }

    public translateTypeLine(zhTypeLine: string): string | undefined {
        let qualityTypePrefix = "";
        let zhSkill = zhTypeLine;
        for (const [zh, en] of QUALITY_TYPES) {
            const prefix = `${zh} `;
            if (zhSkill.startsWith(prefix)) {
                qualityTypePrefix = `${en} `;
                zhSkill = zhTypeLine.substring(prefix.length);
                break;
            }
        }

        const skill = this.translateBaseType(zhSkill);
        return skill !== undefined ? `${qualityTypePrefix}${skill}` : undefined;
    }

    public translatePropertyName(zhName: string): string | undefined {
        if (PROPERTY_NAMES.has(zhName)) {
            return PROPERTY_NAMES.get(zhName);
        }

        return undefined;
    }
}
