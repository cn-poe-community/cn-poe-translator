import requirements from "../asset/requirements.json";
import suffixes from "../asset/requirement_suffixes.json";
import { Requirement, Suffix } from "../type/requirement.type";

export class RequirementProvider {
    private readonly requirementsIndexedByZh = new Map<string, Requirement>();
    private readonly suffixesIndexedByZh = new Map<string, Suffix>();

    constructor() {
        const requirementList = requirements as unknown as Array<Requirement>;
        for (const r of requirementList) {
            const zh = r.zh;
            this.requirementsIndexedByZh.set(zh, r);
        }

        const suffixList = suffixes as unknown as Array<Suffix>;
        for (const s of suffixList) {
            const zh = s.zh;
            this.suffixesIndexedByZh.set(zh, s);
        }
    }

    public provideRequirement(zh: string): Requirement | undefined {
        return this.requirementsIndexedByZh.get(zh);
    }

    public provideSuffix(zh: string): Suffix | undefined {
        return this.suffixesIndexedByZh.get(zh);
    }
}
