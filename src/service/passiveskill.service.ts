import { PassiveSkillProvider } from "../provider/passiveskill.provider.js";

export class PassiveSkillService {
    private readonly passiveSkillProvider: PassiveSkillProvider;

    constructor(passiveSkillProvider: PassiveSkillProvider) {
        this.passiveSkillProvider = passiveSkillProvider;
    }

    public translateNotable(zh: string): string | undefined {
        const node = this.passiveSkillProvider.provideNotableByZh(zh);
        if (node !== undefined) {
            return node.en;
        }

        return undefined;
    }

    public translateKeystone(zh: string): string | undefined {
        const node = this.passiveSkillProvider.provideKeystoneByZh(zh);
        if (node !== undefined) {
            return node.en;
        }

        return undefined;
    }

    public translateAscendant(zh: string): string | undefined {
        const node = this.passiveSkillProvider.provideAscendantByZh(zh);
        if (node !== undefined) {
            return node.en;
        }

        return undefined;
    }
}
