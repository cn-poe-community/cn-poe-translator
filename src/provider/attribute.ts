import { Attribute } from "../type/attribute.js";

export class AttributeProvider {
    private zhIdx = new Map<string, Attribute>();

    constructor(attrList: Attribute[]) {
        for (const p of attrList) {
            const zh = p.zh;
            this.zhIdx.set(zh, p);
        }
    }

    public provideByZh(zh: string): Attribute | undefined {
        return this.zhIdx.get(zh);
    }
}
