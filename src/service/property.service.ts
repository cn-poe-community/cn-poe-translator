import { PropertyProvider } from "../provider/property.provider.js";
import { StatUtil, Template } from "../util/stat.util.js";

export class PropertyService {
    private readonly propProvider: PropertyProvider;

    constructor(propProvider: PropertyProvider) {
        this.propProvider = propProvider;
    }

    public translate(
        zhName: string,
        zhValue: string
    ): { name: string; value?: string } | undefined {
        const prop = this.propProvider.provideProperty(zhName);
        if (prop !== undefined) {
            if (prop.values !== undefined) {
                for (const v of prop.values) {
                    if (zhValue === v.zh) {
                        return {
                            name: prop.en,
                            value: v.en,
                        };
                    }
                }
            }
            return {
                name: prop.en,
            };
        }

        return undefined;
    }

    public translateName(zhName: string): string | undefined {
        let prop = this.propProvider.provideProperty(zhName);
        if (prop !== undefined) {
            return prop.en;
        }

        prop = this.propProvider.provideVariablePropertyByZhBody(
            StatUtil.getBodyOfZhModifier(zhName)
        );
        if (prop !== undefined) {
            const zhTmpl = new Template(prop.zh);
            const posParams = zhTmpl.parseParams(zhName);
            //does not match
            if (posParams === undefined) {
                return undefined;
            }

            const enTmpl = new Template(prop.en);

            return enTmpl.render(posParams);
        }

        return undefined;
    }
}
