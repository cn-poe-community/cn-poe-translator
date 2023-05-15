import { Node } from "../type/passiveskill.type.js";

export class PassiveSkillProvider {
    private readonly notablesIndexedByZh = new Map<string, Node>();
    private readonly keystonesIndexedByZh = new Map<string, Node>();
    private readonly ascendantIndexedByZh = new Map<string, Node>();

    constructor(notables: Node[], keystones: Node[], ascendants: Node[]) {
        for (const node of notables) {
            this.notablesIndexedByZh.set(node.zh, node);
        }

        for (const node of keystones) {
            this.keystonesIndexedByZh.set(node.zh, node);
        }

        for (const node of ascendants) {
            this.ascendantIndexedByZh.set(node.zh, node);
        }
    }

    public provideNotableByZh(zhName: string): Node | undefined {
        return this.notablesIndexedByZh.get(zhName);
    }

    public provideKeystoneByZh(zhName: string): Node | undefined {
        return this.keystonesIndexedByZh.get(zhName);
    }

    public provideAscendantByZh(zhName: string): Node | undefined {
        return this.ascendantIndexedByZh.get(zhName);
    }
}
