import { Property } from "../type/property.type.js";

export class PropertyProvider {
    private readonly propertyIndexByZhName = new Map<string, Property>();

    constructor(propertyList: Property[]) {
        for (const p of propertyList) {
            const zh = p.zh;
            this.propertyIndexByZhName.set(zh, p);
        }
    }

    public provideProperty(zhName: string): Property | undefined {
        return this.propertyIndexByZhName.get(zhName);
    }
}
