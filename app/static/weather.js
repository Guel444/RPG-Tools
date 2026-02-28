// =============================================================
// WEATHER & ENVIRONMENTAL CONDITIONS GENERATOR
// =============================================================

function wxPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function wxPickN(arr, n) {
    const copy = [...arr], res = [];
    for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        res.push(copy.splice(idx, 1)[0]);
    }
    return res;
}

// ---- TEMPERATURA por bioma + estação ----
const TEMP_TABLE = {
    forest:      { spring: "cool (8–14°C / 46–57°F)",    summer: "warm (18–26°C / 64–79°F)",  autumn: "cold (4–12°C / 39–54°F)",   winter: "freezing (−8–2°C / 18–36°F)"  },
    mountain:    { spring: "cold (0–8°C / 32–46°F)",     summer: "cool (10–18°C / 50–64°F)",  autumn: "freezing (−5–5°C / 23–41°F)",winter: "brutal (−20–−5°C / −4–23°F)"  },
    plains:      { spring: "mild (12–20°C / 54–68°F)",   summer: "hot (26–36°C / 79–97°F)",   autumn: "mild (8–18°C / 46–64°F)",   winter: "cold (−5–5°C / 23–41°F)"      },
    swamp:       { spring: "warm (16–24°C / 61–75°F)",   summer: "humid (28–36°C / 82–97°F)", autumn: "cool (10–18°C / 50–64°F)",  winter: "cold (0–8°C / 32–46°F)"       },
    desert:      { spring: "warm (22–32°C / 72–90°F)",   summer: "scorching (38–50°C / 100–122°F)", autumn: "warm (20–30°C / 68–86°F)", winter: "cold nights (2–18°C / 36–64°F)" },
    arctic:      { spring: "freezing (−15–0°C / 5–32°F)",summer: "cold (−5–8°C / 23–46°F)",   autumn: "brutal (−20–−8°C / −4–18°F)",winter: "deadly (−40–−20°C / −40–−4°F)" },
    coastal:     { spring: "mild (12–18°C / 54–64°F)",   summer: "warm (20–28°C / 68–82°F)",  autumn: "breezy (10–18°C / 50–64°F)",winter: "raw (2–10°C / 36–50°F)"        },
    underground: { spring: "constant (10–14°C / 50–57°F)",summer: "constant (10–14°C / 50–57°F)",autumn: "constant (10–14°C / 50–57°F)",winter: "constant (10–14°C / 50–57°F)" },
};

// ---- CONDIÇÕES por bioma + intensidade ----
const CONDITIONS = {
    forest: {
        calm:         ["Clear skies visible through the canopy","Gentle breeze rustling the leaves","Dappled sunlight filtering through branches","Morning mist lingering near the ground","A light drizzle pattering on the leaves above"],
        unstable:     ["Overcast skies, light intermittent rain","Gusty wind bending the treetops","Thick fog reducing visibility between the trees","Sporadic heavy showers with rumbling thunder in the distance","Dark clouds moving fast, occasional drops"],
        severe:       ["Heavy rain hammering through the canopy","Strong winds snapping branches overhead","Thick fog — can't see more than 30 feet","Thunderstorm directly overhead, lightning striking the tallest trees","Torrential downpour, ground turning to mud"],
        catastrophic: ["Violent storm, trees uprooted around you","Flash flood surging through the forest floor","Lightning striking every few minutes — nowhere is safe under a tree","A wall of fire visible through the trees, driven by the wind","The canopy is gone — stripped by a past tornado, leaving exposed, broken ground"],
    },
    mountain: {
        calm:         ["Crisp, clear air with stunning visibility","Light wind carrying the smell of pine","Thin clouds far below in the valleys","Morning frost on the rocks, already melting","Perfectly still — unnervingly so at this altitude"],
        unstable:     ["Building cloud cover from the west","Intermittent gusts threatening to unbalance you","Light snow beginning to fall","Fog rolling in from the valley below","Hail beginning — small stones, not yet dangerous"],
        severe:       ["Heavy snowfall, drifts forming on ledges","Blizzard-force wind howling through the passes","Black ice on every surface","Whiteout conditions — can't see the path ahead","Avalanche conditions — every loud sound is a risk"],
        catastrophic: ["Complete whiteout, zero visibility","Avalanche in progress nearby — the ground is shaking","Lightning storm directly over the peaks — metal conducts","Wind so strong standing requires a DC 15 Strength check each round","The pass is buried. There is no way forward until this clears."],
    },
    plains: {
        calm:         ["Endless blue sky, light breeze","Heat shimmer on the horizon","A single bank of cloud providing occasional shade","Golden light in late afternoon, shadows long","Still air, the grass barely moving"],
        unstable:     ["Dark line of clouds approaching from the west","Wind picking up, grass flattening in waves","Pressure dropping — animals are restless","Scattered showers moving across the plain","A distant funnel cloud — not close, not yet"],
        severe:       ["Thunderstorm with driving rain and near-zero visibility","Lightning striking the open ground around you","Wind making ranged attacks nearly impossible","Flash flood in the low ground — avoid the gullies","Hailstorm — golf-ball sized stones, 1d4 bludgeoning per round exposed"],
        catastrophic: ["Tornado visible and moving. It is heading this way.","Firestorm moving across the dry grass — driven by wind","Flash flood turning the plain into a lake","Lightning striking every 10 seconds in a 300-foot radius","The sky has turned green. Experienced travelers are running."],
    },
    swamp: {
        calm:         ["Thick, humid air hanging still over the water","Morning mist across the surface","The drone of insects, the occasional splash","Filtered grey light through the moss-draped trees","An eerie stillness broken only by frogs"],
        unstable:     ["Building fog reducing visibility to 60 feet","Light rain dimpling the water's surface","Swamp gas — faint smell of rot, occasional flicker","Rising water — the paths you used to enter are now ankle-deep","Mist thickening as temperature drops"],
        severe:       ["Dense fog — visibility 15 feet","Heavy rain turning the ground into sucking mud","The water level is rising. An hour ago it was knee-deep.","Electrical storm over the water — dangerous to be in or near it","Methane pockets igniting in the rain — random pillars of blue flame"],
        catastrophic: ["Flash flood. The swamp is becoming a river.","Complete fog blackout — visibility zero beyond arm's reach","Toxic gas cloud moving through the area — DC 13 Con save or poisoned","Lightning igniting the methane — the swamp is on fire in patches","The ground is gone. Everything is water."],
    },
    desert: {
        calm:         ["Blazing sun, no cloud cover","Heat shimmer making distances deceptive","A hot dry wind from the south","The silence of the deep desert — no insects, no birds","Stars beginning to appear — the temperature is already dropping"],
        unstable:     ["High clouds providing brief, unreliable shade","Wind picking up, carrying fine sand","The horizon to the southwest has turned brown","Extreme heat — DC 10 Con save each hour or gain a level of exhaustion","Temperature swinging — hot in sun, cold in shadow"],
        severe:       ["Sandstorm approaching — 30 minutes warning","Extreme heat wave — DC 13 Con save each hour","Wind carrying sand stripping exposed skin (1d4 slashing per round)","Sun blindness risk — unprotected eyes disadvantage on sight-based checks","Night temperature dropping below freezing — hypothermia risk"],
        catastrophic: ["Full sandstorm — visibility zero, 2d6 slashing per round unprotected","Sun heat stroke — DC 15 Con save each 30 min or unconscious","The dunes are moving. A familiar landmark is now buried.","A haboob — a wall of sand 1,000 feet high moving at 60 mph","Navigation is impossible. All tracks are buried. The sun is hidden."],
    },
    arctic: {
        calm:         ["Crisp, breathtaking clarity — visibility for miles","Snow crunching underfoot in the silence","Northern lights visible on the horizon","The sun low on the horizon, casting long blue shadows","Perfect stillness — the cold is almost beautiful"],
        unstable:     ["Cloud cover building, temperature dropping","Spindrift — fine snow blowing across the surface","Wind chill making the effective temperature 15 degrees colder","Visibility dropping as snow begins","The cold is deepening. Breath comes harder."],
        severe:       ["Blizzard — visibility 30 feet, wind 50 mph","Frostbite risk — DC 13 Con save each hour or one level exhaustion","Ice bridge ahead — DC 12 Athletics to cross safely","Whiteout — all direction is lost without landmarks","Temperature: exposure kills in two hours without shelter"],
        catastrophic: ["Survival impossible without magical protection","Blizzard so severe sound doesn't carry — shouts lost at 5 feet","Ice collapse — the ground you're standing on may not be solid","Wind chill fatal in 30 minutes — DC 15 Con save each 10 min","Complete whiteout in all directions — up and down are unclear"],
    },
    coastal: {
        calm:         ["Gentle sea breeze, smell of salt and kelp","Small waves, clear water reflecting the sky","Seabirds calling overhead","Low tide revealing rock pools and sand flats","Light haze on the horizon"],
        unstable:     ["Chop on the water, stronger gusts","Dark clouds building over the sea","Waves increasing — spray reaching the cliff tops","Mist rolling in from the water","Pressure dropping fast — fishing boats heading back to port"],
        severe:       ["Gale-force wind — ranged attacks at disadvantage","Heavy surf — swimming requires DC 15 Athletics","Sea spray reducing visibility to 60 feet","Thunder and lightning over the water","Waves crashing over the lower path — it may not be passable"],
        catastrophic: ["Storm surge — the sea is 10 feet above normal","Hurricane-force winds — flying impossible, movement halved","Lightning striking the water every few seconds","The lower coastal path is gone — taken by the sea","Waterspout making landfall — treat as a tornado"],
    },
    underground: {
        calm:         ["Still, cool air — completely silent","The sound of distant dripping water","Faint smell of minerals and wet stone","Total darkness beyond your light sources","The temperature is constant — neither warming nor cooling"],
        unstable:     ["Air pressure changing — something large moved somewhere below","Sound of rushing water getting closer","A tremor — small, but enough to dislodge loose stone","Gas pocket ahead — smell of sulfur, candles guttering","The ceiling has lowered. You are moving deeper."],
        severe:       ["Flooding — water rising 1 foot per minute","Rockfall — DC 13 Dex save or 2d8 bludgeoning","Toxic gas — DC 13 Con save each minute or poisoned","Complete darkness — even darkvision reduced by 30 feet in the thick air","Structural instability — movement triggers further collapse (DC 14 Dex)"],
        catastrophic: ["Full cave-in in progress","Flash flood from underground river — 20 feet of water in 5 minutes","Volcanic gas — DC 15 Con save each round or incapacitated","The floor is gone — a new chasm has opened","Magma intrusion — heat dealing 2d10 fire per round within 30 feet"],
    },
};

