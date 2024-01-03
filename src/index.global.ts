import { Assets } from "cn-poe-export-db/dist/types.js";
import { BasicTranslatorFactory } from "./index.js";

/**
 * 
 * @param assets 
 * @returns 
 * @deprecated replaced by BasicTranslatorFactory
 */
function newBasicTranslatorFactory(assets: Assets) {
    return new BasicTranslatorFactory(assets);
}

export default {
    newBasicTranslatorFactory,
    BasicTranslatorFactory,
};
