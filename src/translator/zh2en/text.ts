import { BasicTranslator } from "./basic.js";
import {
    ZH_CLASS_SCION,
    ZH_FORBIDDEN_FLAME,
    ZH_FORBIDDEN_FLESH,
    ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN,
    ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN_FIXED,
} from "./json.js";

export class TextTranslator {
    constructor(readonly basic: BasicTranslator) {}

    public trans(content: string): string {
        const item = new TextItem(this.preHandle(content));
        const ctx = new Context(this);
        return item.getTranslation(ctx);
    }

    // 与翻译 json 的过程类似，需要对本土化过程中引入的 bug 进行 hack。
    preHandle(content: string): string {
        if (
            content.includes(ZH_FORBIDDEN_FLESH) ||
            content.includes(ZH_FORBIDDEN_FLAME)
        ) {
            if (content.includes(ZH_CLASS_SCION)) {
                content = content.replace(
                    ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN,
                    ZH_PASSIVE_SKILL_ASCENDANT_ASSASSIN_FIXED,
                );
            }
        }

        //// S26 赛季武器附魔引入的中文词缀重复问题
        content = content.replaceAll(
            /^元素伤害(提高|降低) \d+% \(enchant\)$/gm,
            (line) => "该武器的" + line,
        );

        return content;
    }
}

class Context {
    translator: TextTranslator;
    item?: TextItem;
    part?: Part;

    constructor(translator: TextTranslator) {
        this.translator = translator;
    }
}

const PART_SEPARATOR = "\n--------\n";
const LINE_SEPARATOR = "\n";
const KEY_VALUE_SEPARATOR = ": ";

const ZH_PROPERTY_ITEM_CLASS = "物品类别";
//const ZH_PROPERTY_RARITY = "稀 有 度";

/**
 * 文本物品。
 */
class TextItem {
    parts: Part[];

    constructor(content: string) {
        const partsContents = content.split(PART_SEPARATOR);

        this.parts = partsContents.map((partContent) => {
            if (partContent.startsWith(ZH_PROPERTY_ITEM_CLASS)) {
                return new MetaPart(partContent);
            }
            return new Part(partContent);
        });
    }

    getTranslation(ctx: Context): string {
        ctx.item = this;
        return this.parts
            .map((part) => part.getTranslation(ctx))
            .join(PART_SEPARATOR);
    }
}

/**
 * 文本分区。
 *
 * 将文本基于分隔符`--------`切分，得到的块单位。
 */
class Part {
    lines: Line[];

    constructor(content: string) {
        const linesContents = content.split(LINE_SEPARATOR);
        this.lines = linesContents.map((lineContent) =>
            Line.NewLine(lineContent),
        );
    }

    /**
     * 获取分区的翻译。
     *
     * 这里假设分区为 mod 组成的分区，这是最常见的情况，子类型的分区需要覆盖该方法。
     */
    getTranslation(ctx: Context): string {
        ctx.part = this;
        const translator = ctx.translator;
        const buf: string[] = [];

        for (let i = 0; i < this.lines.length; ) {
            const line = this.lines[i];
            // 首先检查是否是 multiline mod
            const maxLines = translator.basic.getMaxLinesOfMultilineMod(
                line.content,
            );
            if (maxLines > 0) {
                const mod = this.lines.slice(
                    i,
                    Math.min(i + maxLines, this.lines.length),
                );
                const translation = translator.basic.transMultilineMod(
                    // ModLine 可能带有后缀，这里不需要后缀
                    mod.map((line) =>
                        line instanceof ModLine ? line.mod : line.content,
                    ),
                );
                if (translation) {
                    buf.push(
                        this.fillSuffixesOfMultilineModTranslation(
                            mod,
                            translation.result,
                        ),
                    );
                    i += translation.lineCount;
                    continue;
                }
            }

            buf.push(line.getTranslation(ctx));
            i++;
        }

        return buf.join(LINE_SEPARATOR);
    }

    // 给带有后缀的 multiline mod 的翻译结果的每行添加后缀
    fillSuffixesOfMultilineModTranslation(
        mod: Line[],
        translation: string,
    ): string {
        const slices = translation.split(LINE_SEPARATOR);
        const buf: string[] = [];

        for (const [i, slice] of slices.entries()) {
            const sub = mod[i];
            if (sub instanceof ModLine && sub.suffix) {
                buf.push(`${slice} ${sub.suffix}`);
            } else {
                buf.push(slice);
            }
        }

        return buf.join(LINE_SEPARATOR);
    }
}

/**
 * 元信息分区。
 */
class MetaPart extends Part {
    rarity: string;

