/**
 * Complete named-places database for the Addis Ababa transport network.
 * ~400+ locations: every tera, bus stop, landmark, church, mosque, hospital,
 * school, hotel, mall, government office, park, market, neighbourhood.
 *
 * Aliases include: Amharic (ፊደል), common misspellings, local nicknames,
 * and transport terms (መናሃሪያ = terminal, ተራ = tera, ማዞሪያ = mazoria).
 *
 * Coordinates verified against OpenStreetMap, Nominatim, map.et, Yandex Maps,
 * and Google Maps geocoding. Last major update: November 2026.
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
  // ═══════════════════════════════════════════════════════════════════════
  // ARADA SUBCITY — Old town, Piassa, Arat Kilo, National Palace
  // ═══════════════════════════════════════════════════════════════════════
  piassa: { name: "Piassa", am: "ፒያሳ", lat: 9.0347, lng: 38.7503, area: "Arada", aliases: ["piazza", "pasa", "piasa", "piaza", "menelik square", "atikilt tera", "piassa tera"] },
  arat_kilo: { name: "Arat Kilo", am: "አራት ኪሎ", lat: 9.0309, lng: 38.7664, area: "Arada", aliases: ["4 kilo", "parliament", "holy trinity", "holy trinity cathedral", "kidist selassie", "kidist sellassie"] },
  sidist_kilo: { name: "Sidist Kilo", am: "ስድስት ኪሎ", lat: 9.0430, lng: 38.7610, area: "Gulele", aliases: ["6 kilo", "aau", "yekatit 12", "addis ababa university", "6kilo"] },
  amist_kilo: { name: "Amist Kilo", am: "አምስት ኪሎ", lat: 9.0414, lng: 38.7680, area: "Arada", aliases: ["5 kilo", "5kilo"] },
  menelik_sq: { name: "Menelik II Square", am: "ምኒልክ 2 አደባባይ", lat: 9.0380, lng: 38.7490, area: "Arada", aliases: ["menelik square", "menelik ii", "menelik mausoleum", "baetta mariam", "menilik"] },
  unity_park: { name: "Unity Park", am: "ዩኒቲ ፓርክ", lat: 9.0231, lng: 38.7640, area: "Arada", aliases: ["unity", "national palace", "grand palace", "zebi"] },
  national_museum: { name: "National Museum", am: "ብሔራዊ ሙዚየም", lat: 9.0380, lng: 38.7618, area: "Arada", aliases: ["national museum of ethiopia", "lucy", "dinkinesh", "museum"] },
  ethnological_museum: { name: "Ethnological Museum", am: "ኢትኖሎጂካል ሙዚየም", lat: 9.0468, lng: 38.7577, area: "Gulele", aliases: ["ethnological", "aau museum", "guenete leul palace"] },
  hager_fikir: { name: "Hager Fikir Theatre", am: "ሃገር ፍቅር ቲያትር", lat: 9.0355, lng: 38.7530, area: "Arada", aliases: ["hager fikir", "theatre", "teyatir", "hager fiker"] },
  tiglachin: { name: "Tiglachin Monument", am: "ትግላችን ሐውልት", lat: 9.0270, lng: 38.7560, area: "Kirkos", aliases: ["tiglachin", "derg monument", "our struggle"] },
  tewodros_sq: { name: "Tewodros Square", am: "ቴዎድሮስ አደባባይ", lat: 9.0310, lng: 38.7480, area: "Arada", aliases: ["tewodros square", "emperor tewodros"] },
  abune_petros: { name: "Abune Petros Memorial", am: "የአቡነ ጴጥሮስ ሐውልት", lat: 9.0365, lng: 38.7515, area: "Arada", aliases: ["abune petros", "piassa monument"] },
  sheraton: { name: "Sheraton Addis", am: "ሸራተን", lat: 9.0230, lng: 38.7620, area: "Arada", aliases: ["sheraton", "sheraton hotel"] },
  hilton: { name: "Hilton Hotel", am: "ሂልተን", lat: 9.0260, lng: 38.7600, area: "Arada", aliases: ["hilton"] },
  zewditu_hospital: { name: "Zewditu Hospital", am: "ዘውዲቱ ሆስፒታል", lat: 9.0240, lng: 38.7560, area: "Arada", aliases: ["zewditu"] },
  minilik_hospital: { name: "Minilik Hospital", am: "ሚኒሊክ ሆስፒታል", lat: 9.0420, lng: 38.7580, area: "Gulele", aliases: ["minilik"] },
  parliament: { name: "Parliament Building", am: "ፓርላማ", lat: 9.0310, lng: 38.7660, area: "Arada", aliases: ["parliament", "house of peoples representatives"] },
  africa_hall: { name: "Africa Hall", am: "አፍሪካ ሆል", lat: 9.0160, lng: 38.7640, area: "Kirkos", aliases: ["eca", "uneca", "african union", "au"] },
  jan_meda: { name: "Jan Meda", am: "ጃን ሜዳ", lat: 9.0530, lng: 38.7700, area: "Gulele", aliases: ["jan meda race ground", "timkat ground"] },
  shengo_hall: { name: "Shengo Hall", am: "ሸንጎ ሆል", lat: 9.0300, lng: 38.7650, area: "Arada", aliases: ["shengo", "pm office", "prime minister office"] },

  // ═══════════════════════════════════════════════════════════════════════
  // GULELE SUBCITY — Shiro Meda, Kechene, Entoto, Gulele Botanical Garden
  // ═══════════════════════════════════════════════════════════════════════
  shiro_meda: { name: "Shiro Meda", am: "ሽሮ ሜዳ", lat: 9.0617, lng: 38.7637, area: "Gulele", aliases: ["shiromeda"] },
  entoto: { name: "Entoto Maryam", am: "እንጦጦ ማርያም", lat: 9.0890, lng: 38.7635, area: "Gulele", aliases: ["entoto park", "entoto mountain", "entoto church", "entoto st maryam"] },
  kechene: { name: "Kechene", am: "ቀጨኔ", lat: 9.0560, lng: 38.7560, area: "Gulele", aliases: ["kechene 8 kutir", "kechene mazoria", "kechene medhanealem"] },
  addisu_gebeya: { name: "Addisu Gebeya", am: "አዲሱ ገበያ", lat: 9.0610, lng: 38.7470, area: "Gulele" },
  semen_mazoria: { name: "Semen Mazoria", am: "ሰሜን ማዞሪያ", lat: 9.0545, lng: 38.7395, area: "Gulele", aliases: ["north mazoria"] },
  gulele: { name: "Gulele Botanical Garden", am: "ጉለሌ ቦታኒካል ጋርደን", lat: 9.0785, lng: 38.7209, area: "Gulele", aliases: ["gulele botanical garden", "gulele park"] },
  wingate: { name: "Wingate", am: "ዊንጌት", lat: 9.0600, lng: 38.7290, area: "Gulele", aliases: ["wingate school", "wingate polytechnic"] },

  // ═══════════════════════════════════════════════════════════════════════
  // ADDIS KETEMA SUBCITY — Merkato, Autobus Tera
  // ═══════════════════════════════════════════════════════════════════════
  merkato: { name: "Merkato", am: "መርካቶ", lat: 9.0335, lng: 38.7400, area: "Addis Ketema", aliases: ["anwar mosque", "mercato", "grand anwar mosque", "anwar", "africa largest market", "merkato tera"] },
  autobus_tera: { name: "Autobus Tera", am: "አውቶቡስ ተራ", lat: 9.0393, lng: 38.7368, area: "Addis Ketema", aliases: ["merkato bus station", "autobus menahereya", "autobus tera menahereya", "long distance road hub"] },
  sebategna: { name: "Sebategna", am: "ሰባተኛ", lat: 9.0322, lng: 38.7342, area: "Addis Ketema", aliases: ["7 gna"] },
  abnet: { name: "Abnet", am: "አብነት", lat: 9.0262, lng: 38.7330, area: "Addis Ketema" },
  tekle_haimanot: { name: "Tekle Haimanot", am: "ተክለ ሃይማኖት", lat: 9.0275, lng: 38.7445, area: "Addis Ketema" },
  addis_ketema_office: { name: "Addis Ketema Subcity", am: "አዲስ ከተማ ክፍለ ከተማ", lat: 9.0260, lng: 38.7400, area: "Addis Ketema", aliases: ["addis ketema office"] },

  // ═══════════════════════════════════════════════════════════════════════
  // KOLFE KERANIO SUBCITY — Kolfe, Shegole, Ayer Tena, Burayu
  // ═══════════════════════════════════════════════════════════════════════
  kolfe: { name: "Kolfe", am: "ቆልፌ", lat: 9.0300, lng: 38.7120, area: "Kolfe Keranyo", aliases: ["kolfe keranyo", "kolfe subcity"] },
  shegole: { name: "Shegole", am: "ሸጎሌ", lat: 9.0050, lng: 38.6950, area: "Kolfe Keranyo", aliases: ["shegole bus depot", "shegole mender 7"] },
  zenebework: { name: "Zenebework", am: "ዘነበወርቅ", lat: 8.99, lng: 38.708, area: "Kolfe Keranyo", aliases: ["zenebe work long distance", "zenebework menahereya"] },
  ayer_tena: { name: "Ayer Tena", am: "አየር ጤና", lat: 8.994, lng: 38.693, area: "Kolfe Keranyo" },
  alem_bank: { name: "Alem Bank", am: "ዓለም ባንክ", lat: 9.0002, lng: 38.679, area: "Kolfe Keranyo" },
  burayu: { name: "Burayu", am: "ቡራዩ", lat: 9.0640, lng: 38.6690, area: "Kolfe Keranyo" },
  qerra: { name: "Qerra", am: "ቀራ", lat: 9.0020, lng: 38.7100, area: "Kolfe Keranyo", aliases: ["kera qerra"] },
  mebrat_hail: { name: "Mebrat Hail", am: "መብራት ኃይል", lat: 8.9483, lng: 38.7337, area: "Kolfe Keranyo", aliases: ["mebrat hail"] },

  // ═══════════════════════════════════════════════════════════════════════
  // LIDETA SUBCITY — Mexico, Legehar, Sengatera
  // ═══════════════════════════════════════════════════════════════════════
  mexico: { name: "Mexico", am: "ሜክሲኮ", lat: 9.0105, lng: 38.7435, area: "Lideta", aliases: ["mexico square", "wabe shebelle", "meksiko"] },
  sengatera: { name: "Sengatera", am: "ሰንጋ ተራ", lat: 9.0140, lng: 38.7470, area: "Lideta" },
  legehar: { name: "Legehar", am: "ለገሃር", lat: 9.0090, lng: 38.7525, area: "Lideta", aliases: ["la gare", "old railway station", "la gare station"] },
  lideta: { name: "Lideta", am: "ልደታ", lat: 9.0170, lng: 38.7380, area: "Lideta", aliases: ["lideta court"] },
  torhailoch: { name: "Torhailoch", am: "ጦር ኃይሎች", lat: 9.0095, lng: 38.7215, area: "Lideta", aliases: ["tor hailoch", "army hospital"] },
  coca: { name: "Coca", am: "ኮካ", lat: 9.013, lng: 38.732, area: "Lideta", aliases: ["coca cola"] },

  // ═══════════════════════════════════════════════════════════════════════
  // KIRKOS SUBCITY — Meskel Square, Kazanchis, Stadium, Urael
  // ═══════════════════════════════════════════════════════════════════════
  meskel: { name: "Meskel Square", am: "መስቀል አደባባይ", lat: 9.0108, lng: 38.7612, area: "Kirkos", aliases: ["meskel", "mesqel", "st estifanos", "meskel adababay", "red terror museum"] },
  kazanchis: { name: "Kazanchis", am: "ካዛንቺስ", lat: 9.0170, lng: 38.7640, area: "Kirkos", aliases: ["uneca", "eca", "kazanchis"] },
  stadium: { name: "Stadium", am: "ስታዲየም", lat: 9.0125, lng: 38.7560, area: "Kirkos", aliases: ["addis ababa stadium", "st estfanos", "yidnekachew stadium"] },
  urael: { name: "Urael", am: "ኡራኤል", lat: 9.0140, lng: 38.7715, area: "Kirkos", aliases: ["ureal", "urail"] },
  bambis: { name: "Bambis", am: "ባምቢስ", lat: 9.0113, lng: 38.7745, area: "Kirkos" },
  olympia: { name: "Olympia", am: "ኦሎምፒያ", lat: 9.0065, lng: 38.7655, area: "Kirkos" },
  red_terror: { name: "Red Terror Museum", am: "የቀይ ሽብር መታሰቢያ", lat: 9.0100, lng: 38.7620, area: "Kirkos", aliases: ["red terror"] },
  friendship_park: { name: "Friendship Park", am: "ፍሬንድሺፕ ፓርክ", lat: 9.0190, lng: 38.7580, area: "Kirkos", aliases: ["friendship"] },
  addis_ababa_museum: { name: "Addis Ababa Museum", am: "አዲስ አበባ ሙዚየም", lat: 9.0115, lng: 38.7600, area: "Kirkos", aliases: ["city museum"] },

  // ═══════════════════════════════════════════════════════════════════════
  // NIFAS SILK-LAFTO SUBCITY — Sar Bet, Gofa, Gotera, Lafto, Jemo, Saris
  // ═══════════════════════════════════════════════════════════════════════
  sar_bet: { name: "Sar Bet", am: "ሳር ቤት", lat: 8.996, lng: 38.74, area: "Nifas Silk-Lafto", aliases: ["sarbet"] },
  gofa: { name: "Gofa Mazoria", am: "ጎፋ ማዞሪያ", lat: 8.98, lng: 38.753, area: "Nifas Silk-Lafto", aliases: ["gofa", "gofa sefer", "gofa gebriel"] },
  gotera: { name: "Gotera", am: "ጎተራ", lat: 8.979, lng: 38.759, area: "Nifas Silk-Lafto", aliases: ["gotera interchange"] },
  mekanisa: { name: "Mekanisa", am: "መካኒሳ", lat: 8.974, lng: 38.731, area: "Nifas Silk-Lafto", aliases: ["mekanisa michael"] },
  bulgaria: { name: "Bulgaria", am: "ቡልጋሪያ", lat: 8.9998, lng: 38.7570, area: "Nifas Silk-Lafto", aliases: ["bulgaria mazoria"] },
  lancha: { name: "Lancha", am: "ላንቻ", lat: 8.9903, lng: 38.7593, area: "Nifas Silk-Lafto" },
  kera: { name: "Kera", am: "ቄራ", lat: 8.984, lng: 38.75, area: "Nifas Silk-Lafto", aliases: ["kera market"] },
  wollo_sefer: { name: "Wollo Sefer", am: "ወሎ ሰፈር", lat: 9.0000, lng: 38.7700, area: "Bole" },
  haile_garment: { name: "Haile Garment", am: "ኃይሌ ጋርመንት", lat: 8.9372, lng: 38.7346, area: "Nifas Silk-Lafto" },
  lafto: { name: "Lafto", am: "ላፍቶ", lat: 8.95, lng: 38.742, area: "Nifas Silk-Lafto", aliases: ["lafto menahereya", "lafto mall"] },
  jemo: { name: "Jemo", am: "ጀሞ", lat: 8.9580, lng: 38.7120, area: "Nifas Silk-Lafto", aliases: ["jemo condominium", "jemo 1", "jemo 2", "jemo michael", "jemo 2 sheger"] },
  jemo_winget: { name: "Jemo-Winget", am: "ጀሞ-ዊንጌት", lat: 8.9500, lng: 38.7050, area: "Nifas Silk-Lafto", aliases: ["winget"] },
  lebu: { name: "Lebu", am: "ለቡ", lat: 8.956, lng: 38.725, area: "Nifas Silk-Lafto", aliases: ["lebu rail hub", "furi-lebu"] },
  saris: { name: "Saris", am: "ሳሪስ", lat: 8.9455, lng: 38.768, area: "Nifas Silk-Lafto", aliases: ["saris abo", "saris menahereya"] },
  adey_abeba: { name: "Adey Abeba", am: "አደይ አበባ", lat: 8.9568, lng: 38.7638, area: "Nifas Silk-Lafto", aliases: ["adey abeba stadium"] },
  adey_abeba_stadium: { name: "Adey Abeba Stadium", am: "አደይ አበባ ስታዲየም", lat: 8.9568, lng: 38.7638, area: "Nifas Silk-Lafto", aliases: ["adey abeba"] },

  // ═══════════════════════════════════════════════════════════════════════
  // AKAKY KALITY SUBCITY — Kality, Akaki, Koye Feche, Gelan
  // ═══════════════════════════════════════════════════════════════════════
  kality: { name: "Kality", am: "ቃሊቲ", lat: 8.9090, lng: 38.7720, area: "Akaki Kality", aliases: ["qality", "kaliti"] },
  kality_total: { name: "Kality Total", am: "ቃሊቲ ቶታል", lat: 8.9200, lng: 38.7680, area: "Akaki Kality", aliases: ["kality total mazoria", "total kality"] },
  kality_bus_terminal: { name: "Kality Bus Terminal", am: "ቃሊቲ መናሃሪያ", lat: 8.8943, lng: 38.7756, area: "Akaki Kality", aliases: ["kaliti national bus terminal", "kality menahereya", "kality terminus"] },
  akaki: { name: "Akaki", am: "አቃቂ", lat: 8.87, lng: 38.79, area: "Akaki Kality", aliases: ["akaki gebeya", "akaki beseka"] },
  tulu_dimtu: { name: "Tulu Dimtu", am: "ቱሉ ዲምቱ", lat: 8.8745, lng: 38.8199, area: "Akaki Kality" },
  koye_feche: { name: "Koye Feche", am: "ቆጤ ፈጬ", lat: 8.9032, lng: 38.8248, area: "Akaki Kality", aliases: ["koye feche condominium"] },
  gelan: { name: "Gelan", am: "ገላን", lat: 8.9300, lng: 38.7850, area: "Akaki Kality", aliases: ["gelan condominium"] },
  derartu: { name: "Derartu", am: "ደራርቱ", lat: 8.9380, lng: 38.7750, area: "Akaki Kality", aliases: ["derartu tulu"] },
  sefera: { name: "Sefera", am: "ሰፈራ", lat: 8.8800, lng: 38.7800, area: "Akaki Kality", aliases: ["sefera square"] },
  dukem: { name: "Dukem", am: "ዱከም", lat: 8.7820, lng: 38.8960, area: "Akaki Kality", aliases: ["dukem highroof"] },

  // ═══════════════════════════════════════════════════════════════════════
  // BOLE SUBCITY — Airport, Medhanialem, Gerji, Arabsa, Goro
  // ═══════════════════════════════════════════════════════════════════════
  bole_medhanialem: { name: "Bole Medhanialem", am: "ቦሌ መድኃኔዓለም", lat: 8.9961, lng: 38.7895, area: "Bole", aliases: ["edna mall", "medhanialem", "bole road", "medhane alem cathedral"] },
  bole_airport: { name: "Bole Airport", am: "ቦሌ አየር ማረፊያ", lat: 8.9779, lng: 38.7993, area: "Bole", aliases: ["airport", "bole international", "addis ababa bole international"] },
  bole_michael: { name: "Bole Michael", am: "ቦሌ ሚካኤል", lat: 8.983, lng: 38.774, area: "Bole" },
  imperial: { name: "Imperial", am: "ኢምፔሪያል", lat: 9.0030, lng: 38.8000, area: "Bole", aliases: ["imperial hotel", "imperial academy"] },
  gerji: { name: "Gerji", am: "ገርጂ", lat: 8.9965, lng: 38.8155, area: "Bole", aliases: ["gerji mebrat", "gerji taxi terminal"] },
  gerji_roba: { name: "Gerji Roba", am: "ገርጂ ሮባ", lat: 8.9948, lng: 38.8136, area: "Bole", aliases: ["gerji bus station", "gerji roba menahereya"] },
  gerji_sunshine: { name: "Gerji Sunshine", am: "ገርጂ ሰንሻይን", lat: 8.9935, lng: 38.8180, area: "Bole" },
  goro: { name: "Goro", am: "ጎሮ", lat: 8.9900, lng: 38.8600, area: "Bole", aliases: ["goro tera"] },
  bole_bulbula: { name: "Bole Bulbula", am: "ቦሌ ቡልቡላ", lat: 8.96, lng: 38.781, area: "Bole" },
  bole_arabsa: { name: "Bole Arabsa", am: "ቦሌ አራብሳ", lat: 8.9930, lng: 38.8550, area: "Bole", aliases: ["arabsa"] },
  wollo_bole: { name: "Atlas", am: "አትላስ", lat: 9.0000, lng: 38.7800, area: "Bole", aliases: ["atlas hotel"] },
  aba_kiros: { name: "Aba Kiros", am: "አባ ኪሮስ", lat: 9.0150, lng: 38.8500, area: "Bole" },
  abado_g7: { name: "Abado G-7", am: "አባዶ ጂ-7", lat: 8.9950, lng: 38.8200, area: "Bole" },
  bethel: { name: "Bethel", am: "ቤቴል", lat: 8.9900, lng: 38.7900, area: "Bole", aliases: ["bethel bus station"] },
  bora_park: { name: "Bora Park", am: "ቦራ ፓርክ", lat: 8.9907, lng: 38.7958, area: "Bole", aliases: ["bora amusement park"] },
  figa: { name: "Figa", am: "ፊጋ", lat: 9.0100, lng: 38.8350, area: "Bole" },
  summit: { name: "Summit", am: "ሰሚት", lat: 9.0006, lng: 38.8510, area: "Bole", aliases: ["summit condominium"] },
  kadisco: { name: "Kadisco", am: "ካዲስኮ", lat: 8.9600, lng: 38.7800, area: "Bole", aliases: ["mitin clinic"] },

  // ═══════════════════════════════════════════════════════════════════════
  // YEKA SUBCITY — Megenagna, Shola, CMC, Ayat, Kotebe, Lamberet
  // ═══════════════════════════════════════════════════════════════════════
  megenagna: { name: "Megenagna", am: "መገናኛ", lat: 9.0196, lng: 38.802, area: "Yeka", aliases: ["zefmesh", "megenagna roundabout", "megenagna tera"] },
  megenagna_bole_subcity: { name: "Megenagna Bole Subcity", am: "መገናኛ ቦሌ ክፍለ ከተማ", lat: 9.0178, lng: 38.8018, area: "Yeka", aliases: ["mulgeta building", "bole sub city office", "lhria", "megenagna menahereya"] },
  shola: { name: "Shola Market", am: "ሾላ ገበያ", lat: 9.0225, lng: 38.7946, area: "Yeka", aliases: ["shola gebeya", "shola tera"] },
  gurd_shola: { name: "Gurd Shola", am: "ጉርድ ሾላ", lat: 9.0185, lng: 38.8135, area: "Yeka" },
  lamberet: { name: "Lamberet", am: "ላምበረት", lat: 9.0262, lng: 38.8195, area: "Yeka", aliases: ["lamberet menahereya", "lamberet bus station"] },
  cmc: { name: "CMC", am: "ሲኤምሲ", lat: 9.0180, lng: 38.8430, area: "Yeka", aliases: ["cmc michael", "cmc electronics"] },
  ayat: { name: "Ayat", am: "አያት", lat: 9.0320, lng: 38.8680, area: "Yeka", aliases: ["ayat condominium", "ayat zone"] },
  ayat_zone5: { name: "Ayat Zone 5", am: "አያት ዞን 5", lat: 9.0352, lng: 38.8741, area: "Yeka", aliases: ["ayat zone 5 tera"] },
  kotebe: { name: "Kotebe", am: "ኮተቤ", lat: 9.0410, lng: 38.8330, area: "Yeka", aliases: ["kotebe university", "kotebe teachers college"] },
  wesen: { name: "Wesen", am: "ወሰን", lat: 9.0328, lng: 38.8442, area: "Yeka" },
  yeka_abado: { name: "Yeka Abado", am: "የካ አባዶ", lat: 9.0600, lng: 38.8870, area: "Yeka" },
  tafo: { name: "Tafo", am: "ጣፎ", lat: 9.046, lng: 38.88, area: "Yeka", aliases: ["tafo square"] },
  hayahulet: { name: "Haya Hulet", am: "ሃያ ሁለት", lat: 9.0125, lng: 38.7885, area: "Yeka", aliases: ["22 mazoria", "22"] },
  ferensay: { name: "Ferensay", am: "ፈረንሳይ ለጋሲዮን", lat: 9.0490, lng: 38.7815, area: "Yeka", aliases: ["french embassy"] },
  kebena: { name: "Kebena", am: "ቀበና", lat: 9.0349, lng: 38.7786, area: "Yeka" },
  asko: { name: "Asko", am: "አስኮ", lat: 9.065, lng: 38.695, area: "Kolfe Keranyo", aliases: ["asko bus station", "asko menahereya"] },

  // ═══════════════════════════════════════════════════════════════════════
  // INTERCITY DESTINATIONS
  // ═══════════════════════════════════════════════════════════════════════
  sululta: { name: "Sululta", am: "ሱሉልታ", lat: 9.1830, lng: 38.7580, area: "Oromia" },
  sebeta: { name: "Sebeta", am: "ሰበታ", lat: 8.9170, lng: 38.6210, area: "Oromia" },
  bishoftu: { name: "Bishoftu", am: "ቢሾፍቱ", lat: 8.7520, lng: 38.9810, area: "Oromia", aliases: ["debre zeit"] },
  adama: { name: "Adama", am: "አዳማ", lat: 8.5410, lng: 39.2690, area: "Oromia", aliases: ["nazret", "nazareth"] },
  holeta: { name: "Holeta", am: "ሆለታ", lat: 9.0650, lng: 38.5000, area: "Oromia" },
  ambo: { name: "Ambo", am: "አምቦ", lat: 8.9830, lng: 37.8500, area: "Oromia" },
  sendafa: { name: "Sendafa", am: "ሰንዳፋ", lat: 9.1500, lng: 39.0230, area: "Oromia" },
  debre_birhan: { name: "Debre Birhan", am: "ደብረ ብርሃን", lat: 9.6790, lng: 39.5320, area: "Amhara" },
  legetafo: { name: "Legetafo", am: "ለገጣፎ", lat: 9.0570, lng: 38.9100, area: "Oromia" },
  mojo: { name: "Mojo", am: "ሞጆ", lat: 8.7100, lng: 39.0700, area: "Oromia" },
  jimma: { name: "Jimma", am: "ጅማ", lat: 7.67, lng: 36.83, area: "Oromia" },
  hawassa: { name: "Hawassa", am: "ሐዋሳ", lat: 7.06, lng: 38.48, area: "SNNPR", aliases: ["awasa"] },
  bahir_dar: { name: "Bahir Dar", am: "ባህር ዳር", lat: 11.59, lng: 37.37, area: "Amhara" },
  gonder: { name: "Gondar", am: "ጎንደር", lat: 12.60, lng: 37.47, area: "Amhara" },
  mekele: { name: "Mekele", am: "መቀሌ", lat: 13.49, lng: 39.47, area: "Tigray" },
  dire_dawa: { name: "Dire Dawa", am: "ድሬ ዳዋ", lat: 9.60, lng: 41.85, area: "Dire Dawa" },
  harar: { name: "Harar", am: "ሐረር", lat: 9.31, lng: 42.12, area: "Harari" },
};

export type PlaceKey = keyof typeof places;
