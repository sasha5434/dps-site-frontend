import whitelist from "@/assets/dpsData/whitelist.js";
import serversPerRegion from "@/assets/dpsData/serversPerRegion.js";

export default {
	allowedRegions: Object.keys(serversPerRegion.data),
	defaultRegionParamOverride: serversPerRegion.default,
	topToday: { huntingZoneId: 3027, bossId: 1000 },
	gameClasses: [{translation: "TWarrior", value: { "roleType": 1, "class": "Warrior" }}, {translation: "Warrior", value: { "roleType": 2, "class": "Warrior" }}, "Lancer", "Slayer", {translation: "TBerserker", value: { "roleType": 1, "class": "Berserker" }}, {translation: "Berserker", value: { "roleType": 2, "class": "Berserker" }}, "Sorcerer", "Archer", "Priest", "Mystic", "Reaper", "Gunner", {translation: "Brawler", value: { "roleType": 2, "class": "Brawler" }}, {translation: "TBrawler", value: { "roleType": 1, "class": "Brawler" }}, "Ninja", "Valkyrie"],
	allowedDungeons: whitelist,
	serversPerRegion: serversPerRegion.data,
	windowTitle: "Asura TeraLogs - Breakdowns storage site for Asura TERA Online",
	windowTitleSearchTop: "Asura TeraLogs - Leaderboard",
	windowTitleSearch: "Asura TeraLogs - Search",
	windowTitleAbout: "Asura TeraLogs - About",
	windowTitleApi: "Asura TeraLogs - API",
	windowTitleDetails: "Asura TeraLogs - Run details",
};