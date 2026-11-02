/**
 * Essential places database for Addis Ababa transport network.
 * Focuses on major landmarks, transit hubs, and important locations.
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
  // ARADA SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  piassa: { name: "Piassa", am: "ፒያሳ", lat: 9.0347, lng: 38.7503, area: "Arada", aliases: ["piazza", "pasa", "menelik square"] },
  arat_kilo: { name: "Arat Kilo", am: "አራት ኪሎ", lat: 9.0309, lng: 38.7664, area: "Arada", aliases: ["4 kilo", "parliament", "holy trinity"] },
  sidist_kilo: { name: "Sidist Kilo", am: "ስድስት ኪሎ", lat: 9.0430, lng: 38.7610, area: "Arada", aliases: ["6 kilo", "aau"] },
  unity_park: { name: "Unity Park", am: "ዩኒቲ ፓርክ", lat: 9.0231, lng: 38.7640, area: "Arada", aliases: ["national palace"] },
  national_museum: { name: "National Museum", am: "ብሔራዊ ሙዚየም", lat: 9.0380, lng: 38.7618, area: "Arada", aliases: ["lucy", "dinkinesh"] },
  sheraton: { name: "Sheraton Addis", am: "ሸራተን", lat: 9.0230, lng: 38.7620, area: "Arada" },
  hilton: { name: "Hilton Hotel", am: "ሂልተን", lat: 9.0260, lng: 38.7600, area: "Arada" },
  ghion_hotel: { name: "Ghion Hotel", am: "ጊዮን ሆቴል", lat: 9.0380, lng: 38.7615, area: "Arada", aliases: ["ghion"] },
  zewditu_hospital: { name: "Zewditu Hospital", am: "ዘውዲቱ ሆስፒታል", lat: 9.0240, lng: 38.7560, area: "Arada" },
  shiro_meda: { name: "Shiro Meda", am: "ሽሮ ሜዳ", lat: 9.0617, lng: 38.7637, area: "Arada" },

  // ═══════════════════════════════════════════════════════════════════════
  // KIRKOS SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  meskel: { name: "Meskel Square", am: "መስቀል አደባባይ", lat: 9.0108, lng: 38.7612, area: "Kirkos", aliases: ["meskel", "red terror museum"] },
  kazanchis: { name: "Kazanchis", am: "ካዛንቺስ", lat: 9.0170, lng: 38.7640, area: "Kirkos", aliases: ["uneca", "eca"] },
  stadium: { name: "Stadium", am: "ስታዲየም", lat: 9.0125, lng: 38.7560, area: "Kirkos", aliases: ["addis ababa stadium"] },
  urael: { name: "Urael", am: "ኡራኤል", lat: 9.0140, lng: 38.7715, area: "Kirkos" },
  africa_hall: { name: "Africa Hall", am: "አፍሪካ ሆል", lat: 9.0160, lng: 38.7640, area: "Kirkos", aliases: ["au"] },
  tiglachin: { name: "Tiglachin Monument", am: "ትግላችን ሐውልት", lat: 9.0270, lng: 38.7560, area: "Kirkos", aliases: ["derg monument"] },

  // ═══════════════════════════════════════════════════════════════════════
  // GULELE SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  kechene: { name: "Kechene", am: "ቀጨኔ", lat: 9.0560, lng: 38.7560, area: "Gulele" },
  entoto: { name: "Entoto Maryam", am: "እንጦጦ ማርያም", lat: 9.0890, lng: 38.7635, area: "Gulele", aliases: ["entoto park"] },
  minilik_hospital: { name: "Minilik Hospital", am: "ሚኒሊክ ሆስፒታል", lat: 9.0420, lng: 38.7580, area: "Gulele" },
  addisu_gebeya: { name: "Addisu Gebeya", am: "አዲሱ ገበያ", lat: 9.0610, lng: 38.7470, area: "Gulele" },
  wingate: { name: "Wingate", am: "ዊንጌት", lat: 9.0600, lng: 38.7290, area: "Gulele" },

  // ═══════════════════════════════════════════════════════════════════════
  // ADDIS KETEMA SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  merkato: { name: "Merkato", am: "መርካቶ", lat: 9.0335, lng: 38.7400, area: "Addis Ketema", aliases: ["anwar mosque", "mercato"] },
  autobus_tera: { name: "Autobus Tera", am: "አውቶቡስ ተራ", lat: 9.0393, lng: 38.7368, area: "Addis Ketema", aliases: ["merkato bus station"] },

  // ═══════════════════════════════════════════════════════════════════════
  // LIDETA SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  mexico: { name: "Mexico", am: "ሜክሲኮ", lat: 9.0105, lng: 38.7435, area: "Lideta", aliases: ["mexico square"] },
  legehar: { name: "Legehar", am: "ለገሃር", lat: 9.0090, lng: 38.7525, area: "Lideta", aliases: ["la gare"] },
  lideta: { name: "Lideta", am: "ልደታ", lat: 9.0170, lng: 38.7380, area: "Lideta" },
  torhailoch: { name: "Torhailoch", am: "ጦር ኃይሎች", lat: 9.0095, lng: 38.7215, area: "Lideta" },

  // ═══════════════════════════════════════════════════════════════════════
  // BOLE SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  bole_medhanialem: { name: "Bole Medhanialem", am: "ቦሌ መድኃኔዓለም", lat: 8.9961, lng: 38.7895, area: "Bole", aliases: ["edna mall"] },
  bole_airport: { name: "Bole Airport", am: "ቦሌ አየር ማረፊያ", lat: 8.9779, lng: 38.7993, area: "Bole", aliases: ["airport"] },
  bole_michael: { name: "Bole Michael", am: "ቦሌ ሚካኤል", lat: 8.983, lng: 38.774, area: "Bole" },
  bole_bulbula: { name: "Bole Bulbula", am: "ቦሌ ቡልቡላ", lat: 8.96, lng: 38.781, area: "Bole" },
  gerji: { name: "Gerji", am: "ገርጂ", lat: 8.9965, lng: 38.8155, area: "Bole" },
  gerji_roba: { name: "Gerji Roba", am: "ገርጂ ሮባ", lat: 8.9948, lng: 38.8136, area: "Bole" },
  gerji_sunshine: { name: "Gerji Sunshine", am: "ገርጂ ሰንሻይን", lat: 8.9935, lng: 38.8180, area: "Bole" },
  goro: { name: "Goro", am: "ጎሮ", lat: 8.9900, lng: 38.8600, area: "Bole" },
  bethel: { name: "Bethel", am: "ቤቴል", lat: 8.9900, lng: 38.7900, area: "Bole" },
  summit: { name: "Summit", am: "ሰሚት", lat: 9.0006, lng: 38.8510, area: "Bole" },
  wollo_sefer: { name: "Wollo Sefer", am: "ወሎ ሰፈር", lat: 9.0000, lng: 38.7700, area: "Bole" },

  // ═══════════════════════════════════════════════════════════════════════
  // YEKA SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  megenagna: { name: "Megenagna", am: "መገናኛ", lat: 9.0196, lng: 38.802, area: "Yeka", aliases: ["zefmesh"] },
  megenagna_bole_subcity: { name: "Megenagna Bole Subcity", am: "መገናኛ ቦሌ ክፍለ ከተማ", lat: 9.0178, lng: 38.8018, area: "Yeka" },
  shola: { name: "Shola Market", am: "ሾላ ገበያ", lat: 9.0225, lng: 38.7946, area: "Yeka", aliases: ["shola gebeya"] },
  cmc: { name: "CMC", am: "ሲኤምሲ", lat: 9.0180, lng: 38.8430, area: "Yeka" },
  ayat: { name: "Ayat", am: "አያት", lat: 9.0320, lng: 38.8680, area: "Yeka" },
  kotebe: { name: "Kotebe", am: "ኮተቤ", lat: 9.0410, lng: 38.8330, area: "Yeka" },
  lamberet: { name: "Lamberet", am: "ላምበረት", lat: 9.0262, lng: 38.8195, area: "Yeka" },
  hayahulet: { name: "Haya Hulet", am: "ሃያ ሁለት", lat: 9.0125, lng: 38.7885, area: "Yeka" },
  ferensay: { name: "Ferensay", am: "ፈረንሳይ", lat: 9.0490, lng: 38.7815, area: "Yeka" },
  wesen: { name: "Wesen", am: "ወሰን", lat: 9.0328, lng: 38.8442, area: "Yeka" },
  yeka_abado: { name: "Yeka Abado", am: "የካ አባዶ", lat: 9.0600, lng: 38.8870, area: "Yeka" },

  // ═══════════════════════════════════════════════════════════════════════
  // NIFAS SILK-LAFTO SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  sar_bet: { name: "Sar Bet", am: "ሳር ቤት", lat: 8.996, lng: 38.74, area: "Nifas Silk-Lafto" },
  gofa: { name: "Gofa Mazoria", am: "ጎፋ ማዞሪያ", lat: 8.98, lng: 38.753, area: "Nifas Silk-Lafto" },
  bulgaria: { name: "Bulgaria", am: "ቡልጋሪያ", lat: 8.9998, lng: 38.7570, area: "Nifas Silk-Lafto" },
  gotera: { name: "Gotera", am: "ጎተራ", lat: 8.979, lng: 38.759, area: "Nifas Silk-Lafto" },
  mekanisa: { name: "Mekanisa", am: "መካኒሳ", lat: 8.974, lng: 38.731, area: "Nifas Silk-Lafto" },
  lafto: { name: "Lafto", am: "ላፍቶ", lat: 8.95, lng: 38.742, area: "Nifas Silk-Lafto" },
  jemo: { name: "Jemo", am: "ጀሞ", lat: 8.9580, lng: 38.7120, area: "Nifas Silk-Lafto" },
  lebu: { name: "Lebu", am: "ለቡ", lat: 8.956, lng: 38.725, area: "Nifas Silk-Lafto" },
  saris: { name: "Saris", am: "ሳሪስ", lat: 8.9455, lng: 38.768, area: "Nifas Silk-Lafto" },
  adey_abeba: { name: "Adey Abeba", am: "አደይ አበባ", lat: 8.9568, lng: 38.7638, area: "Nifas Silk-Lafto" },
  haile_garment: { name: "Haile Garment", am: "ኃይሌ ጋርመንት", lat: 8.9372, lng: 38.7346, area: "Nifas Silk-Lafto" },

  // ═══════════════════════════════════════════════════════════════════════
  // KOLFE KERANYO SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  kolfe: { name: "Kolfe", am: "ቆልፌ", lat: 9.0300, lng: 38.7120, area: "Kolfe Keranyo" },
  shegole: { name: "Shegole", am: "ሸጎሌ", lat: 9.0050, lng: 38.6950, area: "Kolfe Keranyo" },
  zenebework: { name: "Zenebework", am: "ዘነበወርቅ", lat: 8.99, lng: 38.708, area: "Kolfe Keranyo" },
  alem_bank: { name: "Alem Bank", am: "ዓለም ባንክ", lat: 9.0002, lng: 38.679, area: "Kolfe Keranyo" },
  burayu: { name: "Burayu", am: "ቡራዩ", lat: 9.0640, lng: 38.6690, area: "Kolfe Keranyo" },
  asko: { name: "Asko", am: "አስኮ", lat: 9.065, lng: 38.695, area: "Kolfe Keranyo" },
  ayer_tena: { name: "Ayer Tena", am: "አየር ጤና", lat: 8.9944, lng: 38.6918, area: "Kolfe Keranyo" },

  // ═══════════════════════════════════════════════════════════════════════
  // AKAKI KALITY SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  kality: { name: "Kality", am: "ቃሊቲ", lat: 8.9090, lng: 38.7720, area: "Akaki Kality" },
  kality_total: { name: "Kality Total", am: "ቃሊቲ ቶታል", lat: 8.9200, lng: 38.7680, area: "Akaki Kality" },
  kality_bus_terminal: { name: "Kality Bus Terminal", am: "ቃሊቲ መናሃሪያ", lat: 8.8943, lng: 38.7756, area: "Akaki Kality" },
  akaki: { name: "Akaki", am: "አቃቂ", lat: 8.87, lng: 38.79, area: "Akaki Kality" },
  tulu_dimtu: { name: "Tulu Dimtu", am: "ቱሉ ዲምቱ", lat: 8.8745, lng: 38.8199, area: "Akaki Kality" },
  koye_feche: { name: "Koye Feche", am: "ቆጤ ፈጬ", lat: 8.9032, lng: 38.8248, area: "Akaki Kality" },
  gelan: { name: "Gelan", am: "ገላን", lat: 8.9300, lng: 38.7850, area: "Akaki Kality" },
  dukem: { name: "Dukem", am: "ዱከም", lat: 8.7820, lng: 38.8960, area: "Akaki Kality" },

  // ═══════════════════════════════════════════════════════════════════════
  // INTERCITY DESTINATIONS
  // ═══════════════════════════════════════════════════════════════════════
  bishoftu: { name: "Bishoftu", am: "ቢሾፍቱ", lat: 8.7520, lng: 38.9810, area: "Oromia", aliases: ["debre zeit"] },
  adama: { name: "Adama", am: "አዳማ", lat: 8.5410, lng: 39.2690, area: "Oromia", aliases: ["nazret"] },
  jimma: { name: "Jimma", am: "ጅማ", lat: 7.67, lng: 36.83, area: "Oromia" },
  hawassa: { name: "Hawassa", am: "ሐዋሳ", lat: 7.06, lng: 38.48, area: "SNNPR" },
  bahir_dar: { name: "Bahir Dar", am: "ባህር ዳር", lat: 11.59, lng: 37.37, area: "Amhara" },
  gonder: { name: "Gondar", am: "ጎንደር", lat: 12.60, lng: 37.47, area: "Amhara" },
  debre_birhan: { name: "Debre Birhan", am: "ደብረ ብርሃን", lat: 9.6800, lng: 39.5300, area: "Amhara" },
  ambo: { name: "Ambo", am: "አምቦ", lat: 8.9850, lng: 37.8500, area: "Oromia" },
  sebeta: { name: "Sebeta", am: "ሰበታ", lat: 8.8700, lng: 38.6300, area: "Oromia" },
  sululta: { name: "Sululta", am: "ሱልልጣ", lat: 9.1800, lng: 38.7200, area: "Oromia" },
  sendafa: { name: "Sendafa", am: "ሰንደፋ", lat: 9.1500, lng: 38.7800, area: "Oromia" },
  holeta: { name: "Holeta", am: "ሆሌታ", lat: 8.9600, lng: 38.5800, area: "Oromia" },
  tafo: { name: "Tafo", am: "ታፎ", lat: 9.0200, lng: 38.6500, area: "Oromia" },

  // ═══════════════════════════════════════════════════════════════════════
  // ADDITIONAL ROUTE PLACES (referenced in route via arrays)
  // ═══════════════════════════════════════════════════════════════════════
  gurd_shola: { name: "Gurd Shola", am: "ጉርድ ሾላ", lat: 9.0280, lng: 38.8150, area: "Nefas Silk-Lafto", aliases: ["gurd"] },
  imperial: { name: "Imperial", am: "ኢምፔሪያል", lat: 9.0180, lng: 38.8050, area: "Bole", aliases: ["imperial hotel"] },
  kera: { name: "Kera", am: "ቀራ", lat: 8.9850, lng: 38.7550, area: "Nifas Silk-Lafto" },
  figa: { name: "Figa", am: "ፊጋ", lat: 9.0150, lng: 38.8850, area: "Yeka" },
  coca: { name: "Coca", am: "ኮካ", lat: 8.9950, lng: 38.7850, area: "Nifas Silk-Lafto" },
  lancha: { name: "Lancha", am: "ላንቻ", lat: 8.9750, lng: 38.7450, area: "Nifas Silk-Lafto" },
  kebena: { name: "Kebena", am: "ከበና", lat: 8.9450, lng: 38.7350, area: "Nifas Silk-Lafto" },
  mebrat_hail: { name: "Mebrat Hail", am: "መብራት ሃይል", lat: 9.0220, lng: 38.7580, area: "Addis Ketema" },
  olympia: { name: "Olympia", am: "ኦሊምፒያ", lat: 9.0050, lng: 38.7450, area: "Addis Ketema", aliases: ["olympia cinema"] },
  tekle_haimanot: { name: "Tekle Haimanot", am: "ተክለ ሃይማኖት", lat: 9.0280, lng: 38.7350, area: "Addis Ketema", aliases: ["teklehaimanot"] },
  wollo_bole: { name: "Wollo Bole", am: "ወሎ ቦሌ", lat: 9.0150, lng: 38.7950, area: "Bole" },
  bole_arabsa: { name: "Bole Arabsa", am: "ቦሌ አረብሳ", lat: 9.0120, lng: 38.8080, area: "Bole", aliases: ["arabsa"] },
  amist_kilo: { name: "Amist Kilo", am: "አምስት ኪሎ", lat: 9.0350, lng: 38.7650, area: "Arada", aliases: ["5 kilo"] },
  abnet: { name: "Abnet", am: "አብነት", lat: 9.0080, lng: 38.7750, area: "Kirkos" },
  bambis: { name: "Bambis", am: "ባምቢስ", lat: 8.9820, lng: 38.7680, area: "Nifas Silk-Lafto" },
  legetafo: { name: "Legetafo", am: "ለገታፎ", lat: 9.0050, lng: 38.8150, area: "Bole" },
  sebategna: { name: "Sebategna", am: "ሰባተኛ", lat: 8.9680, lng: 38.7520, area: "Nifas Silk-Lafto" },
  semen_mazoria: { name: "Semen Mazoria", am: "ሰመን ማዞሪያ", lat: 8.9750, lng: 38.7580, area: "Nifas Silk-Lafto" },
};

export type PlaceKey = keyof typeof places;
