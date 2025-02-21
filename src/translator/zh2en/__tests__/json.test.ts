import { ZhToEn } from "../../../index.js";
import Assets from "cn-poe-export-db";
import { Item } from "../../../type/json.js";

const factory = new ZhToEn.TranslatorFactory(Assets);
const jsonTranslator = factory.getJsonTranslator();

test("crucible mod translation", () => {
    const item: any = {
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
    };
    jsonTranslator.transItem(item);
    expect(item.crucibleMods[2]).toEqual("+1.2% to Critical Strike Chance");
});

test("forbidden jewels translation", () => {
    const item: Item = {
        verified: false,
        w: 1,
        h: 1,
        icon: "https://poecdn.game.qq.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvSmV3ZWxzL1B1enpsZVBpZWNlSmV3ZWxfR3JlYXRUYW5nbGUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/9035b9ffd4/PuzzlePieceJewel_GreatTangle.png",
        league: "S22赛季",
        id: "0df33223c46c6ac81c38fa4683e4f97b74f7f812c7fffa43153c844e6372d36a",
        name: "禁断之肉",
        typeLine: "钴蓝珠宝",
        baseType: "钴蓝珠宝",
        identified: true,
        ilvl: 86,
        corrupted: true,
        properties: [
            {
                name: "仅限",
                values: [["1", 0]],
                displayMode: 0,
            },
        ],
        requirements: [
            {
                name: "职业：",
                values: [["女巫", 0]],
                displayMode: 0,
                type: 57,
            },
        ],
        explicitMods: ["禁断之火上有匹配的词缀则配置 邪恶君王"],
        descrText:
            "放置到一个天赋树的珠宝插槽中以产生效果。右键点击以移出插槽。",
        flavourText: [
            "被纠缠之主包裹的肉体们\r",
            "在永无止尽的融合中哭喊着救命……",
        ],
        frameType: 3,
        x: 56,
        y: 0,
        inventoryId: "PassiveJewels",
    } as any as Item;
    jsonTranslator.transItem(item);
    expect(item.properties![0].name).toEqual("Limited to");
    expect(item.requirements![0]!.name).toEqual("Class:");
    expect(item.requirements![0]!.values[0][0]).toEqual("Witch");
});
