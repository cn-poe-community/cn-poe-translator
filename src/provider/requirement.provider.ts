import { Requirement, RequirementSuffix as RequirementSuffix } from "../type/requirement.type.js";

export class RequirementProvider {
    private readonly requirementsIndexedByZh = new Map<string, Requirement>();
    private readonly suffixesIndexedByZh = new Map<string, RequirementSuffix>();

    constructor(requirementList: Requirement[], suffixList: RequirementSuffix[]) {
        for (const r of requirementList) {
            const zh = r.zh;
            this.requirementsIndexedByZh.set(zh, r);
        }

        for (const s of suffixList) {
            const zh = s.zh;
            this.suffixesIndexedByZh.set(zh, s);
        }
    }

    public provideRequirement(zh: string): Requirement | undefined {
        return this.requirementsIndexedByZh.get(zh);
    }

    public provideSuffix(zh: string): RequirementSuffix | undefined {
        return this.suffixesIndexedByZh.get(zh);
    }
}
