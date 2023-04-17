import { BaseType } from "../type/basetype.type";

export class BaseTypeProvider {
    private readonly baseTypesIndexedByZh = new Map<string, BaseType[]>();
    private readonly baseTypesIndexedByUniqueZh = new Map<string, BaseType[]>();

    constructor(baseTypesList: BaseType[][]) {
        for (const baseTypeList of baseTypesList) {
            for (const baseType of baseTypeList) {
                const zh = baseType.zh;

                if (this.baseTypesIndexedByZh.has(zh)) {
                    this.baseTypesIndexedByZh.get(zh)?.push(baseType);
                } else {
                    this.baseTypesIndexedByZh.set(zh, [baseType]);
                }

                const uniques = baseType.uniques;
                for (const unique of uniques) {
                    const zh = unique.zh;
                    if (zh in this.baseTypesIndexedByUniqueZh) {
                        this.baseTypesIndexedByUniqueZh.get(zh)?.push(baseType);
                    } else {
                        this.baseTypesIndexedByUniqueZh.set(zh, [baseType]);
                    }
                }
            }
        }
    }

    public provideBaseTypesByZh(zh: string): BaseType[] | undefined {
        const entries = this.baseTypesIndexedByZh.get(zh);

        return entries;
    }
}