// ---- VISIBILIDADE ----
const VISIBILITY = {
    calm:         { range: "Normal (1 mile+)", note: "No penalties to Perception checks.", color: "#4caf7d" },
    unstable:     { range: "Reduced (300 feet)", note: "Disadvantage on Perception checks beyond 300 feet.", color: "#e0a832" },
    severe:       { range: "Poor (60 feet)", note: "Disadvantage on all Perception checks. Heavily obscured beyond 60 feet.", color: "#e07832" },
    catastrophic: { range: "Zero (10 feet)", note: "Effectively blind beyond 10 feet. All attacks against unseen targets miss on 1–5.", color: "#e74c3c" },
};

// ---- EFEITOS MECÂNICOS por intensidade ----
const MECHANICAL_EFFECTS = {
    calm: [
        "No mechanical penalties.",
        "Advantage on Survival checks to track — conditions are ideal.",
        "Normal movement speed.",
        "No penalties to ranged attacks.",
    ],
    unstable: [
        "Ranged attack rolls at −1 due to wind and poor light.",
        "Survival (tracking) checks at disadvantage in rain.",
        "Perception checks that rely on hearing at disadvantage.",
        "Unprotected flames (torches) have 50% chance of going out each minute.",
        "DC 10 Con save after each hour of travel or gain one level of exhaustion.",
    ],
    severe: [
        "Ranged attack rolls at disadvantage.",
        "All Perception checks at disadvantage.",
        "Movement speed reduced by 10 feet.",
        "Concentration spell saves have +2 to DC.",
        "Flying creatures must succeed DC 13 Str save each round or be pushed 10 feet.",
        "Unprotected flames extinguished immediately.",
        "DC 12 Con save each hour or gain one level of exhaustion.",
        "Stealth checks in open ground at advantage — noise and visibility work in your favor.",
    ],
    catastrophic: [
        "Ranged attacks impossible beyond 30 feet.",
        "All Perception checks at disadvantage; automatically fail if relying on sound.",
        "Movement speed halved.",
        "Flying impossible without magical means.",
        "Concentration spells require DC 15 save each round.",
        "DC 14 Con save each 30 minutes or gain one level of exhaustion.",
        "Spells with verbal components require DC 12 Con save to cast.",
        "Open flame impossible without magical means.",
        "All ability checks made outdoors at disadvantage.",
    ],
};

