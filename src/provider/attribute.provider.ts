import { Attribute } from "../type/attribute.type.js";

export class AttributeProvider {
    private readonly attrIndexedByZhName = new Map<string, Attribute>();

    constructor(attrList: Attribute[]) {
        for (const p of attrList) {
            const zh = p.zh;
            this.attrIndexedByZhName.set(zh, p);
        }
    }

    public provideAttribute(zhName: string): Attribute | undefined {
        return this.attrIndexedByZhName.get(zhName);
    }
}
