import type { Stat } from "cn-poe-export-db/dist/types.js";

export type { Stat };

export interface CompoundedStatIndexEntry {
    maxLineSize: number;
    stats: CompoundedStat[];
}

export interface CompoundedStat {
    lineSize: number;
    stat: Stat;
}

export const COMPOUNDED_STAT_LINE_SEPARATOR = "\n";
