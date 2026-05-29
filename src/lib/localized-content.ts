import type { Category, Locale, Product, StorySeries } from "@/lib/types";

type StoryChapterLike = {
  code: string;
  title: string;
  summary: string;
  emotion: string;
};

type ProductSeedLike = {
  serial: string;
  title: string;
  zhTitle: string;
  materialLine: string;
  craftLine: string;
  storyLine: string;
};

const categoryTranslations: Record<Category, string> = {
  ring: "Ring",
  necklace: "Necklace",
  earring: "Earrings",
  bracelet: "Bracelet",
  watch: "Watch",
  stud: "Studs",
  brooch: "Brooch",
};

const termTranslations: Record<string, string> = {
  暗红珐琅: "dark red enamel",
  暗红光点: "dark red light point",
  钯金: "palladium",
  白玛瑙: "white agate",
  白水晶: "clear quartz",
  半透明珐琅: "translucent enamel",
  半透明留白: "translucent negative space",
  半透明水纹: "translucent water pattern",
  贝母: "mother of pearl",
  贝母薄片镶嵌: "mother-of-pearl inlay",
  贝母盘面: "mother-of-pearl dial",
  边界切线: "boundary cutline",
  铂金: "platinum",
  不对称结构: "asymmetric structure",
  不完全闭合曲线: "incomplete curve",
  彩色宝石: "colored gemstones",
  潮汐弧线: "tidal arc",
  错金银: "gold-and-silver inlay",
  大面积留白: "wide negative space",
  单颗宝石: "single gemstone",
  单颗宝石证据: "single-gem evidence",
  档案封条: "archive seal",
  低声编号: "low-voice serial",
  雕金: "carved gold",
  珐琅彩: "painted enamel",
  非对称重生线: "asymmetric rebirth line",
  非具象星点: "abstract star point",
  粉白内光: "soft white inner light",
  粉玉髓: "pink chalcedony",
  锋利转折: "sharp turn",
  钢琴烤漆: "piano lacquer",
  锆陶瓷: "zirconia ceramic",
  海蓝宝: "aquamarine",
  黑贝母: "black nacre",
  黑铑铂金: "black rhodium platinum",
  黑铑封层: "black rhodium coating",
  黑玛瑙: "black onyx",
  黑陶瓷: "black ceramic",
  黑曜石: "obsidian",
  红宝石: "ruby",
  红色尖晶石: "red spinel",
  黄金: "yellow gold",
  玑镂雕纹: "guilloche engraving",
  尖晶石: "spinel",
  焦黑裂面: "charred fracture",
  景泰蓝: "cloisonne-inspired enamel",
  景泰蓝灵感配色: "cloisonne-inspired palette",
  镜面抛光: "mirror polish",
  局部鎏彩: "partial color gilding",
  局部氧化: "partial oxidation",
  克制裂隙: "restrained fissure",
  孔雀石: "malachite",
  拉丝雾面: "brushed matte finish",
  蓝宝石: "sapphire",
  冷珐琅: "cold enamel",
  冷色鎏彩: "cool-tone color gilding",
  鎏彩: "color gilding",
  鎏金: "gilding",
  鎏金鎏彩: "gilding and color gilding",
  玫瑰金: "rose gold",
  内侧回声线: "inner echo line",
  暖色珐琅: "warm enamel",
  欧泊: "opal",
  帕拉伊巴碧玺: "Paraiba tourmaline",
  偏心结构: "off-center structure",
  偏移亮点: "offset light point",
  漂流编号: "drifting serial",
  平衡线: "balance line",
  七段细线: "seven fine lines",
  浅色珐琅: "pale enamel",
  青金石: "lapis lazuli",
  柔弧护甲: "soft-arc armor",
  沙弗莱石: "tsavorite",
  时间刻度: "time markers",
  手工錾刻: "hand chasing",
  水晶切面: "crystal facets",
  水纹雕刻: "water-pattern carving",
  钛金属: "titanium",
  钛金属拉丝: "brushed titanium",
  钛金属阳极氧化: "anodized titanium",
  坦桑石: "tanzanite",
  碳纤维: "carbon fiber",
  碳纤维层压: "carbon-fiber lamination",
  陶瓷烧结: "ceramic sintering",
  天然白钻: "natural white diamonds",
  透光珐琅: "light-transmitting enamel",
  透明珐琅: "transparent enamel",
  透明水晶: "clear crystal",
  微雕: "micro carving",
  微刻封存线: "micro-engraved archive line",
  微刻时标: "micro-engraved hour markers",
  微密镶: "micro pave",
  雾面钛: "matte titanium",
  细小花芽: "tiny flower bud",
  小面积光点: "small light point",
  悬浮细线: "floating fine line",
  雪花镶: "snow setting",
  烟晶: "smoky quartz",
  隐藏编号: "hidden serial",
  隐藏铰链: "hidden hinge",
  隐秘式镶嵌: "invisible setting",
  玉髓: "chalcedony",
  玉髓包镶: "chalcedony bezel setting",
  月光石: "moonstone",
  月相切片: "moon-phase slice",
  陨石: "meteorite",
  陨铁: "meteorite iron",
  珍珠母贝: "pearl mother-of-pearl",
  祖母绿: "emerald",
};

