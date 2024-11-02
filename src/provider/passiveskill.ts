import { Node } from "../type/passive_skills.js";

export class PassiveSkillProvider {
    private readonly notablesZhIdx = new Map<string, Node>();
    private readonly keystonesZhIdx = new Map<string, Node>();
    private readonly ascendantsZhIdx = new Map<string, Node>();

    constructor(notables: Node[], keystones: Node[], ascendants: Node[]) {
        for (const node of notables) {
            this.notablesZhIdx.set(node.zh, node);
        }

        for (const node of keystones) {
            this.keystonesZhIdx.set(node.zh, node);
        }

        for (const node of ascendants) {
            this.ascendantsZhIdx.set(node.zh, node);
        }
    }

    public provideNotableByZh(zh: string): Node | undefined {
        return this.notablesZhIdx.get(zh);
    }

    public provideKeystoneByZh(zh: string): Node | undefined {
        return this.keystonesZhIdx.get(zh);
    }

    public provideAscendantByZh(zh: string): Node | undefined {
        return this.ascendantsZhIdx.get(zh);
    }
}
