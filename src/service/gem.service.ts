import { GemProvider } from "../provider/gem.provider.js";

const PROPERTY_NAMES = new Map([
    ["等级", "Level"],
    ["品质", "Quality"],
]);

export class GemService {
    constructor(private readonly gemProvider: GemProvider) {}

    public translateBaseType(zhBaseType: string): string | undefined {
        return this.gemProvider.provideSkill(zhBaseType)?.en;
    }

    public translateTypeLine(zhTypeLine: string): string | undefined {
        let zhSkill = zhTypeLine;

        const skill = this.translateBaseType(zhSkill);
        return skill !== undefined ? `${skill}` : undefined;
    }

    public translatePropertyName(zhName: string): string | undefined {
        if (PROPERTY_NAMES.has(zhName)) {
            return PROPERTY_NAMES.get(zhName);
        }

        return undefined;
    }
}