const seriesTranslations: Record<
  string,
  Pick<StorySeries, "theme" | "emotionalLine" | "description" | "ipHook">
> = {
  "still-here": {
    theme: "Still standing after the lowest valley.",
    emotionalLine: "I am still here, so the light is still here.",
    description:
      "Created for those who reclaim themselves after a low point. The works carry incomplete curves, restrained fissures, and a small point of light, proving that after a wound, form remains.",
    ipHook:
      "After an anonymous collector named Still Here confirmed N-0007, Noirven set the rule that unclaimed works continue waiting instead of being abandoned.",
  },
  "unclaimed-star": {
    theme: "Some light does not belong to the crowd; it waits for the one person who can read it.",
    emotionalLine: "It is not unloved; it has not yet met its one owner.",
    description:
      "Created for presences that wait a long time before mutual recognition. The works avoid literal star shapes, using a single gem, floating lines, and generous negative space to express quiet light before belonging.",
    ipHook:
      "Each period of waiting becomes part of the archive: the work is not forgotten, it is waiting for someone who can recognize it back.",
  },
  "seventh-light": {
    theme: "After the seventh day, the light does not disappear; it belongs to someone.",
    emotionalLine: "On the seventh day, light found belonging.",
    description:
      "A core series built around the moment of being seen. Seven fine lines, offset light points, and time markers create a hidden memory of belonging at the turn of fate.",
    ipHook: "Every Seventh Light work carries a final-hour reversal, held between tension and tenderness.",
  },
  "justice-of-one": {
    theme: "Let underestimated singularity receive one fair presentation.",
    emotionalLine: "Defined by no majority, confirmed by one.",
    description:
      "Created for the underestimated and misunderstood that remain sharp and whole. Balance lines, off-center stones, and evidence-like light form a quiet proof of value.",
    ipHook: "The work behaves like silent testimony: it does not need a majority vote to prove its value.",
  },
  "ash-garden": {
    theme: "From what was burned, flowers grow without permission.",
    emotionalLine: "Ash is not the end; it is another form of bloom.",
    description:
      "Created for those who have rebuilt after collapse, loss, and silence. Black ceramic, smoky quartz, obsidian, dark red enamel, and titanium create a calm life force; the flower is not softness, but evidence growing from a fracture.",
    ipHook:
      "Ash Garden can expand into ruins, survivors, secret gardens, and rebuilt cities. Every work is the first flower after disaster.",
  },
  "tide-return": {
    theme: "What the sea carried away returns as another kind of light.",
    emotionalLine: "Loss is not sinking; it is waiting for the next tide.",
    description:
      "Created for people who leave, migrate, travel, and return to themselves. Mother of pearl, aquamarine, lapis, pearl nacre, and transparent water textures make material feel like tide around the body.",
    ipHook:
      "Tide Return can expand into bottles at sea, lost-and-found objects, old seaside letters, and travelers who come back changed.",
  },
  "tender-armor": {
    theme: "Tenderness is not surrender; it is choosing not to be broken.",
    emotionalLine: "I am soft, but I will not be broken easily again.",
    description:
      "Created for those who appear gentle but remain firm inside. Carbon fiber, matte titanium, pink chalcedony, white agate, and piano lacquer form light protective structures with clear boundaries.",
    ipHook:
      "Tender Armor can become a long arc about protection, boundaries, repair, and future game equipment systems.",
  },
  "moon-archive": {
    theme: "The moon remembers every farewell you never said aloud.",
    emotionalLine: "It is not forgotten; it is preserved by moonlight.",
    description:
      "Created for those who do not reveal their wounds but still preserve memory. Moonstone, black nacre, lapis, clear quartz, and pale enamel form archive-like layers of translucence, silence, and sealed serials.",
    ipHook:
      "Moon Archive can become a secret archive, moon-phase diary, lost-memory library, and a character-backstory system for future fiction.",
  },
};

