import { Assets } from "cn-poe-export-db/dist/types.js";
import { BaseTypeProvider } from "../../provider/basetype.js";
import { RequirementProvider } from "../../provider/requirement.js";
import { PropertyProvider } from "../../provider/property.js";
import { GemProvider } from "../../provider/gem.js";
import { PassiveSkillProvider } from "../../provider/passiveskill.js";
import { StatProvider } from "../../provider/stat.js";
import { AttributeProvider } from "../../provider/attribute.js";
import { BasicTranslator } from "./basic.js";
import { JsonTranslator } from "./json.js";
import { TextTranslator } from "./text.js";

export class TranslatorFactory {
    basicTranslator: BasicTranslator;

    constructor(assets: Assets) {
        const attributeProvider = new AttributeProvider(assets.attributes);

        const baseTypesList = [
            assets.amulets,
            assets.belts,
            assets.rings,
            assets.bodyArmours,
            assets.boots,
            assets.gloves,
            assets.helmets,
            assets.quivers,
            assets.shields,
            assets.flasks,
            assets.tinctures,
            assets.jewels,
            assets.weapons,
            assets.tattoos,
            assets.grafts,
        ];
        const baseTypeProvider = new BaseTypeProvider(baseTypesList);
        const requirementProvider = new RequirementProvider(
            assets.requirements,
            assets.requirementSuffixes,
        );

        const propertyProvider = new PropertyProvider(assets.properties);
        const gemProvider = new GemProvider(assets.gems, assets.hybridSkills);

        const passiveSkillProvider = new PassiveSkillProvider(
            assets.notables,
            assets.keystones,
            assets.ascendant,
        );

        const statProvider = new StatProvider(assets.stats);

        this.basicTranslator = new BasicTranslator(
            attributeProvider,
            baseTypeProvider,
            gemProvider,
            passiveSkillProvider,
            propertyProvider,
            requirementProvider,
            statProvider,
        );
    }

    public getBasicTranslator(): BasicTranslator {
        return this.basicTranslator;
    }
    public getJsonTranslator(): JsonTranslator {
        return new JsonTranslator(this.basicTranslator);
    }
    public getTextTranslator(): TextTranslator {
        return new TextTranslator(this.basicTranslator);
    }
}