// ---- PERIGOS AMBIENTAIS ----
const HAZARDS = {
    forest: {
        calm:         ["Slippery moss on rocks — DC 10 Acrobatics or fall prone","A downed tree across the path","Wasp nest disturbed by movement"],
        unstable:     ["Falling branches — DC 12 Dex save or 1d6 bludgeoning","Flash flood risk in low ground","Poor footing in mud — movement costs 1 extra foot per foot"],
        severe:       ["Uprooted trees blocking passage","Lightning striking the tallest trees — 30-foot radius, 4d8 lightning, DC 14 Dex half","Flash flood — 4d8 bludgeoning, swept 30 feet downstream"],
        catastrophic: ["Wildfire driven by wind — 6d8 fire per round, spreads 30 feet/round","Tornado — 10d10 bludgeoning, flung 1d6×10 feet","Structural tree collapse — 4d10 bludgeoning in 20-foot radius"],
    },
    mountain: {
        calm:         ["Loose scree — DC 11 Athletics or slide 10 feet","Thin air above 10,000 feet — DC 10 Con each hour","Hidden crevasse — DC 13 Perception to spot"],
        unstable:     ["Ice patch — DC 12 Acrobatics or fall prone","Rock slide — DC 13 Dex save or 3d8 bludgeoning","Wind gust at exposed ridge — DC 13 Str save or pushed 10 feet"],
        severe:       ["Avalanche — DC 15 Dex save or 8d8 bludgeoning and buried","Black ice — fall prone on any failed Dex check","Whiteout disorientation — party may travel in wrong direction"],
        catastrophic: ["Avalanche — 10d10 bludgeoning, half DC 17 Dex, fully buried","Lightning at the summit — 8d8 lightning, DC 14 Dex half","Wind throws flying creatures into the mountain face — 6d6 bludgeoning"],
    },
    plains: {
        calm:         ["Sun blindness — 4+ hours unprotected, disadvantage on sight checks","Hidden sinkhole — DC 12 Perception","Waist-high grass obscuring vision at ground level"],
        unstable:     ["Lightning rod risk — metal armor DC 12 or struck for 3d10","Flash flooding in gullies — DC 13 Athletics to swim","Hail — 1d4 bludgeoning per round unprotected"],
        severe:       ["Lightning strike — 6d8 lightning, 30-foot radius, DC 14 Dex half","Tornado on the horizon — 30 minutes before arrival","Flash flood — 6d6 bludgeoning, swept 60 feet"],
        catastrophic: ["Direct tornado hit — 12d6 bludgeoning, flung 100 feet, DC 17 Str or incapacitated","Wildfire — 8d8 fire per round, spreads each round","Lightning strikes twice per round in 200-foot area — DC 14 Dex save or 6d8 lightning"],
    },
    swamp: {
        calm:         ["Quicksand — DC 12 Perception, DC 13 Athletics to escape","Venomous snake — DC 12 Perception","Unstable ground — 50% chance of sinking ankle-deep each step"],
        unstable:     ["Swamp gas ignition — DC 11 Perception, 3d6 fire in 10-foot radius","Rising water — paths closing off","Venomous insect cloud — DC 12 Con or poisoned 1 hour"],
        severe:       ["Flash flood — 5d8 bludgeoning, swept 30 feet","Methane explosion — 4d10 fire, DC 14 Dex half, 20-foot radius","Toxic fog — DC 13 Con save each minute or poisoned"],
        catastrophic: ["Complete flooding — swimming required, DC 13 Athletics each minute","Toxic gas cloud — DC 15 Con save or incapacitated","Fire on the water — burning methane, 6d8 fire per round"],
    },
    desert: {
        calm:         ["Sunstroke — DC 10 Con each 2 hours or exhaustion","Mirage — DC 12 Insight to recognize","Scorpion in gear — DC 13 Perception when dressing"],
        unstable:     ["Sand in mechanisms — ranged weapons malfunction on 1–2","Dehydration — water consumption doubled","Heat shimmer — disadvantage on Perception beyond 60 feet"],
        severe:       ["Sandstorm — 2d6 slashing per round unprotected","Sun blindness — unprotected eyes, DC 13 Con or blinded 1d4 hours","Heat stroke — DC 13 Con each 30 min or unconscious"],
        catastrophic: ["Full haboob — 4d8 slashing per round, zero visibility","Quicksand beneath drifting sand — DC 14 Perception","Heat stroke DC 15 Con each 10 minutes or unconscious"],
    },
    arctic: {
        calm:         ["Snow blindness — DC 12 Con or disadvantage on sight checks","Thin ice — DC 13 Perception to spot, falls through","Frostbite on exposed extremities after 2 hours"],
        unstable:     ["Ice crack — DC 12 Perception, falls into frozen water","Frostbite — DC 12 Con each hour or one level exhaustion","Avalanche risk — loud noises trigger DC 13 Dex save, 6d8 bludgeoning"],
        severe:       ["Hypothermia — DC 13 Con each 30 min or one level exhaustion","Blizzard disorientation — may walk in wrong direction","Frostbite — DC 14 Con save or lose feeling in extremity (−2 to attack rolls)"],
        catastrophic: ["Exposure kills in 30 min without shelter — DC 15 Con each 10 min","Ice collapse — ground gives way, 30 feet of freezing water below","Avalanche — 10d10 bludgeoning, fully buried, DC 17 Dex half"],
    },
    coastal: {
        calm:         ["Slippery rocks — DC 10 Acrobatics","Unexpected wave — DC 11 Str save or knocked prone","Jellyfish in swimming area"],
        unstable:     ["Rogue wave — DC 13 Str save or swept 20 feet","Sea mist — disadvantage on sight-based Perception","Cliff erosion — DC 12 Perception to notice unstable edge"],
        severe:       ["Storm surge — 15-foot wave, DC 15 Str or swept away","Lightning on water — 5d8 lightning, 30-foot radius, DC 14 Dex half","Cliff collapse — 6d8 bludgeoning, DC 14 Dex half"],
        catastrophic: ["Hurricane wave — 20-foot wall of water, 8d10 bludgeoning","Waterspout — treat as tornado on water","Storm surge flooding coastal areas — swimming required"],
    },
    underground: {
        calm:         ["Unstable ceiling — DC 12 Perception to notice","Hidden drop — DC 13 Perception","Bat colony disturbed — swarm attack"],
        unstable:     ["Partial collapse — 3d8 bludgeoning, DC 13 Dex half","Gas pocket — DC 12 Con or poisoned","Rising water — 1 foot per 10 minutes"],
        severe:       ["Rockfall — 5d8 bludgeoning, DC 14 Dex half, 20-foot radius","Flash flood — 4d8 bludgeoning, swept 30 feet","Toxic gas — DC 14 Con save each round or incapacitated"],
        catastrophic: ["Full cave-in — 8d10 bludgeoning, DC 16 Dex half, passage blocked","Magma flow — 4d10 fire per round within 30 feet","Explosive gas — 10d8 fire, DC 15 Dex half, 40-foot radius"],
    },
};

