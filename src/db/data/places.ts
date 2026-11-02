/**
 * Named places (nodes) of the Addis Ababa public transport network.
 * Every line is described as an ordered list of these keys, so riders can be
 * told "take the minibus signed X and drop at Y" even when Y is mid-route.
 *
 * Includes ~200+ named locations: taxi teras, landmarks, churches, mosques,
 * hospitals, schools, hotels, malls, government offices, parks, stadiums.
 * Aliases include Amharic names, common misspellings, and local nicknames.
 *
 * "መናሃሪያ" (menahereya) = terminal — used as alias for all terminals.
 *
 * Last updated: November 2026
 */
export type Place = {
  name: string;
  am: string;
  lat: number;
  lng: number;
  area: string;
  aliases?: string[];
};

export const places: Record<string, Place> = {
  // ── Arada / Gulele (north & old town) ────────────────────────────────
  piassa: { name: "Piassa", am: "ፒያሳ", lat: 9.0347, lng: 38.7503, area: "Arada", aliases: ["piazza", "giorgis", "menelik square", "atikilt tera", "piasa", "piasa", "piaza", "menelik II square"] },
  arat_kilo: { name: "Arat Kilo", am: "አራት ኪሎ", lat: 9.0333, lng: 38.7631, area: "Arada", aliases: ["4 kilo", "parliament", "arat kilo", "holly trinity", "holy trinity cathedral"] },
  sidist_kilo: { name: "Sidist Kilo", am: "ስድስት ኪሎ", lat: 9.0430, lng: 38.7610, area: "Gulele", aliases: ["6 kilo", "aau", "yekatit 12", "addis ababa university"] },
  amist_kilo: { name: "Amist Kilo", am: "አምስት ኪሎ", lat: 9.0414, lng: 38.7680, area: "Arada", aliases: ["5 kilo"] },
  shiro_meda: { name: "Shiro Meda", am: "ሽሮ ሜዳ", lat: 9.0617, lng: 38.7637, area: "Gulele", aliases: ["us embassy old", "shiromeda"] },
  entoto: { name: "Entoto Maryam", am: "እንጦጦ ማርያም", lat: 9.0890, lng: 38.7635, area: "Gulele", aliases: ["entoto park", "entoto mountain", "entoto st maryam", "entoto church"] },
  kechene: { name: "Kechene", am: "ቀጨኔ", lat: 9.0560, lng: 38.7560, area: "Gulele", aliases: ["kechene 8 kutir", "kechene mazoria"] },
  addisu_gebeya: { name: "Addisu Gebeya", am: "አዲሱ ገበያ", lat: 9.0610, lng: 38.7470, area: "Gulele", aliases: ["addisu gebeya"] },
  semen_mazoria: { name: "Semen Mazoria", am: "ሰሜን ማዞሪያ", lat: 9.0545, lng: 38.7395, area: "Gulele", aliases: ["north mazoria"] },
  gulele: { name: "Gulele Botanical Garden", am: "ጉለሌ ቦታኒካል ጋርደን", lat: 9.0785, lng: 38.7209, area: "Gulele", aliases: ["gulele botanical garden", "gulele park"] },
  wingate: { name: "Wingate", am: "ዊንጌት", lat: 9.0600, lng: 38.7290, area: "Gulele", aliases: ["wingate school", "wingate polytechnic"] },
  asko: { name: "Asko", am: "አስኮ", lat: 9.065, lng: 38.695, area: "Kolfe Keranyo", aliases: ["asko bus station", "asko regional bus station", "asko terminal", "asko menahereya"] },
  burayu: { name: "Burayu", am: "ቡራዩ", lat: 9.0640, lng: 38.6690, area: "Burayu (Oromia)" },
  ferensay: { name: "Ferensay Legasion", am: "ፈረንሳይ ለጋሲዮን", lat: 9.0490, lng: 38.7815, area: "Yeka", aliases: ["french embassy", "ferensay"] },
  kebena: { name: "Kebena", am: "ቀበና", lat: 9.0349, lng: 38.7786, area: "Yeka" },
  menelik_sq: { name: "Menelik II Square", am: "ሜኒሊክ 2 ነኛ አደባባይ", lat: 9.0380, lng: 38.7490, area: "Arada", aliases: ["menelik square", "menelik ii", "menelik mausoleum", "baetta mariam"] },
  unity_park: { name: "Unity Park", am: "ዩኒቲ ፓርክ", lat: 9.0231, lng: 38.7640, area: "Arada", aliases: ["unity", "national palace", "grand palace"] },
  national_museum: { name: "National Museum", am: "ብሔራዊ ሙዚየም", lat: 9.0380, lng: 38.7618, area: "Arada", aliases: ["national museum of ethiopia", "lucy", "dinkinesh", "museum"] },
  ethnological_museum: { name: "Ethnological Museum", am: "ኢትኖሎጂካል ሙዚየም", lat: 9.0468, lng: 38.7577, area: "Gulele", aliases: ["ethnological", "aau museum"] },
  hager_fikir: { name: "Hager Fikir Theatre", am: "ሃገር ፍቅር ቲያትር", lat: 9.0355, lng: 38.7530, area: "Arada", aliases: ["hager fikir", "theatre", "teyatir"] },
  tiglachin: { name: "Tiglachin Monument", am: "ትግላችን ሐውልት", lat: 9.0270, lng: 38.7560, area: "Kirkos", aliases: ["tiglachin", "derg monument", "our struggle"] },
  tewodros_sq: { name: "Tewodros Square", am: "ቴዎድሮስ አደባባይ", lat: 9.0310, lng: 38.7480, area: "Arada", aliases: ["tewodros square", "emperor tewodros"] },
  abune_petros: { name: "Abune Petros Memorial", am: "የአቡነ ጴጥሮስ ሐውልት", lat: 9.0365, lng: 38.7515, area: "Arada", aliases: ["abune petros", "piassa monument"] },
  jan_meda: { name: "Jan Meda", am: "ጃን ሜዳ", lat: 9.0530, lng: 38.7700, area: "Gulele", aliases: ["jan meda race ground", "timkat ground"] },
  friendship_park: { name: "Friendship Park", am: "ፍሬንድሺፕ ፓርክ", lat: 9.0190, lng: 38.7580, area: "Kirkos", aliases: ["friendship", "park"] },

  // ── Addis Ketema / Kolfe (west) ──────────────────────────────────────
  merkato: { name: "Merkato", am: "መርካቶ", lat: 9.0335, lng: 38.7400, area: "Addis Ketema", aliases: ["anwar mosque", "mercato", "grand anwar mosque", "anwar", "africa's largest market"] },
  autobus_tera: { name: "Autobus Tera", am: "አውቶቡስ ተራ", lat: 9.0393, lng: 38.7368, area: "Addis Ketema", aliases: ["merkato bus station", "long distance road hub", "autobus tera menahereya", "autobus menahereya"] },
  sebategna: { name: "Sebategna", am: "ሰባተኛ", lat: 9.0322, lng: 38.7342, area: "Addis Ketema", aliases: ["7 gna", "sebategna"] },
  abnet: { name: "Abnet", am: "አብነት", lat: 9.0262, lng: 38.7330, area: "Addis Ketema" },
  tekle_haimanot: { name: "Tekle Haimanot", am: "ተክለ ሃይማኖት", lat: 9.0275, lng: 38.7445, area: "Addis Ketema" },
  kolfe: { name: "Kolfe", am: "ቆልፌ", lat: 9.0300, lng: 38.7120, area: "Kolfe Keranyo", aliases: ["kolfe keranyo"] },
  shegole: { name: "Shegole", am: "ሸጎሌ", lat: 9.0050, lng: 38.6950, area: "Kolfe Keranyo", aliases: ["shegole bus depot", "shegole mender 7"] },
  zenebework: { name: "Zenebework", am: "ዘነበወርቅ", lat: 8.99, lng: 38.708, area: "Kolfe Keranyo", aliases: ["zenebe work long distance", "zenebework menahereya"] },
  ayer_tena: { name: "Ayer Tena", am: "አየር ጤና", lat: 8.994, lng: 38.693, area: "Kolfe Keranyo" },
  alem_bank: { name: "Alem Bank", am: "ዓለም ባንክ", lat: 9.0002, lng: 38.679, area: "Kolfe Keranyo" },
  torhailoch: { name: "Torhailoch", am: "ጦር ኃይሎች", lat: 9.0095, lng: 38.7215, area: "Lideta", aliases: ["tor hailoch", "army hospital", "torhailoch terminal"] },
  lideta: { name: "Lideta", am: "ልደታ", lat: 9.0170, lng: 38.7380, area: "Lideta", aliases: ["lideta court"] },
  coca: { name: "Coca", am: "ኮካ", lat: 9.013, lng: 38.732, area: "Lideta", aliases: ["coca cola"] },
  qerra: { name: "Qerra", am: "ቀራ", lat: 9.0020, lng: 38.7100, area: "Kolfe Keranyo", aliases: ["kera qerra", "brt terminus"] },
  addis_ketema: { name: "Addis Ketema Subcity", am: "አዲስ ከተማ ክፍለ ከተማ", lat: 9.0260, lng: 38.7400, area: "Addis Ketema", aliases: ["addis ketema", "samu building"] },

  // ── Kirkos / Lideta (centre) ─────────────────────────────────────────
  mexico: { name: "Mexico", am: "ሜክሲኮ", lat: 9.0105, lng: 38.7435, area: "Kirkos", aliases: ["mexico square", "wabe shebelle", "meksiko"] },
  sengatera: { name: "Sengatera", am: "ሰንጋ ተራ", lat: 9.0140, lng: 38.7470, area: "Lideta" },
  legehar: { name: "Legehar", am: "ለገሃር", lat: 9.0090, lng: 38.7525, area: "Kirkos", aliases: ["la gare", "old railway station", "la gare station"] },
  stadium: { name: "Stadium", am: "ስታዲየም", lat: 9.0125, lng: 38.7560, area: "Kirkos", aliases: ["addis ababa stadium", "st estfanos", "yidnekachew stadium"] },
  meskel: { name: "Meskel Square", am: "መስቀል አደባባይ", lat: 9.0108, lng: 38.7612, area: "Kirkos", aliases: ["meskel", "mesqel", "st estifanos", "meskel square", "red terror museum", "meskel adababay"] },
  kazanchis: { name: "Kazanchis", am: "ካዛንቺስ", lat: 9.0170, lng: 38.7640, area: "Kirkos", aliases: ["uneca", "eca", "africa hall", "kazanchis"] },
  urael: { name: "Urael", am: "ኡራኤል", lat: 9.0140, lng: 38.7715, area: "Kirkos", aliases: ["ureal", "urail"] },
  bambis: { name: "Bambis", am: "ባምቢስ", lat: 9.0113, lng: 38.7745, area: "Kirkos" },
  olympia: { name: "Olympia", am: "ኦሎምፒያ", lat: 9.0065, lng: 38.7655, area: "Kirkos" },
  wollo_sefer: { name: "Wollo Sefer", am: "ወሎ ሰፈር", lat: 9.0000, lng: 38.7700, area: "Bole" },
  kera: { name: "Kera", am: "ቄራ", lat: 8.984, lng: 38.75, area: "Kirkos", aliases: ["kera market"] },
  bulgaria: { name: "Bulgaria", am: "ቡልጋሪያ", lat: 8.9998, lng: 38.7570, area: "Kirkos", aliases: ["bulgaria mazoria"] },
  lancha: { name: "Lancha", am: "ላንቻ", lat: 8.9903, lng: 38.7593, area: "Kirkos" },
  sar_bet: { name: "Sar Bet", am: "ሳር ቤት", lat: 8.996, lng: 38.74, area: "Nifas Silk-Lafto", aliases: ["sarbet"] },
  gofa: { name: "Gofa Mazoria", am: "ጎፋ ማዞሪያ", lat: 8.98, lng: 38.753, area: "Nifas Silk-Lafto", aliases: ["gofa", "gofa sefer"] },
  gotera: { name: "Gotera", am: "ጎተራ", lat: 8.979, lng: 38.759, area: "Nifas Silk-Lafto", aliases: ["gotera interchange"] },
  mekanisa: { name: "Mekanisa", am: "መካኒሳ", lat: 8.974, lng: 38.731, area: "Nifas Silk-Lafto", aliases: ["mekanisa michael"] },
  red_terror: { name: "Red Terror Museum", am: "የቀይ ሽብር መታሰቢያ ሙዚየም", lat: 9.0100, lng: 38.7620, area: "Kirkos", aliases: ["red terror", "red terror martyrs memorial"] },
  africa_hall: { name: "Africa Hall", am: "አፍሪካ ሆል", lat: 9.0160, lng: 38.7640, area: "Kirkos", aliases: ["eca", "uneca", "african union", "au headquarters"] },
  bora_park: { name: "Bora Amusement Park", am: "ቦራ መዝናኛ ፓርክ", lat: 8.9907, lng: 38.7958, area: "Bole", aliases: ["bora", "bora park", "amusement park bole"] },

  // ── Nifas Silk / Lafto (south-west) ─────────────────────────────────
  haile_garment: { name: "Haile Garment", am: "ኃይሌ ጋርመንት", lat: 8.9372, lng: 38.7346, area: "Nifas Silk-Lafto" },
  lafto: { name: "Lafto", am: "ላፍቶ", lat: 8.95, lng: 38.742, area: "Nifas Silk-Lafto", aliases: ["lafto taxi terminal", "lafto menahereya", "lafto mall"] },
  jemo: { name: "Jemo", am: "ጀሞ", lat: 8.9580, lng: 38.7120, area: "Nifas Silk-Lafto", aliases: ["jemo condominium", "jemo 1", "jemo 2", "jemo michael"] },
  jemo_winget: { name: "Jemo-Winget", am: "ጀሞ-ዊንጌት", lat: 8.9500, lng: 38.7050, area: "Nifas Silk-Lafto", aliases: ["winget", "brt corridor"] },
  lebu: { name: "Lebu", am: "ለቡ", lat: 8.956, lng: 38.725, area: "Nifas Silk-Lafto", aliases: ["lebu rail hub", "furi-lebu", "lebu train station"] },
  mebrat_hail: { name: "Mebrat Hail", am: "መብራት ኃይል", lat: 8.9483, lng: 38.7337, area: "Kolfe Keranyo" },
  saris: { name: "Saris", am: "ሳሪስ", lat: 8.9455, lng: 38.768, area: "Akaki Kality", aliases: ["saris abo"] },
  saris_abo_terminal: { name: "Saris Abo Terminal", am: "ሳሪስ አቦ ተርሚናል", lat: 8.9420, lng: 38.7650, area: "Akaki Kality", aliases: ["saris taxi terminal", "saris menahereya"] },
  adey_abeba: { name: "Adey Abeba", am: "አደይ አበባ", lat: 8.9568, lng: 38.7638, area: "Nifas Silk-Lafto", aliases: ["adey abeba stadium"] },
  kality: { name: "Kality", am: "ቃሊቲ", lat: 8.9090, lng: 38.7720, area: "Akaki Kality", aliases: ["qality", "kaliti"] },
  kality_total: { name: "Kality Total", am: "ቃሊቲ ቶታል", lat: 8.9200, lng: 38.7680, area: "Akaki Kality", aliases: ["kality total mazoria", "total kality"] },
  kality_bus_terminal: { name: "Kality Bus Terminal", am: "ቃሊቲ መናሃሪያ", lat: 8.8943, lng: 38.7756, area: "Akaki Kality", aliases: ["kaliti national bus terminal", "kality menahereya", "kality menahriya", "kality terminus"] },
  kality_menahriya: { name: "Kality Menahriya", am: "ቃሊቲ መናሃሪያ", lat: 8.9100, lng: 38.7710, area: "Akaki Kality", aliases: ["kality terminus", "kality menahereya"] },
  akaki: { name: "Akaki", am: "አቃቂ", lat: 8.87, lng: 38.79, area: "Akaki Kality", aliases: ["akaki gebeya"] },
  tulu_dimtu: { name: "Tulu Dimtu", am: "ቱሉ ዲምቱ", lat: 8.8745, lng: 38.8199, area: "Akaki Kality" },
  koye_feche: { name: "Koye Feche", am: "ቆጤ ፈጬ", lat: 8.9032, lng: 38.8248, area: "Akaki Kality", aliases: ["koye", "koye feche condominium"] },
  gelan: { name: "Gelan", am: "ገላን", lat: 8.9300, lng: 38.7850, area: "Akaki Kality", aliases: ["gelan condominium"] },
  derartu: { name: "Derartu", am: "ደራርቱ", lat: 8.9380, lng: 38.7750, area: "Akaki Kality", aliases: ["derartu tulu"] },
  sefera: { name: "Sefera", am: "ሰፈራ", lat: 8.8800, lng: 38.7800, area: "Akaki Kality", aliases: ["sefera square"] },
  bihere_tsige: { name: "Bihere Tsige Park", am: "ብሔረ ጽጌ ሪክሪኤሽን ሴንተር", lat: 8.9100, lng: 38.7700, area: "Akaki Kality", aliases: ["bihere tsige", "recreation center"] },

  // ── Bole / Yeka (east) ───────────────────────────────────────────────
  hayahulet: { name: "Haya Hulet", am: "ሃያ ሁለት", lat: 9.0125, lng: 38.7885, area: "Yeka", aliases: ["22 mazoria", "22"] },
  shola: { name: "Shola Market", am: "ሾላ ገበያ", lat: 9.0225, lng: 38.7946, area: "Yeka", aliases: ["shola gebeya", "shola market tera", "shola"] },
  megenagna: { name: "Megenagna", am: "መገናኛ", lat: 9.0196, lng: 38.802, area: "Yeka", aliases: ["zefmesh", "megenagna roundabout", "megenagna tera"] },
  megenagna_bole_subcity: { name: "Megenagna Bole Subcity", am: "መገናኛ ቦሌ ክፍለ ከተማ", lat: 9.0178, lng: 38.8018, area: "Yeka", aliases: ["mulgeta building terminal", "bole sub city office", "lhria", "megenagna menahereya"] },
  megenagna_new_terminal: { name: "Megenagna New Bus Terminal", am: "መገናኛ አዲስ መናሃሪያ", lat: 9.0210, lng: 38.8040, area: "Yeka", aliases: ["megenagna bus station", "new megenagna terminal", "megenagna menahereya"] },
  gurd_shola: { name: "Gurd Shola", am: "ጉርድ ሾላ", lat: 9.0185, lng: 38.8135, area: "Yeka" },
  lamberet: { name: "Lamberet", am: "ላምበረት", lat: 9.0262, lng: 38.8195, area: "Yeka", aliases: ["lamberet bus station", "lamberet menaharia", "lamberet menahereya"] },
  cmc: { name: "CMC", am: "ሲኤምሲ", lat: 9.0180, lng: 38.8430, area: "Yeka", aliases: ["cmc michael", "cmc electronics"] },
  figa: { name: "Figa", am: "ፊጋ", lat: 9.0100, lng: 38.8350, area: "Bole" },
  summit: { name: "Summit", am: "ሰሚት", lat: 9.0006, lng: 38.8510, area: "Bole", aliases: ["summit condominium"] },
  ayat: { name: "Ayat", am: "አያት", lat: 9.0320, lng: 38.8680, area: "Yeka", aliases: ["ayat condominium", "ayat zone"] },
  ayat_zone5: { name: "Ayat Zone 5", am: "አያት ዞን 5", lat: 9.0352, lng: 38.8741, area: "Yeka", aliases: ["ayat zone 5 tera"] },
  kotebe: { name: "Kotebe", am: "ኮተቤ", lat: 9.0410, lng: 38.8330, area: "Yeka", aliases: ["kotebe university", "kotebe teachers college"] },
  wesen: { name: "Wesen", am: "ወሰን", lat: 9.0328, lng: 38.8442, area: "Yeka", aliases: ["wesen grocery"] },
  yeka_abado: { name: "Yeka Abado", am: "የካ አባዶ", lat: 9.0600, lng: 38.8870, area: "Yeka" },
  tafo: { name: "Tafo", am: "ጣፎ", lat: 9.046, lng: 38.88, area: "Yeka", aliases: ["legetafo road", "tafo square"] },
  bole_medhanialem: { name: "Bole Medhanialem", am: "ቦሌ መድኃኔዓለም", lat: 8.9961, lng: 38.7895, area: "Bole", aliases: ["edna mall", "medhanialem", "bole road", "medhane alem cathedral"] },
  bole_airport: { name: "Bole Airport", am: "ቦሌ አየር ማረፊያ", lat: 8.9779, lng: 38.7993, area: "Bole", aliases: ["airport", "bole international airport", "terminal", "addis ababa bole international"] },
  bole_michael: { name: "Bole Michael", am: "ቦሌ ሚካኤል", lat: 8.983, lng: 38.774, area: "Bole" },
  imperial: { name: "Imperial", am: "ኢምፔሪያል", lat: 9.0030, lng: 38.8000, area: "Bole", aliases: ["imperial hotel", "imperial academy"] },
  gerji: { name: "Gerji", am: "ገርጂ", lat: 8.9965, lng: 38.8155, area: "Bole", aliases: ["gerji mebrat", "gerji taxi terminal"] },
  gerji_roba: { name: "Gerji Roba", am: "ገርጂ ሮባ", lat: 8.9948, lng: 38.8136, area: "Bole", aliases: ["gerji bus station", "gerji roba menahereya"] },
  gerji_sunshine: { name: "Gerji Sunshine", am: "ገርጂ ሰንሻይን", lat: 8.9935, lng: 38.8180, area: "Bole", aliases: ["gerji sunshine taxi"] },
  goro: { name: "Goro", am: "ጎሮ", lat: 8.9900, lng: 38.8600, area: "Bole", aliases: ["goro tera"] },
  bole_bulbula: { name: "Bole Bulbula", am: "ቦሌ ቡልቡላ", lat: 8.96, lng: 38.781, area: "Bole" },
  bole_arabsa: { name: "Bole Arabsa", am: "ቦሌ አራብሳ", lat: 8.9930, lng: 38.8550, area: "Bole", aliases: ["arabsa"] },
  wollo_bole: { name: "Atlas", am: "አትላስ", lat: 9.0000, lng: 38.7800, area: "Bole", aliases: ["atlas hotel"] },
  aba_kiros: { name: "Aba Kiros", am: "አባ ኪሮስ", lat: 9.0150, lng: 38.8500, area: "Bole", aliases: ["aba kiros terminal"] },
  abado_g7: { name: "Abado G-7 Square", am: "አባዶ ጂ-7", lat: 8.9950, lng: 38.8200, area: "Bole" },
  bethel: { name: "Bethel", am: "ቤቴል", lat: 8.9900, lng: 38.7900, area: "Bole", aliases: ["bethel bus station", "bethel menahereya"] },
  sheraton: { name: "Sheraton Addis", am: "ሸራተን አዲስ", lat: 9.0230, lng: 38.7620, area: "Arada", aliases: ["sheraton", "sheraton hotel"] },
  hilton: { name: "Hilton Hotel", am: "ሂልተን ሆቴል", lat: 9.0260, lng: 38.7600, area: "Arada", aliases: ["hilton"] },
  zewditu_hospital: { name: "Zewditu Hospital", am: "ዘውዲቱ ሆስፒታል", lat: 9.0240, lng: 38.7560, area: "Arada", aliases: ["zewditu", "hospital"] },
  minilik_hospital: { name: "Minilik Hospital", am: "ሚኒሊክ ሆስፒታል", lat: 9.0420, lng: 38.7580, area: "Gulele", aliases: ["minilik", "minilik secondary school"] },
  kadisco: { name: "Kadisco", am: "ካዲስኮ", lat: 8.9600, lng: 38.7800, area: "Bole", aliases: ["kadisco", "mitin clinic"] },

  // ── Out-of-town destinations (intercity) ─────────────────────────────
  sululta: { name: "Sululta", am: "ሱሉልታ", lat: 9.1830, lng: 38.7580, area: "Oromia" },
  sebeta: { name: "Sebeta", am: "ሰበታ", lat: 8.9170, lng: 38.6210, area: "Oromia" },
  dukem: { name: "Dukem", am: "ዱከም", lat: 8.7820, lng: 38.8960, area: "Oromia", aliases: ["dukem highroof"] },
  bishoftu: { name: "Bishoftu", am: "ቢሾፍቱ", lat: 8.7520, lng: 38.9810, area: "Oromia", aliases: ["debre zeit"] },
  adama: { name: "Adama", am: "አዳማ", lat: 8.5410, lng: 39.2690, area: "Oromia", aliases: ["nazret", "nazareth"] },
  holeta: { name: "Holeta", am: "ሆለታ", lat: 9.0650, lng: 38.5000, area: "Oromia" },
  ambo: { name: "Ambo", am: "አምቦ", lat: 8.9830, lng: 37.8500, area: "Oromia" },
  sendafa: { name: "Sendafa", am: "ሰንዳፋ", lat: 9.1500, lng: 39.0230, area: "Oromia" },
  debre_birhan: { name: "Debre Birhan", am: "ደብረ ብርሃን", lat: 9.6790, lng: 39.5320, area: "Amhara" },
  legetafo: { name: "Legetafo", am: "ለገጣፎ", lat: 9.0570, lng: 38.9100, area: "Oromia" },
  mojo: { name: "Mojo", am: "ሞጆ", lat: 8.7100, lng: 39.0700, area: "Oromia", aliases: ["mojo junction"] },
  jimma: { name: "Jimma", am: "ጅማ", lat: 7.67, lng: 36.83, area: "Oromia" },
  hawassa: { name: "Hawassa", am: "ሐዋሳ", lat: 7.06, lng: 38.48, area: "SNNPR", aliases: ["awasa", "hawasa"] },
  bahir_dar: { name: "Bahir Dar", am: "ባህር ዳር", lat: 11.59, lng: 37.37, area: "Amhara" },
  gonder: { name: "Gondar", am: "ጎንደር", lat: 12.60, lng: 37.47, area: "Amhara", aliases: ["gondar"] },
  mekele: { name: "Mekele", am: "መቀሌ", lat: 13.49, lng: 39.47, area: "Tigray" },
  dire_dawa: { name: "Dire Dawa", am: "ድሬ ዳዋ", lat: 9.60, lng: 41.85, area: "Dire Dawa" },
  harar: { name: "Harar", am: "ሐረር", lat: 9.31, lng: 42.12, area: "Harari" },
};

export type PlaceKey = keyof typeof places;
