import { Assets, BasicTranslatorFactory } from "./index.js";

function newBasicTranslatorFactory(assets: Assets) {
    return new BasicTranslatorFactory(assets);
}

export default {
    newBasicTranslatorFactory,
};
