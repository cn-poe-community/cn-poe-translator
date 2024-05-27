import { Property } from "../type/property.type.js";
import { StatUtil } from "../util/stat.util.js";

const VARIABLE_MARK = "{0}";

export class PropertyProvider {
    private readonly propertyIndexedByZhName = new Map<string, Property>();
    private readonly variablePropertyIndexedByZhBody = new Map<string, Property>();

    constructor(propertyList: Property[]) {
        for (const p of propertyList) {
            const zh = p.zh;
            this.propertyIndexedByZhName.set(zh, p);

            if (zh.includes(VARIABLE_MARK)) {
                this.variablePropertyIndexedByZhBody.set(StatUtil.getBodyOfZhTemplate(zh), p);
            }
        }
    }

    public provideProperty(zhName: string): Property | undefined {
        return this.propertyIndexedByZhName.get(zhName);
    }

    public provideVariablePropertyByZhBody(zhBody: string): Property | undefined {
        return this.variablePropertyIndexedByZhBody.get(zhBody);
    }
}