const productInspirationTranslations: Record<string, string> = {
  "N-0527": "The ember after ash is not residue; it is testimony that the self still exists.",
  "N-0101": "I am still here, so the light is still here.",
  "N-0102": "Not repairing the wound, but recognizing that what remains after it is still whole.",
  "N-0103": "After the wound, form remains.",
  "N-0201": "It is not unloved; it has not yet met its one owner.",
  "N-0202": "Waiting is not blank space; it is the prelude before belonging happens.",
  "N-0203": "Before being seen, it was already unrepeatable.",
  "N-0301": "On the seventh day, light found belonging.",
  "N-0302": "The final-hour reversal of belonging.",
  "N-0303": "Time gave light a place to belong.",
  "N-0401": "Defined by no majority, confirmed by one.",
  "N-0402": "A fair presentation for the underestimated singular.",
  "N-0403": "Before being proven, it already stood.",
  "N-0501": "A true verdict is not noise; it lets an underestimated green be seen again.",
  "N-0502": "When the tide withdraws, it leaves not absence but the light of the next return.",
  "N-0503": "Tenderness is not surrender; it turns boundaries into wearable armor.",
  "N-0504": "Some farewells cannot be public, so moonlight preserves them as a black archive.",
  "N-0505": "Some light does not belong to the crowd; it waits for the one person who can read it.",
  "N-0506": "True value does not need a majority to raise its hands.",
  "N-0507": "A fracture is not an ending; it is where light passes through.",
  "N-0508": "In the final hour, light found a heartbeat.",
  "N-0509": "Returning is not repeating the old path; it is arriving as another shade of blue.",
  "N-0510": "Black is not defense; it keeps softness for those worthy of coming close.",
  "N-0511": "Moonlight does not make you forget; it keeps the deep-blue evidence until you are ready to read it.",
  "N-0512": "The first flame in the ruins rises again without permission.",
  "N-0519": "A piece of meteorite is evidence after ash. It says nothing, but it never withdraws.",
  "N-0520": "Returning is not walking the old path again; it is receiving your own receipt at last.",
  "N-0522": "Some names do not need forgiveness; they need archiving.",
  "N-0521": "A boundary is not a wall; it is the structure that keeps you whole inside tenderness.",
  "N-0526": "The seventh light no longer asks whether it was late; it calibrates belonging to its own hour.",
  "N-0525": "A fracture is not evidence waiting for repair; it is a quiet valve where you choose how light passes through.",
  "N-0523": "Not every waiting stays still; some light reaches its one person along its own meridian.",
  "N-0524": "The true reversal is not defeating the crowd; it is returning the misread green to yourself.",
};

