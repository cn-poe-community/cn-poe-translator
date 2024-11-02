import type { Stat } from "cn-poe-export-db/dist/types.js";

export type { Stat };

export interface CompoundedStatIndexEntry {
    maxLines: number;
    stats: MultilineStat[];
}

export interface MultilineStat {
    lineSize: number;
    stat: Stat;
}
