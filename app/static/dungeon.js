// =============================================================
// DUNGEON GENERATOR — Part 1: Data Tables
// =============================================================

function dgPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function dgPickN(arr, n) {
    const copy = [...arr], res = [];
    for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        res.push(copy.splice(idx, 1)[0]);
    }
    return res;
}
function dgRoll(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function dgD(sides) { return Math.floor(Math.random() * sides) + 1; }

// ---- NOMES ----
const DG_NAME_PREFIX = {
    ruins:     ["The Broken","The Shattered","The Forgotten","The Sunken","The Buried","The Fallen","The Lost","The Cursed"],
    crypt:     ["The Silent","The Weeping","The Hollow","The Ashen","The Pale","The Shrouded","The Eternal","The Cold"],
    mine:      ["The Deep","The Dark","The Iron","The Black","The Flooded","The Abandoned","The Collapsed","The Endless"],
    temple:    ["The Defiled","The Forsaken","The Burning","The Bleeding","The Blind","The Hungering","The Hollow","The Crimson"],
    arcane:    ["The Sealed","The Shattered","The Forbidden","The Twisted","The Resonant","The Clockwork","The Inverted","The Dreaming"],
    fortress:  ["The Conquered","The Ruined","The Besieged","The Iron","The Sundered","The Fallen","The Obsidian","The Scarred"],
    cave:      ["The Breathing","The Dripping","The Deep","The Black","The Whispering","The Hungry","The Living","The Blind"],
};
const DG_NAME_SUFFIX = {
    ruins:     ["of Valdris","of the Old King","of the First Age","of Arenthal","of the Sun Court","of the Three Moons","Keep","Citadel"],
    crypt:     ["of the Nameless","of House Morvan","of the Undying","of the Last Rites","of the Forgotten Dead","Mausoleum","Tomb","Ossuary"],
    mine:      ["of Kharak","of the Iron Vein","of the Dwarven Lords","of the Deep Shaft","Pit","Excavation","Quarry","Delve"],
    temple:    ["of the Sleeping God","of the Blood Moon","of the Devourer","of the Hollow Eye","of the Fallen Saint","Sanctum","Fane","Shrine"],
    arcane:    ["of the Archmage","of the Shattered Experiment","of Valdimore","of the Paradox","of the Last Working","Tower","Laboratory","Observatory"],
    fortress:  ["of the Black Company","of the Iron Legion","of House Corvath","of the Siege","of the Last Stand","Keep","Bastion","Redoubt"],
    cave:      ["of the Old Ones","of the Deep Current","of Endless Dark","of the Blind Fish","of the Stone Heart","Warren","Grotto","Depths"],
};

// ---- BACKSTORY ----
const DG_BACKSTORY = {
    ruins: [
        "Once a thriving settlement, this place was abandoned during a plague that killed everyone who sheltered here. Whatever caused the plague never left.",
        "The ruling family that built this fortress was exterminated in a single night. No one who investigated the cause came back to report it.",
        "This structure predates the current civilization by at least three centuries. The builders are unknown. The purpose is disputed. The danger is not.",
        "Abandoned after the river that fed it changed course overnight. Scholars say that's geologically impossible. The ruins say otherwise.",
        "The survivors of the battle that destroyed this place were asked what happened. None of them answered the same way twice.",
    ],
    crypt: [
        "Built to house the remains of a noble line that died out under suspicious circumstances. The suspicious circumstances have apparently continued.",
        "A priest of a forgotten god built this to preserve his congregation after they were outlawed. The preservation worked better than intended.",
        "Sealed generations ago after a gravedigger reported hearing voices below the main chamber. The seal was broken last week.",
        "The bodies interred here were never supposed to be buried together. Someone did it anyway. The reasons seemed good at the time.",
        "A crypt built by a necromancer who was, by all accounts, genuinely trying to do something good. It didn't work out.",
    ],
    mine: [
        "The miners broke into something on the 40th day of excavation. The foreman's last log entry reads only: 'Do not go deeper.'",
        "Abandoned when the vein ran out — officially. The real reason involved something that lived in the lower tunnels and objected to the noise.",
        "A rich ore deposit drew three competing companies here. The richest seam was found on the same day all three companies' representatives disappeared.",
        "The mine produced wealth for sixty years until the earthquake. The shaking opened passages that hadn't been dug by human hands.",
        "Workers refused to continue after the seventh level. Management replaced them. The replacements lasted four days.",
    ],
    temple: [
        "Consecrated to a deity that has since been struck from all official records. The worship continued in secret long after.",
        "The high priest who oversaw this temple underwent a transformation that his congregation initially interpreted as divine ascension.",
        "Built on a site that was considered sacred — and dangerous — long before the temple existed. The builders knew this. They built anyway.",
        "Abandoned after the congregation performed a ritual that succeeded. The aftermath of the success is what emptied the temple.",
        "Converted from a place of healing into something else after the cleric who ran it made a particular bargain.",
    ],
    arcane: [
        "The archmage who built this laboratory was working on something they described as 'the final problem.' They solved it. The solution was catastrophic.",
        "A research institution that produced brilliant work for decades before one of the projects escaped containment.",
        "Built into the space between two competing ley lines, this place has unstable magical properties that the original owner considered an asset.",
        "The wizard who lived here left in a hurry, taking nothing. Whatever they left behind, they considered it more dangerous to take with them.",
        "Three different mages occupied this tower in succession. All three vanished. Their notes, when found, all ended with the same unfinished sentence.",
    ],
    fortress: [
        "The garrison held this fortress for three years against a siege that should have broken them in three weeks. What fed them during those years is unclear.",
        "Taken in battle a generation ago and never successfully held since. Each occupying force leaves — or stops being found.",
        "Built to defend against an enemy that never came from the direction the architects expected.",
        "The fortress fell not to assault but to something that came from inside the walls. The attacking army found the gates open and everyone gone.",
        "A stronghold that changed hands seven times in twenty years. Its current occupants are the longest-lasting. They've been here for two months.",
    ],
    cave: [
        "The cave system was mapped twice. The two maps don't match — not because of surveying errors, but because the caves are different.",
        "Locals have avoided this cave network for generations. The taboo predates any living memory of why.",
        "A hermit lived in the upper caves for forty years. She left last winter. No one has asked what changed.",
        "The cave breathes — a slow in-and-out of air that follows no natural pattern. Something deep inside is doing the breathing.",
        "Miners charted the upper levels. Explorers charted the middle. No one has returned from the lower levels with a map.",
    ],
};

// ---- TIPOS DE SALA ----
const ROOM_TYPES = {
    entrance:  { label: "Entrance",        icon: "🚪", color: "#4a90c9" },
    corridor:  { label: "Corridor",        icon: "〰️", color: "#8a8070" },
    chamber:   { label: "Chamber",         icon: "🏛️", color: "#8a8070" },
    guardroom: { label: "Guard Room",      icon: "⚔️",  color: "#e0a832" },
    shrine:    { label: "Shrine/Altar",    icon: "🕯️", color: "#9b59b6" },
    prison:    { label: "Prison",          icon: "⛓️",  color: "#e07832" },
    storage:   { label: "Storage",         icon: "📦", color: "#8a8070" },
    trap:      { label: "Trap Room",       icon: "⚠️",  color: "#e07832" },
    treasure:  { label: "Treasure Vault",  icon: "💰", color: "#c9a84c" },
    boss:      { label: "Boss Chamber",    icon: "💀", color: "#e74c3c" },
    secret:    { label: "Secret Room",     icon: "🔍", color: "#4caf7d" },
    natural:   { label: "Natural Cavern",  icon: "🪨", color: "#8a8070" },
    ritual:    { label: "Ritual Chamber",  icon: "🔮", color: "#9b59b6" },
};

// ---- DESCRIÇÕES DE SALA por tipo de masmorra ----
const ROOM_DESCRIPTIONS = {
    entrance: {
        ruins:     ["The threshold of a once-grand gate, now half-buried under fallen masonry. Twin pillars flank the opening, one cracked through, the other leaning at an angle that defies gravity. Old carvings line the arch — worn smooth, but not by time alone.","Steps descend from a doorway set into the hillside, framed by stonework that was clearly built to impress. Whatever it was meant to impress is long gone. The air coming from below is cold and still."],
        crypt:     ["Iron doors set into the hillside, sealed with a lock that has been forced open from the inside. The tracks in the mud are old. Not old enough.","A stone arch carved with names — hundreds of them, running from the top of the frame to the ground on both sides. The last name at the bottom is recent. The carving is rough, done in a hurry."],
        mine:      ["A timber-framed shaft entrance reinforced with iron strapping. The support beams are sound. The tools left beside the entrance are not — they're coated in something that isn't rust.","A horizontal tunnel entrance shored up with wooden beams, a rusted iron track leading into the dark. A handcart sits derailed twenty feet in, its cargo spilled: ore that glows faintly."],
        temple:    ["A portico of dark stone columns, each one carved with a different face — all wearing the same expression. The doors between them are open. They open inward.","Steps of polished black stone lead down to a pair of doors carved with a sigil that has been deliberately defaced — by someone who knew what it meant."],
        arcane:    ["A laboratory antechamber, shelves still lined with empty vessels. The floor is scorched in a perfect circle twelve feet across. The scorch is recent.","A foyer tiled with a mosaic depicting a sunrise — except the sun at the center has a face, and the face is looking at you, and the tesserae that form the eyes are made of something that isn't stone."],
        fortress:  ["A shattered gatehouse, the portcullis bent inward as if something hit it from the outside with enormous force. Ballista bolts are embedded in the inner walls. None of them came from outside.","The main gate hangs open, one hinge broken. Boot prints in the dirt lead in both directions. None of them lead out."],
        cave:      ["A natural opening in the rock face, wider than it looks from outside. The ground inside is worn smooth — not by water, but by the passage of many feet over a very long time.","The cave mouth is partially obscured by vegetation that has grown over it deliberately — not from outside, but from within."],
    },
    chamber: {
        ruins:     ["A great hall, the roof partially collapsed and open to the sky. Rain has gotten in long enough to grow moss on the stones. The hearth at the far end is cold but intact.","A reception room, the furniture rotted to suggestions of its original shapes. Paintings on the walls survive under a layer of grime — the subjects have been scraped away from every one."],
        crypt:     ["A vaulted chamber lined with stone sarcophagi, each marked with a name and a date. The dates span two centuries. The names are all the same family.","A preparation room for the dead — stone table at the center, drainage channels in the floor, hooks on the walls. All of it recently used."],
        mine:      ["A wide excavation chamber, the walls showing exposed veins of ore that have been ignored. Whatever the miners found, it wasn't ore.","A rest area where the workers took their meals — overturned tables, scattered tin cups, a meal that was abandoned mid-bite and has since petrified."],
        temple:    ["A nave of black columns, the space between them filled with stone pews. Something has been sitting in those pews — the stone is worn in patterns that suggest regular occupancy.","An antechamber where the faithful prepared for ritual. Robes still hang on the walls. They are still occupied."],
        arcane:    ["A study chamber, the bookshelves still full — but every book has had its text removed, leaving blank pages between intact covers.","A large workspace cluttered with equipment in various states of experiment. Some of it is still running."],
        fortress:  ["A barracks room, the beds still made — with occupants. They are armored and they haven't moved, but they are breathing.","A great hall, the long table set for a feast that wasn't finished. The food is gone. The plates are clean. The chairs are pushed back as if the meal ended normally."],
        cave:      ["A large natural chamber, stalactites overhead, a pool of still black water at the center. The water is very clear and very deep.","A cavern where the walls have been carved — not worked stone, but deliberate marks scratched by something with claws, covering every surface from floor to ceiling."],
    },
    guardroom: {
        ruins:     ["A checkpoint room, a collapsed portcullis blocking the far door. The mechanism to raise it is intact. The counterweights are bodies.","An armory antechamber, weapon racks emptied long ago except for one sword that no one took — the metal is wrong, the color off, the runes illegible."],
        crypt:     ["A warden's post at the intersection of four corridors, the chair still facing the entrance. Whoever sat here was watching for something coming in. Or going out.","A room of iron cages, most empty, one locked. The thing inside the locked cage isn't there to be imprisoned."],
        mine:      ["A security checkpoint where expensive equipment was checked in and out. The ledger on the desk records what went in. Nothing is recorded as having come back.","A foreman's office overlooking a shaft. The glass in the observation window has been broken from the inside."],
        temple:    ["A room of temple guards — or rather, their remains, posed in their original positions with unsettling precision.","An antechamber where initiates waited for judgment. The judgment chair at the far end is occupied."],
        arcane:    ["A guardian post where magical sentinels once stood. The pedestals are there. The sentinels are not — but their footprints remain burned into the floor leading away.","A security alcove with a crystal eye mounted on the wall. The eye is watching you. It has been watching you since you entered the building."],
        fortress:  ["A guardroom with two soldiers still at their post — standing, armed, and dead on their feet in a way that suggests they never had a chance to react.","A checkpoint, the barrier down. The guards are present. They don't speak. They're waiting for a password no one alive knows."],
        cave:      ["A natural chokepoint in the cave system, the passage narrowed to a single-file width. The narrowing was deliberate — the stones on either side were moved.","A chamber where something has built a nest from the bones of many things, arranged into walls. It is currently unoccupied."],
    },
    shrine: {
        ruins:     ["A small shrine to a god whose name has been removed from every surface — chiseled away with obvious effort. A fresh candle burns before the empty plinth.","A family chapel, small and well-made. The pews face an altar that holds the image of a saint. The saint's face has been replaced with that of someone specific."],
        crypt:     ["A memorial chamber where offerings were left for the dead. The offerings on the shelves are fresh.","A ritual space for funeral rites, the stone floor stained with oil and old blood in complex patterns. The patterns are still meaningful."],
        mine:      ["A miners' prayer alcove — a common feature, usually holding an image of whatever god they trusted to keep the roof up. This one holds something else.","A shrine built by the workers to something they found in the deep. The offering bowl is full of ore. The ore is still being added to."],
        temple:    ["The inner sanctum, the air thick with incense that has no source. The idol at the center was not made by human hands — the proportions are wrong.","An altar room, the surface of the altar stained in ways that suggest recent, regular use. The ritual implements are clean and arranged."],
        arcane:    ["A focus chamber, a ring of precisely placed arcane symbols inlaid in the floor surrounding an empty pedestal. The symbols are active.","A meditation room for magical preparation, the walls inscribed with equations. Some of them are unfinished — broken off mid-calculation."],
        fortress:  ["A chapel of war, the warrior-god's idol still standing and recently anointed with oil. The soldiers who made the offering did so after whatever happened here.","A small shrine to luck, covered in small offerings left by the garrison over years. The most recent ones were left in a hurry."],
        cave:      ["A natural formation that has been arranged into a place of worship — the stalactites carved into figures, a flat rock serving as an altar.","A space where the cave walls have been painted — ochre, black, white — in images too old to date. Something is still leaving offerings here."],
    },
    trap: {
        ruins:     ["A wide corridor with an unusually clean floor — no debris, no dust, no fallen stone. The ceiling above it is darker than it should be.","A room that was clearly a waiting area, but the chairs have been moved to the walls. The center of the floor is tiled differently from the rest."],
        crypt:     ["A passage lined with carved mourning figures, arms outstretched toward the center. Their hands are very close together.","A chamber with a pressure plate floor — every third stone is a different shade. The far door is the only exit."],
        mine:      ["A tunnel that smells wrong — the slightly sweet scent of gas. The lantern flame burns a shade lower than it should.","A passage where the support beams have been cut — recently, deliberately — and poorly replaced to appear intact."],
        temple:    ["A ritual approach corridor, the floor carved with sacred geometry. The pattern, decoded, is a map of where not to step.","A blessing chamber where suppliants were once purified. The purification mechanism is still active and has expanded its definition of impurity."],
        arcane:    ["A detection grid — thin lines of magical force crossing the corridor at ankle, waist, and eye height. They're not all visible.","A puzzle door, the frame carved with a sequence that must be followed to open it safely. The sequence is written on the wall — with one step missing."],
        fortress:  ["A kill corridor — arrow slits in both walls, a door at each end. The murder holes in the ceiling are still loaded.","A gate mechanism room, the levers on the wall controlling the portcullis ahead. Three of the four levers do what the labels say."],
        cave:      ["A narrow passage over a pit, the rock bridge two feet wide and crumbling at the edges.","A chamber where the ceiling is covered in stalactites — and something has been drilling into them from above. They're hollow. And occupied."],
    },
    treasure: {
        ruins:     ["A vault, the door open, the mechanism that sealed it defeated from inside. Whatever was stored here chose to leave.","A treasury, the shelves empty except for one item left behind — either because it was overlooked or because it was deliberately left."],
        crypt:     ["A burial vault, the grave goods of generations stacked floor to ceiling. The newest addition is a chest that doesn't match the others.","A reliquary, sealed cases holding objects of religious significance. One of the cases has been opened and resealed imperfectly."],
        mine:      ["The assay room, where ore and finds were processed and valued. The safe in the wall has been opened from the inside.","A secure storage room, the lock on the outside, the bar on the inside. It can only be locked from within."],
        temple:    ["The offering vault, the accumulated wealth of the congregation stored behind stone and iron. The door is intact. The wall next to it has been removed.","A reliquary of the faith, the sacred objects on display behind glass. Most are what they appear to be."],
        arcane:    ["A containment vault for dangerous magical objects, each one in an individually warded case. Most of the cases are sealed. One is not.","A storage room for the products of the laboratory's work — objects that don't look like anything until you hold them."],
        fortress:  ["The paymaster's vault, the gold still inside and the guards still outside — from the inside. They appear to have walked in voluntarily.","An armory vault for exceptional items — things too dangerous or too valuable for the regular armory. It has been partially emptied."],
        cave:      ["A natural alcove where something has built a collection — a magpie's hoard of everything shiny, interesting, or magical found in the caves.","A hidden cache, sealed behind a false wall of stone, containing provisions and wealth that were never recovered."],
    },
    ritual: {
        ruins:     ["A circular chamber, the walls carved with a repeating scene — figures approaching a central figure, kneeling, and then the next panel shows only the central figure.","A great ceremonial hall, the floor a mosaic depicting something astronomical. The arrangement isn't any known star pattern."],
        crypt:     ["A necromantic circle, old and dried, the reagents still visible in the grooves of the carved floor. It has been used more recently than old.","A chamber where the dead were animated, the tools of that work still present. The work is unfinished."],
        mine:      ["A ritual space that the miners built underground, at odds with everything else about the mine. They were worshipping something they found down here.","A carved chamber that predates the mine — the miners broke into it and worked around it, carefully, avoiding disturbing anything."],
        temple:    ["The innermost sanctum, where the highest rituals were performed. The ritual in progress when the temple was abandoned was never completed. The reagents are still there. So is the subject.","A chamber of transformation, the walls depicting a process in stages. The final stage is unclear — the carvings were never finished."],
        arcane:    ["An experimental chamber, the largest in the complex, purpose-built to contain something that didn't stay contained.","A dimensional anchor room, the floor covered in a binding circle forty feet across. The binding is still active. What it was binding is still inside it."],
        fortress:  ["A war ritual chamber, where the garrison performed rites before battle. The last ritual is mid-performance.","A siege magic room, the great weapon mounts still in place. One of them is still loaded."],
        cave:      ["A natural amphitheater deep in the cave system, the rock formations arranged around a central point with suspicious regularity.","A painted cave of considerable age — tens of thousands of years — recently used for a ritual the painters never imagined."],
    },
    prison: {
        ruins:     ["A holding area, the iron rings in the walls still present, some still occupied — by what the occupants left behind.","A court of punishment — stocks, a whipping post, and a sealed stone building that was used for more permanent solutions."],
        crypt:     ["A section of the crypt where bodies were sealed that the family didn't want to bury normally. The seals are from the outside.","A containment chamber for something the builders feared but couldn't bring themselves to destroy. The containment was insufficient."],
        mine:      ["A company jail, built for workers who stole or refused to work. The management philosophy has left its mark.","A secure holding area built near the bottom of the mine. It was built after the workers found something. It was built to hold that something."],
        temple:    ["A penitent's cell block, where the faithful were held for purification. The length of the sentences suggests the bar for purification was high.","A containment area for things the temple acquired that they needed to keep but couldn't allow to leave."],
        arcane:    ["A holding area for experimental subjects — the labels on the cells describe what was done to each one.","A stasis chamber, the suspension fields still active around three occupied alcoves."],
        fortress:  ["The stockade, a few cells still locked from the outside, none locked from the inside.","A secure area for political prisoners — the quality of the furnishings indicates these were important people."],
        cave:      ["A natural pit, the walls too sheer to climb, used as a cage. Something is in it. It has been there for some time.","A section of cave that has been sealed off with iron bars. The thing that did the sealing was working from inside."],
    },
    natural: {
        cave:      ["A vast natural chamber, the ceiling invisible in the darkness above. The formations here took millennia to form. Something has broken several of them.","An underground lake, perfectly still and perfectly black. The water is very clear. The bottom is very far down."],
        mine:      ["A natural cavern the miners broke into, larger than anything they dug themselves. They used it. Their signs are everywhere. So are signs of earlier use.","A fault in the rock, a crack ten feet wide and indeterminate feet deep, bridged by planks the miners laid. The planks are rotting."],
        ruins:     ["The dungeon's foundation, built on natural rock. Where the foundation ends and the natural cave begins is unclear.","A natural spring room, the water still running, the only source of fresh water in the complex."],
        crypt:     ["A natural cave that the crypt was built around, incorporated into its design. The cave was here first. The crypt was built to enclose it.","An underground river passage, the water running through a crack in the floor. The sound it makes is almost words."],
        temple:    ["A sacred natural space incorporated into the temple, the deity's presence felt in the rock formations.","The living heart of the temple — a natural cave that the structure was built to protect and access."],
        arcane:    ["A natural ley line nexus, the rock glowing faintly where the energies pass through.","An old cave system that predates the laboratory, connected to it through a hole in the basement wall."],
        fortress:  ["A natural cave system beneath the fortress used for storage and escape routes.","A spring cave providing the fortress with its water supply, now corrupted."],
    },
};

// ---- INIMIGOS por facção e nível ----
const ENEMIES = {
    undead: {
        "1-4":   [
            { name: "3d4 Skeletons (CR 1/4)", note: "armed with rusted weapons, patrol in silence" },
            { name: "2d4 Zombies (CR 1/4)", note: "drawn to noise and light, attack relentlessly" },
            { name: "1d4 Shadows (CR 1/2)", note: "emerge from the walls when light sources are lit" },
            { name: "1 Ghoul + 2d4 Zombies", note: "the ghoul directs the zombies with predatory intelligence" },
        ],
        "5-10":  [
            { name: "1d4 Ghosts (CR 4)", note: "bound to specific locations, possessive and territorial" },
            { name: "2 Wights + 1d6 Zombies (CR 3)", note: "the wights are former soldiers, still following orders" },
            { name: "1 Mummy (CR 3) + 2d4 Skeletons", note: "a cursed guardian that was once the site's protector" },
            { name: "1d4 Wraiths (CR 5)", note: "incorporeal, immune to non-magical weapons" },
            { name: "2 Banshees (CR 4)", note: "their wail can be heard three rooms away" },
        ],
        "11-16": [
            { name: "1 Lich (CR 21) — outpost", note: "this is not the lich's lair, merely a waypoint — it will not fight to the death here" },
            { name: "1d4 Vampires (CR 13)", note: "a coven using the dungeon as a hunting ground" },
            { name: "2 Death Knights (CR 17)", note: "bound to guard this place by an oath they cannot break" },
            { name: "1 Vampire Spawn Lord (CR 8) + 2d4 Vampire Spawn", note: "the spawn lord is trying to create enough spawn to challenge its master" },
        ],
        "17+":   [
            { name: "1 Lich (CR 21) — in residence", note: "this is its lair — legendary actions apply" },
            { name: "1 Death Knight (CR 17) + 2 Vampires", note: "a hierarchy of undead serving a common master" },
            { name: "1 Dracolich (CR varies)", note: "the dragon was convinced to attempt undeath. It regrets nothing." },
        ],
    },
    cultists: {
        "1-4":   [
            { name: "2d6 Cultists (CR 1/8) + 1 Cult Fanatic (CR 2)", note: "mid-ritual when the party arrives" },
            { name: "1d4 Cultists + 1 Cult Fanatic", note: "standing guard, expecting no one to find this place" },
            { name: "2d4 Cultists + 1 Acolyte (CR 1/4)", note: "new initiates, poorly trained but zealous" },
        ],
        "5-10":  [
            { name: "2 Cult Fanatics + 1d6 Cultists + 1 Summoned Demon (CR 1d4)", note: "the summoning just succeeded" },
            { name: "1 Mage (CR 6) directing 2d6 Cultists", note: "the mage is the chapter leader and will fight to the last convert" },
            { name: "1d4 Cult Fanatics + 1 Cambion (CR 5)", note: "the cambion is the patron's envoy, unimpressed with the local operation" },
        ],
        "11-16": [
            { name: "1 Archmage cultist (CR 12) + 2 Mages + 2d6 Fanatics", note: "the leadership is here for a convergence ritual" },
            { name: "1 Pit Fiend envoy (CR 20) + 1d4 Erinyes (CR 12)", note: "the patron has arrived to ensure things are done correctly" },
            { name: "1 Cultist High Priest (Priest stats, CR 2) with 4th-level spells + summoned Balor (CR 19)", note: "the ritual completed. The problem is what was summoned." },
        ],
        "17+":   [
            { name: "1 Archdevil Avatar (CR 20+)", note: "not the real thing. A projection. Equally dangerous." },
            { name: "1 Demon Prince manifestation + 1d4 Mariliths (CR 16)", note: "the planar barrier has thinned enough for direct manifestation" },
        ],
    },
    aberrations: {
        "1-4":   [
            { name: "1d4 Gibbering Mouthers (CR 2)", note: "their babbling causes confusion — DC 10 Wis save or lose action" },
            { name: "2d4 Chuuls (CR 4) — juvenile", note: "smaller than adult chuuls but no less dangerous in a group" },
            { name: "1 Nothic (CR 2) + 1d4 Ghouls", note: "the nothic has corrupted the undead through its gaze" },
        ],
        "5-10":  [
            { name: "1 Chuul (CR 4) + 1d4 Nothics (CR 2)", note: "the chuul is being advised by the nothics, who are hungry for secrets" },
            { name: "1 Mind Flayer (CR 7)", note: "hunting alone, has established a thrall network in the dungeon" },
            { name: "1d3 Otyughs (CR 5)", note: "not hostile unless disturbed — but they consider everything their territory" },
        ],
        "11-16": [
            { name: "1 Mind Flayer Arcanist (CR 8) + 2d4 Intellect Devourers", note: "an elder brain outpost, harvesting knowledge" },
            { name: "1 Beholder (CR 13)", note: "territorial and paranoid — it has seen your approach and has planned for it" },
            { name: "1d3 Aboleth (CR 10)", note: "impossibly old, patient, and fully aware of everything in the surrounding water" },
        ],
        "17+":   [
            { name: "1 Elder Brain (CR 14) + 2d4 Mind Flayers", note: "a full illithid colony, actively expanding" },
            { name: "1 Death Tyrant (CR 14)", note: "a beholder that died and refused to stop seeing" },
        ],
    },
    constructs: {
        "1-4":   [
            { name: "2d4 Animated Armors (CR 1)", note: "still following their original patrol route" },
            { name: "1d4 Flying Swords (CR 1/4) + 2 Animated Armors", note: "an automated defense system still active after all this time" },
            { name: "1 Shield Guardian (CR 7)", note: "bound to a master it hasn't seen in decades, awaiting orders" },
        ],
        "5-10":  [
            { name: "2 Stone Golems (CR 10)", note: "guarding something specific — they won't pursue beyond their assigned area" },
            { name: "1 Iron Golem (CR 16)", note: "too powerful for this level — it has strict patrol boundaries and won't break them" },
            { name: "2d4 Helmed Horrors (CR 4)", note: "immune to specific spells that the creator knew their enemies would use" },
        ],
        "11-16": [
            { name: "2 Iron Golems (CR 16)", note: "a matched pair, coordinated, guarding a single objective" },
            { name: "1 Clockwork Horror (use Golem stats) + 1d6 Animated Armors", note: "the original creator's masterwork, still ticking" },
            { name: "1d4 Maruts (CR 25) — reduced", note: "planar constructs stripped of power but still formidable" },
        ],
        "17+":   [
            { name: "1 Inevitable (Marut, CR 25)", note: "sent to ensure a specific contract is fulfilled" },
            { name: "3 Iron Golems + 1 Arcane Guardian (homebrew, CR 18)", note: "the complex's final defense" },
        ],
    },
    beasts: {
        "1-4":   [
            { name: "1 Owlbear (CR 3)", note: "nesting here, has cubs somewhere nearby — it is furious" },
            { name: "2d6 Giant Rats (CR 1/8)", note: "a massive colony that has taken over the lower areas" },
            { name: "1d4 Giant Spiders (CR 1)", note: "webbing covers the entire room, reducing movement" },
            { name: "1 Brown Bear (CR 1)", note: "using the dungeon as a den, confused and aggressive" },
        ],
        "5-10":  [
            { name: "1 Manticore (CR 3)", note: "roosting here, has accumulated a hoard of interesting objects" },
            { name: "2 Basilisks (CR 3)", note: "petrified figures in the room are their previous victims" },
            { name: "1 Wyvern (CR 6)", note: "the nest is here, the mate is not — yet" },
            { name: "1d3 Displacer Beasts (CR 3)", note: "pack hunters using the corridors to their advantage" },
        ],
        "11-16": [
            { name: "1 Roc (CR 11) — juvenile", note: "not full-sized but already capable of carrying a horse" },
            { name: "1d4 Hydras (CR 8)", note: "each occupying a flooded section of the dungeon" },
            { name: "1 Purple Worm (CR 15)", note: "has burrowed through the dungeon walls, creating new passages" },
        ],
        "17+":   [
            { name: "1 Ancient Dragon (CR varies)", note: "using the dungeon as a lair, has been here longer than the dungeon itself" },
            { name: "1 Tarrasque (CR 30)", note: "sleeping. Deeply. Do not wake it." },
        ],
    },
    fiends: {
        "1-4":   [
            { name: "2d4 Imps (CR 1)", note: "familiar-class devils scouting for their master" },
            { name: "1d4 Dretches (CR 1/4) + 1 Quasit (CR 1)", note: "the lowest tier of infernal hierarchy, squabbling among themselves" },
            { name: "2 Spined Devils (CR 2)", note: "posted as guards, resentful of the assignment" },
        ],
        "5-10":  [
            { name: "1 Bearded Devil (CR 5) + 2d4 Imps", note: "a sergeant and its unit" },
            { name: "1d4 Cambions (CR 5)", note: "half-mortal agents operating independently" },
            { name: "1 Barbed Devil (CR 5) + 1d6 Spined Devils", note: "an overseer ensuring the operation runs correctly" },
        ],
        "11-16": [
            { name: "1 Ice Devil (CR 14)", note: "overseeing operations with cold contempt for everything around it" },
            { name: "1 Chain Devil (CR 8) + 2 Erinyes (CR 12)", note: "a hunting party pursuing a specific target" },
            { name: "1d4 Vrocks (CR 9)", note: "chaotic and violent, barely controlled" },
        ],
        "17+":   [
            { name: "1 Pit Fiend (CR 20)", note: "a general of Hell, here on specific business" },
            { name: "1 Balor (CR 19)", note: "a demon lord's champion, impossible to reason with" },
        ],
    },
    bandits: {
        "1-4":   [
            { name: "2d6 Bandits (CR 1/8) + 1 Bandit Captain (CR 2)", note: "a crew of 10–15, organized and armed" },
            { name: "1d4 Veterans (CR 3) + 2d6 Bandits", note: "experienced mercenaries who turned to crime" },
            { name: "1 Spy (CR 1) + 2d4 Bandits", note: "the spy handles intelligence; the bandits handle everything else" },
        ],
        "5-10":  [
            { name: "1 Bandit Captain (CR 2) + 2 Veterans (CR 3) + 2d6 Bandits", note: "a well-organized crew with clear chain of command" },
            { name: "1 Assassin (CR 8) + 1d4 Spies", note: "a professional outfit, not interested in confrontation they didn't choose" },
            { name: "1 Gladiator (CR 5) leading 2d4 Bandits", note: "the gladiator was bought out of the arena by this crew; they are loyal to a fault" },
        ],
        "11-16": [
            { name: "1 Assassin (CR 8) + 2 Gladiators (CR 5) + 2d6 Veterans", note: "the inner circle of a major criminal organization" },
            { name: "1 Archmage (CR 12) turned crime lord + 2d4 Mages", note: "a wizard who decided legitimacy wasn't worth it" },
        ],
        "17+":   [
            { name: "1 Master Assassin (use Assassin stats + 4th level) + 2 Assassins", note: "the kind of operation that topples kingdoms" },
            { name: "1 Warlord (use Gladiator + legendary actions) + 2d6 Veterans", note: "a criminal empire's enforcement arm" },
        ],
    },
    mixed: {
        "1-4":   [
            { name: "1d4 Cultists + 2 Zombies + 1 Shadow", note: "cultists who succeeded in their ritual, partially" },
            { name: "2d4 Bandits + 1 Nothic", note: "the bandits found something down here and now they can't leave" },
            { name: "1d4 Skeletons + 1 Giant Spider", note: "the spider has been here long enough to web the skeletons into its larder" },
        ],
        "5-10":  [
            { name: "1 Mind Flayer + 2d4 Thralls (Bandit stats)", note: "the mind flayer has converted the previous occupants" },
            { name: "1 Wight + 1d4 Cultists + 2d4 Zombies", note: "the wight leads the cultists; the cultists created the zombies" },
            { name: "1 Cambion + 1d4 Cult Fanatics + 1d6 Skeletons", note: "a fiend directing mortal agents directing undead" },
        ],
        "11-16": [
            { name: "1 Vampire + 1d4 Mind Flayer thralls + 2d6 Vampire Spawn", note: "an unlikely alliance of predators" },
            { name: "1 Lich (outpost) + 1d4 Cultists (Archmage stats)", note: "mortal mages serving an undead master willingly" },
        ],
        "17+":   [
            { name: "1 Pit Fiend + 1 Lich + mutual agreement", note: "two powers with temporarily aligned interests" },
            { name: "1 Beholder + Mind Flayer colony", note: "a territorial arrangement neither side is happy about" },
        ],
    },
};

// ---- ARMADILHAS ----
const TRAPS = {
    ruins: [
        { name: "Collapsing Floor", trigger: "Walking on the weakened section", effect: "DC 13 Perception to notice. Fail: fall 20 feet, 2d6 bludgeoning, DC 14 Dex save or restrained under rubble", dc: 13 },
        { name: "Poison Needle Lock", trigger: "Opening the locked chest incorrectly", effect: "DC 15 Dex save or take 1d6 piercing + 2d6 poison, poisoned 1 hour", dc: 15 },
        { name: "Swinging Blade", trigger: "Tripwire at ankle height across the corridor", effect: "DC 14 Perception to spot. DC 13 Dex save or 2d10 slashing", dc: 14 },
        { name: "Rolling Boulder", trigger: "Pressure plate on the stairs", effect: "DC 15 Perception. DC 14 Dex or 4d10 bludgeoning and knocked prone", dc: 15 },
        { name: "Falling Portcullis", trigger: "Release mechanism in adjacent room", effect: "DC 15 Dex save or take 3d8 piercing and restrained. DC 20 Athletics to lift", dc: 15 },
    ],
    crypt: [
        { name: "Spiked Pit", trigger: "False flagstone in the center of the passage", effect: "DC 14 Perception. DC 14 Dex or 2d6 fall + 2d6 piercing from spikes, restrained", dc: 14 },
        { name: "Unholy Alarm", trigger: "Non-undead creature crosses the threshold", effect: "DC 13 to notice (Religion check). Triggers 1d4 Skeletons in adjacent room", dc: 13 },
        { name: "Gas Trap", trigger: "Opening the sealed sarcophagus incorrectly", effect: "DC 14 Perception (smell). 15-foot cloud, DC 13 Con save or poisoned, repeating each round inside cloud", dc: 14 },
        { name: "Cursed Inscription", trigger: "Reading the inscription aloud", effect: "DC 16 Arcana to recognize as dangerous. Reader: DC 14 Wis save or disadvantage on all checks for 24 hours", dc: 16 },
    ],
    mine: [
        { name: "Unstable Ceiling", trigger: "Loud noise or moving the marked support beam", effect: "DC 12 Perception (engineering). 3d6 bludgeoning in 20-foot area, DC 13 Dex half", dc: 12 },
        { name: "Gas Pocket", trigger: "Breaking the wall or using fire near it", effect: "DC 13 Perception (smell). 4d6 fire damage, 10-foot radius, or DC 12 Con if no fire (asphyxiation)", dc: 13 },
        { name: "Flooded Shaft", trigger: "Opening the sealed door", effect: "DC 15 Athletics to swim out. Creatures in the area DC 14 Str save or pulled into current", dc: 15 },
        { name: "Rigged Elevator", trigger: "Using the mine elevator without checking it", effect: "DC 14 Perception. Rope cut: 30-foot fall, 3d6 bludgeoning, DC 15 Dex half", dc: 14 },
    ],
    temple: [
        { name: "Divine Ward", trigger: "Carrying a profane object past the threshold", effect: "DC 14 Religion to identify. 3d8 radiant damage, DC 14 Con save to resist being knocked prone", dc: 14 },
        { name: "Symbol of Pain", trigger: "Reading the marked inscription", effect: "DC 16 Arcana. DC 13 Con save or incapacitated with pain for 1 minute; repeat save each turn", dc: 16 },
        { name: "False Offering Plate", trigger: "Removing coins from the offering bowl", effect: "DC 14 Perception (subtle runes). 2d8 necrotic damage, DC 13 Con save or maximum HP reduced by same amount until rest", dc: 14 },
        { name: "Spear Wall", trigger: "Stepping off the correct ritual path", effect: "DC 15 Religion to identify safe path. DC 14 Dex save or 2d8 piercing from wall-mounted spears", dc: 15 },
    ],
    arcane: [
        { name: "Glyph of Warding", trigger: "Touching the marked surface or object", effect: "DC 17 Arcana to identify. 4d8 thunder damage, 20-foot radius, DC 14 Dex half, knocked prone on fail", dc: 17 },
        { name: "Teleport Trap", trigger: "Stepping in the marked circle", effect: "DC 15 Arcana. Teleported to random room in the dungeon (1d6 determines which)", dc: 15 },
        { name: "Anti-Magic Field", trigger: "Crossing the threshold of the next room", effect: "DC 14 Arcana to notice the shimmer. All spells and magic items suppressed within. No save — but not damage.", dc: 14 },
        { name: "Summoning Circle (Residual)", trigger: "Breaking the circle lines on the floor", effect: "DC 15 Arcana to identify. Releases a CR (party level / 2) creature appropriate to the dungeon's faction", dc: 15 },
        { name: "Mirror Trap", trigger: "Looking into the mirror", effect: "DC 16 Arcana or Perception. DC 13 Wis save or swapped with reflection — duplicate acts as hostile NPC for 1d4 rounds", dc: 16 },
    ],
    fortress: [
        { name: "Murder Holes", trigger: "Walking through the marked corridor", effect: "DC 13 Perception. Ranged attack: +5 to hit, 2d8 piercing from above. Repeats each round until players find cover", dc: 13 },
        { name: "Spiked Portcullis Drop", trigger: "Pressure plate in the doorway", effect: "DC 14 Perception. DC 14 Dex save or 3d10 piercing, restrained. DC 20 Athletics to lift", dc: 14 },
        { name: "Arrow Slits (Automated)", trigger: "Crossing tripwire", effect: "DC 15 Perception. +4 ranged attack, 1d8+2 piercing on each creature in the corridor. Repeats for 3 rounds", dc: 15 },
        { name: "Burning Oil Chute", trigger: "Pressure plate or lever in adjacent room", effect: "DC 13 Perception (oil smell). 4d6 fire, DC 14 Dex half, persistent fire 1d6/round until extinguished", dc: 13 },
    ],
    cave: [
        { name: "Unstable Stalactites", trigger: "Loud noise (including thunder spells) or forced movement", effect: "DC 12 Perception. 3d8 piercing in 10-foot area, DC 14 Dex half", dc: 12 },
        { name: "Slippery Ledge", trigger: "Moving quickly or without caution on the marked section", effect: "DC 12 Perception or DC 12 Acrobatics. DC 13 Dex save or fall 2d6×5 feet (roll 1d6 for distance)", dc: 12 },
        { name: "Territorial Spores", trigger: "Disturbing the fungal growth on the walls", effect: "DC 14 Perception (smell). DC 12 Con save or poisoned, DC 14 Perception from outside the area to notice cloud", dc: 14 },
        { name: "Underground Current", trigger: "Entering the flooded section", effect: "DC 13 Perception. DC 14 Str save each round or swept 20 feet downstream into a worse area", dc: 13 },
    ],
};

// ---- LOOT por sala ----
const ROOM_LOOT = {
    common: [
        "Scattered copper and silver — 2d6 × 10 cp total",
        "A pouch with 1d6 sp and a note in a language no one speaks",
        "Broken equipment worth 1d4 gp as scrap",
        "Personal effects of no monetary value but potential story significance",
        "A cache of mundane supplies: torches, rations, rope",
        "1d4 gp in mixed coinage from several different nations",
        "A locked box containing personal correspondence and 2d6 sp",
        "Alchemical supplies worth 1d6 × 5 gp if extracted carefully",
    ],
    valuable: [
        "A masterwork weapon (no magical properties, but excellent quality — worth 3× normal)",
        "Religious idol in silver — worth 1d4 × 25 gp, possibly more to the right buyer",
        "A locked strongbox: 3d6 gp + 1d4 gems (25 gp each)",
        "Trade goods (spices, silk, dyes) worth 2d6 × 10 gp",
        "A piece of jewelry — gold and gemstone, worth 1d4 × 50 gp",
        "Encoded documents that someone would pay well to possess or suppress",
        "A collection of rare books — 1d4 volumes, each worth 1d6 × 10 gp to a scholar",
        "An experimental substance in sealed vials — unknown effect, worth 1d6 × 25 gp to an alchemist",
    ],
    magical: [
        "A spell scroll (cantrip or 1st level, appropriate to the dungeon's theme)",
        "A potion of healing (2d4+2 HP)",
        "An uncommon magic item (roll on the appropriate table from the Treasure Generator)",
        "A cursed item that appears valuable — its curse manifests after 24 hours of possession",
        "A wand with 1d6 charges of a 1st or 2nd level spell",
        "A common magic item (Moon-Touched sword, Cloak of Billowing, etc.)",
        "A rare ingredient for spellcasting worth 1d4 × 50 gp to the right wizard",
        "A fragment of something larger — a broken artifact that is clearly part of a set",
    ],
};

// ---- SEGREDOS ----
const SECRETS = [
    { find: "DC 15 Perception or Investigation", content: "A hidden passage behind a false wall, leading to a room that doesn't appear on any map the players might find." },
    { find: "DC 13 Perception", content: "A loose stone concealing a cavity — inside: a personal journal with the previous occupant's final entries." },
    { find: "DC 14 Investigation", content: "A secondary door, sealed and hidden in a decorative element. It leads to a shortcut to the boss room." },
    { find: "DC 15 Arcana or Religion", content: "A hidden inscription that reveals the dungeon's true history — changing the players' understanding of who the enemy is." },
    { find: "DC 12 Perception", content: "A crawlspace used by someone who needed to move through the dungeon undetected. It still smells of whoever last used it." },
    { find: "DC 16 Investigation", content: "A hidden safe containing a key to a door not yet found — and a note that says 'do not open what is behind it without the other key.'" },
    { find: "DC 13 Perception (floor patterns)", content: "A trapdoor beneath a rug or debris, leading to a lower level not on any map." },
    { find: "DC 14 Perception (sound)", content: "A hollow section of wall — behind it, a room used for observation of the main chamber, with sightlines and arrow slits." },
];

// ---- GANCHOS DE SAÍDA ----
const EXIT_HOOKS = [
    "Among the boss's possessions: a map. Several locations are marked. This dungeon is one of them.",
    "A survivor found here — barely alive — knows where the real operation is based.",
    "The ritual found in progress was the third of five. Two more locations are named in the documentation.",
    "A ledger recovered here records transactions with a name the party recognizes — and shouldn't.",
    "The item the party came for isn't here. A note explains where it was sent and by whom.",
    "The dungeon connects to something larger — a passage leads deeper than the map shows.",
    "A prisoner freed here has information they've been carrying for months, waiting for someone to find them.",
    "The insignia found here matches something in the capital. Someone important is involved.",
    "A dying enemy's last words name a location. They seemed to think this would be a mercy.",
    "The arcane device found here is one of a matched pair. The other is active. Somewhere.",
    "A decoded message among the papers: the group's leader is not who they claim to be.",
    "The creature that escaped during the fight will carry word back to whoever sent it.",
];


// ---- BOSS FIGHTS ----
const BOSSES = {
    undead: {
        "1-4":   { name: "The Hollow Warden", stats: "Wight (CR 3) with 2× HP and one legendary action: drain life (60 ft, DC 13 Con or 2d8 necrotic)", desc: "Once the dungeon's caretaker, now bound to its original duty by forces it no longer controls. It remembers its name.", tactics: "Begins by ordering its undead to engage while it hangs back. Uses drain life on spellcasters first. Retreats toward the altar in the boss chamber." },
        "5-10":  { name: "The Grieving Sovereign", stats: "Vampire (CR 13) — alone, no spawn in this room", desc: "An aristocrat of ancient lineage who chose undeath rather than watch their line die out. They were the last of their family. The loneliness has not improved their disposition.", tactics: "Offers to negotiate first. If refused, fights with aristocratic contempt — they consider winning inevitable." },
        "11-16": { name: "The Deathless Architect", stats: "Lich (CR 21) at 60% HP (phylactery not here)", desc: "The lich built this place over centuries, long enough to have forgotten what it originally wanted. The dungeon is now an end in itself.", tactics: "Uses legendary actions to counterspell everything. Will abandon the fight at 30% HP — there is no point dying here when the phylactery survives." },
        "17+":   { name: "The Unending King", stats: "Lich (CR 21) full HP, lair actions active", desc: "Old enough to remember when the world was different. The phylactery is in this room. They know you're here for it.", tactics: "Opens with time stop. Uses the lair to trap and divide the party. Taunts the party with accurate information about their weaknesses." },
    },
    cultists: {
        "1-4":   { name: "The Fanatic High Initiate", stats: "Cult Fanatic (CR 2) with 3× HP, can cast Inflict Wounds as 3rd level once", desc: "Genuinely believes in what they're doing. Has been waiting for this moment for years. Is not afraid.", tactics: "Begins the fight mid-ritual — completes it if not interrupted (1d4 rounds). If the ritual completes, summons a Quasit." },
        "5-10":  { name: "The Chosen Vessel", stats: "Mage (CR 6) with the following addition: when reduced to 0 HP, a Cambion (CR 5) erupts from the body", desc: "A mage who invited something in, not understanding the terms. The invitation has been accepted.", tactics: "Uses defensive spells first. The party may not realize what will happen when the mage dies." },
        "11-16": { name: "The Speaker of the Final Word", stats: "Archmage (CR 12) + at initiative count 20 each round, 1d2 Cultists arrive from the side passages", desc: "The head of the operation, halfway through a transformation that was supposed to be an apotheosis.", tactics: "Fights from range, using the cultist reinforcements as shields. If reduced to 50%, triggers a prepared Programmed Illusion to appear dead — watching from hiding." },
        "17+":   { name: "The Manifest Patron", stats: "Pit Fiend (CR 20) or Balor (CR 19) — choose based on cult type", desc: "The entity the cult served has arrived personally. It is not grateful for the service. It is here for the result.", tactics: "Does not acknowledge the party as threats initially. Continues what it came to do. Fights only when directly impeded — then with complete focus." },
    },
    aberrations: {
        "1-4":   { name: "The Thought-Eater", stats: "Nothic (CR 2) with 2× HP + advantage on Initiative and Rotting Gaze recharge 5-6", desc: "Something that was once a wizard, reduced to hunger and fragments of memory. It still knows spells. It uses them wrong.", tactics: "Uses Weird Insight first to identify the party's secrets. Uses that information to taunt while attacking." },
        "5-10":  { name: "The Elder Eye", stats: "Mind Flayer (CR 7) + 3 Intellect Devourers (CR 2) that emerge from crevices on round 2", desc: "A mind flayer that has been here long enough to understand the dungeon better than its builders did.", tactics: "Opens with Mind Blast. Uses the Intellect Devourers to separate party members. Attempts to take over the most dangerous character." },
        "11-16": { name: "The One Who Watches Itself", stats: "Beholder (CR 13), lair actions active", desc: "Paranoid even by beholder standards — it has divided itself into separate fears and assigned each eye ray to a specific one.", tactics: "Uses anti-magic cone on the most magical party member and keeps them in it. Prioritizes eliminating anyone who can counter its eye rays." },
        "17+":   { name: "The Eternal Memory", stats: "Aboleth (CR 10) in underwater lair + 2d4 Mind Flayer Thralls", desc: "It has been here since before the dungeon was built. It remembers the people who built it. It remembers their children. It is waiting.", tactics: "Does not fight. Negotiates. Everything it says is true. Nothing it wants is acceptable." },
    },
    constructs: {
        "1-4":   { name: "The Last Sentinel", stats: "Shield Guardian (CR 7) bound to a control amulet in the room", desc: "A guardian whose master is long dead, still following the last command given. The command was: allow no one to pass.", tactics: "Immovable. Will not leave its designated area. If the amulet is found and taken, the fight may end — or escalate." },
        "5-10":  { name: "The Masterwork", stats: "Stone Golem (CR 10) + after taking 50 damage, it separates into 2 smaller Stone Golems (CR 5 each)", desc: "The creator's crowning achievement, built in their own image. It has been improving itself.", tactics: "Slow activation — takes a full round. When it separates, players who don't know this will be surprised." },
        "11-16": { name: "The Iron Throne", stats: "Iron Golem (CR 16) + lair feature: the room's machinery activates on round 3, restraining effect DC 15 Str", desc: "Built into the room itself — the golem and the chamber are one system.", tactics: "Tries to activate the room's mechanical restraints before engaging directly." },
        "17+":   { name: "The Inevitability Engine", stats: "Marut (CR 25) at 70% stats", desc: "A construct built not to guard a place but to ensure a specific outcome. The outcome involves the party.", tactics: "States its purpose clearly. Fights without anger. Cannot be dissuaded from its function by argument." },
    },
    beasts: {
        "1-4":   { name: "The Nesting Horror", stats: "Owlbear (CR 3) with cubs nearby — if cubs are threatened, +2 to all attack rolls and resistance to damage", desc: "A creature that found this place and made it home. It has been here long enough to know every passage.", tactics: "Fights defensively at first — trying to drive away rather than kill. Becomes lethal if it believes the cubs are threatened." },
        "5-10":  { name: "The Ancient Predator", stats: "Wyvern (CR 6) + the mate arrives on round 4 from the entrance passage", desc: "A mated pair that has used this dungeon as a lair for years. One is always hunting. One is always here.", tactics: "The first wyvern fights while the second returns. The players will know the second is coming — they can hear it from round 2." },
        "11-16": { name: "The Dreaming Worm", stats: "Purple Worm (CR 15) — the room is its body. The 'walls' on one side are its hide.", desc: "The purple worm has settled into the deepest chamber so completely that it has become part of the architecture.", tactics: "Players may not realize what the room is until round 1. The 'wall' moves on initiative count 20." },
        "17+":   { name: "The Sleeping King", stats: "Ancient Dragon (CR appropriate to color) — lair actions active", desc: "Old enough that the dungeon was built around it, not the other way around. It has been asleep for fifty years. Something woke it.", tactics: "Furious. Wants to know what woke it. Will accept a good answer. Will not accept a bad one." },
    },
    fiends: {
        "1-4":   { name: "The Bound Emissary", stats: "Quasit (CR 1) serving as spokesperson + 1d4 Imps (CR 1)", desc: "A minor devil sent to establish a foothold. It is more dangerous than its CR suggests because it is far smarter.", tactics: "Offers a deal. The deal is genuinely good in the short term. The long-term costs are in the fine print." },
        "5-10":  { name: "The Architect of Compromise", stats: "Cambion (CR 5) + two Spined Devils (CR 2) as bodyguards", desc: "A half-mortal devil-child who believes in what they're building here with an authenticity that is more disturbing than pure malevolence.", tactics: "Uses its Fiendish Charm first. Fights with a sword named after a concept — it said the name when it made the kill." },
        "11-16": { name: "The Frozen General", stats: "Ice Devil (CR 14), lair is 10 degrees colder — difficult terrain throughout the boss chamber", desc: "A devil of patience and calculation, treating the dungeon as a piece in a game played across centuries.", tactics: "Has prepared contingencies for every tactic the party has used in this dungeon. It was watching." },
        "17+":   { name: "The Pit Sovereign", stats: "Pit Fiend (CR 20), lair actions: at count 20 the ground cracks and 1d4 Bearded Devils (CR 5) emerge", desc: "A general of Hell who has personally taken interest in this operation. It considers killing the party a courtesy — they're clearly skilled enough to be useful elsewhere.", tactics: "Offers employment before combat. Fights with honor — it considers cheating beneath its station." },
    },
    bandits: {
        "1-4":   { name: "The Desperate Captain", stats: "Bandit Captain (CR 2) + 2d4 Bandits", desc: "Someone who had options once and made choices that eliminated them one by one. This is the last one.", tactics: "Tries to negotiate from a position of false strength. Will surrender at 25% HP. Has information worth trading." },
        "5-10":  { name: "The Professional", stats: "Assassin (CR 8) alone — the guards are outside", desc: "Not interested in a fight. Was hired to do something specific. The party has interrupted that thing.", tactics: "Uses terrain and darkness. Tries to eliminate the most dangerous party member first and then leave. Will not fight to the death." },
        "11-16": { name: "The Warlord of the Empty Throne", stats: "Gladiator (CR 5) with Legendary Resistance 2/day and 2× HP", desc: "Someone who built an empire in the cracks between legitimate powers. Has been here before any of the party was born.", tactics: "Challenges the strongest party member to single combat. Keeps word if accepted. Fights normally if refused, with visible contempt." },
        "17+":   { name: "The Shadow Broker", stats: "Master Spy (Archmage stats, non-magical abilities only) + 1d6 Assassins (CR 8)", desc: "The organization's founder. Knows everything. Has contingency plans for contingency plans. Has been expecting this visit.", tactics: "Knows the party's names, composition, and capabilities. Opens with that information. Then negotiates. Then, if necessary, fights." },
    },
    mixed: {
        "1-4":   { name: "The Corrupted Keeper", stats: "Bandit Captain (CR 2) partially transformed by dark magic — immunity to non-silvered weapons", desc: "Whoever was here before made a deal with whatever moved in after. The deal went badly.", tactics: "Confused and in pain. May be talked down. May not be." },
        "5-10":  { name: "The Host", stats: "Mage (CR 6) carrying a Mind Flayer parasite — on round 3, the mage's body is taken over (Mind Flayer stats, CR 7)", desc: "A powerful mage who was taken over slowly enough to be aware of it throughout the process.", tactics: "The mage fights the takeover for 2 rounds, visibly. Round 3, the fight changes entirely." },
        "11-16": { name: "The Convergence Point", stats: "Vampire (CR 13) + Ice Devil (CR 14) in uneasy alliance — fight separately", desc: "Two predators who realized the party was a mutual threat. They hate each other more than they hate you. They are cooperating anyway.", tactics: "The vampire and devil attack from opposite sides but do not coordinate. Occasionally one interferes with the other by accident." },
        "17+":   { name: "The Ascending One", stats: "Archmage (CR 12) mid-ascension to lichdom — on death, rises as a proto-Lich with 100 HP and limited lich abilities", desc: "A mortal at the threshold of a transformation. Not yet undead. No longer fully alive.", tactics: "Uses every spell in the archmage's list. On apparent death, the transformation completes — and the party realizes this isn't over." },
    },
};

// ---- GERADOR PRINCIPAL ----
function generateDungeon() {
    const dtype    = document.getElementById('dg-type').value;
    const dsize    = document.getElementById('dg-size').value;
    const dlevel   = document.getElementById('dg-level').value;
    const dfaction = document.getElementById('dg-faction').value;
    const result   = document.getElementById('dungeonResult');

    // Número de salas
    const roomCount = { small: dgRoll(5,7), medium: dgRoll(8,12), large: dgRoll(13,18) }[dsize];

    // Nome
    const name = dgPick(DG_NAME_PREFIX[dtype]) + ' ' + dgPick(DG_NAME_SUFFIX[dtype]);

    // Backstory
    const backstory = dgPick(DG_BACKSTORY[dtype]);

    // Boss
    const boss = BOSSES[dfaction][dlevel];

    // Segredo
    const secret = dgPick(SECRETS);

    // Gancho de saída
    const exitHook = dgPick(EXIT_HOOKS);

    // Gerar salas
    const rooms = buildRooms(dtype, dlevel, dfaction, roomCount);

    // Render
    renderDungeon(result, { name, dtype, dsize, dlevel, dfaction, backstory, rooms, boss, secret, exitHook });
}

function buildRooms(dtype, dlevel, dfaction, count) {
    // Estrutura fixa: entrada → salas variadas → opcional segredo → boss
    const ROOM_SEQUENCE = ['entrance'];

    // Tipos de sala intermediária por tipo de masmorra
    const MID_TYPES = {
        ruins:     ['chamber','guardroom','trap','chamber','shrine','storage','natural','ritual','corridor'],
        crypt:     ['chamber','shrine','prison','trap','ritual','guardroom','chamber','corridor'],
        mine:      ['chamber','guardroom','natural','trap','storage','natural','corridor','chamber'],
        temple:    ['chamber','shrine','ritual','guardroom','trap','chamber','shrine','corridor'],
        arcane:    ['chamber','shrine','ritual','trap','prison','storage','chamber','corridor'],
        fortress:  ['guardroom','chamber','trap','guardroom','prison','storage','chamber','corridor'],
        cave:      ['natural','chamber','natural','trap','natural','chamber','corridor','natural'],
    };

    const midTypes = MID_TYPES[dtype] || MID_TYPES['ruins'];

    // Preencher salas intermediárias
    for (let i = 1; i < count - 2; i++) {
        ROOM_SEQUENCE.push(dgPick(midTypes));
    }

    // Sempre terminar com tesouro → boss
    ROOM_SEQUENCE.push('treasure');
    ROOM_SEQUENCE.push('boss');

    // Gerar cada sala
    return ROOM_SEQUENCE.map((rtype, idx) => buildRoom(rtype, idx + 1, dtype, dlevel, dfaction, count));
}

function buildRoom(rtype, num, dtype, dlevel, dfaction, total) {
    const rt = ROOM_TYPES[rtype];

    // Descrição
    const descPool = (ROOM_DESCRIPTIONS[rtype] || {})[dtype] || (ROOM_DESCRIPTIONS['chamber'] || {})[dtype] || ["A stone chamber, unremarkable except for its contents."];
    const desc = dgPick(descPool);

    // Inimigos (não em entrada, corredor, storage, segredo)
    let enemies = null;
    const ENEMY_ROOMS = ['guardroom','chamber','shrine','prison','ritual','boss','trap','natural'];
    if (ENEMY_ROOMS.includes(rtype)) {
        const factionEnemies = ENEMIES[dfaction] || ENEMIES['mixed'];
        const levelEnemies = factionEnemies[dlevel] || factionEnemies['5-10'];
        if (rtype === 'boss') {
            enemies = null; // boss é tratado separadamente
        } else if (Math.random() > 0.3) {
            enemies = dgPick(levelEnemies);
        }
    }

    // Armadilha
    let trap = null;
    const TRAP_ROOMS = ['trap','corridor','chamber','entrance','treasure'];
    if (TRAP_ROOMS.includes(rtype) && (rtype === 'trap' || Math.random() > 0.6)) {
        const trapPool = TRAPS[dtype] || TRAPS['ruins'];
        trap = dgPick(trapPool);
    }

    // Loot
    let loot = null;
    const LOOT_ROOMS = ['chamber','guardroom','shrine','storage','treasure','boss','prison','ritual'];
    if (LOOT_ROOMS.includes(rtype)) {
        if (rtype === 'treasure' || rtype === 'boss') {
            loot = dgPick(ROOM_LOOT.magical);
        } else if (Math.random() > 0.4) {
            loot = Math.random() > 0.7 ? dgPick(ROOM_LOOT.valuable) : dgPick(ROOM_LOOT.common);
        }
    }

    // Conexões (simplificado — sequencial com bifurcações ocasionais)
    const connections = [];
    if (num > 1) connections.push(`Room ${num - 1}`);
    if (num < total) connections.push(`Room ${num + 1}`);
    if (num > 2 && Math.random() > 0.75 && rtype !== 'boss') {
        const skip = Math.floor(Math.random() * (num - 2)) + 1;
        connections.push(`Room ${skip} (passage)`);
    }

    return { num, rtype, rt, desc, enemies, trap, loot, connections };
}

function renderDungeon(result, data) {
    const { name, dtype, dsize, dlevel, dfaction, backstory, rooms, boss, secret, exitHook } = data;

    const S   = 'background:#1c1c22;border:1px solid rgba(201,168,76,0.12);border-radius:4px;padding:20px;';
    const T   = 'font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(201,168,76,0.1);';
    const LI  = 'padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:14px;color:#e8e0d0;line-height:1.5;';
    const LBL = 'font-size:11px;font-family:Cinzel,serif;letter-spacing:1px;color:#8a8070;display:block;margin-bottom:2px;';

    const TYPE_LABELS   = { ruins:'🏚️ Ancient Ruins', crypt:'⚰️ Crypt', mine:'⛏️ Abandoned Mine', temple:'🕍 Defiled Temple', arcane:'🔮 Arcane Laboratory', fortress:'🏰 Fallen Fortress', cave:'🕳️ Cave System' };
    const SIZE_LABELS   = { small:'Small', medium:'Medium', large:'Large' };
    const FACTION_COLORS= { undead:'#9b59b6', cultists:'#e74c3c', aberrations:'#4a90c9', constructs:'#8a8070', beasts:'#4caf7d', fiends:'#e07832', bandits:'#e0a832', mixed:'#c9a84c' };
    const fColor = FACTION_COLORS[dfaction] || '#c9a84c';

    let html =
        // Header
        '<div style="' + S + 'border-color:rgba(201,168,76,0.3);margin-bottom:20px;">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">'
        + '<div>'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:6px;">'
        + TYPE_LABELS[dtype] + ' &nbsp;·&nbsp; ' + SIZE_LABELS[dsize] + ' (' + rooms.length + ' rooms) &nbsp;·&nbsp; Level ' + dlevel
        + '</div>'
        + '<div style="font-family:Cinzel,serif;font-size:28px;font-weight:700;color:#c9a84c;line-height:1.2;">' + name + '</div>'
        + '</div>'
        + '<span style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;padding:4px 12px;border-radius:2px;border:1px solid ' + fColor + ';color:' + fColor + ';flex-shrink:0;text-transform:uppercase;">' + dfaction + '</span>'
        + '</div></div>'

        // Backstory
        + '<div style="background:rgba(201,168,76,0.04);border-left:3px solid rgba(201,168,76,0.3);padding:16px 20px;margin-bottom:20px;border-radius:0 4px 4px 0;">'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:8px;">📜 HISTORY</div>'
        + '<div style="font-size:15px;color:#e8e0d0;line-height:1.7;font-style:italic;">' + backstory + '</div>'
        + '</div>'

        // Mapa de salas
        + '<div style="' + S + 'margin-bottom:20px;">'
        + '<div style="' + T + '">🗺️ DUNGEON MAP — ' + rooms.length + ' ROOMS</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">'
        + rooms.map(r =>
            '<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:rgba(0,0,0,0.2);border:1px solid rgba(201,168,76,' + (r.rtype==='boss'?'0.4':'0.1') + ');border-radius:2px;font-size:12px;">'
            + '<span>' + r.rt.icon + '</span>'
            + '<span style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;color:' + r.rt.color + ';">' + r.num + '</span>'
            + '<span style="font-size:12px;color:#8a8070;">' + r.rt.label + '</span>'
            + '</div>'
        ).join('<span style="color:#8a8070;align-self:center;">→</span>')
        + '</div>'

        // Legenda da conexão secreta
        + '<div style="font-size:12px;color:#4caf7d;padding:6px 10px;background:rgba(76,175,125,0.06);border:1px solid rgba(76,175,125,0.15);border-radius:2px;display:inline-block;">'
        + '🔍 Secret: ' + secret.find
        + '</div>'
        + '</div>';

    // Salas individuais
    html += '<div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">';

    for (const room of rooms) {
        if (room.rtype === 'boss') continue; // boss renderizado separadamente

        const isBossAdj = room.num === rooms.length - 1;
        html += '<div style="' + S + (isBossAdj ? 'border-color:rgba(201,168,76,0.2);' : '') + '">'
            + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">'
            + '<div style="font-family:Cinzel,serif;font-size:22px;color:rgba(201,168,76,0.3);min-width:32px;">' + String(room.num).padStart(2,'0') + '</div>'
            + '<div style="font-size:18px;">' + room.rt.icon + '</div>'
            + '<div>'
            + '<div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:2px;color:' + room.rt.color + ';">' + room.rt.label.toUpperCase() + '</div>'
            + '<div style="font-size:12px;color:#8a8070;">Connects to: ' + room.connections.join(', ') + '</div>'
            + '</div>'
            + '</div>'

            + '<div style="font-size:14px;color:#e8e0d0;line-height:1.7;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.05);">' + room.desc + '</div>'

            + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;">';

        if (room.enemies) {
            html += '<div style="padding:10px;background:rgba(192,57,43,0.06);border:1px solid rgba(192,57,43,0.15);border-radius:2px;">'
                + '<div style="' + LBL + 'color:rgba(192,57,43,0.7);">⚔️ ENEMIES</div>'
                + '<div style="font-size:13px;color:#e8e0d0;margin-bottom:4px;">' + room.enemies.name + '</div>'
                + '<div style="font-size:12px;color:#8a8070;font-style:italic;">' + room.enemies.note + '</div>'
                + '</div>';
        }

        if (room.trap) {
            html += '<div style="padding:10px;background:rgba(224,120,50,0.06);border:1px solid rgba(224,120,50,0.15);border-radius:2px;">'
                + '<div style="' + LBL + 'color:rgba(224,120,50,0.7);">⚠️ TRAP — ' + room.trap.name + '</div>'
                + '<div style="font-size:12px;color:#8a8070;margin-bottom:4px;"><span style="color:#e07832;">Trigger:</span> ' + room.trap.trigger + '</div>'
                + '<div style="font-size:12px;color:#8a8070;font-style:italic;">' + room.trap.effect + '</div>'
                + '</div>';
        }

        if (room.loot) {
            html += '<div style="padding:10px;background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.15);border-radius:2px;">'
                + '<div style="' + LBL + '">💰 LOOT</div>'
                + '<div style="font-size:13px;color:#e8e0d0;">' + room.loot + '</div>'
                + '</div>';
        }

        html += '</div></div>';
    }

    html += '</div>';

    // Boss Chamber
    html += '<div style="' + S + 'border-color:rgba(231,76,60,0.3);margin-bottom:16px;">'
        + '<div style="' + T + 'color:rgba(231,76,60,0.7);border-color:rgba(231,76,60,0.15);">💀 BOSS CHAMBER — ROOM ' + rooms.length + '</div>'

        + '<div style="font-family:Cinzel,serif;font-size:20px;color:#e74c3c;margin-bottom:6px;">' + boss.name + '</div>'
        + '<div style="font-size:13px;color:#8a8070;margin-bottom:12px;font-family:Cinzel,serif;letter-spacing:1px;">' + boss.stats + '</div>'

        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;">'

        + '<div style="padding:12px;background:rgba(0,0,0,0.2);border-radius:2px;">'
        + '<div style="' + LBL + '">DESCRIPTION</div>'
        + '<div style="font-size:14px;color:#e8e0d0;line-height:1.6;font-style:italic;">' + boss.desc + '</div>'
        + '</div>'

        + '<div style="padding:12px;background:rgba(0,0,0,0.2);border-radius:2px;">'
        + '<div style="' + LBL + '">TACTICS</div>'
        + '<div style="font-size:14px;color:#e8e0d0;line-height:1.6;">' + boss.tactics + '</div>'
        + '</div>'

        + '</div></div>';

    // Segredo + Gancho
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:16px;">'

        + '<div style="' + S + 'border-color:rgba(76,175,125,0.2);">'
        + '<div style="' + T + 'color:rgba(76,175,125,0.6);border-color:rgba(76,175,125,0.1);">🔍 SECRET ROOM</div>'
        + '<div style="font-size:13px;color:#4caf7d;margin-bottom:8px;font-family:Cinzel,serif;">' + secret.find + '</div>'
        + '<div style="font-size:14px;color:#e8e0d0;line-height:1.6;">' + secret.content + '</div>'
        + '</div>'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">🎣 EXIT HOOK</div>'
        + '<div style="font-size:14px;color:#e8e0d0;line-height:1.6;">' + exitHook + '</div>'
        + '</div>'

        + '</div>';

    // Botão
    html += '<button onclick="generateDungeon()" style="width:100%;background:none;border:1px solid rgba(201,168,76,0.25);border-radius:2px;padding:12px;color:#c9a84c;font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background=\'rgba(201,168,76,0.08)\'" onmouseout="this.style.background=\'none\'">🎲 GENERATE NEW DUNGEON</button>';

    result.innerHTML = html;
}