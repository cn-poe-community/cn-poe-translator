import {
    ZH_CLASS_SCION,
    ZH_FORBIDDEN_FLAME,
    ZH_FORBIDDEN_FLESH,
    ZH_PASSIVESKILL_ASCENDANT_ASSASSIN,
    ZH_PASSIVESKILL_ASCENDANT_ASSASSIN_FIXED,
} from "./json.translator.js";
import { AttributeService } from "../service/attribute.service.js";
import { BaseTypeService } from "../service/basetype.service.js";
import { GemService } from "../service/gem.service.js";
import { ItemService } from "../service/item.service.js";
import { PropertyService } from "../service/property.service.js";
import { RequirementSerivce } from "../service/requirement.service.js";
import { StatService } from "../service/stat.service.js";
import { COMPOUNDED_STAT_LINE_SEPARATOR } from "../type/stat.type.js";

export class TextTranslator {
    constructor(
        readonly baseTypeService: BaseTypeService,
        readonly itemService: ItemService,
        readonly requirementService: RequirementSerivce,
        readonly propertySerivce: PropertyService,
        readonly gemService: GemService,
        readonly statService: StatService,
        readonly attributeService: AttributeService
    ) {}

    public translate(content: string): string {
        const item = new TextItem(this.fixChineseTextError(content));
        const ctx = new Context();
        ctx.translator = this;
        return item.getTranslation(ctx);
    }

    // Fix Chinese translation error
    fixChineseTextError(content: string): string {
        if (content.includes(ZH_FORBIDDEN_FLESH) || content.includes(ZH_FORBIDDEN_FLAME)) {
            if (content.includes(ZH_CLASS_SCION)) {
                content = content.replace(
                    ZH_PASSIVESKILL_ASCENDANT_ASSASSIN,
                    ZH_PASSIVESKILL_ASCENDANT_ASSASSIN_FIXED
                );
            }
        }
        return content;
    }
}

class Context {
    translator?: TextTranslator;
    item?: TextItem;
    part?: Part;
}

const PART_SEPARATOR = "\n--------\n";
const LINE_SEPARATOR = "\n";
const KEY_VALUE_SEPARATOR = ": ";

const ZH_ITEM_CLASS = "物品类别";

class TextItem {
    parts: Part[];

    constructor(content: string) {
        const partsContents = content.split(PART_SEPARATOR);

        this.parts = partsContents.map((partContent) => {
            if (partContent.startsWith(ZH_ITEM_CLASS)) {
                return new MetaPart(partContent);
            }
            return new Part(partContent);
        });
    }

    getTranslation(ctx: Context): string {
        ctx.item = this;
        return this.parts.map((part) => part.getTranslation(ctx)).join(PART_SEPARATOR);
    }
}

class Part {
    lines: Line[];

    constructor(content: string) {
        const linesContents = content.split(LINE_SEPARATOR);
        this.lines = linesContents.map((lineContent) => Line.NewLine(lineContent));
    }

    getTranslation(ctx: Context): string {
        ctx.part = this;
        const translator = ctx.translator!;
        const buf: string[] = [];

        for (let i = 0; i < this.lines.length; ) {
            const line = this.lines[i];
            // check compounded modifier first
            const maxSize = translator.statService.getMaxLineSizeOfCompoundedMod(line.content);
            if (maxSize > 0) {
                const mod = this.lines.slice(i, Math.min(i + maxSize, this.lines.length));
                const translation = translator.statService.translateCompoundedMod(
                    mod.map((line) => (line instanceof ModiferLine ? line.modifier : line.content))
                );
                if (translation !== undefined) {
                    buf.push(this.fillSuffixsOfCompoundedModTranslation(mod, translation.result));
                    i += translation.lineSize;
                    continue;
                }
            }

            buf.push(line.getTranslation(ctx));
            i++;
        }

        return buf.join(LINE_SEPARATOR);
    }

