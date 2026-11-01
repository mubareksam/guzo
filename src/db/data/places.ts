/**
 * Named places (nodes) of the Addis Ababa public transport network.
 * Every line is described as an ordered list of these keys, so riders can be
 * told "take the minibus signed X and drop at Y" even when Y is mid-route.
 *
 * Coordinates verified against OpenStreetMap, map.et, Yandex Maps, and
 * community reports. Last major update: November 2026.
 */
export type Place = {
  name: string;
  am: string;
  lat: number;
  lng: number;
  area: string; // sub-city / town
  aliases?: string[];
};

export const places: Record<string, Place> = {
  // ── Arada / Gulele (north & old town) ────────────────────────────────
  piassa: { name: "Piassa", am: "ፒያሳ", lat: 9.0347, lng: 38.7503, area: "Arada", aliases: ["piazza", "giorgis", "menelik square", "atikilt tera"] },
  arat_kilo: { name: "Arat Kilo", am: "አራት ኪሎ", lat: 9.0333, lng: 38.7631, area: "Arada", aliases: ["4 kilo", "parliament"] },
  sidist_kilo: { name: "Sidist Kilo", am: "ስድስት ኪሎ", lat: 9.0430, lng: 38.7610, area: "Gulele", aliases: ["6 kilo", "aau", "yekatit 12"] },
  amist_kilo: { name: "Amist Kilo", am: "አምስት ኪሎ", lat: 9.0414, lng: 38.7680, area: "Arada", aliases: ["5 kilo"] },
  shiro_meda: { name: "Shiro Meda", am: "ሽሮ ሜዳ", lat: 9.0617, lng: 38.7637, area: "Gulele", aliases: ["us embassy old"] },
  entoto: { name: "Entoto Maryam", am: "እንጦጦ ማርያም", lat: 9.0870, lng: 38.7620, area: "Gulele", aliases: ["entoto park"] },
  kechene: { name: "Kechene", am: "ቀጨኔ", lat: 9.0560, lng: 38.7560, area: "Gulele", aliases: ["kechene 8 kutir"] },
  addisu_gebeya: { name: "Addisu Gebeya", am: "አዲሱ ገበያ", lat: 9.0610, lng: 38.7470, area: "Gulele" },
  semen_mazoria: { name: "Semen Mazoria", am: "ሰሜን ማዞሪያ", lat: 9.0545, lng: 38.7395, area: "Gulele", aliases: ["north mazoria"] },
  gulele: { name: "Gulele", am: "ጉለሌ", lat: 9.0660, lng: 38.7330, area: "Gulele", aliases: ["gulele botanical garden"] },
  wingate: { name: "Wingate", am: "ዊንጌት", lat: 9.0600, lng: 38.7290, area: "Gulele", aliases: ["wingate school"] },
  asko: { name: "Asko", am: "አስኮ", lat: 9.065, lng: 38.695, area: "Kolfe Keranyo", aliases: ["asko bus station", "asko regional bus station"] },
  burayu: { name: "Burayu", am: "ቡራዩ", lat: 9.0640, lng: 38.6690, area: "Burayu (Oromia)" },
  ferensay: { name: "Ferensay Legasion", am: "ፈረንሳይ ለጋሲዮን", lat: 9.0490, lng: 38.7815, area: "Yeka", aliases: ["french embassy", "ferensay"] },
  kebena: { name: "Kebena", am: "ቀበና", lat: 9.0349, lng: 38.7786, area: "Yeka" },
  menelik_sq: { name: "Menelik II Square", am: "ሜኒሊክ 2 ነኛ አደባባይ", lat: 9.0380, lng: 38.7490, area: "Arada", aliases: ["menelik square", "menelik ii"] },

  // ── Addis Ketema / Kolfe (west) ──────────────────────────────────────
  merkato: { name: "Merkato", am: "መርካቶ", lat: 9.0335, lng: 38.7400, area: "Addis Ketema", aliases: ["anwar mosque", "mercato"] },
  autobus_tera: { name: "Autobus Tera", am: "አውቶቡስ ተራ", lat: 9.0393, lng: 38.7368, area: "Addis Ketema", aliases: ["merkato bus station", "long distance road hub"] },
  sebategna: { name: "Sebategna", am: "ሰባተኛ", lat: 9.0322, lng: 38.7342, area: "Addis Ketema", aliases: ["7 gna"] },
  abnet: { name: "Abnet", am: "አብነት", lat: 9.0262, lng: 38.7330, area: "Addis Ketema" },
  tekle_haimanot: { name: "Tekle Haimanot", am: "ተክለ ሃይማኖት", lat: 9.0275, lng: 38.7445, area: "Addis Ketema" },
  kolfe: { name: "Kolfe", am: "ቆልፌ", lat: 9.0300, lng: 38.7120, area: "Kolfe Keranyo", aliases: ["kolfe keranyo"] },
  shegole: { name: "Shegole", am: "ሸጎሌ", lat: 9.0050, lng: 38.6950, area: "Kolfe Keranyo", aliases: ["shegole bus depot", "shegole mender 7"] },
  zenebework: { name: "Zenebework", am: "ዘነበወርቅ", lat: 8.99, lng: 38.708, area: "Kolfe Keranyo", aliases: ["zenebe work long distance"] },
  ayer_tena: { name: "Ayer Tena", am: "አየር ጤና", lat: 8.994, lng: 38.693, area: "Kolfe Keranyo" },
  alem_bank: { name: "Alem Bank", am: "ዓለም ባንክ", lat: 9.0002, lng: 38.679, area: "Kolfe Keranyo" },
  torhailoch: { name: "Torhailoch", am: "ጦር ኃይሎች", lat: 9.0095, lng: 38.7215, area: "Lideta", aliases: ["tor hailoch", "army hospital"] },
  lideta: { name: "Lideta", am: "ልደታ", lat: 9.0170, lng: 38.7380, area: "Lideta", aliases: ["lideta court"] },
  coca: { name: "Coca", am: "ኮካ", lat: 9.013, lng: 38.732, area: "Lideta", aliases: ["coca cola"] },
  qerra: { name: "Qerra", am: "ቀራ", lat: 9.0020, lng: 38.7100, area: "Kolfe Keranyo", aliases: ["kera qerra", "brt terminus"] },

  // ── Kirkos / Lideta (centre) ─────────────────────────────────────────
  mexico: { name: "Mexico", am: "ሜክሲኮ", lat: 9.0105, lng: 38.7435, area: "Kirkos", aliases: ["mexico square", "wabe shebelle"] },
  sengatera: { name: "Sengatera", am: "ሰንጋ ተራ", lat: 9.0140, lng: 38.7470, area: "Lideta" },
  legehar: { name: "Legehar", am: "ለገሃር", lat: 9.0090, lng: 38.7525, area: "Kirkos", aliases: ["la gare", "old railway station"] },
  stadium: { name: "Stadium", am: "ስታዲየም", lat: 9.0125, lng: 38.7560, area: "Kirkos", aliases: ["addis ababa stadium", "st estfanos"] },
  meskel: { name: "Meskel Square", am: "መስቀል አደባባይ", lat: 9.0108, lng: 38.7612, area: "Kirkos", aliases: ["meskel", "mesqel", "st estifanos"] },
  kazanchis: { name: "Kazanchis", am: "ካዛንቺስ", lat: 9.0170, lng: 38.7640, area: "Kirkos", aliases: ["uneca", "eca"] },
  urael: { name: "Urael", am: "ኡራኤል", lat: 9.0140, lng: 38.7715, area: "Kirkos", aliases: ["ureal"] },
  bambis: { name: "Bambis", am: "ባምቢስ", lat: 9.0113, lng: 38.7745, area: "Kirkos" },
  olympia: { name: "Olympia", am: "ኦሎምፒያ", lat: 9.0065, lng: 38.7655, area: "Kirkos" },
  wollo_sefer: { name: "Wollo Sefer", am: "ወሎ ሰፈር", lat: 9.0000, lng: 38.7700, area: "Bole" },
  kera: { name: "Kera", am: "ቄራ", lat: 8.984, lng: 38.75, area: "Kirkos", aliases: ["kera market"] },
  bulgaria: { name: "Bulgaria", am: "ቡልጋሪያ", lat: 8.9998, lng: 38.7570, area: "Kirkos", aliases: ["bulgaria mazoria"] },
  lancha: { name: "Lancha", am: "ላንቻ", lat: 8.9903, lng: 38.7593, area: "Kirkos" },
  sar_bet: { name: "Sar Bet", am: "ሳር ቤት", lat: 8.996, lng: 38.74, area: "Nifas Silk-Lafto", aliases: ["sarbet"] },
  gofa: { name: "Gofa Mazoria", am: "ጎፋ ማዞሪያ", lat: 8.98, lng: 38.753, area: "Nifas Silk-Lafto", aliases: ["gofa", "gofa sefer"] },
  gotera: { name: "Gotera", am: "ጎተራ", lat: 8.979, lng: 38.759, area: "Nifas Silk-Lafto", aliases: ["gotera interchange"] },
  mekanisa: { name: "Mekanisa", am: "መካኒሳ", lat: 8.974, lng: 38.731, area: "Nifas Silk-Lafto" },

  // ── Nifas Silk / Lafto (south-west) ─────────────────────────────────
  haile_garment: { name: "Haile Garment", am: "ኃይሌ ጋርመንት", lat: 8.9372, lng: 38.7346, area: "Nifas Silk-Lafto" },
  lafto: { name: "Lafto", am: "ላፍቶ", lat: 8.95, lng: 38.742, area: "Nifas Silk-Lafto", aliases: ["lafto taxi terminal"] },
  jemo: { name: "Jemo", am: "ጀሞ", lat: 8.9580, lng: 38.7120, area: "Nifas Silk-Lafto", aliases: ["jemo condominium", "jemo 1", "jemo 2"] },
  jemo_winget: { name: "Jemo-Winget", am: "ጀሞ-ዊንጌት", lat: 8.9500, lng: 38.7050, area: "Nifas Silk-Lafto", aliases: ["winget", "brt corridor"] },
  lebu: { name: "Lebu", am: "ለቡ", lat: 8.956, lng: 38.725, area: "Nifas Silk-Lafto", aliases: ["lebu rail hub", "furi-lebu"] },
  mebrat_hail: { name: "Mebrat Hail", am: "መብራት ኃይል", lat: 8.9483, lng: 38.7337, area: "Kolfe Keranyo" },
  saris: { name: "Saris", am: "ሳሪስ", lat: 8.9455, lng: 38.768, area: "Akaki Kality", aliases: ["saris abo"] },
  saris_abo_terminal: { name: "Saris Abo Terminal", am: "ሳሪስ አቦ ተርሚናል", lat: 8.9420, lng: 38.7650, area: "Akaki Kality", aliases: ["saris taxi terminal"] },
  adey_abeba: { name: "Adey Abeba", am: "አደይ አበባ", lat: 8.9568, lng: 38.7638, area: "Nifas Silk-Lafto", aliases: ["adey abeba stadium"] },
  kality: { name: "Kality", am: "ቃሊቲ", lat: 8.9090, lng: 38.7720, area: "Akaki Kality", aliases: ["qality", "kaliti"] },
  kality_total: { name: "Kality Total", am: "ቃሊቲ ቶታል", lat: 8.9200, lng: 38.7680, area: "Akaki Kality", aliases: ["kality total mazoria", "total kality"] },
  kality_bus_terminal: { name: "Kality Bus Terminal", am: "ቃሊቲ መናኸሪያ", lat: 8.8943, lng: 38.7756, area: "Akaki Kality", aliases: ["kaliti national bus terminal", "kality menahriya"] },
  kality_menahriya: { name: "Kality Menahriya", am: "ቃሊቲ መናኸሪያ", lat: 8.9100, lng: 38.7710, area: "Akaki Kality", aliases: ["kality terminus"] },
  akaki: { name: "Akaki", am: "አቃቂ", lat: 8.87, lng: 38.79, area: "Akaki Kality", aliases: ["akaki gebeya"] },
  tulu_dimtu: { name: "Tulu Dimtu", am: "ቱሉ ዲምቱ", lat: 8.8745, lng: 38.8199, area: "Akaki Kality" },
  koye_feche: { name: "Koye Feche", am: "ቆጤ ፈጬ", lat: 8.9032, lng: 38.8248, area: "Akaki Kality", aliases: ["koye", "koye feche condominium"] },
  gelan: { name: "Gelan", am: "ገላን", lat: 8.9300, lng: 38.7850, area: "Akaki Kality", aliases: ["gelan condominium"] },
  derartu: { name: "Derartu", am: "ደራርቱ", lat: 8.9380, lng: 38.7750, area: "Akaki Kality", aliases: ["derartu tulu"] },
  sefera: { name: "Sefera", am: "ሰፈራ", lat: 8.8800, lng: 38.7800, area: "Akaki Kality", aliases: ["sefera square"] },

  // ── Bole / Yeka (east) ───────────────────────────────────────────────
  hayahulet: { name: "Haya Hulet", am: "ሃያ ሁለት", lat: 9.0125, lng: 38.7885, area: "Yeka", aliases: ["22 mazoria", "22"] },
  shola: { name: "Shola Market", am: "ሾላ ገበያ", lat: 9.0250, lng: 38.7949, area: "Yeka", aliases: ["shola gebeya", "shola market tera"] },
  megenagna: { name: "Megenagna", am: "መገናኛ", lat: 9.0196, lng: 38.802, area: "Yeka", aliases: ["zefmesh", "megenagna roundabout"] },
  megenagna_bole_subcity: { name: "Megenagna Bole Subcity", am: "መገናኛ ቦሌ ክፍለ ከተማ", lat: 9.0178, lng: 38.8018, area: "Yeka", aliases: ["mulgeta building terminal", "bole sub city office", "lhria"] },
  megenagna_new_terminal: { name: "Megenagna New Bus Terminal", am: "መገናኛ አዲስ መናኸሪያ", lat: 9.0210, lng: 38.8040, area: "Yeka", aliases: ["megenagna bus station", "new megenagna terminal"] },
  gurd_shola: { name: "Gurd Shola", am: "ጉርድ ሾላ", lat: 9.0185, lng: 38.8135, area: "Yeka" },
  lamberet: { name: "Lamberet", am: "ላምበረት", lat: 9.0262, lng: 38.8195, area: "Yeka", aliases: ["lamberet bus station", "lamberet menaharia"] },
  cmc: { name: "CMC", am: "ሲኤምሲ", lat: 9.0180, lng: 38.8430, area: "Yeka", aliases: ["cmc michael", "cmc electronics"] },
  figa: { name: "Figa", am: "ፊጋ", lat: 9.0100, lng: 38.8350, area: "Bole" },
  summit: { name: "Summit", am: "ሰሚት", lat: 9.0006, lng: 38.8510, area: "Bole", aliases: ["summit condominium"] },
  ayat: { name: "Ayat", am: "አያት", lat: 9.0320, lng: 38.8680, area: "Yeka", aliases: ["ayat condominium", "ayat zone"] },
  ayat_zone5: { name: "Ayat Zone 5", am: "አያት ዞን 5", lat: 9.0352, lng: 38.8741, area: "Yeka", aliases: ["ayat zone 5 tera"] },
  kotebe: { name: "Kotebe", am: "ኮተቤ", lat: 9.0410, lng: 38.8330, area: "Yeka", aliases: ["kotebe university"] },
  wesen: { name: "Wesen", am: "ወሰን", lat: 9.0328, lng: 38.8442, area: "Yeka", aliases: ["wesen grocery"] },
  yeka_abado: { name: "Yeka Abado", am: "የካ አባዶ", lat: 9.0600, lng: 38.8870, area: "Yeka" },
  tafo: { name: "Tafo", am: "ጣፎ", lat: 9.046, lng: 38.88, area: "Yeka", aliases: ["legetafo road", "tafo square"] },
  bole_medhanialem: { name: "Bole Medhanialem", am: "ቦሌ መድኃኔዓለም", lat: 8.9955, lng: 38.7868, area: "Bole", aliases: ["edna mall", "medhanialem", "bole road"] },
  bole_airport: { name: "Bole Airport", am: "ቦሌ አየር ማረፊያ", lat: 8.9800, lng: 38.7990, area: "Bole", aliases: ["airport", "bole international airport", "terminal"] },
  bole_michael: { name: "Bole Michael", am: "ቦሌ ሚካኤል", lat: 8.983, lng: 38.774, area: "Bole" },
  imperial: { name: "Imperial", am: "ኢምፔሪያል", lat: 9.0030, lng: 38.8000, area: "Bole", aliases: ["imperial hotel"] },
  gerji: { name: "Gerji", am: "ገርጂ", lat: 8.9965, lng: 38.8155, area: "Bole", aliases: ["gerji mebrat"] },
  gerji_roba: { name: "Gerji Roba", am: "ገርጂ ሮባ", lat: 8.9948, lng: 38.8136, area: "Bole", aliases: ["gerji bus station"] },
  gerji_sunshine: { name: "Gerji Sunshine", am: "ገርጂ ሰንሻይን", lat: 8.9935, lng: 38.8180, area: "Bole", aliases: ["gerji sunshine taxi"] },
  goro: { name: "Goro", am: "ጎሮ", lat: 8.9900, lng: 38.8600, area: "Bole", aliases: ["goro tera"] },
  bole_bulbula: { name: "Bole Bulbula", am: "ቦሌ ቡልቡላ", lat: 8.96, lng: 38.781, area: "Bole" },
  bole_arabsa: { name: "Bole Arabsa", am: "ቦሌ አራብሳ", lat: 8.9930, lng: 38.8550, area: "Bole", aliases: ["arabsa"] },
  wollo_bole: { name: "Atlas", am: "አትላስ", lat: 9.0000, lng: 38.7800, area: "Bole", aliases: ["atlas hotel"] },
  aba_kiros: { name: "Aba Kiros", am: "አባ ኪሮስ", lat: 9.0150, lng: 38.8500, area: "Bole", aliases: ["aba kiros terminal"] },
  abado_g7: { name: "Abado G-7 Square", am: "አባዶ ጂ-7", lat: 8.9950, lng: 38.8200, area: "Bole" },

  // ── Bethel / Bethel area ──────────────────────────────────────────────
  bethel: { name: "Bethel", am: "ቤቴል", lat: 8.9900, lng: 38.7900, area: "Bole", aliases: ["bethel bus station"] },

  // ── Out-of-town destinations (intercity) ─────────────────────────────
  sululta: { name: "Sululta", am: "ሱሉልታ", lat: 9.1830, lng: 38.7580, area: "Oromia" },
  sebeta: { name: "Sebeta", am: "ሰበታ", lat: 8.9170, lng: 38.6210, area: "Oromia" },
  dukem: { name: "Dukem", am: "ዱከም", lat: 8.7820, lng: 38.8960, area: "Oromia" },
  bishoftu: { name: "Bishoftu", am: "ቢሾፍቱ", lat: 8.7520, lng: 38.9810, area: "Oromia", aliases: ["debre zeit"] },
  adama: { name: "Adama", am: "አዳማ", lat: 8.5410, lng: 39.2690, area: "Oromia", aliases: ["nazret", "nazareth"] },
  holeta: { name: "Holeta", am: "ሆለታ", lat: 9.0650, lng: 38.5000, area: "Oromia" },
  ambo: { name: "Ambo", am: "አምቦ", lat: 8.9830, lng: 37.8500, area: "Oromia" },
  sendafa: { name: "Sendafa", am: "ሰንዳፋ", lat: 9.1500, lng: 39.0230, area: "Oromia" },
  debre_birhan: { name: "Debre Birhan", am: "ደብረ ብርሃን", lat: 9.6790, lng: 39.5320, area: "Amhara" },
  legetafo: { name: "Legetafo", am: "ለገጣፎ", lat: 9.0570, lng: 38.9100, area: "Oromia" },
  mojo: { name: "Mojo", am: "ሞጆ", lat: 8.7100, lng: 39.0700, area: "Oromia", aliases: ["mojo junction"] },
};

export type PlaceKey = keyof typeof places;
