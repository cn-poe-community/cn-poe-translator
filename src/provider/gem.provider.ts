import { Gem, Skill } from "../type/gem.type";

export class GemProvider {
    private readonly skillsIndexedByZh = new Map<string, Skill>();

    constructor(gems: Gem[]) {
        for (const gem of gems) {
            const skills = gem.skills;
            for (const skill of skills) {
                this.skillsIndexedByZh.set(skill.zh, skill);
            }
        }
    }

    public provideSkill(zh: string): Skill | undefined {
        return this.skillsIndexedByZh.get(zh);
    }
}