const chapterTranslations: Record<string, Pick<StoryChapterLike, "title" | "summary" | "emotion">> = {
  "CH-17": {
    title: "Ash Garden's Ember Witness",
    summary:
      "N-0527 turns the warmth that remains after ruin into a collar-close testimony: black ceramic holds the outer edge, rose gold builds a quiet inner structure, meteorite texture reads like time that cannot be forged, and dark red enamel with smoky quartz lowers the flame. Ruby and white diamonds flash only at the turning points. The collector said: I do not need to return to before the fire. I only need to prove that after ash, my own temperature remains.",
    emotion: "ember, testimony, rebuilding",
  },
  "CH-16": {
    title: "Seventh Light's Sevenfold Halo",
    summary:
      "N-0526 turns the final hour of the seventh day into an off-center halo: the black nacre dial refuses a perfect circle, seven gold lines calibrate outward from a rose-gold axis, sapphire becomes the coordinate finally seen after delay, and tanzanite with white diamonds leaves a low ring of light along the asymmetric edge. The collector said: I no longer explain lateness as being missed. I only confirm that the light arrived on my own time.",
    emotion: "belonging, final hour, calibration",
  },
  "CH-15": {
    title: "Still Here's Quiet Valve Echo",
    summary:
      "N-0525 turns the fracture into a quiet valve that can breathe: black rhodium platinum refuses to hide the break, a palladium inner line pulls it back into order, smoky quartz holds testimony in a low voice, and the single white diamond flashes only off-center. The collector said: I do not need anyone to rescue me back into my old shape. I only need to confirm that after the fracture, I can still choose where light passes through.",
    emotion: "rescue, fracture, self-order",
  },
  "CH-14": {
    title: "Justice of One's Verdant Cipher",
    summary:
      "N-0524 compresses misread green into a quiet cipher: the emerald refuses to stand at the center for approval, malachite lines behave like rearranged testimony, and tsavorite with white diamond light appears only along the asymmetric edge. The collector said: I do not need to defeat everyone; I only need to return the misjudged part of myself to myself.",
    emotion: "reversal, proof, self-return",
  },
  "CH-13": {
    title: "Awaiting Star's Meridian Whisper",
    summary:
      "N-0523 does not turn waiting into a literal star. It stretches it into a quiet meridian: pearl mother-of-pearl feels like an unsent letter, a crystal lens bends late light back toward the self, and Paraiba with tanzanite flashes only at the edge. The collector said: I was not standing still for someone else; I was reaching myself along my own orbit.",
    emotion: "waiting, arrival, singular recognition",
  },
  "CH-01": {
    title: "Ash Garden's First Letter",
    summary:
      "A collector left no real name, only one sentence: I do not want to return to before; I only want to prove that ruins can bloom. Ash Garden became Noirven's first story led by non-bright metals.",
    emotion: "rebuilding, survival, reversal",
  },
  "CH-02": {
    title: "The Blue Receipt of Tide Return",
    summary:
      "N-0520 waited through several cycles until a long-distance traveler confirmed it on a tide day. She said: I did not come back to find someone; I came back to confirm myself.",
    emotion: "departure, return, rescue",
  },
  "CH-03": {
    title: "The Boundary of Tender Armor",
    summary:
      "It looks light, but it is difficult to break. The collector wore it on the inner wrist, like placing an unspoken no into the body.",
    emotion: "boundary, protection, clarity",
  },
  "CH-04": {
    title: "The Moon Archive",
    summary:
      "Every Moon Archive work feels like a page sealed by moonlight. It does not erase memory; it preserves what cannot yet be said until the day it is understood.",
    emotion: "memory, farewell, preservation",
  },
  "CH-05": {
    title: "The Silent Orbit of Awaiting Star",
    summary:
      "It did not seek every gaze; it shone in its own orbit. One night, someone stopped and said: this is not waiting for me to buy it. It feels like waiting for me to admit myself.",
    emotion: "waiting, destiny, singular recognition",
  },
  "CH-06": {
    title: "The Testimony of Verdict Green",
    summary:
      "Malachite lines look like unsigned testimony, while tsavorite shines off-center. It reminds the wearer that true value does not require a majority vote.",
    emotion: "justice, proof, reversal",
  },
  "CH-07": {
    title: "White Diamond in a Black Rhodium Rift",
    summary:
      "A white diamond is placed beside the most restrained fissure, less like decoration than a living answer. Still Here never hides the crack; it turns the crack into a passage for light.",
    emotion: "survival, repair, faint light",
  },
  "CH-08": {
    title: "The Red Hand of the Final Hour",
    summary:
      "In the final hour of the seventh day, ruby feels like a delayed heartbeat. It does not hurry anyone; it holds the tension and tenderness before belonging inside gold lines.",
    emotion: "moment, belonging, fate",
  },
  "CH-09": {
    title: "The Meteorite Testimony of Ash Garden",
    summary:
      "The meteorite slice in N-0519 is not decoration. It is evidence that fell from beyond the sky into a ruin. It remembers the breath of ash and the silence after being left behind.",
    emotion: "rebuilding, evidence, reversal",
  },
  "CH-10": {
    title: "Tide Return's Receipt: A Proof for Myself",
    summary:
      "N-0520 does not flaunt return with brightness. It asks a quieter question: can you feel, with your own hands, that blue is not right or wrong but direction? The collector said: I only wanted the part of me that waited to finally receive a receipt.",
    emotion: "return, received, recalibration",
  },
  "CH-12": {
    title: "Moon Archive's Sealed Index",
    summary:
      "N-0522 seals a name you refuse to carry in silence anymore between black nacre and a crystal lens. Not for revenge, but to give truth a place to be filed. The collector said: I no longer have to hold anyone else's silence; moonlight will testify for me.",
    emotion: "evidence, farewell, self",
  },
  "CH-11": {
    title: "Tender Armor's Lattice Answer",
    summary:
      "N-0521 writes a calm answer with carbon fiber and titanium cutlines: a boundary is not a wall, but the structure that keeps you whole inside tenderness. The collector wore it on the inner wrist and said: I no longer need to explain my softness; it has its own equation.",
    emotion: "boundary, tenderness, repair",
  },
};

