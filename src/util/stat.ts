import { escapeRegExp } from "./text.js";

export const LINE_SEPARATOR = "\n";

/**
 * 返回文本（stat,mod）的骨架，以用于索引。
 */
export function getTextBody(text: string): string {
    return text.replace(/[{}\d.+-]/gu, "");
}

/**
 *
 * 模板，可以将 stat 解析为段和位置参数占位符。
 *
 * 例如:
 * "Chain Hook has a {0}% chance to grant +1 Rage if it Hits Enemies"
 *
 *   段: ["Chain Hook has a ", "% chance to grant +1 Rage if it Hits Enemies"]
 *   位置参数占位符: [0]
 */
export class Template {
    text: string;
    segments: string[];
    paramNumbers: number[]; //positional parameter numbers

    constructor(text: string) {
        this.text = text;
        this.segments = [];
        this.paramNumbers = [];

        let j = 0;
        let k = 0;
        let onParam = false;
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if (code === 123) {
                // "{"
                k = i;
                onParam = true;
            } else if (code === 125) {
                // "}"
                if (onParam) {
                    this.segments.push(text.slice(j, k));
                    this.paramNumbers.push(
                        Number.parseInt(text.slice(k + 1, i)),
                    );
                    j = i + 1;
                    onParam = false;
                }
            } else {
                if (onParam) {
                    if (code < 48 || code > 57) {
                        // out of "0"~"9"
                        onParam = false;
                    }
                }
            }
        }
        this.segments.push(text.slice(j));
    }

    /**
     * parseParams 解析 mod 并返回位置参数与实际参数的映射。
     * @param mod 词缀
     * @returns 位置参数到实际参数的映射表，如果词缀不匹配当前模板，返回 undefined。
     */
    public parseParams(mod: string): Map<number, string> | undefined {
        const regStr = `^${this.segments.map((s) => escapeRegExp(s)).join("(\\S+)")}$`;
        const execResult = new RegExp(regStr).exec(mod);

        if (!execResult) {
            return undefined;
        }

        const paramList = execResult.slice(1, this.paramNumbers.length + 1);

        const paramMap = new Map<number, string>();
        for (const [i, num] of this.paramNumbers.entries()) {
            paramMap.set(num, paramList[i]);
        }

        return paramMap;
    }

    /**
     * 使用实际参数渲染模板。
     * @param params 位置参数到实际参数的映射表。
     */
    public render(params: Map<number, string>): string {
        const buf = new Array<string>(
            this.segments.length + this.paramNumbers.length,
        );
        let j = 0;
        for (let i = 0; i < this.paramNumbers.length; i++) {
            buf[j++] = this.segments[i];
            const paramValue = params.get(this.paramNumbers[i]);
            buf[j++] = paramValue ? paramValue : `{${i}}`;
        }

        buf[j] = this.segments[this.segments.length - 1];

        return buf.join("");
    }
}
