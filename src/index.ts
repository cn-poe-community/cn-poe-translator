import { Assets } from "cn-poe-export-db/dist/types.js";
import { AttributeProvider } from "./provider/attribute.provider.js";
import { BaseTypeProvider } from "./provider/basetype.provider.js";
import { GemProvider } from "./provider/gem.provider.js";
import { PassiveSkillProvider } from "./provider/passiveskill.provider.js";
import { PropertyProvider } from "./provider/property.provider.js";
import { RequirementProvider } from "./provider/requirement.provider.js";
import { StatProvider } from "./provider/stat.provider.js";
import { AttributeService } from "./service/attribute.service.js";
import { BaseTypeService } from "./service/basetype.service.js";
import { GemService } from "./service/gem.service.js";
import { ItemService } from "./service/item.service.js";
import { PassiveSkillService } from "./service/passiveskill.service.js";
import { PropertyService } from "./service/property.service.js";
import { RequirementService } from "./service/requirement.service.js";
import { StatService } from "./service/stat.service.js";
import { JsonTranslator } from "./translator/json.translator.js";
import { TextTranslator } from "./translator/text.translator.js";

export abstract class TranslatorFactory {
    public abstract getJsonTranslator(): JsonTranslator;
    public abstract getTextTranslator(): TextTranslator;
    public abstract getBaseTypeService(): BaseTypeService;
    public abstract getPassiveSkillService(): PassiveSkillService;
    public abstract getAttributeService(): AttributeService;
    public abstract getGemService(): GemService;
    public abstract getItemService(): ItemService;
    public abstract getPropertiesService(): PropertyService;
    public abstract getRequirementService(): RequirementService;
    public abstract getStatService(): StatService;
}

export class BasicTranslatorFactory extends TranslatorFactory {
    private baseTypeService: BaseTypeService;
    private itemService: ItemService;
    private requirementService: RequirementService;
    private propertyService: PropertyService;
    private gemService: GemService;
    private passiveSkillService: PassiveSkillService;
    private statService: StatService;
    private attributeService: AttributeService;

    private jsonTranslator: JsonTranslator;
    private textTranslator: TextTranslator;

    constructor(assets: Assets) {
        super();
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
            assets.jewels,
            assets.weapons,
            assets.tattoos,
        ];
        const baseTypeProvider = new BaseTypeProvider(baseTypesList);
        this.baseTypeService = new BaseTypeService(baseTypeProvider);
        this.itemService = new ItemService(baseTypeProvider);

        const requirementProvider = new RequirementProvider(
            assets.requirements,
            assets.requirementSuffixes
        );
        this.requirementService = new RequirementService(requirementProvider);

        const propertyProvider = new PropertyProvider(assets.properties);
        this.propertyService = new PropertyService(propertyProvider);
        const gemProvider = new GemProvider(assets.gems, assets.hybridSkills);
        this.gemService = new GemService(gemProvider);

        const passiveSkillProvider = new PassiveSkillProvider(
            assets.notables,
            assets.keystones,
            assets.ascendant
        );
        this.passiveSkillService = new PassiveSkillService(passiveSkillProvider);

        const statProvider = new StatProvider(assets.stats);
        this.statService = new StatService(this.passiveSkillService, statProvider);

        const attributeProvider = new AttributeProvider(assets.attributes);
        this.attributeService = new AttributeService(attributeProvider);

        this.jsonTranslator = new JsonTranslator(
            this.baseTypeService,
            this.itemService,
            this.requirementService,
            this.propertyService,
            this.gemService,
            this.statService,
            this.passiveSkillService
        );

        this.textTranslator = new TextTranslator(
            this.baseTypeService,
            this.itemService,
            this.requirementService,
            this.propertyService,
            this.gemService,
            this.statService,
            this.attributeService
        );
    }

    public getJsonTranslator(): JsonTranslator {
        return this.jsonTranslator;
    }
    public getTextTranslator(): TextTranslator {
        return this.textTranslator;
    }
    public getBaseTypeService(): BaseTypeService {
        return this.baseTypeService;
    }
    public getPassiveSkillService(): PassiveSkillService {
        return this.passiveSkillService;
    }
    public getAttributeService(): AttributeService {
        return this.attributeService;
    }
    public getGemService(): GemService {
        return this.gemService;
    }
    public getItemService(): ItemService {
        return this.itemService;
    }
    public getPropertiesService(): PropertyService {
        return this.propertyService;
    }
    public getRequirementService(): RequirementService {
        return this.requirementService;
    }
    public getStatService(): StatService {
        return this.statService;
    }
}
