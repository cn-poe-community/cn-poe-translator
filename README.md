# cn-poe-translator

POE 中英文数据翻译。目前支持：

- POB使用的 POE API 数据的中译英
- 交易、客户端复制的装备文本的中译英

# 使用

取决于你所使用的包管理器，以及取决于你选择作为开发依赖还是编译依赖，比如使用npm并添加为编译依赖：
```
npm i cn-poe-translator
```

模块`ZhToEn`提供中译英的服务，核心类包括：

- `BasicTranslator`，提供基础翻译服务
- `JsonTranslator`，提供 POE API 翻译服务
- `TextTranslator`，提供 文本 翻译服务
- `TranslatorFactory`，翻译器工厂

一个翻译文本的示例：

```ts
import { ZhToEn } from "cn-poe-translator";
import Assets from "cn-poe-export-db";

const text = `物品类别: 腰带
稀 有 度: 稀有
劲风 束灵
忆境 饰布腰带
--------
品质（属性词缀）: +20% (augmented)
--------
需求:
等级: 66
--------
物品等级: 100
--------
击中被你恐惧的敌人时，该次击中的法术暴击率提高 50% (enchant)
--------
力量提高 18% (implicit)
--------
+99 最大生命
+68 最大魔力
药剂充能使用降低 20%
药剂效果的持续时间延长 33%
冷却回复速度加快 16%
伤害提高 17% (crafted)
--------
忆境物品`;

const factory = new ZhToEn.TranslatorFactory(Assets);
const textTranslator = factory.getTextTranslator();
console.log(textTranslator.translate(text));
```

输出：

```
Item Class: Belts
Rarity: Rare
Item
Synthesised Cloth Belt
--------
Quality (Attribute Modifiers): +20% (augmented)
--------
Requirements:
Level: 66
--------
Item Level: 100
--------
Hits against Enemies Unnerved by you have 50% increased Spell Critical Strike Chance (enchant)
--------
18% increased Strength (implicit)
--------
+99 to maximum Life
+68 to maximum Mana
20% reduced Flask Charges used
33% increased Flask Effect Duration
16% increased Cooldown Recovery Rate
17% increased Damage (crafted)
--------
Synthesised Item
```