    fillSuffixsOfCompoundedModTranslation(mod: Line[], translation: string): string {
        const slices = translation.split(COMPOUNDED_STAT_LINE_SEPARATOR);
        const buf: string[] = [];

        for (const [i, slice] of slices.entries()) {
            const sub = mod[i];
            if (sub instanceof ModiferLine && sub.suffix) {
                buf.push(`${slice} ${sub.suffix}`);
            } else {
                buf.push(slice);
            }
        }

        return buf.join(COMPOUNDED_STAT_LINE_SEPARATOR);
    }
}

class MetaPart extends Part {
    getTranslation(ctx: Context): string {
        ctx.part = this;
        const translator = ctx.translator!;
        const buf = [];

        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];
            // last two lines are name and typeline
            // but magic item has only typeline
            if (this.isNameLine(i)) {
                const zhName = line.content;
                const zhTypeLine = this.lines[this.lines.length - 1].content;
                const result = translator.baseTypeService.getBaseTypeByZhTypeLine(
                    zhTypeLine,
                    zhName
                );
                buf.push(
                    translator.itemService.translateName(
                        zhName,
                        result !== undefined ? result.zhBaseType : zhTypeLine
                    )
                );
            } else if (this.isTypeLine(i)) {
                const t = translator.baseTypeService.translateTypeLine(line.content);
                buf.push(t !== undefined ? t : line.content);
            } else {
                buf.push(line.getTranslation(ctx));
            }
        }
        return buf.join(LINE_SEPARATOR);
    }

    isNameLine(lineNum: number): boolean {
        return lineNum === this.lines.length - 2 && this.lines[lineNum] instanceof ModiferLine;
    }

    isTypeLine(lineNum: number): boolean {
        return lineNum === this.lines.length - 1 && this.lines[lineNum] instanceof ModiferLine;
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
                return new ModiferLine(content);
            } else {
                return new KeyValueLine(content, pair[0], pair[1]);
            }
        } else if (content.endsWith(":")) {
            return new OnlyKeyLine(content);
        } else {
            return new ModiferLine(content);
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
        const translator = ctx.translator!;
        let translation = translator.propertySerivce.translate(this.key, this.value);
        if (translation !== undefined) {
            let key = this.key;
            if (translation.name) {
                key = translation.name;
            }

            let value = this.value;
            if (translation.value) {
                value = translation.value;
            }

            return `${key}${KEY_VALUE_SEPARATOR}${value}`;
        }

        translation = translator.requirementService.translate(this.key, this.value);
        if (translation !== undefined) {
            const key = translation.name;
            const value = translation.value;
            return `${key ? key : this.key}${KEY_VALUE_SEPARATOR}${value ? value : this.value}`;
        }

        translation = translator.attributeService.translatePair(this.key, this.value);

        if (translation !== undefined) {
            if (translation.name) {
                this.key = translation.name;
            }

            if (translation.value) {
                this.value = translation.value;
            }
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
        const translator = ctx.translator!;
        let translation = translator.propertySerivce.translateName(this.key);
        if (translation !== undefined) {
            return `${translation}${KEY_VALUE_SEPARATOR}`;
        }
        translation = translator.attributeService.translateName(this.key);
        if (translation !== undefined) {
            return `${translation}${KEY_VALUE_SEPARATOR}`;
        }

        return `${this.key}${KEY_VALUE_SEPARATOR}`;
    }
}

class ModiferLine extends Line {
    modifier: string;
    suffix?: string;

    constructor(content: string) {
        super(content);
        const pattern = new RegExp("(.+)\\s(\\(\\w+\\))$");
        const matchs = pattern.exec(content);
        if (matchs !== null) {
            this.modifier = matchs[1];
            this.suffix = matchs[2];
        } else {
            this.modifier = content;
        }
    }

    getTranslation(ctx: Context): string {
        const translator = ctx.translator!;
        let translation = translator.statService.translateMod(this.modifier);
        if (translation !== undefined) {
            if (this.suffix) {
                return `${translation} ${this.suffix}`;
            }
            return translation;
        }

        // Some lines are properties,attributes
        translation = translator.propertySerivce.translateName(this.modifier);
        if (translation !== undefined) {
            return translation;
        }

        translation = translator.attributeService.translateName(this.modifier);
        if (translation !== undefined) {
            return translation;
        }

        return this.content;
    }
}
