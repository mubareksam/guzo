import type { PlaceKey } from "./places";

export type StationKind = "tera" | "lrt" | "intercity" | "bus_terminal" | "bajaj_stand";
export type Mode = "minibus" | "city_bus" | "train" | "bajaj" | "intercity_bus";

export type StationDef = {
  key: string;
  name: string;
  am: string;
  place: PlaceKey;
  lat: number;
  lng: number;
  kind: StationKind;
  /** How a rider recognises this exact stand on the street. */
  landmark: string;
  verified?: boolean;
};

/**
 * Taxi stands ("tera"), light-rail platforms and bus terminals.
 * Several big junctions (Megenagna, Meskel, Mexico, Piassa, Bole, Merkato, Ayat, Kality)
 * have more than one stand — each is described by the landmark riders use.
 */
export const stationDefs: StationDef[] = [
  // Megenagna — three stands around the roundabout
  { key: "megenagna_east", name: "Megenagna Tera — Zefmesh side", am: "መገናኛ ተራ (ዘፍመሽ)", place: "megenagna", lat: 9.0207, lng: 38.8031, kind: "tera", landmark: "Under the ring-road flyover on the Zefmesh Grand Mall side. Eastbound minibuses to CMC, Ayat, Summit and Kotebe.", verified: true },
  { key: "megenagna_west", name: "Megenagna Tera — Shola side", am: "መገናኛ ተራ (ሾላ በኩል)", place: "megenagna", lat: 9.0199, lng: 38.7990, kind: "tera", landmark: "West side of the roundabout facing the Shola road, next to the Abyssinia Bank branch. Westbound lines to Arat Kilo, Piassa, Meskel and Mexico.", verified: true },
  { key: "megenagna_south", name: "Megenagna Tera — Bole road side", am: "መገናኛ ተራ (ቦሌ መንገድ)", place: "megenagna", lat: 9.0184, lng: 38.8013, kind: "tera", landmark: "South exit toward Imperial, beside the Mulugeta Zeleke Building and Bole Subcity office. Lines to Bole, Gerji, Arabsa, the airport and the ring road to Saris and Kality.", verified: true },

  // Piassa — two stands
  { key: "piassa_giorgis", name: "Piassa Tera — St. George", am: "ፒያሳ ተራ (ጊዮርጊስ)", place: "piassa", lat: 9.0356, lng: 38.7509, kind: "tera", landmark: "Beside St. George's Cathedral and Menelik II statue. Lines to Arat Kilo, Megenagna, Shiro Meda, Meskel and Bole.", verified: true },
  { key: "piassa_atikilt", name: "Piassa Tera — Atikilt Tera", am: "ፒያሳ አትክልት ተራ", place: "piassa", lat: 9.0336, lng: 38.7489, kind: "tera", landmark: "Down the hill behind the old Municipality (City Hall), at the vegetable-market corner. Lines to Merkato, Autobus Tera, Asko and Wingate.", verified: true },

  { key: "arat_kilo", name: "Arat Kilo Tera", am: "አራት ኪሎ ተራ", place: "arat_kilo", lat: 9.0336, lng: 38.7625, kind: "tera", landmark: "Around the Miyazia 27 (Victory) monument, opposite AAU Science Faculty.", verified: true },
  { key: "sidist_kilo", name: "Sidist Kilo Tera", am: "ስድስት ኪሎ ተራ", place: "sidist_kilo", lat: 9.0426, lng: 38.7615, kind: "tera", landmark: "At the Yekatit 12 monument, in front of the Addis Ababa University main gate." },
  { key: "shiro_meda", name: "Shiro Meda Tera", am: "ሽሮ ሜዳ ተራ", place: "shiro_meda", lat: 9.0620, lng: 38.7640, kind: "tera", landmark: "Next to the shemma (traditional cloth) market, a short walk from the US Embassy.", verified: true },
  { key: "entoto", name: "Entoto Maryam Stand", am: "እንጦጦ ማርያም", place: "entoto", lat: 9.0866, lng: 38.7618, kind: "tera", landmark: "Parking area below Entoto Maryam church and the Entoto Park entrance." },
  { key: "ferensay", name: "Ferensay Legasion Tera", am: "ፈረንሳይ ለጋሲዮን ተራ", place: "ferensay", lat: 9.0487, lng: 38.7811, kind: "tera", landmark: "At the roundabout near the French Embassy compound." },
  { key: "shola", name: "Shola Market Tera", am: "ሾላ ገበያ ተራ", place: "shola", lat: 9.0250, lng: 38.7949, kind: "tera", landmark: "Beside the Yeka Higher Court, 100 m south of Shola open-air market entrance. Lines to Megenagna, CMC and Ferensay.", verified: true },
  { key: "addisu_gebeya", name: "Addisu Gebeya Tera", am: "አዲሱ ገበያ ተራ", place: "addisu_gebeya", lat: 9.0612, lng: 38.7466, kind: "tera", landmark: "Addisu Gebeya market square, on the Gojjam road." },
  { key: "wingate", name: "Wingate Tera", am: "ዊንጌት ተራ", place: "wingate", lat: 9.0598, lng: 38.7295, kind: "tera", landmark: "In front of General Wingate Polytechnic College gate." },

  // Meskel — two stands
  { key: "meskel_bole", name: "Meskel Square Tera — Bole road side", am: "መስቀል አደባባይ (ቦሌ በኩል)", place: "meskel", lat: 9.0098, lng: 38.7630, kind: "tera", landmark: "Africa Avenue (Bole Road) corner at the bottom of the Meskel Square steps. Eastbound lines to Bole, Megenagna and Gerji.", verified: true },
  { key: "meskel_south", name: "Meskel Square Tera — Ras Mekonnen side", am: "መስቀል አደባባይ (ራስ መኮንን)", place: "meskel", lat: 9.0113, lng: 38.7598, kind: "tera", landmark: "Ras Mekonnen Avenue side facing the Addis Ababa Museum. Southbound lines to Saris, Kality, Gofa and Mexico.", verified: true },

  { key: "legehar", name: "Legehar Tera", am: "ለገሃር ተራ", place: "legehar", lat: 9.0087, lng: 38.7521, kind: "tera", landmark: "In front of the old La Gare railway station building, Churchill Avenue end.", verified: true },
  { key: "kazanchis", name: "Kazanchis Tera", am: "ካዛንቺስ ተራ", place: "kazanchis", lat: 9.0175, lng: 38.7645, kind: "tera", landmark: "Behind UNECA, near the Intercontinental Hotel." },

  // Mexico — two stands
  { key: "mexico_west", name: "Mexico Tera — Wabe Shebelle side", am: "ሜክሲኮ ተራ (ዋቤ ሸበሌ)", place: "mexico", lat: 9.0110, lng: 38.7425, kind: "tera", landmark: "Beside Wabe Shebelle Hotel. Westbound lines to Torhailoch, Ayer Tena, Alem Bank and Autobus Tera.", verified: true },
  { key: "mexico_south", name: "Mexico Tera — Sar Bet road", am: "ሜክሲኮ ተራ (ሳር ቤት መንገድ)", place: "mexico", lat: 9.0097, lng: 38.7441, kind: "tera", landmark: "Across from Tegbare-id College at the start of the Sar Bet road. Southbound lines to Mekanisa, Lafto and Jemo.", verified: true },

  // Merkato
  { key: "merkato", name: "Merkato Tera — Anwar Mosque", am: "መርካቶ ተራ (አንዋር መስጊድ)", place: "merkato", lat: 9.0332, lng: 38.7405, kind: "tera", landmark: "Between Anwar Mosque and Raguel Church, at the heart of Merkato.", verified: true },
  { key: "autobus_tera", name: "Autobus Tera (Merkato bus station)", am: "አውቶቡስ ተራ", place: "autobus_tera", lat: 9.0396, lng: 38.7364, kind: "intercity", landmark: "Main intercity bus terminal on the north edge of Merkato — buses to Burayu, Holeta and Ambo.", verified: true },
  { key: "kolfe", name: "Kolfe Tera", am: "ቆልፌ ተራ", place: "kolfe", lat: 9.0302, lng: 38.7125, kind: "tera", landmark: "Kolfe market roundabout, by Kolfe Keranyo sub-city office." },
  { key: "asko", name: "Asko Bus Station", am: "አስኮ መናኸሪያ", place: "asko", lat: 9.0653, lng: 38.6945, kind: "intercity", landmark: "Asko bus station on the Ambo road, west exit of the city." },
  { key: "ayer_tena", name: "Ayer Tena Tera", am: "አየር ጤና ተራ", place: "ayer_tena", lat: 8.9944, lng: 38.6918, kind: "tera", landmark: "Ayer Tena square on the Jimma road, beside the Ayer Tena Kidane Mihret church." },
  { key: "torhailoch", name: "Torhailoch Tera", am: "ጦር ኃይሎች ተራ", place: "torhailoch", lat: 9.0099, lng: 38.7208, kind: "tera", landmark: "Opposite the Armed Forces General Hospital gate.", verified: true },
  { key: "alem_bank", name: "Alem Bank Tera", am: "ዓለም ባንክ ተራ", place: "alem_bank", lat: 9.0005, lng: 38.6795, kind: "tera", landmark: "Alem Bank square, west end of the Ambo road condominiums." },
  { key: "zenebework", name: "Zenebework Tera", am: "ዘነበወርቅ ተራ", place: "zenebework", lat: 8.9903, lng: 38.7085, kind: "tera", landmark: "Zenebework junction near the Total fuel station." },

  // South / south-west
  { key: "sar_bet", name: "Sar Bet Tera", am: "ሳር ቤት ተራ", place: "sar_bet", lat: 8.9963, lng: 38.7404, kind: "tera", landmark: "Sar Bet roundabout, near the Canadian Embassy." },
  { key: "gofa", name: "Gofa Mazoria Tera", am: "ጎፋ ማዞሪያ ተራ", place: "gofa", lat: 8.9805, lng: 38.7528, kind: "tera", landmark: "Gofa roundabout beside Gofa Gebriel church." },
  { key: "mekanisa", name: "Mekanisa Tera", am: "መካኒሳ ተራ", place: "mekanisa", lat: 8.9743, lng: 38.7314, kind: "tera", landmark: "Mekanisa Michael church junction." },
  { key: "lafto", name: "Lafto Tera", am: "ላፍቶ ተራ", place: "lafto", lat: 8.9503, lng: 38.7416, kind: "bajaj_stand", landmark: "Lafto square near Lafto Mall — minibuses and bajajs." },
  { key: "jemo", name: "Jemo Tera — Michael church", am: "ጀሞ ተራ (ሚካኤል)", place: "jemo", lat: 8.9584, lng: 38.7125, kind: "tera", landmark: "Jemo 1 condominium gate opposite Jemo Michael church.", verified: true },
  { key: "lebu", name: "Lebu Tera", am: "ለቡ ተራ", place: "lebu", lat: 8.9563, lng: 38.7254, kind: "bajaj_stand", landmark: "Lebu Music-Bet junction, bajajs line up along the main road." },
  { key: "saris", name: "Saris Abo Tera", am: "ሳሪስ አቦ ተራ", place: "saris", lat: 8.9447, lng: 38.7672, kind: "tera", landmark: "Saris Abo church junction on the Debre Zeit road.", verified: true },
  { key: "kality", name: "Kality Tera", am: "ቃሊቲ ተራ", place: "kality", lat: 8.9090, lng: 38.7720, kind: "tera", landmark: "Kality main junction beside the Anbessa bus depot.", verified: true },
  { key: "kality_total", name: "Kality Total Mazoria", am: "ቃሊቲ ቶታል ማዞሪያ", place: "kality_total", lat: 8.9200, lng: 38.7680, kind: "tera", landmark: "Kality Total fuel station junction. Minibuses to Autobus Tera and Mexico.", verified: true },
  { key: "kality_bus", name: "Kality National Bus Terminal", am: "ቃሊቲ መናኸሪያ", place: "kality_bus_terminal", lat: 8.8943, lng: 38.7756, kind: "intercity", landmark: "Massive modern bus terminal in Kality sub-city — long-distance buses to Dukem, Bishoftu (Debre Zeit), Adama and beyond. Opened 2026.", verified: true },
  { key: "akaki", name: "Akaki Beseka Tera", am: "አቃቂ በሰቃ ተራ", place: "akaki", lat: 8.8703, lng: 38.7896, kind: "bajaj_stand", landmark: "Akaki Beseka square; bajajs to the residential areas." },
  { key: "tulu_dimtu", name: "Tulu Dimtu Tera", am: "ቱሉ ዲምቱ ተራ", place: "tulu_dimtu", lat: 8.8748, lng: 38.8195, kind: "tera", landmark: "Tulu Dimtu roundabout on the ring road extension." },
  { key: "koye_feche", name: "Koye Feche Tera", am: "ቆጤ ፈጬ ተራ", place: "koye_feche", lat: 8.9035, lng: 38.8244, kind: "bajaj_stand", landmark: "Main gate of the Koye Feche condominium site." },

  // East
  { key: "hayahulet", name: "Haya Hulet Tera", am: "ሃያ ሁለት ተራ", place: "hayahulet", lat: 9.0128, lng: 38.7880, kind: "tera", landmark: "Haya Hulet (22) Mazoria roundabout, Golagul building side." },
  { key: "bole_edna", name: "Bole Tera — behind Edna Mall", am: "ቦሌ ተራ (ኤድና ሞል)", place: "bole_medhanialem", lat: 8.9967, lng: 38.7874, kind: "tera", landmark: "Behind Edna Mall / Matti Multiplex. Lines to the airport, Bole Michael and the ring road south.", verified: true },
  { key: "bole_church", name: "Bole Tera — Medhanialem church", am: "ቦሌ መድኃኔዓለም ተራ", place: "bole_medhanialem", lat: 8.9948, lng: 38.7860, kind: "tera", landmark: "In front of Bole Medhanialem church gate on Bole Road. Westbound lines to Meskel, Mexico and Arat Kilo.", verified: true },
  { key: "bole_airport", name: "Bole Airport Stand", am: "ቦሌ አየር ማረፊያ", place: "bole_airport", lat: 8.9805, lng: 38.7975, kind: "tera", landmark: "Arrivals parking of Bole International Terminal 2, past the taxi rank." },
  { key: "bole_michael", name: "Bole Michael Tera", am: "ቦሌ ሚካኤል ተራ", place: "bole_michael", lat: 8.9833, lng: 38.7745, kind: "bajaj_stand", landmark: "Bole Michael church; bajajs to Bulbula and Goro." },
  { key: "gerji", name: "Gerji Tera", am: "ገርጂ ተራ", place: "gerji", lat: 8.9968, lng: 38.8150, kind: "tera", landmark: "Gerji Mebrat Hail roundabout, Unity University side." },
  { key: "gerji_roba", name: "Gerji Roba Bus Station", am: "ገርጂ ሮባ መናኸሪያ", place: "gerji_roba", lat: 8.9948, lng: 38.8136, kind: "bus_terminal", landmark: "Gerji Roba bus station near Wereda 13 administration. Minibuses to Bole Arabsa, CMC and Ayat.", verified: true },
  { key: "gerji_sunshine", name: "Gerji Sunshine Tera", am: "ገርጂ ሰንሻይን ተራ", place: "gerji_sunshine", lat: 8.9935, lng: 38.8180, kind: "tera", landmark: "Gerji Sunshine junction near the Abado G-7 square. Lines to Bole Arabsa and Goro." },
  { key: "megenagna_bole_subcity", name: "Megenagna Bole Subcity Terminal", am: "መገናኛ ቦሌ ክፍለ ከተማ መናኸሪያ", place: "megenagna_bole_subcity", lat: 9.0178, lng: 38.8018, kind: "bus_terminal", landmark: "Mulgeta Building bus terminal next to Bole Sub City office (LHRIA). City buses and minibuses.", verified: true },
  { key: "bole_bulbula", name: "Bole Bulbula Tera", am: "ቦሌ ቡልቡላ ተራ", place: "bole_bulbula", lat: 8.9603, lng: 38.7806, kind: "bajaj_stand", landmark: "Bulbula 93 Mazoria; minibuses and bajajs." },
  { key: "summit", name: "Summit Tera", am: "ሰሚት ተራ", place: "summit", lat: 9.0010, lng: 38.8505, kind: "tera", landmark: "Summit Fiyel Bet roundabout at the condominium entrance." },
  { key: "cmc", name: "CMC Tera — Michael church", am: "ሲኤምሲ ተራ (ሚካኤል)", place: "cmc", lat: 9.0204, lng: 38.8326, kind: "tera", landmark: "CMC Michael church junction on the Ayat road." },
  { key: "ayat", name: "Ayat Tera — Ayat square", am: "አያት ተራ (አደባባይ)", place: "ayat", lat: 9.0324, lng: 38.8686, kind: "tera", landmark: "Ayat square in front of the Ayat Real Estate office.", verified: true },
  { key: "kotebe", name: "Kotebe Tera", am: "ኮተቤ ተራ", place: "kotebe", lat: 9.0413, lng: 38.8325, kind: "tera", landmark: "Kotebe Metropolitan University main gate." },
  { key: "yeka_abado", name: "Yeka Abado Tera", am: "የካ አባዶ ተራ", place: "yeka_abado", lat: 9.0603, lng: 38.8865, kind: "bajaj_stand", landmark: "Yeka Abado condominium main gate." },
  { key: "lamberet", name: "Lamberet Bus Station", am: "ላምበረት መናኸሪያ", place: "lamberet", lat: 9.0265, lng: 38.8200, kind: "intercity", landmark: "Lamberet bus station on the Debre Birhan road — Sendafa, Tafo and Debre Birhan buses.", verified: true },
  { key: "wesen", name: "Wesen Mecheresha Tera", am: "ወሰን መጨረሻ ተራ", place: "wesen", lat: 9.0330, lng: 38.8446, kind: "tera", landmark: "End of the Wesen road near Wesen Grocery — Anbessa buses and minibuses terminate here." },
  { key: "haile_garment", name: "Haile Garment Tera", am: "ኃይሌ ጋርመንት ተራ", place: "haile_garment", lat: 8.9375, lng: 38.7342, kind: "tera", landmark: "Haile Garment Square — Sheger buses to Mexico terminate here." },
  { key: "wollo_sefer", name: "Wollo Sefer Tera", am: "ወሎ ሰፈር ተራ", place: "wollo_sefer", lat: 9.0003, lng: 38.7705, kind: "tera", landmark: "Wollo Sefer roundabout, Ethio-China friendship road junction." },

  // Light rail platforms (Addis Ababa LRT)
  { key: "lrt_ayat", name: "Ayat LRT Station", am: "አያት ባቡር ጣቢያ", place: "ayat", lat: 9.0300, lng: 38.8640, kind: "lrt", landmark: "Eastern terminus of the East–West light rail line." },
  { key: "lrt_cmc", name: "CMC LRT Station", am: "ሲኤምሲ ባቡር ጣቢያ", place: "cmc", lat: 9.0196, lng: 38.8340, kind: "lrt", landmark: "Elevated platform above the CMC road." },
  { key: "lrt_megenagna", name: "Megenagna LRT Station", am: "መገናኛ ባቡር ጣቢያ", place: "megenagna", lat: 9.0196, lng: 38.8027, kind: "lrt", landmark: "Elevated platform next to the Megenagna roundabout." },
  { key: "lrt_stadium", name: "Stadium LRT Station", am: "ስታዲየም ባቡር ጣቢያ", place: "stadium", lat: 9.0120, lng: 38.7568, kind: "lrt", landmark: "Interchange of the East–West and North–South lines by the stadium." },
  { key: "lrt_mexico", name: "Mexico LRT Station", am: "ሜክሲኮ ባቡር ጣቢያ", place: "mexico", lat: 9.0102, lng: 38.7448, kind: "lrt", landmark: "Platform on the Mexico square median." },
  { key: "lrt_torhailoch", name: "Torhailoch LRT Station", am: "ጦር ኃይሎች ባቡር ጣቢያ", place: "torhailoch", lat: 9.0105, lng: 38.7226, kind: "lrt", landmark: "Western terminus of the East–West line." },
  { key: "lrt_menelik", name: "Menelik II Square LRT Station", am: "ምኒልክ አደባባይ ባቡር ጣቢያ", place: "piassa", lat: 9.0362, lng: 38.7498, kind: "lrt", landmark: "Northern terminus of the North–South line at Menelik II Square." },
  { key: "lrt_meskel", name: "Meskel Square LRT Station", am: "መስቀል አደባባይ ባቡር ጣቢያ", place: "meskel", lat: 9.0104, lng: 38.7605, kind: "lrt", landmark: "Platform below Meskel Square on Ras Mekonnen Avenue." },
  { key: "lrt_saris", name: "Saris LRT Station", am: "ሳሪስ ባቡር ጣቢያ", place: "saris", lat: 8.952, lng: 38.7634, kind: "lrt", landmark: "Platform on the Debre Zeit road at Saris." },
  { key: "lrt_kality", name: "Kality LRT Station", am: "ቃሊቲ ባቡር ጣቢያ", place: "kality", lat: 8.938, lng: 38.763, kind: "lrt", landmark: "Southern terminus of the North–South line, Kality depot." },
];

