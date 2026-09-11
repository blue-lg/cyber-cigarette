export type RegionCategory = 'all' | 'china' | 'americas' | 'asia' | 'europe' | 'special';

export type CigaretteType = '烤烟型' | '混合型' | '外香型' | '丁香型' | '雪茄型';

export interface Cigarette {
  id: string;
  name: string;
  nameEn: string;
  brand: string;
  country: string;
  regionCategory: 'china' | 'americas' | 'asia' | 'europe' | 'special';
  tar: number; // mg
  nicotine: number; // mg
  carbonMonoxide: number; // mg
  type: CigaretteType;
  filterStyle: {
    color: string;
    pattern: 'cork' | 'white' | 'gold_band' | 'black_gold' | 'charcoal' | 'brown_wood';
    textColor?: string;
    ringColor?: string;
  };
  paperColor: string; // usually #fff, or #1a1a1a for Sobranie, or #5c3826 for cigarillo
  length: 'standard' | 'slim' | 'short' | 'cigarillo'; // 84mm, 97mm, 70mm, 100mm
  hasBead?: boolean;
  beadFlavor?: string;
  yearIntroduced: number;
  tagline: string;
  history: string;
  flavorNotes: string[];
  packTheme: {
    primary: string;
    accent: string;
    text: string;
    badgeText: string;
  };
  rarity?: '国粹传奇' | '世界风云' | '百年经典' | '奢华典藏' | '异域香颂' | '经典';
}

export type LighterModel = 'zippo_brass' | 'zippo_silver' | 'luxury_black' | 'clipper_blue';

export interface LighterConfig {
  id: LighterModel;
  name: string;
  material: string;
  baseColor: string;
  accentColor: string;
  capColor: string;
  wheelColor: string;
}

export interface OrientationData {
  gamma: number; // Left-to-right tilt (-90 to 90)
  beta: number;  // Front-to-back tilt (-180 to 180)
  isSupported: boolean;
  permissionGranted: boolean;
}
