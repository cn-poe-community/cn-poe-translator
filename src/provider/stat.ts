import {
    Stat,
    CompoundedStatIndexEntry as MultilineStats,
} from "../type/stat.js";
import { getTextBody, LINE_SEPARATOR } from "../util/stat.js";

export class StatProvider {
    private readonly zhBodyIdx = new Map<string, Stat[]>();
    private readonly firstLineZhBodyIdx = new Map<string, MultilineStats>();

    constructor(statList: Stat[]) {
        for (const stat of statList) {
            const zh = stat.zh;
            const body = getTextBody(zh);
            if (this.zhBodyIdx.has(body)) {
                const array = this.zhBodyIdx.get(body)!;
                array.push(stat);
            } else {
                this.zhBodyIdx.set(body, [stat]);
            }

            if (zh.includes(LINE_SEPARATOR)) {
                const lines = zh.split(LINE_SEPARATOR);
                const firstLine = lines[0];
                const firstLineBody = getTextBody(firstLine);

                const value = this.firstLineZhBodyIdx.get(firstLineBody);
                const compoundedStat = { lineSize: lines.length, stat: stat };
                if (value === undefined) {
                    this.firstLineZhBodyIdx.set(firstLineBody, {
                        maxLines: lines.length,
                        stats: [compoundedStat],
                    });
                } else {
                    if (value.maxLines < lines.length) {
                        value.maxLines = lines.length;
                    }
                    value.stats.push(compoundedStat);
                }
            }
        }

        // 按照行数从多到少排序，这样可以按照贪婪原则推断 multiline mods
        for (const value of this.firstLineZhBodyIdx.values()) {
            if (value.stats.length > 1) {
                value.stats.sort((a, b) => b.lineSize - a.lineSize);
            }
        }
    }

    public provideStatsByZhBody(zhBody: string): Stat[] | undefined {
        return this.zhBodyIdx.get(zhBody);
    }

    public provideMultilineStatsByFirstLinesZhBody(
        body: string,
    ): MultilineStats | undefined {
        return this.firstLineZhBodyIdx.get(body);
    }
}
