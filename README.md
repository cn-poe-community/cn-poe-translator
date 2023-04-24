# cn-poe-translator

Translate CN POE data to English.

Json data(include items and passive skills) and text data are supported. Only equipments are supported.

# Usage

```
npm i cn-poe-translator
```

Use `JsonTranslator` to translate json data and use `TextTranslator` to translate text data.

A demo show how to translate text item:

```ts
import { TranslatorFactory } from "cn-poe-translator";

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

const factory = TranslatorFactory.Default();
const textTranslator = factory.getTextTranslator();
console.log(textTranslator.translate(text));
```

output should be:

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
