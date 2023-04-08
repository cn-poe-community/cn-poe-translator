import { RequirementProvider } from "../provider/requirement.provider";

export class RequirementSerivce {
    constructor(private readonly requirementProvider: RequirementProvider) {}

    public translate(
        zhName: string,
        zhValue: string
    ): { name: string; value?: string } | undefined {
        const r = this.requirementProvider.provideRequirement(zhName);
        if (r) {
            if (r.values) {
                for (const v of r.values) {
                    if (v.zh === zhValue) {
                        return { name: r.en, value: v.en };
                    }
                }
            }
            return {
                name: r.en,
            };
        }
    }

    public translateName(zhName: string): string | undefined {
        const r = this.requirementProvider.provideRequirement(zhName);
        if (r) {
            return r.zh;
        }
    }

    public translateSuffix(zhSuffix: string): string | undefined {
        const suffix = this.requirementProvider.provideSuffix(zhSuffix);
        if (suffix) {
            return suffix.en;
        }
    }
}
