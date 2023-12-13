import { Assets } from "cn-poe-export-db/dist/types.js";
import { BasicTranslatorFactory } from "./index.js";

function newBasicTranslatorFactory(assets: Assets) {
    return new BasicTranslatorFactory(assets);
}

export default {
    newBasicTranslatorFactory,
};
