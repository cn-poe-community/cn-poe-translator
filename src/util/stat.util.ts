import { escapeRegExp } from "./text.util.js";

export class StatUtil {
    public static getBodyOfZhTemplate(template: string): string {
        return this.getNonAsciiOrPer(template);
    }

    public static getBodyOfZhModifier(mod: string): string {
        return this.getNonAsciiOrPer(mod);
    }

    private static getNonAsciiOrPer(str: string): string {
        return str.replace(/[\u{0000}-\u{0024}\u{0026}-\u{007F}]/gu, "");
    }

    public static render(
        enTemplate: string,
        zhTemplate: string,
        zhMod: string
    ): string | undefined {
        if (zhMod === zhTemplate) {
            return enTemplate;
        }

        const enTmpl = new Template(enTemplate);
        const zhTmpl = new Template(zhTemplate);

        const params = zhTmpl.parseParams(zhMod);
        if (params === undefined) {
            return undefined;
        }
        return enTmpl.render(params);
    }
}

/**
 *
 * The template that can be parsed to segments and parameter numbers.
 *
 * Simple:
 * "Chain Hook has a {0}% chance to grant +1 Rage if it Hits Enemies"
 *
 *   segments: ["Chain Hook has a ", "% chance to grant +1 Rage if it Hits Enemies"]
 *   parameter numbers: [0]
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
                    this.paramNumbers.push(Number.parseInt(text.slice(k + 1, i + 1)));
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
     * parseParams parses the modifier and returns positional parameters.
     * @param modifier rendered template result with params
     * @returns map contains positions and parameters ; undefined if the modifier does not match the template.
     */
    public parseParams(modifier: string): Map<number, string> | undefined {
        const regStr = `^${this.segments.map((s) => escapeRegExp(s)).join("(\\S+)")}$`;
        const execResult = new RegExp(regStr).exec(modifier);

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
     * Render template by positional params.
     * @param params positional parameters
     */
    public render(params: Map<number, string>): string {
        const buf = new Array<string>(this.segments.length + this.paramNumbers.length);
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