// ---- EFEITOS TÁTICOS EM COMBATE ----
const TACTICAL_EFFECTS = {
    calm:         ["No combat modifiers.","Natural light (if outdoors, daytime).","Normal initiative and positioning."],
    unstable:     ["Ranged attackers roll at −1 to hit.","Torches and lamp have 50% chance extinguishing each round.","Light sources flickering — dim light extends 5 feet less than normal.","Sound-based detection impaired — Stealth at advantage against hearing-only."],
    severe:       ["All ranged attack rolls at disadvantage.","Melee in open ground: Str saving throws for footing each round (DC 11) or −5 ft movement.","Flying movement requires Str save (DC 13) each round or pushed 10 feet.","Concentration save DC +2 from wind and noise.","Difficult terrain everywhere outdoors.","Burning spells extinguished by rain — DM's discretion."],
    catastrophic: ["Ranged attacks impossible beyond 30 feet.","Flying impossible without magical means.","All outdoor movement is difficult terrain.","Verbal spell components require DC 12 Con save.","Concentration saves required every round (DC 12) from environment alone.","Visibility-dependent abilities (sneak attack, etc.) severely limited.","Every creature outdoors must Str save (DC 14) each round or be knocked prone."],
};

// ---- PROGRESSÃO CLIMÁTICA ----
const PROGRESSION = {
    forest: {
        calm:         ["The clouds are building to the west. Rain likely within 4–6 hours.","Conditions will hold through the morning, then cloud over.","This calm is unusual for the season — it won't last long."],
        unstable:     ["The storm will either break into heavy rain or clear within 2 hours.","Conditions deteriorating — severe weather by nightfall.","A short window of calm is coming, then it worsens."],
        severe:       ["The worst should pass in 3–4 hours. Mud and fallen trees will remain.","This front is slow-moving. Expect 8–12 hours of severe conditions.","A brief lull is coming, then another wave hits."],
        catastrophic: ["Conditions will ease in 2 hours, but the forest is transformed.","This storm may last through the night.","The eye is passing over — you have 20 minutes of calm before it returns."],
    },
    mountain: {
        calm:         ["Weather window closing — clouds building on the far peaks.","Two good days of travel before the next front arrives.","The calm will hold until afternoon, then deteriorate rapidly."],
        unstable:     ["Snow likely within 2 hours at this altitude.","The pass may close if this front moves faster than expected.","A brief clearing at dawn, then worsening through the day."],
        severe:       ["Blizzard conditions for 6–10 hours. The pass will be impassable.","The storm peaks at nightfall, then slowly eases by dawn.","Conditions will not improve until the temperature drops another 5 degrees — paradoxically, that means morning."],
        catastrophic: ["This is a multi-day event. Survival is the only priority.","The storm breaks at dawn — if everyone is still alive.","Avalanche probability increasing each hour. Get off the open slope."],
    },
    plains: {
        calm:         ["A storm line is visible on the horizon — 6+ hours away.","Tomorrow will be hotter. The day after, a break.","This is the last calm day before a week of storms."],
        unstable:     ["Tornado watch conditions. Watch the sky.","The storm front passes in 3 hours — then it clears.","Conditions cycling — calm for 30 minutes, severe for 30, repeat."],
        severe:       ["Lightning risk for another 2–3 hours, then clearing.","The storm is stalling — may stay for 12 hours.","Conditions ease by nightfall, but the ground will be flooded."],
        catastrophic: ["The tornado will pass in 10–15 minutes. Survive first.","Storm will break at dawn. It is currently 11 pm.","This is a seasonal event — it will be over in 4 hours and nothing will be the same."],
    },
    swamp: {
        calm:         ["The stillness won't last — water levels are rising slowly.","A storm is building to the north. The swamp will flood by nightfall.","Mist will thicken at sunset — navigation will be very difficult."],
        unstable:     ["Heavy rain will arrive within the hour — flooding imminent.","The fog is thickening. In two hours, visibility will be near zero.","The gas levels are rising. This will get dangerous soon."],
        severe:       ["Flooding peaks in 3 hours, then slowly recedes over 12.","The toxic fog will thin at dawn when temperatures rise.","Conditions will remain severe through the night."],
        catastrophic: ["The swamp is reclaiming everything. Find high ground.","Flooding will peak and then recede within 6 hours.","This is a seasonal flood. The swamp will be unrecognizable for a week."],
    },
    desert: {
        calm:         ["A sandstorm is forming 50 miles south — arrival in 4–6 hours.","The heat will peak in 2 hours, then ease slightly at sunset.","Night temperatures will drop 25 degrees. Prepare for both extremes."],
        unstable:     ["Sandstorm will arrive in 1–2 hours. Find shelter now.","Heat will intensify for another 3 hours before breaking.","The wind is shifting — conditions will change unpredictably."],
        severe:       ["The storm will pass in 3–4 hours. Do not move during it.","Heat will break at sunset — 4 hours away.","A second sandstorm is forming behind the first."],
        catastrophic: ["The haboob will last 6–8 hours. There is no safe movement.","Temperatures will drop 30 degrees in the next hour — new danger.","The storm is circular — you may be at the center."],
    },
    arctic: {
        calm:         ["A blizzard front is 24 hours away. Make distance while you can.","This window will close by tomorrow morning.","The aurora suggests a magnetic storm — navigation will be unreliable tomorrow."],
        unstable:     ["Full blizzard within 2 hours. Find or build shelter now.","Conditions deteriorating through the night — worst before dawn.","Temperature will drop another 15 degrees by midnight."],
        severe:       ["The blizzard will break at dawn — 8 hours away.","Conditions cycling — brief reprieves every 2 hours.","A second cold front is arriving behind this one."],
        catastrophic: ["This is a multi-day Arctic storm. Shelter is survival.","Conditions ease in 6 hours. That is a very long time.","The storm shows no signs of breaking."],
    },
    coastal: {
        calm:         ["A squall line is forming offshore — 4–6 hours before it arrives.","The tide is coming in. Low paths will be submerged within 2 hours.","This is the last calm before the seasonal storm season."],
        unstable:     ["The squall will hit within the hour. Secure anything loose.","Conditions worsening rapidly — full storm by nightfall.","The tide and the storm are arriving together. That is bad."],
        severe:       ["The storm peaks in 2 hours, then clears over 4–6.","High tide in 3 hours — combined with the surge, this will be severe.","The storm is tracking along the coast — it won't end quickly."],
        catastrophic: ["Hurricane conditions for 8–12 hours. No safe movement.","The eye will pass in 2 hours — brief calm before it returns.","Storm surge will peak at high tide in 90 minutes."],
    },
    underground: {
        calm:         ["Water levels are rising slowly — something has changed above.","Air pressure dropping — structural instability likely within hours.","The temperature is dropping slightly — unusual. Something is different."],
        unstable:     ["Flooding will reach this level in 2–3 hours.","Tremors increasing — full collapse risk within hours.","Gas levels building — evacuation recommended."],
        severe:       ["Flooding will peak and stabilize in 1 hour, then hold.","Tremors will ease — or the structure will fully collapse. No middle ground.","Gas will dissipate once the flood opens new passages."],
        catastrophic: ["There is no 'waiting this out.' Find an exit.","The collapse is ongoing — every minute of delay is dangerous.","The magma intrusion will seal this passage permanently within 30 minutes."],
    },
};

