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
  gerji: { name: "Gerji", am: "ገርጂ", lat: 8.9965, lng: 38.8155, area: "Bole" },
  goro: { name: "Goro", am: "ጎሮ", lat: 8.9900, lng: 38.8600, area: "Bole" },
  bethel: { name: "Bethel", am: "ቤቴል", lat: 8.9900, lng: 38.7900, area: "Bole" },
  summit: { name: "Summit", am: "ሰሚት", lat: 9.0006, lng: 38.8510, area: "Bole" },

  // ═══════════════════════════════════════════════════════════════════════
  // YEKA SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  megenagna: { name: "Megenagna", am: "መገናኛ", lat: 9.0196, lng: 38.802, area: "Yeka", aliases: ["zefmesh"] },
  shola: { name: "Shola Market", am: "ሾላ ገበያ", lat: 9.0225, lng: 38.7946, area: "Yeka", aliases: ["shola gebeya"] },
  cmc: { name: "CMC", am: "ሲኤምሲ", lat: 9.0180, lng: 38.8430, area: "Yeka" },
  ayat: { name: "Ayat", am: "አያት", lat: 9.0320, lng: 38.8680, area: "Yeka" },
  kotebe: { name: "Kotebe", am: "ኮተቤ", lat: 9.0410, lng: 38.8330, area: "Yeka" },
  lamberet: { name: "Lamberet", am: "ላምበረት", lat: 9.0262, lng: 38.8195, area: "Yeka" },

  // ═══════════════════════════════════════════════════════════════════════
  // NIFAS SILK-LAFTO SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  gofa: { name: "Gofa Mazoria", am: "ጎፋ ማዞሪያ", lat: 8.98, lng: 38.753, area: "Nifas Silk-Lafto" },
  gotera: { name: "Gotera", am: "ጎተራ", lat: 8.979, lng: 38.759, area: "Nifas Silk-Lafto" },
  mekanisa: { name: "Mekanisa", am: "መካኒሳ", lat: 8.974, lng: 38.731, area: "Nifas Silk-Lafto" },
  lafto: { name: "Lafto", am: "ላፍቶ", lat: 8.95, lng: 38.742, area: "Nifas Silk-Lafto" },
  jemo: { name: "Jemo", am: "ጀሞ", lat: 8.9580, lng: 38.7120, area: "Nifas Silk-Lafto" },
  saris: { name: "Saris", am: "ሳሪስ", lat: 8.9455, lng: 38.768, area: "Nifas Silk-Lafto" },
  adey_abeba: { name: "Adey Abeba", am: "አደይ አበባ", lat: 8.9568, lng: 38.7638, area: "Nifas Silk-Lafto" },

  // ═══════════════════════════════════════════════════════════════════════
  // KOLFE KERANYO SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  kolfe: { name: "Kolfe", am: "ቆልፌ", lat: 9.0300, lng: 38.7120, area: "Kolfe Keranyo" },
  shegole: { name: "Shegole", am: "ሸጎሌ", lat: 9.0050, lng: 38.6950, area: "Kolfe Keranyo" },
  burayu: { name: "Burayu", am: "ቡራዩ", lat: 9.0640, lng: 38.6690, area: "Kolfe Keranyo" },
  asko: { name: "Asko", am: "አስኮ", lat: 9.065, lng: 38.695, area: "Kolfe Keranyo" },

  // ═══════════════════════════════════════════════════════════════════════
  // AKAKI KALITY SUBCITY
  // ═══════════════════════════════════════════════════════════════════════
  kality: { name: "Kality", am: "ቃሊቲ", lat: 8.9090, lng: 38.7720, area: "Akaki Kality" },
  akaki: { name: "Akaki", am: "አቃቂ", lat: 8.87, lng: 38.79, area: "Akaki Kality" },
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
};

export type PlaceKey = keyof typeof places;
