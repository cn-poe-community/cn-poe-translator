export interface Requirement {
    zh: string;
    en: string;
    values?: RequirementValue[];
}

export interface RequirementValue {
    zh: string;
    en: string;
}

export interface Suffix {
    zh: string;
    en: string;
}

export const ZH_REQUIREMENT_NAME_CLASS = "职业：";