// ---- SINAIS DA NATUREZA (ranger/druida) ----
const NATURE_SIGNS = {
    forest: [
        "Birds have gone silent — something disturbed them recently, or a predator is near",
        "Deer tracks heading downhill fast — they're moving away from something",
        "The moss on the north side of trees is unusually thick — moisture building, rain coming",
        "Insects are flying low — pressure dropping, storm incoming within hours",
        "Mushrooms have bloomed overnight — unusual humidity spike",
        "Squirrels are caching food aggressively — they sense a harsh period coming",
        "The bark beetles are active — healthy trees, stable environment",
        "Lichen on the rocks is dry and curling — extended dry period before this",
    ],
    mountain: [
        "Snow crystals are forming on the leeward side of rocks — wind direction has shifted",
        "The snowpack sounds hollow underfoot — avalanche risk is elevated",
        "Eagles are not flying — wind updrafts that birds trust have failed",
        "The rock faces have fresh cracks — freeze-thaw cycle, ice expanding in fissures",
        "Lichen growth patterns show this path floods seasonally — be cautious",
        "Chamois are descending — they go down before storms arrive",
        "The snow has a hard crust with soft powder beneath — unstable layering",
        "Ice formations on the south face are unusually thick — colder than expected",
    ],
    plains: [
        "Horses and cattle are facing the same direction — wind-reading behavior before storms",
        "Swallows are flying very low — insects hugging the ground, pressure dropping",
        "The grass is bending in inconsistent directions — wind shear at altitude",
        "Ant mounds have fresh earthwork piled high — they build up before flooding",
        "A ring around the moon last night — ice crystals, front incoming",
        "The smell of rain is carried from the wrong direction — storm wrapping around",
        "Ground squirrels have sealed their burrows — something serious is coming",
        "Static electricity in your hair and equipment — lightning risk is very high",
    ],
    swamp: [
        "Frogs are calling unusually loud — pressure drop, rain incoming",
        "Fish rising to the surface — oxygen dropping in the water, flood upstream",
        "The water is discolored brown upstream — heavy rain somewhere above",
        "Alligators have moved to higher ground — they know something",
        "Dead fish floating — gas pocket or pollution upstream",
        "Herons are not feeding — something has disturbed the water system",
        "The smell of sulfur is stronger than usual — gas pressure building",
        "Cypress roots are higher than normal — water table has risen recently",
    ],
    desert: [
        "Scorpions are emerging in daylight — temperature flux disturbing their cycle",
        "Sand is moving in thin streams at ground level with no visible wind — deep pressure shift",
        "Birds are not present at all — they evacuated before the conditions you're experiencing",
        "The sand near rocks is unusually soft — moisture from below, aquifer nearby",
        "Camel spiders are active — temperature within their tolerance, but rising fast",
        "The horizon has a brown tinge — suspended sand at altitude, storm incoming",
        "Animal tracks lead toward the same distant location — they know where water is",
        "The temperature dropped 10 degrees in the last hour — a front is moving through",
    ],
    arctic: [
        "Sea ice is cracking in unusual patterns — temperature is rising unexpectedly",
        "Polar bears are moving inland — instability in the ice shelf",
        "The aurora is unusually bright — magnetic storm affecting navigation",
        "Snow crystals are forming in the air above you — temperature inversion, storm likely",
        "Ptarmigan are burrowing into snow — they insulate before blizzards",
        "The ice makes a deep groaning sound — large mass shifting",
        "Seal breathing holes are freshly used — the ice is still stable here",
        "Wind-packed snow on the windward side of obstacles — sustained prevailing wind direction",
    ],
    coastal: [
        "Seabirds are flying inland and low — they don't like what's offshore",
        "The tide is behaving unusually — arriving late or early signals pressure changes",
        "Dolphins are swimming unusually deep — they go down before storms",
        "The sea has an oily, flat look despite wind — surface tension change before a front",
        "Kelp washed ashore with its holdfast intact — unusual wave action offshore",
        "The fishing boats went out and came back within the hour — experienced sailors read the signs",
        "Sand fleas are jumping higher than usual — barometric pressure dropping",
        "Cloud formations over the water are organized in bands — severe weather organizing offshore",
    ],
    underground: [
        "Bats are not returning to their roost — something has disturbed the cave system",
        "The air current has reversed direction — something has opened or closed a passage",
        "Cave crickets are gathering near exits — they flee flooding before it arrives",
        "Fresh mineral deposits on the ceiling — water table has been higher recently",
        "The sound of water is louder than before — an underground stream is rising",
        "Glowing fungi have dimmed — they respond to chemical changes in the air",
        "Blind fish are swimming toward you — they're fleeing something downstream",
        "The temperature has dropped two degrees — new air source, possibly an opening or danger",
    ],
};

