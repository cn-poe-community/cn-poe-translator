import { Property } from "../type/property.type.js";
import { StatUtil } from "../util/stat.util.js";

const VARIABLE_MARK = "{0}";

export class PropertyProvider {
    private readonly propertyZhNameIdx = new Map<string, Property>();
    private readonly variablePropertyZhBodyIdx = new Map<string, Property[]>();

    constructor(propertyList: Property[]) {
        for (const p of propertyList) {
            const zh = p.zh;
            this.propertyZhNameIdx.set(zh, p);

            if (zh.includes(VARIABLE_MARK)) {
                const zhBody = StatUtil.getBodyOfZhTemplate(zh);
                const value = this.variablePropertyZhBodyIdx.get(zhBody);
                if (value !== undefined) {
                    value.push(p);
                } else {
                    this.variablePropertyZhBodyIdx.set(StatUtil.getBodyOfZhTemplate(zh), [p]);
                }
            }
        }
    }

    public provideProperty(zhName: string): Property | undefined {
        return this.propertyZhNameIdx.get(zhName);
    }

    public provideVariablePropertiesByZhBody(zhBody: string): Property[] | undefined {
        return this.variablePropertyZhBodyIdx.get(zhBody);
    }
}
