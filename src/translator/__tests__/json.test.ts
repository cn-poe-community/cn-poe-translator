import { TranslatorFactory } from "../../index";

const factory = TranslatorFactory.Default();
const JsonTranslator = factory.getJsonTranslator();

const crucibleModsTestCase: any = {};
crucibleModsTestCase.items = [
    {
        name: "恐慌 影弦",
        typeLine: "脊弓",
        baseType: "脊弓",
        ilvl: 75,
        crucibleMods: [
            "该装备附加 30 - 47 基础火焰伤害",
            "攻击速度减慢 6%",
            "暴击几率提高 +1.2%",
            "-500 命中值",
        ],
        frameType: 2,
        inventoryId: "Weapon",
    },
];

test("crucible mod translation", () => {
    JsonTranslator.translateItems(crucibleModsTestCase);
    const item = crucibleModsTestCase.items[0];
    expect(item.crucibleMods[2]).toEqual("+1.2% to Critical Strike Chance");
});
