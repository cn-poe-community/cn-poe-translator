import { Gem, Skill } from "../type/gem.js";

export class GemProvider {
    private readonly zhIdx = new Map<string, Skill>();

    constructor(gems: Gem[], hybridSkills: Skill[]) {
        for (const gem of gems) {
            this.zhIdx.set(gem.zh, gem);
        }
        for (const skill of hybridSkills) {
            this.zhIdx.set(skill.zh, skill);
        }
    }

    public provideSkill(zh: string): Skill | undefined {
        return this.zhIdx.get(zh);
    }
}