    constructor(content: string) {
        super(content);
        for (const line of this.lines) {
            if (line instanceof KeyValueLine) {
                this.rarity = (line as KeyValueLine).value;
                break;
            }
        }
        this.rarity = "";
    }

    getTranslation(ctx: Context): string {
        ctx.part = this;
        const translator = ctx.translator;
        const buf = [];

        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];
            // 对于稀有和传奇物品，末尾两行为：name,typeline
            // 对于魔法物品，末尾只有 typeline 行
            if (this.isNameLine(i)) {
                const name = line.content;
                const typeLine = this.lines[this.lines.length - 1].content;
                const result = translator.basic.transNameAndTypeLine(
                    name,
                    typeLine,
                );
                if (result) {
                    buf.push(result.name);
                    buf.push(result.typeLine);
                } else {
                    buf.push(name);
                    buf.push(typeLine);
                }
                //因为这里写入了 typeline，所以到达了末尾
                i++;
            } else if (this.isTypeLine(i)) {
                const result = translator.basic.transTypeLine(line.content);
                buf.push(result ? result : line.content);
            } else {
                buf.push(line.getTranslation(ctx));
            }
        }
        return buf.join(LINE_SEPARATOR);
    }

    isNameLine(lineNum: number): boolean {
        // 目前的检查逻辑比较简单，后续可能考虑通常检查稀有度字段实现
        return (
            lineNum === this.lines.length - 2 &&
            this.lines[lineNum] instanceof ModLine
        );
    }

    isTypeLine(lineNum: number): boolean {
        return (
            lineNum === this.lines.length - 1 &&
            this.lines[lineNum] instanceof ModLine
        );
    }
}

class Line {
    content: string;

    protected constructor(content: string) {
        this.content = content;
    }

    static NewLine(content: string): Line {
        if (content.includes(KEY_VALUE_SEPARATOR)) {
            const pair = content.split(KEY_VALUE_SEPARATOR);
            if (pair.length !== 2) {
                return new ModLine(content);
            } else {
                return new KeyValueLine(content, pair[0], pair[1]);
            }
        } else if (content.endsWith(":")) {
            return new OnlyKeyLine(content);
        } else {
            return new ModLine(content);
        }
    }

    getTranslation(ctx: Context): string {
        return this.content;
    }
}

class KeyValueLine extends Line {
    key: string;
    value: string;

    constructor(content: string, key: string, value: string) {
        super(content);
        this.key = key;
        this.value = value;
    }

    getTranslation(ctx: Context): string {
        const translator = ctx.translator;
        let result = translator.basic.transProp(this.key, this.value);
        if (result) {
            let value = this.value;
            if (result.value) {
                value = result.value;
            }
            return `${result.name}${KEY_VALUE_SEPARATOR}${value}`;
        }

        result = translator.basic.transReq(this.key, this.value);
        if (result) {
            let value = this.value;
            if (result.value) {
                value = result.value;
            }
            return `${result.name}${KEY_VALUE_SEPARATOR}${value}`;
        }

        result = translator.basic.transAttr(this.key, this.value);

        if (result) {
            let value = this.value;
            if (result.value) {
                value = result.value;
            }
            return `${result.name}${KEY_VALUE_SEPARATOR}${value}`;
        }

        return `${this.key}${KEY_VALUE_SEPARATOR}${this.value}`;
    }
}

class OnlyKeyLine extends Line {
    key: string;
    constructor(content: string) {
        super(content);
        this.key = content.substring(0, content.length - 1);
    }

    getTranslation(ctx: Context): string {
        const translator = ctx.translator;
        let result = translator.basic.transPropName(this.key);
        if (result) {
            return `${result}${KEY_VALUE_SEPARATOR}`;
        }
        result = translator.basic.transAttrName(this.key);
        if (result) {
            return `${result}${KEY_VALUE_SEPARATOR}`;
        }

        return `${this.key}${KEY_VALUE_SEPARATOR}`;
    }
}

class ModLine extends Line {
    mod: string;
    suffix?: string;

    constructor(content: string) {
        super(content);
        const pattern = new RegExp("(.+)\\s(\\(\\w+\\))$");
        const match = pattern.exec(content);
        if (match) {
            this.mod = match[1];
            this.suffix = match[2];
        } else {
            this.mod = content;
        }
    }

    getTranslation(ctx: Context): string {
        const translator = ctx.translator;
        let result = translator.basic.transMod(this.mod);
        if (result) {
            if (this.suffix) {
                return `${result} ${this.suffix}`;
            }
            return result;
        }

        // Some lines are properties or attributes
        result = translator.basic.transPropName(this.mod);
        if (result) {
            return result;
        }

        result = translator.basic.transAttrName(this.mod);
        if (result) {
            return result;
        }

        return this.content;
    }
}
