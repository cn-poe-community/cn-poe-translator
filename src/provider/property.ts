import { Property } from "../type/property.js";
import { getTextBody } from "../util/stat.js";

const VARIABLE_MARK = "{0}";

export class PropertyProvider {
    private readonly zhIdx = new Map<string, Property>();
    private readonly zhBodyIdx = new Map<string, Property[]>();

    constructor(propertyList: Property[]) {
        for (const p of propertyList) {
            const zh = p.zh;
            this.zhIdx.set(zh, p);

            if (zh.includes(VARIABLE_MARK)) {
                const zhBody = getTextBody(zh);
                const value = this.zhBodyIdx.get(zhBody);
                if (value) {
                    value.push(p);
                } else {
                    this.zhBodyIdx.set(getTextBody(zh), [p]);
                }
            }
        }
    }

    public provideProperty(zh: string): Property | undefined {
        return this.zhIdx.get(zh);
    }

    public provideVariablePropertiesByZhBody(
        zhBody: string,
    ): Property[] | undefined {
        return this.zhBodyIdx.get(zhBody);
    }
}