const materialNarrativeStories: Record<string, string> = {
  "Night Metal":
    "Black rhodium platinum, titanium, and meteorite carry restraint, low voices, and reversal. They do not merely shine; they leave an unrepeatable silhouette.",
  "Living Blue":
    "Lapis, aquamarine, and Paraiba tourmaline serve waiting, return, and distance, making blue not just a color but a direction recognized again.",
  "Archive Light":
    "Mother of pearl, black nacre, moonstone, and opal behave like preserved memory, made for moon phases, farewells, secrets, and late understanding.",
  "Verdict Green":
    "Malachite, tsavorite, and emerald create the evidence language of Justice of One: quiet, precise, and difficult to dispute.",
  "Burned Bloom":
    "Black ceramic, smoky quartz, dark red enamel, and ruby express life after reconstruction. The flower becomes testimony from a ruin.",
  "Soft Armor":
    "Palladium, carbon fiber, pink chalcedony, and white agate serve Tender Armor: softness with a boundary, not surrender.",
};

export function localizedCategoryLabel(category: Category, locale: Locale = "zh") {
  if (locale === "en") return categoryTranslations[category] ?? category;

  const zhLabels: Record<Category, string> = {
    ring: "戒指",
    necklace: "项链",
    earring: "耳环",
    bracelet: "手环",
    watch: "手表",
    stud: "耳钉",
    brooch: "胸针",
  };

  return zhLabels[category] ?? category;
}

export function localizedTerm(term: string, locale: Locale = "zh") {
  return locale === "en" ? termTranslations[term] ?? term : term;
}

export function localizedTerms(terms: string[], locale: Locale = "zh") {
  return locale === "en" ? terms.map((term) => localizedTerm(term, locale)) : terms;
}

export function localizedSlashLine(line: string, locale: Locale = "zh") {
  if (locale === "zh") return line;

  return line
    .split("/")
    .map((item) => localizedTerm(item.trim(), locale))
    .join(" / ");
}

