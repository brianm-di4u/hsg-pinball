// Every Hot Springs fact the game shows, with its source key in research/town-content.md (section) and the audited
// trivia id where one exists. tools/check-facts.mjs fails the build if a shown fact lacks a source. Hedged facts keep
// their hedge word on screen. All strings ≤ 40 characters for the 128×32 DMD.

export const FACTS = {
  // Thermal Springs (pop bumpers) — town-content §3, §11
  temp: { text: 'SPRING WATER: ABOUT 143°F', src: 'tc§11#1 NPS hs-0147' },
  hottest: { text: 'HOTTEST SPRINGS EAST OF THE ROCKIES', src: 'tc§11#2 hs-0154' },
  age: { text: 'RAIN FROM ABOUT 4,400 YEARS AGO', src: 'tc§11#3 USGS hs-0145' },
  springs: { text: 'ABOUT 47 HOT SPRINGS', src: 'tc§11#4 hs-0148' },
  flow: { text: 'ABOUT 700,000 GALLONS A DAY', src: 'web-findings §4 NPS' },
  // Attract — town-content §11, §9
  reserved: { text: 'RESERVED APRIL 20, 1832', src: 'tc§11#5 hs-0001' },
  older: { text: '40 YEARS OLDER THAN YELLOWSTONE', src: 'tc§11#6 hs-0002' },
  park: { text: 'A NATIONAL PARK SINCE 1921', src: 'tc§11#7 NPS' },
  baden: { text: "1877: AMERICA'S BADEN-BADEN", src: 'tc§11#20 hs-0018' },
  spa: { text: 'NICKNAMED THE AMERICAN SPA', src: 'web-findings §2 NPS' },
  valley: { text: 'NICKNAME: VALLEY OF THE VAPORS', src: 'tc§9; web-findings §2' },
  // Bathhouse Row — town-content §4.1
  rowCount: { text: '8 BATHHOUSES ON THE ROW', src: 'tc§4.1 hs-0109' },
  landmark: { text: 'LANDMARK DISTRICT SINCE 1987', src: 'tc§4.1 hs-0098' },
  bhSuperior: { text: 'SUPERIOR 1916: GREEN TILE MEDALLIONS', src: 'tc§4.1 hs-0066' },
  bhHale: { text: 'HALE 1892: OLDEST ON THE ROW', src: 'tc§4.1 hs-0061' },
  bhMaurice: { text: 'MAURICE 1912: THE ROYCROFT DEN', src: 'tc§4.1 hs-0067' },
  bhFordyce: { text: 'FORDYCE 1915: STAINED GLASS SKYLIGHT', src: 'tc§4.1 hs-0064' },
  bhQuapaw: { text: 'QUAPAW 1922: THE TILED DOME', src: 'tc§4.1 hs-0078' },
  bhOzark: { text: 'OZARK 1922: TWIN STEPPED TOWERS', src: 'tc§4.1 hs-0085' },
  bhBuckstaff: { text: 'BUCKSTAFF: BATHS SINCE 1912', src: 'tc§4.1 hs-0062' },
  bhLamar: { text: 'LAMAR 1923: THE ROW IS COMPLETE', src: 'tc§4.1 hs-0077' },
  fordyceCost: { text: 'FORDYCE COST $212,749.55', src: 'tc§11#9 hs-0064' },
  baths21: { text: '1920: A COURSE OF 21 BATHS', src: 'tc§4.3 NPS 1920 brochure' },
  // Mountain Tower — town-content §5
  woolman: { text: '1877: WOOLMAN TOWER, ABOUT 75 FT', src: 'tc§5' },
  rix: { text: 'NEXT: RIX TOWER, ABOUT 165 FT', src: 'tc§5' },
  tower: { text: 'MOUNTAIN TOWER: 216 FEET', src: 'tc§11#13 hs-0094' },
  // Central Avenue, Oaklawn — town-content §6, §10
  scotch: { text: "MAYOR'S HORSES: SCOTCH AND SODA", src: 'tc§11#14 hs-0488' },
  derby1936: { text: 'FIRST ARKANSAS DERBY: 1936, $5,000', src: 'tc§11#15 hs-0214 hs-0216' },
  fifth: { text: 'THE RACE MEET: THE FIFTH SEASON', src: 'tc§11#16 hs-0470' },
  oaklawn: { text: 'RACING HERE SINCE 1904/05', src: 'tc§10 (disputed year, both shown)' },
  // The Vapors and 1967 — town-content §7
  vapors: { text: 'THE VAPORS OPENED 1960', src: 'tc§11#17 hs-0411' },
  raid: { text: 'AUG 1967: STATE POLICE RAID THE CLUBS', src: 'tc§11#18 EOA hs-0049' },
  slots: { text: '1967: SEIZED SLOTS CRUSHED AND BURNED', src: 'web-findings §1 (gravel pit, OSHM)' },
  // The Arlington — town-content §8
  arlington: { text: 'ARLINGTON: REBUILT IN ABOUT 11 MONTHS', src: 'tc§11#19 hs-0076 (business source, hedged)' },
  capone: { text: "REPORTEDLY CAPONE'S ROOM: 443", src: 'tc§11#H1 hs-0486 (disputed, hedged)' },
  // Tub Race — town-content §10
  tubs: { text: 'TUB RACES ON CENTRAL SINCE 2006', src: 'tc§11#21 hs-0379' },
  // Coaster Hill — town-content §10
  coaster: { text: 'EARLY 1900S: COASTERS AT WHITTINGTON', src: 'tc§10 Coaster Hill (snippet)' },
};

export const ATTRACT_FACTS = ['reserved', 'older', 'park', 'spa', 'valley', 'baden', 'temp', 'springs', 'rowCount', 'landmark', 'tower', 'fifth', 'vapors'];
export const fact = (k) => FACTS[k].text;
