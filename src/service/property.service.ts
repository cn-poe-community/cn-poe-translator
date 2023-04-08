import { PropertyProvider } from "../provider/property.provider";

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
    }

    public translateName(zhName: string): string | undefined {
        const prop = this.propProvider.provideProperty(zhName);
        if (prop !== undefined) {
            return prop.en;
        }
    }
}