// ---- DESCRIÇÕES ATMOSFÉRICAS (read-aloud) ----
const READ_ALOUD = {
    forest: {
        calm:         ["The forest is quiet in the way that feels like held breath — not peaceful, just paused. Pale light filters through the canopy in shifting columns, and the smell of moss and wet bark hangs in the cool air. Somewhere above, a bird calls once and stops.","Morning dew still clings to every leaf and cobweb in sight. The canopy diffuses the light into something green and soft, and the only sound is the slow creak of old wood somewhere to your left.","Late afternoon light turns the forest amber and copper. The air has cooled since midday and carries the smell of earth and pine resin. The trees here are old enough to have names."],
        unstable:     ["The forest is restless. Wind moves through the upper canopy in waves you can hear before you feel them, and the light has taken on a grey, flat quality that makes depth hard to judge. Rain is coming.","Leaves skitter across the path without apparent cause. The forest smells of rain that hasn't fallen yet, and the birds are unusually quiet. Something about the light is wrong.","Intermittent drops fall from above — not yet rain, just the forest exhaling moisture. The air pressure has changed and the trees are bending at the tops in a wind you can barely feel down here."],
        severe:       ["The rain is relentless. It hammers the canopy and falls in sheets where the trees open up, and the ground is giving way underfoot into something between mud and soup. You can't hear anything beyond 20 feet.","The forest roars. The canopy is a chaos of sound and movement, branches snapping somewhere above you with alarming regularity. The path is gone — replaced by a muddy, leaf-strewn stream bed.","Visibility ends at the next tree. The wind has found a way down through the branches and it's cold and directionless and brings with it the smell of torn wood and wet earth."],
        catastrophic: ["The forest is being dismantled around you. Trees you could not have pushed over this morning are being uprooted with a sound like cannon fire. The sky — what you can see of it — is the color of a bruise.","There is no path. There is no forest as you knew it. There is wind and wood and water and the sound of something massive falling nearby every few minutes. The noise makes it hard to think.","Lightning strikes a tree 40 feet away with a crack that stops your heart, and the immediate smell of scorched wood fills your lungs. The forest is on fire in three places you can see."],
    },
    mountain: {
        calm:         ["The air up here is thin and tastes of nothing, which is its own kind of cleanness. Below, the valleys are filled with cloud, and above, the sky is a shade of blue that doesn't exist at lower elevations. Your breath comes slightly harder than it should.","The summit is in view for the first time in days. The silence is physical — the kind that presses against your ears. Your footsteps on the scree are the only sound in the world.","Late light turns the rock faces orange and red, and the shadows in the gullies are already deep blue. The temperature drops another degree with every 100 feet of altitude."],
        unstable:     ["Cloud has moved in from the west and is eating the peaks above you. The wind is steady now and cold, and the rock faces have taken on a damp sheen that makes every handhold suspect.","Snow is falling in a way that doesn't feel serious yet — the flakes are fine and dry and almost ornamental. The wind is building. Your instincts say this will not stay ornamental.","The pass ahead is intermittently visible as the cloud moves through it. When it clears, the view is extraordinary. When it doesn't, there's nothing but grey-white and the sound of wind."],
        severe:       ["The blizzard has arrived in full. Snow is horizontal, the wind is a physical force, and the path — if there is one — is buried under six inches that fell in the last two hours. The cold is comprehensive.","Visibility is one tree length. Every surface is white, every sound is the wind, and the cold is the kind that gets inside regardless of what you're wearing. The summit is not happening today.","Ice has formed on everything. Your gear is stiff, your exposed skin is burning, and the gusts at the ridge were strong enough to make you genuinely uncertain of your footing."],
        catastrophic: ["The mountain is trying to kill you. This is not dramatic language — avalanche debris has crossed the path twice in the last hour, the wind is strong enough to throw a person, and the cold is already past the threshold of comfortable survival.","The pass is gone. Not blocked — gone, buried under new snowpack and hidden in a whiteout. You are on a mountain in a blizzard with no clear way forward and no clear way back.","Lightning has struck the ridge above you twice. The rock is conducting the charge. Metal equipment is warm to the touch in a way that is not natural. The wind has reached the pitch that experienced mountaineers describe as 'the sound that means run.'"],
    },
    plains: {
        calm:         ["The grass runs to every horizon, and the sky takes up three-quarters of the world. The wind is gentle and warm and smells of dry earth and wildflowers, and the only vertical thing in sight is you.","Heat shimmer makes the middle distance dance and distort, turning distant trees into mirages and blurring the line between plain and sky. The silence is enormous.","The light is extraordinary at this hour — horizontal and golden and very long. Your shadow reaches halfway to the horizon, and the grass is lit from the side like a painting."],
        unstable:     ["A dark line has appeared in the west that wasn't there an hour ago. The wind has changed direction twice in the last half-hour. The horses are restless in a way that experienced riders read as weather.","The sky is doing something architectural — enormous clouds building vertically with the speed of things that have real power behind them. The air smells of iron.","Light and shadow move across the plain in patches as the cloud cover shifts. The wind carries the smell of rain from somewhere close."],
        severe:       ["The thunderstorm is directly overhead. Lightning is hitting the open ground every minute or so, and the thunder arrives at the same moment — no safe distance between flash and sound. The rain is blinding.","The plain is a lake. Water is flowing across it in sheets, and what were solid paths an hour ago are now ankle-deep channels. Standing water reflects lightning from above.","The wind is trying to take you somewhere. It's not a figure of speech — an upright person needs to lean into it to maintain position. The grass is completely flat."],
        catastrophic: ["The tornado is real and it is close and it is large. The air pressure has dropped so suddenly your ears have popped. Debris is visible in the column. There is no good option, only less bad ones.","The plain is on fire. Driven by the wind, the fire line moves faster than a horse at full gallop. The smoke column is visible for fifty miles. The air is orange and getting warm.","The sky is green. There is no scientific reassurance available for this. Experienced travelers are prostrate in a ditch. You should find a ditch."],
    },
    swamp: {
        calm:         ["The swamp breathes. You can hear it — the slow exhalation of gas from somewhere below the surface, the drip of moisture from hanging moss, the distant percussion of a heron landing. The smell is rich and rotten and completely alive.","Morning mist lies flat on the water and catches the filtered light in a way that would be beautiful if it weren't also completely disorienting. The trees emerge from it like columns in a flooded temple.","The air is thick enough to wear. It clings to everything, and the smell of organic decay is constant — not unpleasant once you've been here a while, just present. The water is perfectly still."],
        unstable:     ["The mist has thickened since morning and the landmarks you were using are no longer visible. The water level has risen slightly — you noticed when your boot went in further than before.","Something has changed in the smell. It was earth and rot before; now there's a sharper note under it, something chemical. The gas levels are up. Keep flames low.","The frogs have stopped. That happened about twenty minutes ago and everything has been subtly wrong since."],
        severe:       ["The water is at your knees and still rising. What was a path through the swamp is now a navigational memory. The rain is heavy and constant and indistinguishable from the water already everywhere.","The fog is absolute. You can see your hand at arm's length and nothing else. You can hear things moving in the water around you but you cannot see them.","A blue flame appeared in the water 30 feet to the left and burned for six seconds, then vanished. The methane gas is at levels that make open flame genuinely dangerous."],
        catastrophic: ["The swamp is a river. Everything you came in on — path, landmark, dry ground — is submerged under moving water. The current is gentle but constant and pulling south.","You cannot see. The fog has exceeded fog and become something else — a wet darkness that absorbs your light source at 10 feet. Sound works differently here. Sound from very close seems very far.","The gas caught. Three separate spots on the water are burning with a pale blue flame that the rain cannot extinguish. The area smells of burnt swamp gas and the light it produces is deeply wrong."],
    },
    desert: {
        calm:         ["The desert is everything they said. The silence is geological — the kind that's been here for millions of years and has outlasted every creature that crossed it. The heat is immediate and comprehensive and the light off the sand is white.","At this hour the desert is almost cool and completely still, and the rocks throw shadows that are exact and surgical. In two hours this will be unbearable. Right now it is nearly beautiful.","The dunes move. Not quickly — you'd have to watch for minutes to see it — but they're moving, and the tracks you made an hour ago are already half-filled with blown sand."],
        unstable:     ["The horizon to the southwest is the wrong color. Sand at altitude, carried by wind you can't feel yet at ground level. It will arrive. The question is when.","The heat shimmer has become something else — a distortion that makes distances unreliable and the horizon seem to breathe. Real mirages are forming in the middle distance.","The wind has picked up and with it comes fine sand that finds every gap in fabric and armor. It's not a sandstorm yet. It might become one."],
        severe:       ["The sandstorm was theoretical an hour ago. It's not theoretical now. The air is a moving wall of particulate that strips exposed skin and makes breathing without cover inadvisable. The sand is in everything.","Heat this intense becomes abstract. The air itself has temperature in a physical sense — moving through it is like moving through a medium. The rocks are hot to the touch and will burn you.","The visibility is 30 feet and degrading. Sand is moving horizontally fast enough to sting. Somewhere in the distance, something large and geological is howling."],
        catastrophic: ["The haboob is a wall. From a distance it was impressive; inside it, it is one of the more definitive experiences of your life. There is sand in your lungs with every breath. There is no sky. There are no directions. There is only sand.","The temperature reads as a number, but numbers lose meaning here. The air actively damages you. The ground is hot through your boots. Every breath is an act of commitment.","Navigation has ended. The dunes you used as landmarks are different shapes than they were two hours ago. The sun is not visible. The wind has changed direction four times. You are somewhere in the desert."],
    },
    arctic: {
        calm:         ["The arctic is loud with silence. Every footstep is audible, every breath, every adjustment of gear. The sky is a color only found at these latitudes — a blue so deep it approaches violet at the zenith. The cold is clean.","The northern lights move overhead in a way that requires you to stop and watch them, even now. Green and pale violet, they shift in curtains that don't quite behave like light should.","Snow stretches in every direction to every horizon and beyond, unmarked by anything except your footprints and the occasional jutting rock. The beauty is absolute and completely indifferent."],
        unstable:     ["The cloud is moving in from the north and taking the light with it. The temperature has dropped four degrees in the last hour. The wind has found a new direction and it brings nothing good.","Spindrift — fine snow carried across the surface by wind — is beginning. It catches the last of the light like smoke. The experienced read this as a warning.","The sky is still clear directly above but the horizon in three directions is grey-white and indistinct. The storm is building its boundaries around you."],
        severe:       ["The blizzard is a single continuous condition. Wind, snow, cold — they're not separate things here, they're aspects of one overwhelming fact. The fact is that you need shelter.","The exposed skin on your face has lost feeling. That happened about 20 minutes ago and you should have noted it sooner. The wind makes any direction feel like the wrong one.","Visibility is measured in yards. The wind is strong enough that walking into it requires deliberate forward lean. The snow is horizontal and getting into everything."],
        catastrophic: ["Survival is a project. Not in a dramatic sense — in a practical, methodical, moment-to-moment sense. The storm is a magnitude above severe and there is no comfortable frame for it.","The wind chill takes the ambient temperature and makes it academic. The effective temperature is the kind that kills in thirty minutes of exposure. You have no time for bad decisions.","The whiteout is complete. Up and down are theoretical. The horizon is everywhere and nowhere. The only real things are the sound of the wind and the people close enough to touch."],
    },
    coastal: {
        calm:         ["The sea is doing what the sea does — moving, always moving, but quietly today. Low waves fold onto sand with a regularity that's almost hypnotic. The smell of salt and kelp is strong.","The tide is going out and leaving behind a landscape of rock pools and gleaming sand and stranded seaweed, and the light catches everything differently at the waterline.","Sea haze softens the horizon into something approximate. Ships would be visible if there were ships. The beach is a line between the certain and the merely probable."],
        unstable:     ["The sea has changed character. The waves are longer and more deliberate, and there's a swell under them that wasn't there this morning. The horizon has vanished into cloud.","Spray from the rocks is reaching places spray doesn't normally reach. The wind is doing something organized — not gusting randomly, but building to something. The seabirds are gone.","The barometric pressure has done something the old sailors would have noticed immediately. The sea looks flat and oily in a way that precedes storms, not follows them."],
        severe:       ["The gale is full. The sea is a chaos of white water and the spray is cold enough to take the breath. Anything unsecured is already gone. The noise is continuous and absolute.","The waves are coming over the breakwater. That wasn't supposed to be possible but it is happening. The lower coastal path is already submerged. The storm has arrived and it means business.","The lightning over the water is constant — 10-second intervals, give or take. The thunder arrives almost simultaneously. You are standing in the tallest things on the coast. That is a problem."],
        catastrophic: ["The storm surge has changed the geography. Where there was beach there is sea. The waves are structural — not water moving horizontally but walls of water moving vertically, each one a renegotiation of what the coast is.","Hurricane. The word existed as a concept before now. Now it's a physical fact you're inside. The rain is horizontal. The sound is beyond weather and into something geological.","The waterspout came ashore 200 yards north of your position. It is not gone. It has simply become a different problem — a tornado moving south along the coast, and you are south."],
    },
    underground: {
        calm:         ["The cave breathes. A slow, constant movement of air that you can feel on the back of your neck and can't locate. The silence is a different kind from the surface — not absent sound, but the sound of stone.","Your light sources reach their limits and beyond those limits the darkness is absolute — not dim, not shadowy, absolute. The ceiling is lost above you and the walls are where they are.","The sound of dripping water marks time in the deep. Everything else is still. The temperature is the same it was at the entrance and will be the same wherever this leads."],
        unstable:     ["Something has changed. The air pressure shifted about an hour ago — subtle, but your ears registered it. The dripping has become a trickle somewhere close. The cave is responding to something you can't see.","A tremor — small, brief, but real — sent a shower of fine grit from the ceiling 20 minutes ago. Nothing structural moved. But the geology is active here.","The smell of sulfur is new. It wasn't present when you entered. The candles are burning slightly differently."],
        severe:       ["Water is coming from somewhere above and pooling on the floor. It's ankle-deep and still rising. The source is not visible but the rate is.","The rockfall came without warning — a section of ceiling gave way in an area you had passed safely 10 minutes before. The dust hasn't settled. Moving carefully is no longer enough to be safe.","The air quality has changed enough to notice. Breathing requires slightly more effort. The flames of your light sources are smaller than they should be."],
        catastrophic: ["The collapse is ongoing. The sound is a continuous deep groan punctuated by sharp cracks. Dust fills the air to the point of impairing vision and breathing. The passage you came in on no longer exists.","The water is at waist height and moving. This is not pooling — this is an underground flood, and it has current, and it knows where it's going even if you don't.","The heat from the magma intrusion is measurable 60 feet away. The rock near the flow glows. The air is hot enough to blister exposed skin at 30 feet. Every second of debate is a second of damage."],
    },
};