export function localizedSeries(series: StorySeries, locale: Locale = "zh") {
  if (locale === "zh") return series;

  const copy = seriesTranslations[series.id];

  return {
    ...series,
    zhName: series.name,
    theme: copy?.theme ?? series.name,
    emotionalLine: copy?.emotionalLine ?? series.name,
    description: copy?.description ?? series.name,
    materials: localizedTerms(series.materials, locale),
    craft: localizedTerms(series.craft, locale),
    visualMemory: localizedTerms(series.visualMemory, locale),
    ipHook: copy?.ipHook ?? series.name,
  };
}

export function localizedProductTitle(product: Pick<Product, "title" | "zhTitle">, locale: Locale = "zh") {
  return locale === "zh" ? product.zhTitle : product.title;
}

export function localizedProductInspiration(product: Pick<Product, "serial" | "inspiration">, locale: Locale = "zh") {
  return locale === "zh" ? product.inspiration : productInspirationTranslations[product.serial] ?? "";
}

export function localizedProductConcept(product: Product, locale: Locale = "zh") {
  if (locale === "zh") return product.concept;

  const line = localizedProductInspiration(product, locale);
  return `${line} This work binds its materials, craft, and storyline into one unrepeatable memory. Only one physical piece is made; after USDT receipt is confirmed, it belongs to one collector only.`;
}

export function localizedProductSizing(product: Pick<Product, "category" | "sizing">, locale: Locale = "zh") {
  if (locale === "zh") return product.sizing;

  const sizing: Record<Category, string> = {
    ring: "Open ring structure, adjustable to the wearer's size before delivery with a comfort-finished inner curve.",
    bracelet: "Open bracelet structure, adjustable to wrist size before delivery.",
    watch: "Bracelet links or strap positions are confirmed to the wearer's wrist before delivery.",
    necklace: "Adjustable chain length for collarbone or standard necklace wear.",
    brooch: "Safety-lock brooch construction for jackets, scarves, or eveningwear.",
    earring: "Standard earring post construction, with clip conversion consultation available when needed.",
    stud: "Standard stud-post construction without ring or wrist sizing requirements.",
  };

  return sizing[product.category];
}

export function localizedProductEngraving(product: Pick<Product, "serial" | "category" | "engraving">, locale: Locale = "zh") {
  if (locale === "zh") return product.engraving;

  if (product.category === "ring" || product.category === "bracelet") {
    return `Micro-engraved ${product.serial} on the inner side as its unique Noirven serial mark.`;
  }

  return `Micro-engraved ${product.serial} on the reverse or fitting as its unique Noirven serial mark.`;
}

export function localizedPricingBasis(pricingBasis: string, locale: Locale = "zh") {
  if (locale === "zh") return pricingBasis;

  return "Ultra-luxury pricing is assessed for this individual high-jewelry work: category scale, stone rarity, precious-metal structure, composite craft difficulty, story value, one physical entity, and a no-reproduction delivery rule form this work's dedicated ownership price.";
}

export function localizedStoryChapter<T extends StoryChapterLike>(chapter: T, locale: Locale = "zh") {
  if (locale === "zh") return chapter;

  return {
    ...chapter,
    ...(chapterTranslations[chapter.code] ?? {}),
  };
}

export function localizedProductSeed<T extends ProductSeedLike>(seed: T, locale: Locale = "zh") {
  if (locale === "zh") return seed;

  return {
    ...seed,
    zhTitle: seed.title,
    materialLine: localizedSlashLine(seed.materialLine, locale),
    craftLine: localizedSlashLine(seed.craftLine, locale),
    storyLine: productInspirationTranslations[seed.serial] ?? seed.storyLine,
  };
}

export function localizedMaterialNarrativeStory(title: string, fallback: string, locale: Locale = "zh") {
  return locale === "zh" ? fallback : materialNarrativeStories[title] ?? fallback;
}
