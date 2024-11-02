import { BaseType } from "../type/base_type.js";

export class BaseTypeProvider {
    private readonly zhIdx = new Map<string, BaseType[]>();

    constructor(baseTypesList: BaseType[][]) {
        for (const baseTypeList of baseTypesList) {
            for (const baseType of baseTypeList) {
                const zh = baseType.zh;

                if (this.zhIdx.has(zh)) {
                    this.zhIdx.get(zh)?.push(baseType);
                } else {
                    this.zhIdx.set(zh, [baseType]);
                }
            }
        }
    }

    public provideByZh(zh: string): BaseType[] | undefined {
        return this.zhIdx.get(zh);
    }
}
