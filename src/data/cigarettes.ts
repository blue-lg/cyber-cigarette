import { Cigarette } from '../types';

export const CIGARETTES_DATA: Cigarette[] = [
  // --- 中国名烟 ---
  {
    id: 'chunghwa-soft',
    name: '中华 · 软中华',
    nameEn: 'Chunghwa Soft Classic',
    brand: '中华 (Chunghwa)',
    country: '中国 (China)',
    regionCategory: 'china',
    tar: 11,
    nicotine: 1.0,
    carbonMonoxide: 11,
    type: '烤烟型',
    filterStyle: {
      color: '#d4a359',
      pattern: 'gold_band',
      textColor: '#800000',
      ringColor: '#c59b27'
    },
    paperColor: '#fafafa',
    length: 'standard',
    yearIntroduced: 1951,
    tagline: '爱我中华，国烟传奇',
    history: '1951年创立于上海卷烟厂，“中华”牌卷烟作为国宴招待与涉外赠礼的首选，被誉为“国烟”。其外包装上的天安门与华表图案由华东工业部美术家集体设计。配方甄选云贵高原顶级清香型烟叶，独特的“复合梅子酸甜香韵”与醇厚丰润的烟气，成就了七十余年不变的东方烤烟巅峰。',
    flavorNotes: ['幽雅梅香', '浓郁焦甜', '丰满细腻', '余味纯净'],
    packTheme: {
      primary: '#a81c1c',
      accent: '#e5b84c',
      text: '#ffffff',
      badgeText: '国烟经典'
    },
    rarity: '国粹传奇'
  },
  {
    id: 'huanghelou-1916',
    name: '黄鹤楼 · 1916',
    nameEn: 'Huanghelou 1916 Luxury',
    brand: '黄鹤楼 (Huanghelou)',
    country: '中国 (China)',
    regionCategory: 'china',
    tar: 6,
    nicotine: 0.6,
    carbonMonoxide: 6,
    type: '烤烟型',
    filterStyle: {
      color: '#3d261d',
      pattern: 'brown_wood',
      textColor: '#d4af37',
      ringColor: '#d4af37'
    },
    paperColor: '#f7f4ed',
    length: 'short',
    yearIntroduced: 2004,
    tagline: '极品雅香，百年重现',
    history: '黄鹤楼1916的问世源于南洋兄弟烟草公司在1916年留存的一份珍贵烟叶醇化配方手稿。每一片烟叶皆由熟练技师手工片选，经五年以上恒温橡木桶醇化。其特有的“雅香型”风格清润优雅，低焦油却保持了极高饱满度的烟气穿透力，是中国当代奢华香烟的代表作。',
    flavorNotes: ['淡雅草本', '坚果微甜', '柔顺如丝', '回甘生津'],
    packTheme: {
      primary: '#2e1c14',
      accent: '#c89f58',
      text: '#f2e8d5',
      badgeText: '雅香典范'
    },
    rarity: '奢华典藏'
  },
  {
    id: 'nanjing-xuanhemen',
    name: '南京 · 炫赫门',
    nameEn: 'Nanjing Xuanhemen Slim',
    brand: '南京 (Nanjing)',
    country: '中国 (China)',
    regionCategory: 'china',
    tar: 8,
    nicotine: 0.8,
    carbonMonoxide: 7,
    type: '烤烟型',
    filterStyle: {
      color: '#1a365d',
      pattern: 'gold_band',
      textColor: '#ffd700',
      ringColor: '#ffd700'
    },
    paperColor: '#ffffff',
    length: 'slim',
    yearIntroduced: 2011,
    tagline: '抽烟只抽炫赫门，一生只爱一个人',
    history: '江苏中烟推出的现象级细支卷烟。滤嘴采用了独特的亲水保润甜味降焦复合技术，使得唇部接触时带有淡淡的甘甜回味。伴随互联网流行文化的传播，炫赫门凭借精致沉稳的青蓝色调包装与细支优雅造型，成为了当代青年群体中最具辨识度的文化符号之一。',
    flavorNotes: ['清甜滤嘴', '柔和温润', '纤细优雅', '清香飘逸'],
    packTheme: {
      primary: '#0f2744',
      accent: '#ffd700',
      text: '#ffffff',
      badgeText: '细支顶流'
    },
    rarity: '经典'
  },
  {
    id: 'guiyan-kuayue',
    name: '贵烟 · 跨越 (陈皮爆珠)',
    nameEn: 'Guiyan Kuayue Tangerine',
    brand: '贵烟 (Guiyan)',
    country: '中国 (China)',
    regionCategory: 'china',
    tar: 7,
    nicotine: 0.7,
    carbonMonoxide: 5,
    type: '外香型',
    filterStyle: {
      color: '#111827',
      pattern: 'black_gold',
      textColor: '#f59e0b',
      ringColor: '#d97706'
    },
    paperColor: '#ffffff',
    length: 'slim',
    hasBead: true,
    beadFlavor: '新会三十年老陈皮',
    yearIntroduced: 2016,
    tagline: '一口陈皮香，跨越山海情',
    history: '贵烟开创性地将中国传统中药养生瑰宝——广东新会陈皮的提取精华凝练为微胶囊爆珠。包装以深邃的星空点点为底，捏破爆珠后，柑橘类果皮特有的清苦与甘甜瞬间融进贵州高山烟叶的醇厚烟雾中，开创了中式爆珠烟草的全新时代。',
    flavorNotes: ['老陈皮甘冽', '柑橘芳香', '润喉生津', '果木温润'],
    packTheme: {
      primary: '#090b10',
      accent: '#f59e0b',
      text: '#ffffff',
      badgeText: '陈皮爆珠'
    },
    rarity: '经典'
  },
  {
    id: 'furongwang-gold',
    name: '芙蓉王 · 硬黄',
    nameEn: 'Furongwang Yellow Classic',
    brand: '芙蓉王 (Furongwang)',
    country: '中国 (China)',
    regionCategory: 'china',
    tar: 10,
    nicotine: 1.0,
    carbonMonoxide: 11,
    type: '烤烟型',
    filterStyle: {
      color: '#e0ab44',
      pattern: 'cork',
      textColor: '#4a2c00',
      ringColor: '#b45309'
    },
    paperColor: '#ffffff',
    length: 'standard',
    yearIntroduced: 1994,
    tagline: '传递价值，成就你我',
    history: '诞生于湖南常德，芙蓉王包装以纯金色的芙蓉花冠与金色底纹为标志，象征尊贵与圆满。烟丝选料极其考究，坚持不添加人工合成香精，完全依托自然烟叶的发酵陈化，散发纯正的原生烟草芬芳与劲道，是三十年风靡大江南北的高端商务经典。',
    flavorNotes: ['自然烟香', '劲道醇和', '落喉干脆', '回味悠长'],
    packTheme: {
      primary: '#d97706',
      accent: '#fef3c7',
      text: '#451a03',
      badgeText: '湖湘王者'
    },
    rarity: '经典'
  },
  {
    id: 'liqun-classic',
    name: '利群 · 新版',
    nameEn: 'Liqun New Classic',
    brand: '利群 (Liqun)',
    country: '中国 (China)',
    regionCategory: 'china',
    tar: 11,
    nicotine: 1.0,
    carbonMonoxide: 11,
    type: '烤烟型',
    filterStyle: {
      color: '#b33939',
      pattern: 'gold_band',
      textColor: '#ffffff',
      ringColor: '#f1c40f'
    },
    paperColor: '#ffffff',
    length: 'standard',
    yearIntroduced: 1960,
    tagline: '利群，永远的利益群生',
    history: '浙江杭州卷烟厂的历史名品。利群以“醇和自然”的江南风范闻名，红白拼接的三段式设计庄重醒目。点燃时进气流畅，第一口即显浓郁本香，烟气饱满且带有淡淡的淡竹与茶叶清爽气息，深受全国烟民长年青睐。',
    flavorNotes: ['醇正本香', '清爽淡雅', '烟气充盈', '杀瘾劲道'],
    packTheme: {
      primary: '#991b1b',
      accent: '#f87171',
      text: '#ffffff',
      badgeText: '国民口粮'
    },
    rarity: '百年经典'
  },

  // --- 美洲经典 ---
  {
    id: 'marlboro-red',
    name: '万宝路 · 红万',
    nameEn: 'Marlboro Red Hard',
    brand: '万宝路 (Marlboro)',
    country: '美国 (USA)',
    regionCategory: 'americas',
    tar: 10,
    nicotine: 0.8,
    carbonMonoxide: 10,
    type: '混合型',
    filterStyle: {
      color: '#c2884a',
      pattern: 'cork',
      textColor: '#331e05',
      ringColor: '#8a531e'
    },
    paperColor: '#ffffff',
    length: 'standard',
    yearIntroduced: 1924,
    tagline: 'Come to where the flavor is. Come to Marlboro Country.',
    history: '全球销量第一的传奇烟草品牌。最初在1924年以女性柔和香烟出道，50年代由广告大师李奥·贝纳重塑为狂野奔放的“万宝路牛仔（Marlboro Man）”形象，瞬间征服全球。其采用美式混合型（American Blend）经典配方，精选弗吉尼亚烟叶、白肋烟（Burley）与东方香料烟，散发出深邃的烘烤木质香与坚果浓香。',
    flavorNotes: ['浓烈坚果', '可可微苦', '美式烘烤', '硬朗饱满'],
    packTheme: {
      primary: '#dc2626',
      accent: '#ffffff',
      text: '#111827',
      badgeText: '全球霸主'
    },
    rarity: '世界风云'
  },
  {
    id: 'lucky-strike-classic',
    name: '好彩 · 经典红圈',
    nameEn: "Lucky Strike Original 'It's Toasted'",
    brand: '好彩 (Lucky Strike)',
    country: '美国 (USA)',
    regionCategory: 'americas',
    tar: 10,
    nicotine: 0.9,
    carbonMonoxide: 10,
    type: '混合型',
    filterStyle: {
      color: '#bf8648',
      pattern: 'cork',
      textColor: '#1f2937',
      ringColor: '#dc2626'
    },
    paperColor: '#ffffff',
    length: 'standard',
    yearIntroduced: 1871,
    tagline: "It's Toasted! (烘烤工艺，别样风味)",
    history: '始于1871年淘金热时期的弗吉尼亚，品牌名寓意淘金者的“幸运一击”。二战期间被定为美军标准配给物资，经典红圆靶心标志伴随美军步履遍及欧亚战壕。好彩开创性地使用热风烘烤烟叶而非传统日晒风干，使烟草自带焦糖与烤面包般的诱人焦香。',
    flavorNotes: ['烤面包香', '微甜焦糖', '醇厚粗犷', '复古烟草'],
    packTheme: {
      primary: '#b91c1c',
      accent: '#f3f4f6',
      text: '#111827',
      badgeText: '二战传奇'
    },
    rarity: '百年经典'
  },
  {
    id: 'camel-yellow',
    name: '骆驼 · 黄盒经典',
    nameEn: 'Camel Filters Yellow',
    brand: '骆驼 (Camel)',
    country: '美国 (USA)',
    regionCategory: 'americas',
    tar: 10,
    nicotine: 0.8,
    carbonMonoxide: 10,
    type: '混合型',
    filterStyle: {
      color: '#cca064',
      pattern: 'cork',
      textColor: '#38220f',
      ringColor: '#b45309'
    },
    paperColor: '#fff',
    length: 'standard',
    yearIntroduced: 1913,
    tagline: 'I’d Walk a Mile for a Camel',
    history: '雷诺烟草1913年推出的里程碑作品，彻底奠定了现代二十支硬盒卷烟的标准。黄色包装上伫立在金字塔与棕榈树前的单峰骆驼“Old Joe”，成为了二十世纪最著名的波普视觉符号之一。土耳其日晒烟叶与美国本土弗吉尼亚烟叶的黄金配比，带来带有东方异域辛香的馥郁气息。',
    flavorNotes: ['土耳其辛香', '浓郁草本', '甘草香韵', '刚劲有力'],
    packTheme: {
      primary: '#d97706',
      accent: '#fef3c7',
      text: '#451a03',
      badgeText: '百年骆驼'
    },
    rarity: '百年经典'
  },
  {
    id: 'american-spirit-blue',
    name: '天然美洲精神 · 蓝盒',
    nameEn: 'Natural American Spirit Blue',
    brand: '美洲精神 (American Spirit)',
    country: '美国 (USA)',
    regionCategory: 'americas',
    tar: 9,
    nicotine: 1.0,
    carbonMonoxide: 9,
    type: '烤烟型',
    filterStyle: {
      color: '#ffffff',
      pattern: 'white',
      textColor: '#1e3a8a',
      ringColor: '#3b82f6'
    },
    paperColor: '#ffffff',
    length: 'standard',
    yearIntroduced: 1982,
    tagline: '100% Additive-Free Natural Tobacco',
    history: '创立于新墨西哥州圣达菲，以印第安羽冠酋长为象征。坚持采用100%无化学添加剂、无再造烟叶的纯天然全叶整丝填充。由于烟丝紧实度较普通卷烟高出近25%，其燃烧速度极慢，一支的品吸时间可达普通香烟的两倍，散发出质朴原始的纯净大自然植物芳香。',
    flavorNotes: ['无添加纯本香', '慢燃耐品', '干爽麦香', '微甜回甘'],
    packTheme: {
      primary: '#1d4ed8',
      accent: '#93c5fd',
      text: '#ffffff',
      badgeText: '天然有机'
    },
    rarity: '世界风云'
  },

  // --- 日韩典范 ---
  {
    id: 'seven-stars-classic',
    name: '七星 · 经典黑标 (高焦王)',
    nameEn: 'Seven Stars Original 14mg',
    brand: '七星 (Seven Stars)',
    country: '日本 (Japan)',
    regionCategory: 'asia',
    tar: 14,
    nicotine: 1.2,
    carbonMonoxide: 14,
    type: '混合型',
    filterStyle: {
      color: '#e2e8f0',
      pattern: 'charcoal',
      textColor: '#0f172a',
      ringColor: '#475569'
    },
    paperColor: '#ffffff',
    length: 'standard',
    yearIntroduced: 1969,
    tagline: '北斗七星，昭和男儿的纯正滋味',
    history: '日本烟草公司（JT）于1969年推出的划时代杰作，是日本第一款采用活性炭复合滤嘴的香烟。虽然焦油高达14毫克，但凭借双重活性炭颗粒的高效净化，抽吸时丝毫不感刺喉杂味，取而代之的是极致纯粹且深厚的弗吉尼亚烟叶本味与浓密白烟，被称为“昭和男儿的心头好”。',
    flavorNotes: ['极度醇厚', '活性炭纯净', '麦芽香气', '饱满击喉感'],
    packTheme: {
      primary: '#1e293b',
      accent: '#94a3b8',
      text: '#f8fafc',
      badgeText: '14mg重击'
    },
    rarity: '经典'
  },
  {
    id: 'mevius-sky-blue',
    name: '梅比乌斯 · 天蓝8mg (原柔和七星)',
    nameEn: 'Mevius Sky Blue (Mild Seven)',
    brand: '梅比乌斯 (Mevius)',
    country: '日本 (Japan)',
    regionCategory: 'asia',
    tar: 8,
    nicotine: 0.7,
    carbonMonoxide: 9,
    type: '混合型',
    filterStyle: {
      color: '#ffffff',
      pattern: 'white',
      textColor: '#0284c7',
      ringColor: '#38bdf8'
    },
    paperColor: '#ffffff',
    length: 'standard',
    yearIntroduced: 1977,
    tagline: '超越平庸，心境如海',
    history: '前身为1977年问世的“Mild Seven（柔和七星）”，曾连续数十年雄踞亚洲销量榜首，2013年更名为MEVIUS。独创LSS（Less Smoke Smell，低烟气残留味）减臭科技，在保证烟气清爽纯净的同时极大降低了二手烟在衣物上的附着味，设计风格极简现代。',
    flavorNotes: ['清澈干净', '低残留味', '轻柔顺喉', '温和回甜'],
    packTheme: {
      primary: '#0284c7',
      accent: '#bae6fd',
      text: '#ffffff',
      badgeText: '现代风尚'
    },
    rarity: '经典'
  },
  {
    id: 'peace-aroma-royal',
    name: '和平 · 金和平 (Peace Royal)',
    nameEn: 'Peace Aroma Royal Virginian',
    brand: '和平 (Peace)',
    country: '日本 (Japan)',
    regionCategory: 'asia',
    tar: 10,
    nicotine: 1.0,
    carbonMonoxide: 10,
    type: '烤烟型',
    filterStyle: {
      color: '#1e1b4b',
      pattern: 'gold_band',
      textColor: '#fbbf24',
      ringColor: '#f59e0b'
    },
    paperColor: '#fdfbf7',
    length: 'standard',
    yearIntroduced: 1946,
    tagline: '叼着橄榄枝的金鸽，为战后带来平静与芳香',
    history: '1946年二战结束初期为祈愿和平而诞生。其深蓝底色搭配衔橄榄枝金鸽的包装由20世纪设计巨匠雷蒙·罗维（Raymond Loewy）亲自操刀，至今被视为工业设计圣经。精选100%弗吉尼亚顶级烟叶，调配天然香草（Vanilla）精华，点燃后室内满溢着如同高级法式烘焙甜点的华丽芬芳。',
    flavorNotes: ['高雅香草', '醇浓蜜甜', '华丽芳香', '丝滑丰腴'],
    packTheme: {
      primary: '#1e1b4b',
      accent: '#fbbf24',
      text: '#ffffff',
      badgeText: '香草贵族'
    },
    rarity: '奢华典藏'
  },

  // --- 欧洲奢华 ---
  {
    id: 'sobranie-black-russian',
    name: '寿百年 · 黑俄罗斯',
    nameEn: 'Sobranie Black Russian',
    brand: '寿百年 (Sobranie of London)',
    country: '英国 (UK)',
    regionCategory: 'europe',
    tar: 9,
    nicotine: 0.8,
    carbonMonoxide: 9,
    type: '烤烟型',
    filterStyle: {
      color: '#d4af37',
      pattern: 'black_gold',
      textColor: '#1a1a1a',
      ringColor: '#996515'
    },
    paperColor: '#1a1a1a', // 纯黑哑光卷纸
    length: 'cigarillo',
    yearIntroduced: 1879,
    tagline: '沙皇宫廷专供，伦敦圣詹姆斯的贵族礼遇',
    history: '1879年在伦敦圣詹姆斯创立，曾是俄罗斯帝国沙皇罗曼诺夫家族与英国皇家宫廷的指定供奉卷烟。标志性的纯黑哑光纸身与24K金箔滤嘴，印有俄罗斯双头金鹰帝国纹章。烟丝极为纯净温和，是世界公认最具视觉震撼力与奢华仪式感的宴会名烟。',
    flavorNotes: ['优雅木香', '皇家纯净', '细微甘甜', '低调奢华'],
    packTheme: {
      primary: '#121212',
      accent: '#d4af37',
      text: '#ffffff',
      badgeText: '皇家金鹰'
    },
    rarity: '奢华典藏'
  },
  {
    id: 'dunhill-international',
    name: '登喜路 · 国际红盒',
    nameEn: 'Dunhill International Red',
    brand: '登喜路 (Dunhill)',
    country: '英国 (UK)',
    regionCategory: 'europe',
    tar: 10,
    nicotine: 0.9,
    carbonMonoxide: 10,
    type: '烤烟型',
    filterStyle: {
      color: '#bf8240',
      pattern: 'cork',
      textColor: '#ffffff',
      ringColor: '#d4af37'
    },
    paperColor: '#ffffff',
    length: 'standard',
    yearIntroduced: 1907,
    tagline: '英国绅士的优雅与坚持',
    history: '阿尔弗雷德·登喜路于1907年在伦敦杜克街开设烟草工坊，并获得英国皇家御用认证。其首创双舱式宽幅扁平红盒与“Reloc”铝箔保鲜自封口科技，确保每一支卷烟在世界任何角落点燃时都如同刚出工厂般湿润新鲜。口感保持了最地道的英式纯正烤烟风骨。',
    flavorNotes: ['英式纯正', '烟草微甜', '细腻无杂', '醇和均衡'],
    packTheme: {
      primary: '#881337',
      accent: '#facc15',
      text: '#ffffff',
      badgeText: '伦敦绅士'
    },
    rarity: '百年经典'
  },
  {
    id: 'davidoff-classic',
    name: '大卫杜夫 · 经典白盒',
    nameEn: 'Davidoff Classic Super Premium',
    brand: '大卫杜夫 (Davidoff)',
    country: '瑞士 (Switzerland)',
    regionCategory: 'europe',
    tar: 10,
    nicotine: 0.8,
    carbonMonoxide: 10,
    type: '混合型',
    filterStyle: {
      color: '#ffffff',
      pattern: 'white',
      textColor: '#b45309',
      ringColor: '#d97706'
    },
    paperColor: '#ffffff',
    length: 'standard',
    yearIntroduced: 1968,
    tagline: 'The Good Life (享受美好生活)',
    history: '由雪茄传奇泰斗季诺·大卫杜夫在日内瓦建立。大卫杜夫卷烟秉承了高级手卷雪茄的苛刻调配哲学，八角斜边纯白包装高贵典雅。烟气极具丝绸般的平滑感，完全摒弃传统卷烟的粗糙毛刺，如同一杯醒好的陈年干邑。',
    flavorNotes: ['丝滑质感', '雪茄微韵', '雪松木香', '圆润平衡'],
    packTheme: {
      primary: '#292524',
      accent: '#d97706',
      text: '#fafaf9',
      badgeText: '雪茄底蕴'
    },
    rarity: '奢华典藏'
  },

  // --- 特殊与异域 (雪茄/丁香) ---
  {
    id: 'gudang-garam-kretek',
    name: '古当加蓝 · 盐仓丁香烟 (Kretek)',
    nameEn: 'Gudang Garam Surya 16 Clove',
    brand: '古当加蓝 (Gudang Garam)',
    country: '印度尼西亚 (Indonesia)',
    regionCategory: 'special',
    tar: 30,
    nicotine: 1.8,
    carbonMonoxide: 22,
    type: '丁香型',
    filterStyle: {
      color: '#a36329',
      pattern: 'cork',
      textColor: '#ffd700',
      ringColor: '#b45309'
    },
    paperColor: '#faf3e0',
    length: 'standard',
    yearIntroduced: 1958,
    tagline: '丁香微爆的交响乐，千岛之国的灵魂芳气',
    history: '印尼国宝级特产“Kretek（克雷泰克）”丁香香烟。配方中含有高达30%以上的纯天然丁香花蕾碎与特制香料草本糖浆。点燃吸食时，由于丁香花油在高温下受热膨胀，前端会发出如同热油烹炸般的清脆噼啪爆裂声（Kretek拟声词由此而来），滤嘴带有明显甜润，弥漫着极度浓郁的南洋香料异域风情。',
    flavorNotes: ['清脆爆裂声', '浓郁丁香辛香', '肉桂甜香', '重磅满足感'],
    packTheme: {
      primary: '#78350f',
      accent: '#fef08a',
      text: '#ffffff',
      badgeText: '印尼国宝'
    },
    rarity: '异域香颂'
  },
  {
    id: 'cohiba-club-mini',
    name: '高希霸 · 古巴俱乐部雪茄烟',
    nameEn: 'Cohiba Club Cuban Cigarillo',
    brand: '高希霸 (Cohiba)',
    country: '古巴 (Cuba)',
    regionCategory: 'special',
    tar: 12,
    nicotine: 1.2,
    carbonMonoxide: 12,
    type: '雪茄型',
    filterStyle: {
      color: '#3e2417',
      pattern: 'brown_wood',
      textColor: '#f59e0b',
      ringColor: '#f59e0b'
    },
    paperColor: '#4a2c1d', // 天然深棕色雪茄烟叶外包皮
    length: 'cigarillo',
    yearIntroduced: 1966,
    tagline: '卡斯特罗挚爱，古巴比那尔德里奥的黑色黄金',
    history: '诞生于哈瓦那著名的埃尔拉吉托（El Laguito）秘密工坊，最初仅供古巴国家元首菲德尔·卡斯特罗专享及外交礼赠。采用100%古巴下维尔他（Vuelta Abajo）地区最顶级的自然发酵雪茄烟叶卷制而成，不含滤嘴和漂白纸，纯粹呈现浓烈馥郁的烘烤咖啡豆、深色可可与湿润雪松木的野性泥土芳香。',
    flavorNotes: ['古巴雪茄叶', '深烘咖啡', '浓郁黑巧', '雪松木泥土'],
    packTheme: {
      primary: '#1c1917',
      accent: '#eab308',
      text: '#ffffff',
      badgeText: '古巴传奇'
    },
    rarity: '奢华典藏'
  }
];

export const LIGHTER_MODELS = [
  {
    id: 'zippo_brass' as const,
    name: '经典黄铜拉丝 Zippo',
    material: '拉丝复古实木与黄铜合金',
    baseColor: '#c28b38',
    accentColor: '#ffd700',
    capColor: '#b87c28',
    wheelColor: '#4b5563'
  },
  {
    id: 'zippo_silver' as const,
    name: '暗夜流银纯钛 Zippo',
    material: '镜面冷锻精钢与钛灰镀层',
    baseColor: '#94a3b8',
    accentColor: '#e2e8f0',
    capColor: '#64748b',
    wheelColor: '#334155'
  },
  {
    id: 'luxury_black' as const,
    name: '黑金奢典防风打火机',
    material: '哑光曜石黑与24K电镀饰条',
    baseColor: '#18181b',
    accentColor: '#d97706',
    capColor: '#27272a',
    wheelColor: '#d97706'
  },
  {
    id: 'clipper_blue' as const,
    name: '街头经典 Clipper 气机',
    material: '耐磨高聚合尼龙与防滑火石柱',
    baseColor: '#0284c7',
    accentColor: '#38bdf8',
    capColor: '#0369a1',
    wheelColor: '#64748b'
  }
];