/** [originStationKey, mode, via place keys (in order, last = terminus), popularity 1–5, options] */
export type LineDef = [
  station: string,
  mode: Mode,
  via: PlaceKey[],
  popularity: number,
  opts?: { oneWay?: boolean; back?: string; name?: string },
];

export const lineDefs: LineDef[] = [
  // ── Megenagna ──
  ["megenagna_east", "minibus", ["gurd_shola", "cmc"], 5],
  ["megenagna_east", "minibus", ["gurd_shola", "cmc", "ayat"], 5],
  ["megenagna_east", "minibus", ["gurd_shola", "cmc", "figa", "summit"], 4],
  ["megenagna_east", "minibus", ["gurd_shola", "lamberet", "kotebe"], 4],
  ["megenagna_east", "minibus", ["gurd_shola", "lamberet", "kotebe", "yeka_abado"], 3],
  ["megenagna_west", "minibus", ["shola", "kebena", "arat_kilo"], 5],
  ["megenagna_west", "minibus", ["shola", "kebena", "arat_kilo", "piassa"], 5, { back: "piassa_giorgis" }],
  ["megenagna_west", "minibus", ["hayahulet", "urael", "meskel"], 5, { back: "meskel_bole" }],
  ["megenagna_west", "minibus", ["hayahulet", "urael", "meskel", "stadium", "legehar", "mexico"], 5, { back: "mexico_west" }],
  ["megenagna_west", "minibus", ["hayahulet", "urael", "kazanchis"], 4],
  ["megenagna_west", "minibus", ["shola", "ferensay"], 3],
  ["megenagna_south", "minibus", ["imperial", "bole_medhanialem"], 5, { back: "bole_edna" }],
  ["megenagna_south", "minibus", ["imperial", "bole_airport"], 4],
  ["megenagna_south", "minibus", ["imperial", "gerji"], 4],
  ["megenagna_south", "minibus", ["imperial", "bole_medhanialem", "gotera", "saris", "kality"], 4, { name: "Ring road" }],

  // ── Piassa ──
  ["piassa_giorgis", "minibus", ["legehar", "meskel"], 4, { back: "meskel_south" }],
  ["piassa_giorgis", "minibus", ["legehar", "meskel", "urael", "bole_medhanialem"], 4, { back: "bole_church" }],
  ["piassa_giorgis", "minibus", ["legehar", "mexico"], 4, { back: "mexico_west" }],
  ["piassa_giorgis", "minibus", ["arat_kilo", "sidist_kilo", "shiro_meda"], 4],
  ["piassa_giorgis", "minibus", ["arat_kilo", "kazanchis"], 3],
  ["piassa_atikilt", "minibus", ["merkato"], 5],
  ["piassa_atikilt", "minibus", ["autobus_tera", "semen_mazoria", "asko"], 4],
  ["piassa_atikilt", "minibus", ["addisu_gebeya", "wingate"], 3],
  ["piassa_atikilt", "minibus", ["addisu_gebeya"], 4],

  // ── Arat Kilo / north ──
  ["arat_kilo", "minibus", ["amist_kilo", "ferensay"], 4],
  ["arat_kilo", "minibus", ["sidist_kilo", "shiro_meda"], 4],
  ["arat_kilo", "minibus", ["kazanchis", "meskel"], 4, { back: "meskel_bole" }],
  ["shiro_meda", "minibus", ["entoto"], 3],
  ["shiro_meda", "minibus", ["entoto", "sululta"], 2, { oneWay: true }],
  ["ferensay", "minibus", ["kotebe", "wesen"], 3],

  // ── Meskel ──
  ["meskel_bole", "minibus", ["urael", "wollo_bole", "bole_medhanialem"], 5, { back: "bole_church" }],
  ["meskel_bole", "minibus", ["urael", "bole_medhanialem", "gerji"], 3],
  ["meskel_bole", "minibus", ["olympia", "wollo_sefer"], 3],
  ["meskel_south", "minibus", ["lancha", "gotera", "saris"], 5],
  ["meskel_south", "minibus", ["lancha", "gotera", "saris", "kality"], 5],
  ["meskel_south", "minibus", ["bulgaria", "gofa"], 3],
  ["meskel_south", "minibus", ["stadium", "legehar", "mexico"], 4, { back: "mexico_west" }],

  // ── Legehar / Mexico ──
  ["legehar", "minibus", ["sar_bet", "mekanisa", "jemo"], 4],
  ["mexico_west", "minibus", ["torhailoch", "zenebework", "ayer_tena"], 4],
  ["mexico_west", "minibus", ["torhailoch", "alem_bank"], 3],
  ["mexico_west", "minibus", ["lideta", "sebategna", "autobus_tera"], 3, { back: "autobus_tera" }],
  ["mexico_south", "minibus", ["sar_bet", "mekanisa", "lafto"], 4],
  ["mexico_south", "minibus", ["sar_bet", "mekanisa", "jemo"], 4],
  ["mexico_south", "minibus", ["kera", "gofa", "gotera", "saris"], 3],
  ["mexico_south", "minibus", ["sar_bet", "mekanisa", "lafto", "haile_garment"], 3],

  // ── Merkato / west ──
  ["merkato", "minibus", ["tekle_haimanot", "lideta", "mexico"], 4, { back: "mexico_west" }],
  ["merkato", "minibus", ["sebategna", "kolfe"], 5],
  ["merkato", "minibus", ["abnet", "torhailoch"], 3],
  ["merkato", "minibus", ["piassa", "arat_kilo"], 4],
  ["merkato", "minibus", ["piassa", "arat_kilo", "kebena", "shola", "megenagna"], 4, { back: "megenagna_west" }],
  ["merkato", "minibus", ["piassa", "legehar", "meskel", "urael", "bole_medhanialem"], 3, { back: "bole_church" }],
  ["autobus_tera", "minibus", ["asko", "burayu"], 4],
  ["kolfe", "minibus", ["zenebework", "ayer_tena"], 3],
  ["kolfe", "minibus", ["asko"], 3],
  ["torhailoch", "minibus", ["kolfe"], 3, { oneWay: true }],
  ["asko", "minibus", ["burayu"], 4],
  ["ayer_tena", "minibus", ["sebeta"], 4],
  ["ayer_tena", "minibus", ["jemo"], 3],

  // ── South ──
  ["jemo", "minibus", ["lafto", "saris"], 3],
  ["jemo", "bajaj", ["lebu"], 3],
  ["lafto", "bajaj", ["jemo"], 3, { oneWay: true }],
  ["lafto", "bajaj", ["mebrat_hail", "lebu"], 2, { oneWay: true }],
  ["saris", "minibus", ["kality", "akaki"], 3],
  ["saris", "minibus", ["kality", "koye_feche"], 3],
  ["saris", "bajaj", ["adey_abeba"], 2, { oneWay: true }],
  ["kality", "minibus", ["kality_total", "akaki"], 4],
  ["kality", "minibus", ["koye_feche"], 4],
  ["kality_total", "minibus", ["autobus_tera"], 4, { back: "autobus_tera", name: "Kality Total express" }],
  ["kality_total", "minibus", ["mexico"], 3, { back: "mexico_west" }],
  ["kality", "bajaj", ["akaki"], 3, { oneWay: true }],
  ["koye_feche", "bajaj", ["tulu_dimtu"], 3],
  ["kality_bus", "minibus", ["dukem", "bishoftu"], 4, { oneWay: true, name: "Highroof" }],

  // ── Bole / east ──
  ["bole_edna", "minibus", ["bole_airport"], 3],
  ["bole_edna", "minibus", ["gotera", "saris"], 4],
  ["bole_edna", "minibus", ["bole_michael", "bole_bulbula"], 3],
  ["bole_church", "minibus", ["wollo_bole", "urael", "meskel", "legehar", "mexico"], 4, { back: "mexico_west" }],
  ["bole_church", "minibus", ["urael", "kazanchis", "arat_kilo"], 3],
  ["bole_airport", "minibus", ["imperial", "megenagna"], 3, { back: "megenagna_south" }],
  ["bole_michael", "bajaj", ["bole_bulbula"], 3],
  ["gerji", "bajaj", ["goro"], 3, { oneWay: true }],
  ["gerji", "minibus", ["goro", "summit"], 2],
  ["gerji_roba", "minibus", ["gerji_sunshine", "goro", "bole_arabsa"], 3],
  ["gerji_roba", "minibus", ["gerji", "cmc", "ayat"], 3],
  ["cmc", "minibus", ["kotebe"], 3],
  ["ayat", "minibus", ["summit"], 3],
  ["ayat", "minibus", ["bole_arabsa"], 3, { oneWay: true }],
  ["ayat", "minibus", ["legetafo"], 3, { oneWay: true }],
  ["ayat", "bajaj", ["yeka_abado"], 3],
  ["summit", "bajaj", ["figa"], 2, { oneWay: true }],
  ["wollo_sefer", "minibus", ["bulgaria", "gofa"], 2],
  ["hayahulet", "minibus", ["bambis", "urael", "kazanchis", "arat_kilo"], 3],
  ["ayat", "minibus", ["tafo"], 3, { oneWay: true }],

  // ── City buses (Anbessa / Sheger) ──
  ["autobus_tera", "city_bus", ["piassa", "arat_kilo", "amist_kilo", "ferensay", "kotebe", "wesen"], 3, { back: "wesen", name: "Anbessa" }],
  ["piassa_giorgis", "city_bus", ["legehar", "meskel", "lancha", "gotera", "saris", "kality"], 4, { back: "kality", name: "Anbessa" }],
  ["meskel_bole", "city_bus", ["urael", "bole_medhanialem", "bole_michael", "bole_bulbula"], 3, { back: "bole_bulbula", name: "Sheger" }],
  ["megenagna_east", "city_bus", ["gurd_shola", "cmc", "ayat"], 3, { back: "ayat", name: "Sheger" }],
  ["mexico_west", "city_bus", ["torhailoch", "zenebework", "alem_bank"], 3, { back: "alem_bank", name: "Anbessa" }],
  ["mexico_south", "city_bus", ["sar_bet", "mekanisa", "lafto", "haile_garment"], 4, { back: "haile_garment", name: "Sheger" }],
  ["arat_kilo", "city_bus", ["kebena", "shola", "megenagna", "imperial", "bole_medhanialem"], 3, { back: "bole_church", name: "Sheger" }],
  ["kality", "city_bus", ["koye_feche", "tulu_dimtu"], 3, { back: "tulu_dimtu", name: "Sheger" }],
  ["merkato", "city_bus", ["tekle_haimanot", "lideta", "mexico", "legehar", "meskel", "urael", "hayahulet", "megenagna"], 3, { back: "megenagna_west", name: "Anbessa" }],

  // ── Intercity ──
  ["autobus_tera", "intercity_bus", ["asko", "burayu", "holeta", "ambo"], 3, { oneWay: true }],
  ["asko", "intercity_bus", ["burayu", "holeta"], 3, { oneWay: true }],
  ["kality_bus", "intercity_bus", ["dukem", "bishoftu", "adama"], 4, { oneWay: true }],
  ["lamberet", "intercity_bus", ["legetafo", "sendafa"], 3, { oneWay: true }],
  ["lamberet", "intercity_bus", ["debre_birhan"], 3, { oneWay: true }],

  // ── Addis Ababa Light Rail ──
  ["lrt_ayat", "train", ["cmc", "gurd_shola", "megenagna", "hayahulet", "urael", "stadium", "legehar", "mexico", "coca", "torhailoch"], 5, { back: "lrt_torhailoch", name: "East–West line" }],
  ["lrt_menelik", "train", ["autobus_tera", "sebategna", "abnet", "lideta", "mexico", "legehar", "stadium", "meskel", "lancha", "gotera", "adey_abeba", "saris", "kality"], 5, { back: "lrt_kality", name: "North–South line" }],
];
