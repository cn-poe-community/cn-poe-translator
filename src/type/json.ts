export interface Items {
    character: Character;
    items: Item[];
}

export interface Character {
    class: string;
    name: string;
    league: string;
}

export interface Item {
    id: string;
    sockets: Socket[] | undefined;
    influences: Influences | undefined;
    searing: boolean | undefined;
    tangeled: boolean | undefined;
    abyssJewel: boolean | undefined;
    fractured: boolean | undefined;
    name: string;
    typeLine: string;
    baseType: string;
    rarity: string | undefined;
    ilvl: number;
    corrupted: boolean | undefined;
    properties: ItemProperty[] | undefined;
    requirements: ItemRequirement[] | undefined;
    enchantMods: string[] | undefined;
    implicitMods: string[] | undefined;
    explicitMods: string[] | undefined;
    craftedMods: string[] | undefined;
    utilityMods: string[] | undefined;
    fracturedMods: string[] | undefined;
    scourgeMods: string[] | undefined;
    crucibleMods: string[] | undefined;
    inventoryId: string | undefined;
    duplicated: boolean | undefined;
    synthesised: boolean | undefined;
    socketedItems: Item[] | undefined;
    hybrid: GemHybrid | undefined;
    frameType: number;
    x: number | undefined;
}

export interface Socket {
    group: number;
    attr: string;
    sColour: string;
}

export interface Influences {
    shaper: boolean | undefined;
    elder: boolean | undefined;
    warlord: boolean | undefined;
    hunter: boolean | undefined;
    crusader: boolean | undefined;
    redeemer: boolean | undefined;
}

export interface ItemProperty {
    name: string;
    values: ItemPropertyValue[];
}

export type ItemPropertyValue = [string, number];

export interface ItemRequirement {
    name: string;
    values: ItemRequirementValue[];
    suffix: string | undefined;
}

export type ItemRequirementValue = [string, number];

export interface GemHybrid {
    baseTypeName: string;
    isVaalGem: boolean;
}

export interface PassiveSkills {
    alternate_ascendancy: number;
    ascendancy: number;
    character: number;
    hashes: number[];
    hashes_ex: number[];
    items: Item[];
    jewel_data: { [index: number]: JewelData };
    mastery_effects: { [index: number]: number };
    skill_overrides: { [index: number]: SkillOverride };
}

export interface JewelData {
    type: string;
    subgraph: SubGraph | undefined;
}

export interface SubGraph {
    group: { [index: string]: Expansion };
    nodes: { [index: number]: Node };
}

export interface Expansion {
    nodes: string[];
    proxy: string;
}

export interface Node {
    isNotable: boolean | undefined;
    isJewelSocket: boolean | undefined;
    isMastery: boolean | undefined;
    expansionJewel: ExpansionJewel | undefined;
    skill: string;
    orbitIndex: number;
}

export interface ExpansionJewel {
    size: number;
    index: number;
    proxy: string;
}

export interface SkillOverride {
    name: string;
    isKeystone: boolean | undefined;
}
