import {
    accessories,
    armour,
    flasks,
    jewels,
    weapons,
    requirements,
    requirementSuffixes,
    properties,
    gems,
    notables,
    keystones,
    ascendant,
    stats,
    attributes,
} from "./asset/assets";
import { AttributeProvider } from "./provider/attribute.provider";
import { BaseTypeProvider } from "./provider/basetype.provider";
import { GemProvider } from "./provider/gem.provider";
import { PassiveSkillProvider } from "./provider/passiveskill.provider";
import { PropertyProvider } from "./provider/property.provider";
import { RequirementProvider } from "./provider/requirement.provider";
import { StatProvider } from "./provider/stat.provider";
import { AttributeService } from "./service/attribute.service";
import { BaseTypeService } from "./service/basetype.service";
import { GemService } from "./service/gem.service";
import { ItemService } from "./service/item.service";
import { PassiveSkillService } from "./service/passiveskill.service";
import { PropertyService } from "./service/property.service";
import { RequirementSerivce } from "./service/requirement.service";
import { StatService } from "./service/stat.service";
import { JsonTranslator } from "./translator/json.translator";
import { TextTranslator } from "./translator/text.translator";
import { BaseType } from "./type/basetype.type";

export abstract class TranslatorFactory {
    public abstract getJsonTranslator(): JsonTranslator;
    public abstract getTextTranslator(): TextTranslator;
    public abstract getBaseTypeService(): BaseTypeService;

    public static Default(): TranslatorFactory {
        return new DefaultTranslatorFactory();
    }
}

class DefaultTranslatorFactory extends TranslatorFactory {
    private baseTypesList: BaseType[][];
    private baseTypeProvider: BaseTypeProvider;
    private baseTypeService: BaseTypeService;
    private itemService: ItemService;
    private requirementProvider: RequirementProvider;
    private requirementService: RequirementSerivce;
    private propertyProvider: PropertyProvider;
    private propertySerivce: PropertyService;
    private gemProvider: GemProvider;
    private gemService: GemService;
    private passiveSkillProvider: PassiveSkillProvider;
    private passiveSkillService: PassiveSkillService;
    private statProvider: StatProvider;
    private statService: StatService;
    private attributeProvider: AttributeProvider;
    private attributeService: AttributeService;
    private jsonTranslator: JsonTranslator;
    private textTranslator: TextTranslator;

    constructor() {
        super();
        this.baseTypesList = [accessories, armour, flasks, jewels, weapons];
        this.baseTypeProvider = new BaseTypeProvider(this.baseTypesList);
        this.baseTypeService = new BaseTypeService(this.baseTypeProvider);
        this.itemService = new ItemService(this.baseTypeProvider);
        this.requirementProvider = new RequirementProvider(requirements, requirementSuffixes);
        this.requirementService = new RequirementSerivce(this.requirementProvider);
        this.propertyProvider = new PropertyProvider(properties);
        this.propertySerivce = new PropertyService(this.propertyProvider);
        this.gemProvider = new GemProvider(gems);
        this.gemService = new GemService(this.gemProvider);
        this.passiveSkillProvider = new PassiveSkillProvider(notables, keystones, ascendant);
        this.passiveSkillService = new PassiveSkillService(this.passiveSkillProvider);
        this.statProvider = new StatProvider(stats);
        this.statService = new StatService(this.passiveSkillService, this.statProvider);
        this.attributeProvider = new AttributeProvider(attributes);
        this.attributeService = new AttributeService(this.attributeProvider);
        this.jsonTranslator = new JsonTranslator(
            this.baseTypeService,
            this.itemService,
            this.requirementService,
            this.propertySerivce,
            this.gemService,
            this.statService
        );
        this.textTranslator = new TextTranslator(
            this.baseTypeService,
            this.itemService,
            this.requirementService,
            this.propertySerivce,
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
}

export { AttributeProvider } from "./provider/attribute.provider";
export { BaseTypeProvider } from "./provider/basetype.provider";
export { GemProvider } from "./provider/gem.provider";
export { PassiveSkillProvider } from "./provider/passiveskill.provider";
export { PropertyProvider } from "./provider/property.provider";
export { RequirementProvider } from "./provider/requirement.provider";
export { StatProvider } from "./provider/stat.provider";
export { AttributeService } from "./service/attribute.service";
export { BaseTypeService } from "./service/basetype.service";
export { GemService } from "./service/gem.service";
export { ItemService } from "./service/item.service";
export { PassiveSkillService } from "./service/passiveskill.service";
export { PropertyService } from "./service/property.service";
export { RequirementSerivce } from "./service/requirement.service";
export { StatService } from "./service/stat.service";
export { JsonTranslator } from "./translator/json.translator";
export { TextTranslator } from "./translator/text.translator";

export * from "./asset/assets";
