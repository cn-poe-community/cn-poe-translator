import { escapeRegExp } from "./text.util";

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

        const enTpl = new Template(enTemplate);
        const zhTpl = new Template(zhTemplate);

        const params = zhTpl.parseParams(zhMod);
        if (params === undefined) {
            return undefined;
        }
        return enTpl.render(params);
    }
}

/**
 *
 * The template that can be pasered to segments and parameter numbers.
 *
 * Simple:
 * "Chain Hook has a {0}% chance to grant +1 Rage if it Hits Enemies"
 *
 *   segments: ["Chain Hook has a ", "% chance to grant +1 Rage if it Hits Enemies"]
 *   parameter numbers: [0]
 */
export class Template {
    tmpl: string;
    segments: string[];
    paramNumbers: number[]; //positional parameter numbers

    constructor(tmpl: string) {
        this.tmpl = tmpl;
        this.segments = [];
        this.paramNumbers = [];

        let j = 0;
        let k = 0;
        let onParam = false;
        for (let i = 0; i < tmpl.length; i++) {
            const code = tmpl.charCodeAt(i);
            if (code === 123) {
                // "{"
                k = i;
                onParam = true;
            } else if (code === 125) {
                // "}"
                if (onParam) {
                    this.segments.push(tmpl.slice(j, k));
                    this.paramNumbers.push(Number.parseInt(tmpl.slice(k + 1, i + 1)));
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
        this.segments.push(tmpl.slice(j));
    }

    /**
     * parseParams parses the modifer and returns positional parameters.
     * @param modifier rendered template result with params
     * @returns map contains positions and parameters ; undefined if the modifer does not match the template.
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
     * Render template by positional paramters.
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