// ---- MAIN ----
function generateWeather() {
    const biome     = document.getElementById('wx-biome').value;
    const season    = document.getElementById('wx-season').value;
    const intensity = document.getElementById('wx-intensity').value;
    const result    = document.getElementById('weatherResult');

    const temp        = TEMP_TABLE[biome][season];
    const condition   = wxPick(CONDITIONS[biome][intensity]);
    const readAloud   = wxPick(READ_ALOUD[biome][intensity]);
    const visibility  = VISIBILITY[intensity];
    const mechanics   = wxPickN(MECHANICAL_EFFECTS[intensity], Math.min(MECHANICAL_EFFECTS[intensity].length, intensity === 'calm' ? 2 : 4));
    const hazards     = wxPickN(HAZARDS[biome][intensity], intensity === 'calm' ? 2 : 3);
    const tactical    = wxPickN(TACTICAL_EFFECTS[intensity], Math.min(TACTICAL_EFFECTS[intensity].length, intensity === 'calm' ? 2 : 3));
    const progression = wxPick(PROGRESSION[biome][intensity]);
    const natureSigns = wxPickN(NATURE_SIGNS[biome], 2);

    const INTENSITY_STYLES = {
        calm:         { color: '#4caf7d', icon: '🌤️', label: 'CALM'         },
        unstable:     { color: '#e0a832', icon: '🌩️', label: 'UNSTABLE'     },
        severe:       { color: '#e07832', icon: '⛈️', label: 'SEVERE'       },
        catastrophic: { color: '#e74c3c', icon: '🌪️', label: 'CATASTROPHIC' },
    };
    const BIOME_LABELS = {
        forest: '🌲 Forest', mountain: '⛰️ Mountain', plains: '🌾 Plains',
        swamp: '🌿 Swamp', desert: '🏜️ Desert', arctic: '❄️ Arctic',
        coastal: '🌊 Coastal', underground: '🪨 Underground',
    };
    const SEASON_LABELS = { spring: '🌸 Spring', summer: '☀️ Summer', autumn: '🍂 Autumn', winter: '❄️ Winter' };

    const style = INTENSITY_STYLES[intensity];
    const S  = 'background:#1c1c22;border:1px solid rgba(201,168,76,0.12);border-radius:4px;padding:20px;';
    const T  = 'font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(201,168,76,0.1);';
    const LI = 'padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:14px;color:#e8e0d0;line-height:1.5;';
    const LBL= 'font-size:11px;font-family:Cinzel,serif;letter-spacing:1px;color:#8a8070;display:block;margin-bottom:2px;';

    let html =
        // Header
        '<div style="' + S + 'border-color:rgba(201,168,76,0.3);margin-bottom:20px;">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">'
        + '<div>'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:6px;">'
        + BIOME_LABELS[biome] + ' &nbsp;·&nbsp; ' + SEASON_LABELS[season]
        + '</div>'
        + '<div style="font-family:Cinzel,serif;font-size:26px;font-weight:700;color:' + style.color + ';line-height:1.2;">'
        + style.icon + ' ' + condition
        + '</div>'
        + '<div style="font-size:14px;color:#8a8070;margin-top:6px;">' + temp + '</div>'
        + '</div>'
        + '<span style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;padding:4px 12px;border-radius:2px;border:1px solid ' + style.color + ';color:' + style.color + ';flex-shrink:0;">'
        + style.label + '</span>'
        + '</div></div>'

        // Read-aloud
        + '<div style="background:rgba(201,168,76,0.04);border-left:3px solid rgba(201,168,76,0.4);border-radius:0 4px 4px 0;padding:16px 20px;margin-bottom:20px;">'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:10px;">📖 READ ALOUD</div>'
        + '<div style="font-size:15px;color:#e8e0d0;line-height:1.8;font-style:italic;">' + readAloud + '</div>'
        + '</div>'

        // Grid: visibilidade + temperatura
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-bottom:16px;">'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">👁️ VISIBILITY</div>'
        + '<div style="font-family:Cinzel,serif;font-size:18px;color:' + visibility.color + ';margin-bottom:8px;">' + visibility.range + '</div>'
        + '<div style="font-size:13px;color:#8a8070;line-height:1.5;">' + visibility.note + '</div>'
        + '</div>'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">🌡️ CONDITIONS</div>'
        + '<div style="' + LBL + '">TEMPERATURE</div>'
        + '<div style="font-size:14px;color:#e8e0d0;margin-bottom:10px;">' + temp + '</div>'
        + '<div style="' + LBL + '">CURRENT WEATHER</div>'
        + '<div style="font-size:14px;color:#e8e0d0;">' + condition + '</div>'
        + '</div>'

        + '</div>'

        // Efeitos mecânicos + táticos
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:16px;">'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">⚙️ MECHANICAL EFFECTS</div>'
        + mechanics.map((m,i) => '<div style="' + LI + (i===mechanics.length-1?'border:none;':'') + 'display:flex;gap:8px;"><span style="color:' + style.color + ';flex-shrink:0;">▸</span><span>' + m + '</span></div>').join('')
        + '</div>'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">⚔️ COMBAT EFFECTS</div>'
        + tactical.map((t,i) => '<div style="' + LI + (i===tactical.length-1?'border:none;':'') + 'display:flex;gap:8px;"><span style="color:' + style.color + ';flex-shrink:0;">▸</span><span>' + t + '</span></div>').join('')
        + '</div>'

        + '</div>'

        // Perigos
        + '<div style="' + S + 'margin-bottom:16px;border-color:rgba(192,57,43,0.2);">'
        + '<div style="' + T + 'color:rgba(192,57,43,0.6);border-color:rgba(192,57,43,0.15);">⚠️ ENVIRONMENTAL HAZARDS</div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:4px;">'
        + hazards.map(h => '<div style="' + LI + 'border:none;display:flex;gap:8px;padding:8px 0;"><span style="color:#e74c3c;flex-shrink:0;">⚠</span><span>' + h + '</span></div>').join('')
        + '</div></div>'

        // Progressão + sinais da natureza
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:16px;">'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">🕐 WHAT HAPPENS NEXT</div>'
        + '<div style="font-size:14px;color:#e8e0d0;line-height:1.6;">' + progression + '</div>'
        + '</div>'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">🌿 NATURE SIGNS (DC 13 Survival)</div>'
        + natureSigns.map((s,i) => '<div style="' + LI + (i===natureSigns.length-1?'border:none;':'') + 'display:flex;gap:8px;"><span style="color:#4caf7d;flex-shrink:0;">◆</span><span>' + s + '</span></div>').join('')
        + '</div>'

        + '</div>'

        // Botão
        + '<button onclick="generateWeather()" style="width:100%;background:none;border:1px solid rgba(201,168,76,0.25);border-radius:2px;padding:12px;color:#c9a84c;font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background=\'rgba(201,168,76,0.08)\'" onmouseout="this.style.background=\'none\'">🎲 GENERATE NEW CONDITIONS</button>';

    result.innerHTML = html;
}