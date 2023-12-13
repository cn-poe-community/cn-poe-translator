import { Gem, Skill } from "../type/gem.type.js";

export class GemProvider {
    private readonly skillsIndexedByZh = new Map<string, Skill>();

    constructor(gems: Gem[], hybridSkills: Skill[]) {
        for (const gem of gems) {
            this.skillsIndexedByZh.set(gem.zh, gem);
        }
        for (const skill of hybridSkills) {
            this.skillsIndexedByZh.set(skill.zh, skill);
        }
    }

    public provideSkill(zh: string): Skill | undefined {
        return this.skillsIndexedByZh.get(zh);
    }
}
