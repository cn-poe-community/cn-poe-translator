import {
    Requirement,
    RequirementSuffix as RequirementSuffix,
} from "../type/requirement.js";

export class RequirementProvider {
    private readonly zhIdx = new Map<string, Requirement>();
    private readonly suffixesZhIdx = new Map<string, RequirementSuffix>();

    constructor(
        requirementList: Requirement[],
        suffixList: RequirementSuffix[],
    ) {
        for (const r of requirementList) {
            const zh = r.zh;
            this.zhIdx.set(zh, r);
        }

        for (const s of suffixList) {
            const zh = s.zh;
            this.suffixesZhIdx.set(zh, s);
        }
    }

    public provideByZh(zh: string): Requirement | undefined {
        return this.zhIdx.get(zh);
    }

    public provideSuffixByZh(zh: string): RequirementSuffix | undefined {
        return this.suffixesZhIdx.get(zh);
    }
}
