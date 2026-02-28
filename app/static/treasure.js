// =============================================================
// TREASURE GENERATOR — D&D 5e
// =============================================================

function treasureRollDice(count, sides) {
    let total = 0;
    for (let i = 0; i < count; i++) total += Math.floor(Math.random() * sides) + 1;
    return total;
}
function treasurePick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function treasurePickN(arr, n) {
    const copy = [...arr], result = [];
    for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}

// ---- GEMS ----
const GEMS_10GP = ["Azurite (opaque mottled deep blue)","Banded agate (translucent striped brown/blue/white)","Blue quartz (transparent pale blue)","Eye agate (translucent circles of gray/white/brown/blue/green)","Hematite (opaque gray-black)","Lapis lazuli (opaque light/dark blue with yellow flecks)","Malachite (opaque striated light/dark green)","Moss agate (translucent pink/white with mossy gray/green)","Obsidian (opaque black)","Rhodochrosite (opaque light pink)","Tiger eye (translucent brown with golden center)","Turquoise (opaque light blue-green)"];
const GEMS_50GP = ["Bloodstone (opaque dark gray with red flecks)","Carnelian (opaque orange to red-brown)","Chalcedony (opaque white)","Chrysoprase (translucent green)","Citrine (transparent pale yellow-brown)","Jasper (opaque blue/black/brown)","Moonstone (translucent white with pale blue glow)","Onyx (opaque bands of black/white)","Quartz (transparent white/smoky gray)","Sardonyx (opaque bands of red/brown with white)","Rose quartz (translucent rosy)","Zircon (transparent pale blue-green)"];
const GEMS_100GP = ["Amber (transparent watery gold to rich gold)","Amethyst (transparent deep purple)","Chrysoberyl (transparent yellow-green)","Coral (opaque crimson)","Garnet (transparent red/brown-green/violet)","Jade (translucent light/dark green/white)","Jet (opaque deep black)","Pearl (opaque lustrous white/pink/yellow/gray/black)","Spinel (transparent red/red-brown/deep green)","Tourmaline (transparent pale green/blue/brown/red)"];
const GEMS_500GP = ["Alexandrite (transparent dark green)","Aquamarine (transparent pale blue-green)","Black pearl (opaque pure black)","Blue spinel (transparent deep blue)","Peridot (transparent rich olive green)","Topaz (transparent golden yellow)"];
const GEMS_1000GP = ["Black opal (translucent dark green with black mottling and golden flecks)","Blue sapphire (transparent blue-white to medium blue)","Emerald (transparent deep bright green)","Fire opal (translucent fiery red)","Opal (translucent pale blue with green/gold mottling)","Star ruby (translucent ruby with white star-shape)","Star sapphire (translucent blue sapphire with white star-shape)","Yellow sapphire (transparent fiery yellow or yellow-green)"];
const GEMS_5000GP = ["Black sapphire (translucent lustrous black with glowing highlights)","Diamond (transparent blue-white/canary/pink/brown/blue)","Jacinth (transparent fiery orange)","Ruby (transparent clear red to deep crimson)"];

// ---- ART OBJECTS ----
const ART_25GP = ["Silver ewer","Carved bone statuette","Small gold bracelet","Cloth-of-gold vestments","Black velvet mask stitched with silver thread","Copper chalice with silver filigree","Pair of engraved bone dice","Small mirror set in a painted wooden frame","Embroidered silk handkerchief","Gold locket with a painted portrait inside"];
const ART_250GP = ["Gold ring set with bloodstones","Carved ivory statuette","Large gold bracelet","Silver necklace with a gemstone pendant","Bronze crown","Silk robe with gold embroidery","Large well-made tapestry","Brass mug with jade inlay","Box of turquoise animal figurines","Gold bird cage with electrum filigree"];
const ART_750GP = ["Silver chalice set with moonstones","Silver-plated steel longsword with jet set in hilt","Carved harp of exotic wood with ivory inlay and zircon gems","Small gold idol","Gold dragon comb set with red garnets as eyes","Bottle stopper cork embossed with gold leaf and amethysts","Ceremonial electrum dagger with a black pearl in the pommel","Silver and gold brooch","Obsidian statuette with gold fittings and inlay","Painted gold war mask"];
const ART_2500GP = ["Fine gold chain set with a fire opal","Old masterwork oil painting on a rolling canvas","Embroidered silk and velvet mantle set with moonstones","Platinum bracelet set with a sapphire","Embroidered glove set with jewel chips","Jeweled anklet","Gold music box","Gold circlet set with four aquamarines","Eye patch with mock eye set in blue sapphire and moonstone","A necklace string of small pink pearls"];
const ART_7500GP = ["Jeweled gold crown","Jeweled platinum ring","Small gold statuette set with rubies","Gold cup set with emeralds","Gold jewelry box with platinum filigree","Painted gold child's sarcophagus","Jade game board with solid gold playing pieces","Bejeweled ivory drinking horn with gold filigree"];

// ---- MAGIC ITEMS COMMON ----
const MAGIC_COMMON = [
    {name:"Cantrip Spell Scroll",desc:"A scroll containing a single cantrip spell.",attunement:false},
    {name:"Cloak of Billowing",desc:"Use a bonus action to make this cloak billow dramatically.",attunement:false},
    {name:"Cloak of Many Fashions",desc:"Use a bonus action to change this cloak's color and style.",attunement:false},
    {name:"Clockwork Amulet",desc:"Once per day, treat a d20 attack roll as a 10.",attunement:false},
    {name:"Dark Shard Amulet",desc:"A warlock can use this shard of darkness as a spellcasting focus.",attunement:false},
    {name:"Dread Helm",desc:"Your eyes glow red and nonmagical darkness within 30ft appears as dim light.",attunement:false},
    {name:"Ear Horn of Hearing",desc:"Advantage on Perception checks relying on hearing.",attunement:false},
    {name:"Enduring Spellbook",desc:"This spellbook can't be damaged by fire, water, or age.",attunement:false},
    {name:"Ersatz Eye",desc:"Artificial eye — while socketed, you see through it normally.",attunement:true},
    {name:"Hat of Vermin",desc:"3 charges. Produce one harmless bat, frog, or rat from the hat.",attunement:false},
    {name:"Hat of Wizardry",desc:"Use as a spellcasting focus. 5% daily chance to learn a random wizard cantrip.",attunement:true},
    {name:"Horn of Silent Alarm",desc:"4 charges. A chosen creature within 600ft hears the horn; others don't.",attunement:false},
    {name:"Instrument of Illusion",desc:"While playing, create visual illusions within 5 feet.",attunement:false},
    {name:"Lock of Trickery",desc:"Appears ordinary, but the DC to pick it is 15 higher than normal.",attunement:false},
    {name:"Moon-Touched Sword",desc:"In darkness, the unsheathed blade sheds moonlight in a 15-foot radius.",attunement:false},
    {name:"Mystery Key",desc:"Once per day, try it on any lock — 1-in-4 chance it opens.",attunement:false},
    {name:"Orb of Direction",desc:"Use an action to determine which way is north.",attunement:false},
    {name:"Orb of Time",desc:"Use an action to know if it is morning, afternoon, evening, or night outside.",attunement:false},
    {name:"Perfume of Bewitching",desc:"Apply to yourself for advantage on Charisma checks for 1 hour.",attunement:false},
    {name:"Pipe of Smoke Monsters",desc:"Exhale a puff of smoke shaped like a creature of your choice.",attunement:false},
    {name:"Pole of Collapsing",desc:"Command word collapses this 10-foot pole into a 1-foot rod.",attunement:false},
    {name:"Rope of Mending",desc:"Cut this 50-foot rope and speak a command word to knit it back together.",attunement:false},
    {name:"Ruby of the War Mage",desc:"Use a simple or martial weapon as a spellcasting focus.",attunement:true},
    {name:"Shield of Expression",desc:"Bonus action to alter the expression of the face sculpted on this shield.",attunement:false},
    {name:"Smoldering Armor",desc:"Wisps of harmless smoke rise from this armor. Advantage on Stealth in smoke.",attunement:false},
    {name:"Staff of Birdcalls",desc:"10 charges. Produce any bird sound as an action.",attunement:false},
    {name:"Staff of Flowers",desc:"10 charges. Cause a flower to sprout from nearby earth.",attunement:false},
    {name:"Talking Doll",desc:"Program up to six phrases of six words each. Speaks them on touch.",attunement:false},
    {name:"Tankard of Sobriety",desc:"Drink any alcohol from this tankard without becoming inebriated.",attunement:false},
    {name:"Unbreakable Arrow",desc:"This arrow cannot be broken, except within an antimagic field.",attunement:false},
    {name:"Veteran's Cane",desc:"Bonus action command word transforms this cane into a handaxe.",attunement:false},
    {name:"Wand of Conducting",desc:"3 charges. Wave the wand to create orchestral music.",attunement:false},
    {name:"Wand of Pyrotechnics",desc:"7 charges. Create a harmless burst of multicolored light.",attunement:false},
];

// ---- MAGIC ITEMS UNCOMMON ----
const MAGIC_UNCOMMON = [
    {name:"Ammunition +1",desc:"+1 bonus to attack and damage rolls.",attunement:false},
    {name:"Bag of Holding",desc:"Interior holds up to 500 lbs in a 64 cubic-foot space.",attunement:false},
    {name:"Boots of Elvenkind",desc:"Your steps make no sound. Advantage on Stealth checks to move silently.",attunement:false},
    {name:"Boots of Striding and Springing",desc:"Speed becomes 30ft minimum; jump three times the normal distance.",attunement:true},
    {name:"Boots of the Winterlands",desc:"Resistance to cold damage; ignore difficult terrain from ice and snow.",attunement:true},
    {name:"Broom of Flying",desc:"Stand astride and speak the command word to fly at speed 50.",attunement:false},
    {name:"Cap of Water Breathing",desc:"Command word creates a bubble of air around your head underwater.",attunement:false},
    {name:"Cloak of Elvenkind",desc:"Hood up: others have disadvantage to see you; you have advantage on Stealth.",attunement:true},
    {name:"Cloak of Protection",desc:"+1 bonus to AC and saving throws.",attunement:true},
    {name:"Decanter of Endless Water",desc:"Pour a stream, fountain, or geyser of water on command.",attunement:false},
    {name:"Dust of Disappearance",desc:"Throw into air — you and creatures within 10ft turn invisible for 2d4 minutes.",attunement:false},
    {name:"Dust of Dryness",desc:"Each pinch destroys a 15-foot cube of water.",attunement:false},
    {name:"Eversmoking Bottle",desc:"Opens to billow thick smoke in a 60-foot radius.",attunement:false},
    {name:"Eyes of Minute Seeing",desc:"Advantage on Investigation checks relying on sight within 1 foot.",attunement:false},
    {name:"Gauntlets of Ogre Power",desc:"Strength score becomes 19.",attunement:true},
    {name:"Gloves of Missile Snaring",desc:"Reaction: reduce ranged weapon damage by 1d10+Dex modifier.",attunement:true},
    {name:"Gloves of Swimming and Climbing",desc:"Climbing/swimming cost no extra movement; +5 to Athletics for those actions.",attunement:true},
    {name:"Goggles of Night",desc:"Darkvision 60ft, or extends existing darkvision by 60ft.",attunement:false},
    {name:"Hat of Disguise",desc:"Cast disguise self at will.",attunement:true},
    {name:"Headband of Intellect",desc:"Intelligence score becomes 19.",attunement:true},
    {name:"Helm of Comprehending Languages",desc:"Cast comprehend languages at will.",attunement:false},
    {name:"Helm of Telepathy",desc:"Cast detect thoughts (DC 13) at will.",attunement:true},
    {name:"Immovable Rod",desc:"Press the button to fix the rod magically in place — holds 8,000 lbs.",attunement:false},
    {name:"Javelin of Lightning",desc:"Hurl it as a lightning bolt — 4d6 lightning in a 5ft wide 120ft line.",attunement:false},
    {name:"Lantern of Revealing",desc:"Invisible creatures and objects visible in the lantern's bright light.",attunement:false},
    {name:"Medallion of Thoughts",desc:"3 charges. Cast detect thoughts (DC 13).",attunement:true},
    {name:"Necklace of Adaptation",desc:"Breathe normally in any environment; advantage vs harmful gases.",attunement:true},
    {name:"Periapt of Health",desc:"Immune to contracting disease; suppresses disease effects.",attunement:false},
    {name:"Pipes of Haunting",desc:"3 charges. Play to frighten creatures within 30ft (DC 13 Wis).",attunement:false},
    {name:"Potion of Animal Friendship",desc:"Cast animal friendship (DC 13) at will for 1 hour.",attunement:false},
    {name:"Potion of Climbing",desc:"Gain a climbing speed equal to walking speed for 1 hour.",attunement:false},
    {name:"Potion of Fire Breath",desc:"Bonus action: exhale fire at a target within 30ft (4d6 fire, DC 13 Dex).",attunement:false},
    {name:"Potion of Growth",desc:"Gain the enlarge effect for 1d4 hours.",attunement:false},
    {name:"Potion of Healing (Greater)",desc:"Regain 4d4+4 hit points.",attunement:false},
    {name:"Potion of Resistance",desc:"Resistance to one damage type for 1 hour.",attunement:false},
    {name:"Potion of Water Breathing",desc:"Breathe underwater for 1 hour.",attunement:false},
    {name:"Ring of Jumping",desc:"Cast jump on yourself as a bonus action at will.",attunement:true},
    {name:"Ring of Mind Shielding",desc:"Immune to magic that reads thoughts, detects alignment, or detects creature type.",attunement:true},
    {name:"Ring of Swimming",desc:"Swimming speed of 40 feet.",attunement:false},
    {name:"Ring of Warmth",desc:"Resistance to cold damage; survive temperatures down to −50°F.",attunement:true},
    {name:"Ring of Water Walking",desc:"Stand and move on any liquid surface as if it were solid ground.",attunement:false},
    {name:"Rope of Climbing",desc:"60-foot rope that can animate and climb on command; holds 3,000 lbs.",attunement:false},
    {name:"Sending Stones (pair)",desc:"Cast sending to communicate with the paired stone's holder.",attunement:false},
    {name:"Shield +1",desc:"+1 bonus to AC in addition to the shield's normal bonus.",attunement:false},
    {name:"Slippers of Spider Climbing",desc:"Move on walls and ceilings while leaving your hands free.",attunement:true},
    {name:"Spell Scroll (1st level)",desc:"A scroll bearing a single 1st-level spell.",attunement:false},
    {name:"Spell Scroll (2nd level)",desc:"A scroll bearing a single 2nd-level spell.",attunement:false},
    {name:"Spell Scroll (3rd level)",desc:"A scroll bearing a single 3rd-level spell.",attunement:false},
    {name:"Stone of Good Luck",desc:"+1 bonus to ability checks and saving throws.",attunement:true},
    {name:"Wand of Magic Detection",desc:"3 charges. Cast detect magic.",attunement:false},
    {name:"Wand of Magic Missiles",desc:"7 charges. Cast magic missile (1–3 charges).",attunement:false},
    {name:"Wand of Secrets",desc:"3 charges. Pulses and points to the nearest secret door or trap within 30ft.",attunement:false},
    {name:"Wand of the War Mage +1",desc:"+1 to spell attack rolls; ignore half cover.",attunement:true},
    {name:"Weapon +1",desc:"+1 bonus to attack and damage rolls.",attunement:false},
    {name:"Wind Fan",desc:"Cast gust of wind (DC 13) once per day.",attunement:false},
    {name:"Winged Boots",desc:"Flying speed equal to walking speed for up to 4 hours per day.",attunement:true},
];

// ---- MAGIC ITEMS RARE ----
const MAGIC_RARE = [
    {name:"Ammunition +2",desc:"+2 bonus to attack and damage rolls.",attunement:false},
    {name:"Amulet of Health",desc:"Constitution score becomes 19.",attunement:true},
    {name:"Amulet of Proof Against Detection",desc:"Hidden from divination magic; can't be targeted by scrying.",attunement:true},
    {name:"Armor +1 (any)",desc:"+1 bonus to AC.",attunement:false},
    {name:"Belt of Dwarvenkind",desc:"+2 Constitution (max 20); advantage on Persuasion with dwarves.",attunement:true},
    {name:"Belt of Giant Strength (Hill)",desc:"Strength score becomes 21.",attunement:true},
    {name:"Boots of Levitation",desc:"Cast levitate on yourself at will.",attunement:true},
    {name:"Boots of Speed",desc:"Bonus action: double walking speed, disadvantage on opportunity attacks against you.",attunement:true},
    {name:"Brooch of Shielding",desc:"Resistance to force damage; immunity to magic missile.",attunement:true},
    {name:"Cape of the Mountebank",desc:"Cast dimension door once per day.",attunement:false},
    {name:"Carpet of Flying",desc:"Magic carpet with fly speed 80ft (2 passengers) or 40ft (4 passengers).",attunement:false},
    {name:"Cloak of Displacement",desc:"Attackers have disadvantage against you until you take damage.",attunement:true},
    {name:"Cloak of the Bat",desc:"Advantage on Stealth; glide at fly speed 40ft in dim light or darkness.",attunement:true},
    {name:"Cube of Force",desc:"36 charges. Create a force barrier around yourself.",attunement:true},
    {name:"Dagger of Venom",desc:"+1 dagger. Coat blade in poison (1d4+1 min): DC 15 Con or 2d10 poison.",attunement:false},
    {name:"Dragon Scale Mail",desc:"+1 armor with resistance to one damage type based on dragon type.",attunement:true},
    {name:"Elven Chain",desc:"+1 chain shirt. Counts as proficient even without medium armor proficiency.",attunement:false},
    {name:"Flame Tongue",desc:"Bonus action: blade erupts in flame (2d6 fire damage, 40ft bright light).",attunement:true},
    {name:"Gem of Seeing",desc:"3 charges. Truesight out to 120ft for 10 minutes.",attunement:true},
    {name:"Giant Slayer",desc:"Extra 2d6 damage vs giants; giants must save DC 15 Str or fall prone.",attunement:false},
    {name:"Glamoured Studded Leather",desc:"+1 AC. Bonus action: change armor's appearance to any other outfit.",attunement:false},
    {name:"Helm of Teleportation",desc:"3 charges. Cast teleport.",attunement:true},
    {name:"Heward's Handy Haversack",desc:"Backpack with extradimensional pouches holding up to 80 lbs.",attunement:false},
    {name:"Horn of Blasting",desc:"30ft cone of thunder: 5d6 thunder, DC 15 Con or deafened 1 min.",attunement:false},
    {name:"Ioun Stone (Reserve)",desc:"Stores spells of 1st–3rd level; cast them at will.",attunement:true},
    {name:"Mace of Disruption",desc:"Extra 2d6 radiant vs fiends/undead. On low HP, target must flee or die.",attunement:true},
    {name:"Mace of Terror",desc:"3 charges. Creatures within 30ft DC 15 Wis save or frightened.",attunement:true},
    {name:"Mantle of Spell Resistance",desc:"Advantage on saving throws against spells.",attunement:true},
    {name:"Necklace of Fireballs",desc:"1d6+3 beads; each bead can be thrown as a fireball (3d6 per bead).",attunement:false},
    {name:"Necklace of Prayer Beads",desc:"Magic beads: bless, cure wounds, aid, or other cleric spells.",attunement:true},
    {name:"Periapt of Proof Against Poison",desc:"Immune to poison damage and the poisoned condition.",attunement:false},
    {name:"Ring of Animal Influence",desc:"3 charges. Animal friendship, fear, or speak with animals.",attunement:false},
    {name:"Ring of Evasion",desc:"3 charges. Reaction: succeed on a failed Dex saving throw.",attunement:true},
    {name:"Ring of Feather Falling",desc:"Descend 60ft per round and take no falling damage.",attunement:true},
    {name:"Ring of Free Action",desc:"Difficult terrain costs no extra movement; immune to paralyzed and restrained.",attunement:true},
    {name:"Ring of Protection",desc:"+1 bonus to AC and saving throws.",attunement:true},
    {name:"Ring of Resistance",desc:"Resistance to one damage type.",attunement:true},
    {name:"Ring of Spell Storing",desc:"Stores up to 5 levels of spells for the wearer to cast.",attunement:true},
    {name:"Ring of the Ram",desc:"3 charges. Force push dealing 2d10 per charge and knocking prone.",attunement:true},
    {name:"Ring of X-ray Vision",desc:"Action: see into and through solid matter for 1 minute.",attunement:true},
    {name:"Robe of Useful Items",desc:"Cloth patches that become useful objects: boats, ladders, iron doors, etc.",attunement:false},
    {name:"Rod of Rulership",desc:"Action: creatures within 120ft DC 15 Wis save or obey you for 8 hours.",attunement:true},
    {name:"Rod of the Pact Keeper +2",desc:"+2 to warlock spell attacks and save DCs. Regain one warlock spell slot per day.",attunement:true},
    {name:"Rope of Entanglement",desc:"30ft rope. Command one end to entangle a creature within 20ft.",attunement:false},
    {name:"Shield +2",desc:"+2 bonus to AC.",attunement:false},
    {name:"Staff of Charming",desc:"10 charges. Cast charm person, command, or comprehend languages.",attunement:true},
    {name:"Staff of Healing",desc:"10 charges. Cast cure wounds, lesser restoration, or mass cure wounds.",attunement:true},
    {name:"Staff of the Python",desc:"Throw staff to transform it into a giant constrictor snake under your control.",attunement:true},
    {name:"Sun Blade",desc:"Longsword of radiance. +2, extra 1d8 radiant vs undead. Sheds sunlight.",attunement:true},
    {name:"Sword of Life Stealing",desc:"On a nat 20: extra 10 necrotic damage and you gain 10 temp HP.",attunement:true},
    {name:"Sword of Wounding",desc:"Once per turn on hit: target bleeds 1d4 necrotic at start of its turns.",attunement:true},
    {name:"Vicious Weapon",desc:"On a nat 20: extra 7 damage of the weapon's type.",attunement:false},
    {name:"Wand of Binding",desc:"7 charges. Cast hold monster or hold person.",attunement:true},
    {name:"Wand of Fear",desc:"7 charges. Creatures in 60ft cone DC 15 Wis save or frightened.",attunement:true},
    {name:"Wand of Fireballs",desc:"7 charges. Cast fireball (DC 15) using 1–3 charges.",attunement:true},
    {name:"Wand of Lightning Bolts",desc:"7 charges. Cast lightning bolt (DC 15) using 1–3 charges.",attunement:true},
    {name:"Wand of Paralysis",desc:"7 charges. DC 15 Con save or paralyzed for 1 minute.",attunement:true},
    {name:"Wand of the War Mage +2",desc:"+2 to spell attack rolls; ignore half cover.",attunement:true},
    {name:"Wand of Wonder",desc:"7 charges. Roll d100 for a random magical effect.",attunement:true},
    {name:"Weapon +2",desc:"+2 bonus to attack and damage rolls.",attunement:false},
    {name:"Wings of Flying",desc:"1 hour per day: bat or bird wings, fly speed equal to walking speed.",attunement:true},
];

// ---- MAGIC ITEMS VERY RARE ----
const MAGIC_VERY_RARE = [
    {name:"Ammunition +3",desc:"+3 bonus to attack and damage rolls.",attunement:false},
    {name:"Animated Shield",desc:"Bonus action: shield animates and hovers, protecting you hands-free for 1 min.",attunement:true},
    {name:"Armor +2 (any)",desc:"+2 bonus to AC.",attunement:false},
    {name:"Belt of Giant Strength (Stone/Frost)",desc:"Strength score becomes 23.",attunement:true},
    {name:"Cloak of Arachnida",desc:"Resistance to poison; spider climb; move across webs; cast web once per day.",attunement:true},
    {name:"Dancing Sword",desc:"Bonus action: toss the sword to hover and attack on its own for 1 minute.",attunement:true},
    {name:"Demon Armor",desc:"+1 AC; clawed gauntlets deal slashing damage; understand/speak Abyssal.",attunement:true},
    {name:"Dwarven Plate",desc:"+2 AC. Reaction: reduce forced movement by 10ft.",attunement:false},
    {name:"Dwarven Thrower",desc:"+3 warhammer with thrown property. Extra 1d8 (or 2d8 vs giants) on throw.",attunement:true},
    {name:"Efreeti Bottle",desc:"Open to release an efreeti — roll to determine its disposition.",attunement:false},
    {name:"Frost Brand",desc:"Extra 1d6 cold on hit. Resistance to fire. Extinguishes non-magical flames on draw.",attunement:true},
    {name:"Helm of Brilliance",desc:"Set with diamonds, rubies, fire opals. Cast fireball, daylight, prismatic spray.",attunement:true},
    {name:"Ioun Stone (Absorption)",desc:"Absorbs spells of 4th level or lower targeting only you (20 levels total).",attunement:true},
    {name:"Manual of Bodily Health",desc:"Read over 6 days: Constitution increases by 2 (max 28).",attunement:false},
    {name:"Manual of Gainful Exercise",desc:"Read over 6 days: Strength increases by 2 (max 28).",attunement:false},
    {name:"Manual of Quickness of Action",desc:"Read over 6 days: Dexterity increases by 2 (max 28).",attunement:false},
    {name:"Mirror of Life Trapping",desc:"Humanoids who see their reflection DC 15 Cha save or become trapped.",attunement:false},
    {name:"Nine Lives Stealer",desc:"On nat 20 vs creature under 100 HP: DC 15 Con save or instant death.",attunement:true},
    {name:"Oathbow",desc:"Swear an oath against a target: +3d6 damage against it; disadvantage vs others.",attunement:true},
    {name:"Plate Armor +2",desc:"+2 bonus to AC.",attunement:false},
    {name:"Ring of Regeneration",desc:"Regain 1d6 HP every 10 minutes. Regrow lost limbs over 1d6+1 days.",attunement:true},
    {name:"Ring of Telekinesis",desc:"Cast telekinesis at will on unattended objects.",attunement:true},
    {name:"Robe of Eyes",desc:"Darkvision 120ft; see invisible; can't be surprised; advantage on Perception.",attunement:true},
    {name:"Rod of Absorption",desc:"Reaction: absorb a spell targeting only you, storing its levels as charges.",attunement:true},
    {name:"Rod of Security",desc:"Transport up to 200 willing creatures to a paradise demiplane for 200 days.",attunement:false},
    {name:"Scimitar of Speed",desc:"+2 scimitar. Bonus action: make one extra attack per turn.",attunement:true},
    {name:"Shield +3",desc:"+3 bonus to AC.",attunement:false},
    {name:"Spellguard Shield",desc:"Advantage on saves vs spells; spell attacks have disadvantage against you.",attunement:true},
    {name:"Staff of Fire",desc:"Resistance to fire. 10 charges: burning hands, fireball, wall of fire.",attunement:true},
    {name:"Staff of Frost",desc:"Resistance to cold. 10 charges: cone of cold, fog cloud, ice storm, wall of ice.",attunement:true},
    {name:"Staff of Power",desc:"+2 to attacks, AC, saves, spell attacks. 20 charges of powerful spells.",attunement:true},
    {name:"Staff of Striking",desc:"+3 quarterstaff. 10 charges: deal extra 1d6 per charge (up to 3).",attunement:true},
    {name:"Staff of Thunder and Lightning",desc:"+2 quarterstaff. Thunder, lightning bolt, thunderclap, and storm powers.",attunement:true},
    {name:"Sword of Sharpness",desc:"Maximize weapon dice vs objects. On nat 20: extra 4d6 slashing and may sever limb.",attunement:true},
    {name:"Tome of Clear Thought",desc:"Read over 6 days: Intelligence increases by 2 (max 28).",attunement:false},
    {name:"Tome of Leadership and Influence",desc:"Read over 6 days: Charisma increases by 2 (max 28).",attunement:false},
    {name:"Tome of Understanding",desc:"Read over 6 days: Wisdom increases by 2 (max 28).",attunement:false},
    {name:"Wand of the War Mage +3",desc:"+3 to spell attack rolls; ignore half cover.",attunement:true},
    {name:"Weapon +3",desc:"+3 bonus to attack and damage rolls.",attunement:false},
];

// ---- MAGIC ITEMS LEGENDARY ----
const MAGIC_LEGENDARY = [
    {name:"Armor of Invulnerability",desc:"Resistance to nonmagical damage. Action: immunity to nonmagical damage for 10 min.",attunement:true},
    {name:"Belt of Giant Strength (Storm)",desc:"Strength score becomes 29.",attunement:true},
    {name:"Cloak of Invisibility",desc:"Pull up hood: become invisible. Anything worn/carried is invisible too.",attunement:true},
    {name:"Crystal Ball of True Seeing",desc:"Scrying (DC 17) with truesight through the sensor.",attunement:true},
    {name:"Cubic Gate",desc:"Six sides keyed to six planes. Press a side to cast gate to that plane.",attunement:false},
    {name:"Deck of Many Things",desc:"Draw a card: each card has a powerful and potentially catastrophic effect.",attunement:false},
    {name:"Defender",desc:"+3 weapon. Transfer part or all of the bonus to AC each turn.",attunement:true},
    {name:"Efreeti Chain",desc:"+3 AC, immune to fire, understand and speak Primordial.",attunement:true},
    {name:"Hammer of Thunderbolts",desc:"+1 hammer. Kill giants on hit (DC 17 Con save). Thrown: 5d6 thunder in 30ft.",attunement:true},
    {name:"Holy Avenger",desc:"+3 sword. Extra 2d10 radiant vs fiends/undead. Aura of magic resistance in 10ft.",attunement:true},
    {name:"Ioun Stone (Mastery)",desc:"Proficiency bonus increases by 1.",attunement:true},
    {name:"Iron Flask",desc:"Capture a creature from another plane. Command it, then release it.",attunement:false},
    {name:"Luck Blade",desc:"+1 sword, +1 to saves. Reroll one roll per day. 1–3 charges of wish.",attunement:true},
    {name:"Plate Armor of Etherealness",desc:"Command word: gain the effect of etherealness for 10 minutes.",attunement:true},
    {name:"Ring of Djinni Summoning",desc:"Summon a specific djinni to serve for 1 hour per day.",attunement:true},
    {name:"Ring of Elemental Command",desc:"Command elementals of one type. Gain elemental resistances and abilities.",attunement:true},
    {name:"Ring of Invisibility",desc:"Turn invisible as an action at will. Remain until you attack, cast, or choose to end.",attunement:true},
    {name:"Ring of Spell Turning",desc:"Advantage vs spells targeting only you. On nat 20 (spell level ≤7): reflect it.",attunement:true},
    {name:"Ring of Three Wishes",desc:"3 charges. Cast wish. Becomes nonmagical after the last charge.",attunement:false},
    {name:"Robe of the Archmagi",desc:"+2 AC if unarmored; advantage on saves vs spells; +2 to spell save DC and spell attack.",attunement:true},
    {name:"Rod of Lordly Might",desc:"+3 mace that transforms into six different weapons and tools.",attunement:true},
    {name:"Rod of Resurrection",desc:"5 charges. Cast heal (1 charge) or resurrection (5 charges).",attunement:true},
    {name:"Scarab of Protection",desc:"+2 to saving throws. Immune to necromancy spells. 12 charges: negate effects.",attunement:true},
    {name:"Sphere of Annihilation",desc:"A 2-foot void that obliterates all matter it touches. Controllable with a DC check.",attunement:false},
    {name:"Staff of the Magi",desc:"+2 to spell attacks. 50 charges of powerful spells. Retributive Strike on break.",attunement:true},
    {name:"Talisman of Pure Good",desc:"Powerful good-aligned item. Open a holy fissure to banish fiends.",attunement:true},
    {name:"Talisman of Ultimate Evil",desc:"Powerful evil-aligned item. Open an unholy fissure to banish celestials.",attunement:true},
    {name:"Vorpal Sword",desc:"+3 sword. Ignores slashing resistance. On nat 20 vs creature with a head: decapitate.",attunement:true},
    {name:"Well of Many Worlds",desc:"Unfold this cloth to create a two-way portal to a random location on another plane.",attunement:false},
];

// ---- ARTIFACTS ----
const MAGIC_ARTIFACTS = [
    {name:"Axe of the Dwarvish Lords",desc:"Legendary dwarven artifact forged by Moradin. Unites dwarf clans and grants immense power.",attunement:true},
    {name:"Book of Exalted Deeds",desc:"Sacred text of all that is good. Only good creatures can read it without being blinded.",attunement:true},
    {name:"Book of Vile Darkness",desc:"Written by Vecna. Contains the darkest secrets of evil. Corrupts all who read it.",attunement:true},
    {name:"Eye of Vecna",desc:"Vecna's mummified eye. Replace your own eye with it to gain immense necrotic power.",attunement:true},
    {name:"Hand of Vecna",desc:"Vecna's mummified hand. Replace your own hand with it to gain dark magical abilities.",attunement:true},
    {name:"Orb of Dragonkind",desc:"Ancient orb for controlling chromatic dragons. Each orb is tied to a specific dragon type.",attunement:true},
    {name:"Sword of Kas",desc:"The blade that severed Vecna's hand. A sentient sword of immense vampiric power.",attunement:true},
    {name:"Wand of Orcus",desc:"Orcus's personal weapon, topped with a skull. Raises undead armies on command.",attunement:true},
];

// ---- THEMED ITEMS ----
const THEMED_ITEMS = {
    dragon:[
        {name:"Dragon Scale (shed)",desc:"A shed scale still faintly warm to the touch.",value:"50 gp",isThemed:true},
        {name:"Dragon Tooth Necklace",desc:"A crude necklace of dragon teeth.",value:"100 gp",isThemed:true},
        {name:"Vial of Dragon Blood",desc:"A sealed vial of potent, still-magical dragon blood.",value:"200 gp",isThemed:true},
        {name:"Dragon's Hoard Coin",desc:"An ancient gold coin older than any living kingdom, stamped with a wyrm.",value:"10 gp",isThemed:true},
    ],
    undead:[
        {name:"Phylactery Fragment",desc:"A shard of magical crystal that once housed a soul.",value:"500 gp",isThemed:true},
        {name:"Death Knight's Sigil Ring",desc:"A black iron ring bearing the crest of a fallen paladin.",value:"150 gp",isThemed:true},
        {name:"Bone Wand",desc:"A wand carved from humanoid bone, cold to the touch.",value:"100 gp",isThemed:true},
        {name:"Lich's Spellbook",desc:"A singed tome of forbidden magic, its pages inked in necrotic fluid.",value:"1000 gp",isThemed:true},
    ],
    fiend:[
        {name:"Infernal Contract",desc:"A parchment written in blood detailing a soul bargain. The signatory is deceased.",value:"300 gp",isThemed:true},
        {name:"Devil's Eye Gem",desc:"A deep red gem that seems to watch you.",value:"250 gp",isThemed:true},
        {name:"Hellfire Shard",desc:"A fragment of solidified hellfire, perpetually warm.",value:"150 gp",isThemed:true},
        {name:"Demon Ichor Vial",desc:"A sealed vial of foul-smelling black demon blood.",value:"100 gp",isThemed:true},
    ],
    fey:[
        {name:"Pixie Wing Dust",desc:"A small pouch of iridescent dust that smells of flowers.",value:"100 gp",isThemed:true},
        {name:"Moonstone Pendant",desc:"A pendant carved with dancing fey figures; glows under moonlight.",value:"150 gp",isThemed:true},
        {name:"Faerie Ring Mushroom (preserved)",desc:"A preserved mushroom from a faerie ring, still faintly magical.",value:"50 gp",isThemed:true},
        {name:"Unseelie Court Token",desc:"A black rose that never wilts — a gift or threat from the dark fey.",value:"200 gp",isThemed:true},
    ],
    aberration:[
        {name:"Mind Flayer Brain Cylinder",desc:"A sealed cylinder containing a preserved brain — a mind flayer's meal.",value:"200 gp",isThemed:true},
        {name:"Beholder Eyestalk (preserved)",desc:"A preserved eyestalk from a beholder, still faintly magical.",value:"300 gp",isThemed:true},
        {name:"Aboleth Slime Sample",desc:"A vial of aboleth mucus — dangerous if opened without protection.",value:"150 gp",isThemed:true},
        {name:"Far Realm Shard",desc:"A crystalline fragment from beyond the stars; nearby magic behaves oddly.",value:"500 gp",isThemed:true},
    ],
    humanoid:[
        {name:"Guild Ledger",desc:"A coded ledger of a thieves' guild, worth a fortune to the right buyer.",value:"200 gp",isThemed:true},
        {name:"Forged Noble Seal",desc:"A near-perfect forgery of a noble family's wax seal.",value:"100 gp",isThemed:true},
        {name:"Mercenary Contract",desc:"A signed contract for a very large sum, now with no employer.",value:"50 gp",isThemed:true},
        {name:"Spy's Cipher Key",desc:"A key to decode intercepted messages from a foreign power.",value:"300 gp",isThemed:true},
    ],
    construct:[
        {name:"Golem Core Shard",desc:"A fragment of the magical core that animated a golem.",value:"300 gp",isThemed:true},
        {name:"Automaton Gear (arcane)",desc:"A perfectly crafted gear infused with residual magic.",value:"75 gp",isThemed:true},
        {name:"Runic Ingot",desc:"A bar of metal etched with runes that still hum with energy.",value:"150 gp",isThemed:true},
    ],
    beast:[
        {name:"Manticore Spine",desc:"A spine from a manticore's tail, still venomous if handled carelessly.",value:"50 gp",isThemed:true},
        {name:"Owlbear Feather",desc:"An enormous feather from an owlbear, prized by collectors.",value:"25 gp",isThemed:true},
        {name:"Wyvern Stinger",desc:"A severed wyvern stinger — alchemists pay well for these.",value:"200 gp",isThemed:true},
        {name:"Displacer Beast Pelt",desc:"A shimmering pelt that still faintly displaces light.",value:"400 gp",isThemed:true},
    ],
};

// ---- COINS ----
function generateCoins(cr, type) {
    const h = type === 'hoard';
    // Tabelas do DMG 5e — Individual e Hoard por faixa de CR
    if (cr <= 4) {
        if (h) return {
            cp: treasureRollDice(6,6) * 100,
            sp: treasureRollDice(3,6) * 100,
            gp: treasureRollDice(2,6) * 10,
        };
        // Individual: monstro fraco carrega pouco
        const roll = treasureRollDice(1,100);
        if (roll <= 30) return { cp: treasureRollDice(5,6) };
        if (roll <= 60) return { sp: treasureRollDice(4,6) };
        if (roll <= 70) return { cp: treasureRollDice(3,6), sp: treasureRollDice(2,6) };
        if (roll <= 95) return { gp: treasureRollDice(3,6) };
        return { gp: treasureRollDice(1,6), pp: treasureRollDice(1,4) };
    }
    if (cr <= 10) {
        if (h) return {
            cp: treasureRollDice(2,6) * 100,
            sp: treasureRollDice(2,6) * 1000,
            gp: treasureRollDice(6,6) * 100,
            pp: treasureRollDice(3,6) * 10,
        };
        const roll = treasureRollDice(1,100);
        if (roll <= 30) return { cp: treasureRollDice(4,6)*10, sp: treasureRollDice(1,6)*10 };
        if (roll <= 60) return { sp: treasureRollDice(6,6)*10, gp: treasureRollDice(2,6)*10 };
        if (roll <= 70) return { gp: treasureRollDice(3,6)*10, sp: treasureRollDice(2,6)*10 };
        if (roll <= 95) return { gp: treasureRollDice(4,6)*10 };
        return { gp: treasureRollDice(2,6)*10, pp: treasureRollDice(3,6) };
    }
    if (cr <= 16) {
        if (h) return {
            gp:  treasureRollDice(4,6) * 1000,
            pp:  treasureRollDice(5,6) * 100,
        };
        const roll = treasureRollDice(1,100);
        if (roll <= 20) return { sp: treasureRollDice(4,6)*100, gp: treasureRollDice(1,6)*100 };
        if (roll <= 35) return { gp: treasureRollDice(1,6)*100, pp: treasureRollDice(1,6)*10 };
        if (roll <= 75) return { gp: treasureRollDice(2,6)*100, pp: treasureRollDice(1,6)*10 };
        if (roll <= 95) return { gp: treasureRollDice(2,6)*100, pp: treasureRollDice(2,6)*10 };
        return { gp: treasureRollDice(3,6)*100, pp: treasureRollDice(2,6)*10 };
    }
    // CR 17+
    if (h) return {
        gp: treasureRollDice(12,6) * 1000,
        pp: treasureRollDice(8,6)  * 100,   // DMG usa *100, não *1000
    };
    const roll = treasureRollDice(1,100);
    if (roll <= 15) return { gp: treasureRollDice(2,6)*1000, pp: treasureRollDice(8,6)*100 };
    if (roll <= 55) return { gp: treasureRollDice(2,6)*1000, pp: treasureRollDice(8,6)*100 };
    if (roll <= 70) return { gp: treasureRollDice(1,6)*1000, pp: treasureRollDice(1,6)*100 };
    if (roll <= 95) return { gp: treasureRollDice(1,6)*1000, pp: treasureRollDice(2,6)*100 };
    return { gp: treasureRollDice(2,6)*1000, pp: treasureRollDice(3,6)*100 };
}

// ---- GEMS & ART ----
function generateGemsAndArt(cr, type) {
    const h = type === 'hoard';
    const items = [];
    const gpVal = g => GEMS_10GP.includes(g)?'10 gp':GEMS_50GP.includes(g)?'50 gp':GEMS_100GP.includes(g)?'100 gp':GEMS_500GP.includes(g)?'500 gp':GEMS_1000GP.includes(g)?'1,000 gp':'5,000 gp';
    const addGems = (pool, n) => { for(let i=0;i<n;i++){const g=treasurePick(pool);items.push({type:'gem',name:g,value:gpVal(g)});} };
    const addArt  = (pool, val, n) => { for(let i=0;i<n;i++) items.push({type:'art',name:treasurePick(pool),value:val}); };

    const roll = treasureRollDice(1,100);

    if (cr <= 4) {
        if (h) {
            // Hoard CR 1-4: gemas baratas + arte simples
            if (roll <= 30) addGems(GEMS_10GP, treasureRollDice(2,6));
            else if (roll <= 60) addGems(GEMS_50GP, treasureRollDice(2,4));
            else if (roll <= 80) { addGems(GEMS_10GP, treasureRollDice(2,6)); addArt(ART_25GP, '25 gp', treasureRollDice(2,4)); }
            else { addGems(GEMS_50GP, treasureRollDice(1,6)); addArt(ART_25GP, '25 gp', treasureRollDice(1,6)); }
        } else {
            // Individual CR 1-4: chance de 1 gema pequena
            if (roll <= 40) addGems(GEMS_10GP, 1);
            else if (roll <= 60) addGems(GEMS_50GP, 1);
            // 40% sem gema
        }
    } else if (cr <= 10) {
        if (h) {
            if (roll <= 20) addGems(GEMS_100GP, treasureRollDice(2,4));
            else if (roll <= 40) addArt(ART_25GP, '25 gp', treasureRollDice(2,4));
            else if (roll <= 50) addArt(ART_250GP, '250 gp', treasureRollDice(2,4));
            else if (roll <= 60) { addGems(GEMS_50GP, treasureRollDice(2,6)); addArt(ART_250GP, '250 gp', treasureRollDice(2,4)); }
            else if (roll <= 70) { addGems(GEMS_100GP, treasureRollDice(3,6)); addArt(ART_250GP, '250 gp', treasureRollDice(2,4)); }
            else if (roll <= 80) addGems(GEMS_100GP, treasureRollDice(3,6));
            else if (roll <= 90) addArt(ART_250GP, '250 gp', treasureRollDice(2,4));
            else { addGems(GEMS_100GP, treasureRollDice(4,6)); addArt(ART_250GP, '250 gp', treasureRollDice(2,4)); }
        } else {
            // Individual CR 5-10: 1-3 gemas, sem arte
            if (roll <= 25) addGems(GEMS_10GP, treasureRollDice(2,4));
            else if (roll <= 50) addGems(GEMS_50GP, treasureRollDice(1,4));
            else if (roll <= 75) addGems(GEMS_100GP, treasureRollDice(1,4));
            else if (roll <= 90) { addGems(GEMS_50GP, 1); addArt(ART_25GP, '25 gp', 1); }
            // 10% sem nada
        }
    } else if (cr <= 16) {
        if (h) {
            if (roll <= 20) addArt(ART_250GP, '250 gp', treasureRollDice(2,4));
            else if (roll <= 30) addGems(GEMS_500GP, treasureRollDice(2,4));
            else if (roll <= 40) { addArt(ART_750GP, '750 gp', treasureRollDice(2,4)); addGems(GEMS_500GP, treasureRollDice(2,4)); }
            else if (roll <= 50) addArt(ART_750GP, '750 gp', treasureRollDice(2,4));
            else if (roll <= 60) { addGems(GEMS_1000GP, treasureRollDice(2,4)); addArt(ART_2500GP, '2,500 gp', treasureRollDice(2,4)); }
            else if (roll <= 70) addGems(GEMS_1000GP, treasureRollDice(2,4));
            else if (roll <= 80) addArt(ART_2500GP, '2,500 gp', treasureRollDice(2,4));
            else { addGems(GEMS_1000GP, treasureRollDice(2,4)); addArt(ART_2500GP, '2,500 gp', treasureRollDice(2,4)); }
        } else {
            // Individual CR 11-16: gemas médias + chance de arte
            if (roll <= 30) addGems(GEMS_100GP, treasureRollDice(1,4));
            else if (roll <= 55) addGems(GEMS_500GP, treasureRollDice(1,4));
            else if (roll <= 70) addGems(GEMS_1000GP, 1);
            else if (roll <= 85) { addGems(GEMS_500GP, 1); addArt(ART_250GP, '250 gp', 1); }
            else { addGems(GEMS_1000GP, 1); addArt(ART_750GP, '750 gp', 1); }
        }
    } else {
        // CR 17+
        if (h) {
            if (roll <= 15) addArt(ART_2500GP, '2,500 gp', treasureRollDice(2,4));
            else if (roll <= 30) addGems(GEMS_5000GP, treasureRollDice(2,4));
            else if (roll <= 45) { addArt(ART_7500GP, '7,500 gp', treasureRollDice(2,4)); addGems(GEMS_5000GP, treasureRollDice(2,4)); }
            else if (roll <= 60) addArt(ART_7500GP, '7,500 gp', treasureRollDice(2,4));
            else if (roll <= 75) { addGems(GEMS_5000GP, treasureRollDice(2,4)); addArt(ART_2500GP, '2,500 gp', treasureRollDice(2,4)); }
            else if (roll <= 90) { addGems(GEMS_5000GP, treasureRollDice(3,6)); addArt(ART_7500GP, '7,500 gp', treasureRollDice(2,4)); }
            else { addGems(GEMS_5000GP, treasureRollDice(3,6)); addArt(ART_7500GP, '7,500 gp', treasureRollDice(3,4)); }
        } else {
            if (roll <= 25) addGems(GEMS_1000GP, treasureRollDice(1,4));
            else if (roll <= 50) addGems(GEMS_5000GP, treasureRollDice(1,4));
            else if (roll <= 70) { addGems(GEMS_5000GP, 1); addArt(ART_2500GP, '2,500 gp', 1); }
            else if (roll <= 90) { addGems(GEMS_5000GP, 1); addArt(ART_7500GP, '7,500 gp', 1); }
            else { addGems(GEMS_5000GP, treasureRollDice(1,4)); addArt(ART_7500GP, '7,500 gp', treasureRollDice(1,4)); }
        }
    }
    return items;
}

// ---- MAGIC ITEMS ----
function generateMagicItems(cr, type, monsterType) {
    const h    = type === 'hoard';
    const items = [];
    const roll  = treasureRollDice(1,100);

    // Tabelas do DMG: chance e quantidade por CR
    if (cr <= 4) {
        if (h) {
            // Hoard CR 1-4: rolagem de tabela A (common/uncommon)
            if (roll <= 60) items.push(...treasurePickN(MAGIC_COMMON, treasureRollDice(1,6)));
            else if (roll <= 90) items.push(...treasurePickN(MAGIC_UNCOMMON, treasureRollDice(1,4)));
            else { items.push(...treasurePickN(MAGIC_COMMON, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_UNCOMMON, 1)); }
        } else {
            // Individual CR 1-4: 25% chance de 1 item common
            if (roll <= 25) items.push(treasurePick(MAGIC_COMMON));
        }
    } else if (cr <= 10) {
        if (h) {
            // Hoard CR 5-10: tabela B/C
            if (roll <= 40) items.push(...treasurePickN(MAGIC_UNCOMMON, treasureRollDice(1,6)));
            else if (roll <= 60) { items.push(...treasurePickN(MAGIC_UNCOMMON, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_RARE, 1)); }
            else if (roll <= 75) items.push(...treasurePickN(MAGIC_RARE, treasureRollDice(1,4)));
            else if (roll <= 90) { items.push(...treasurePickN(MAGIC_RARE, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_UNCOMMON, treasureRollDice(1,4))); }
            else { items.push(...treasurePickN(MAGIC_RARE, treasureRollDice(1,6))); items.push(...treasurePickN(MAGIC_VERY_RARE, 1)); }
        } else {
            // Individual CR 5-10: 40% chance, uncommon ou raro
            if (roll <= 20) items.push(treasurePick(MAGIC_COMMON));
            else if (roll <= 40) items.push(treasurePick(MAGIC_UNCOMMON));
        }
    } else if (cr <= 16) {
        if (h) {
            // Hoard CR 11-16: tabela D/E
            if (roll <= 20) items.push(...treasurePickN(MAGIC_UNCOMMON, treasureRollDice(1,4)));
            else if (roll <= 35) items.push(...treasurePickN(MAGIC_RARE, treasureRollDice(1,6)));
            else if (roll <= 55) { items.push(...treasurePickN(MAGIC_RARE, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_UNCOMMON, treasureRollDice(1,6))); }
            else if (roll <= 70) { items.push(...treasurePickN(MAGIC_RARE, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_VERY_RARE, 1)); }
            else if (roll <= 85) items.push(...treasurePickN(MAGIC_VERY_RARE, treasureRollDice(1,4)));
            else { items.push(...treasurePickN(MAGIC_VERY_RARE, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_RARE, treasureRollDice(1,4))); }
        } else {
            // Individual CR 11-16: 50% chance
            if (roll <= 20) items.push(treasurePick(MAGIC_UNCOMMON));
            else if (roll <= 40) items.push(treasurePick(MAGIC_RARE));
            else if (roll <= 50) items.push(treasurePick(MAGIC_VERY_RARE));
        }
    } else {
        // CR 17+
        if (h) {
            // Hoard CR 17+: tabela F/G/H/I
            if (roll <= 15) items.push(...treasurePickN(MAGIC_RARE, treasureRollDice(1,4)));
            else if (roll <= 30) { items.push(...treasurePickN(MAGIC_RARE, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_VERY_RARE, treasureRollDice(1,4))); }
            else if (roll <= 45) items.push(...treasurePickN(MAGIC_VERY_RARE, treasureRollDice(1,4)));
            else if (roll <= 60) { items.push(...treasurePickN(MAGIC_VERY_RARE, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_LEGENDARY, 1)); }
            else if (roll <= 75) items.push(...treasurePickN(MAGIC_LEGENDARY, treasureRollDice(1,4)));
            else if (roll <= 90) { items.push(...treasurePickN(MAGIC_LEGENDARY, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_VERY_RARE, treasureRollDice(1,4))); }
            else { items.push(...treasurePickN(MAGIC_LEGENDARY, treasureRollDice(1,4))); items.push(...treasurePickN(MAGIC_ARTIFACTS, 1)); }
        } else {
            // Individual CR 17+: sempre alguma coisa boa
            if (roll <= 20) items.push(treasurePick(MAGIC_RARE));
            else if (roll <= 50) items.push(treasurePick(MAGIC_VERY_RARE));
            else if (roll <= 80) items.push(treasurePick(MAGIC_LEGENDARY));
            else { items.push(treasurePick(MAGIC_LEGENDARY)); items.push(treasurePick(MAGIC_VERY_RARE)); }
        }
    }

    // Item temático do tipo de monstro (chance menor para não inflar)
    if (monsterType !== 'any' && THEMED_ITEMS[monsterType] && Math.random() < 0.35) {
        items.push(treasurePick(THEMED_ITEMS[monsterType]));
    }

    return items;
}

// ---- RARITY ----
function getRarity(item) {
    if(MAGIC_ARTIFACTS.some(x=>x.name===item.name)) return {label:'ARTIFACT',cls:'rarity-artifact'};
    if(MAGIC_LEGENDARY.some(x=>x.name===item.name)) return {label:'LEGENDARY',cls:'rarity-legendary'};
    if(MAGIC_VERY_RARE.some(x=>x.name===item.name)) return {label:'VERY RARE',cls:'rarity-very-rare'};
    if(MAGIC_RARE.some(x=>x.name===item.name)) return {label:'RARE',cls:'rarity-rare'};
    if(MAGIC_UNCOMMON.some(x=>x.name===item.name)) return {label:'UNCOMMON',cls:'rarity-uncommon'};
    return {label:'COMMON',cls:'rarity-common'};
}

// ---- MAIN ----

function generateTreasure() {
    const cr           = parseInt(document.getElementById('tr-cr').value) || 5;
    const treasureType = document.getElementById('tr-type').value;
    const monsterType  = document.getElementById('tr-monster').value;
    const result       = document.getElementById('treasureResult');

    // --- gerar dados ---
    const coins      = generateCoins(cr, treasureType);
    const gemsArt    = generateGemsAndArt(cr, treasureType);
    const magicItems = generateMagicItems(cr, treasureType, monsterType);
    const gems       = gemsArt.filter(i => i.type === 'gem');
    const art        = gemsArt.filter(i => i.type === 'art');

    // --- calcular total em GP ---
    function parseVal(v) { return parseInt(String(v || '0').replace(/[^0-9]/g, '')) || 0; }
    const coinGP  = (coins.cp||0)/100 + (coins.sp||0)/10 + (coins.ep||0)/2 + (coins.gp||0) + (coins.pp||0)*10;
    const gemGP   = gems.reduce((s, g) => s + parseVal(g.value), 0);
    const artGP   = art.reduce((s, a) => s + parseVal(a.value), 0);
    const totalGP = Math.round(coinGP + gemGP + artGP);

    // --- HTML das moedas ---
    const COIN_DEFS = [
        { key: 'cp', label: 'CP', name: 'Copper',   color: '#b87333' },
        { key: 'sp', label: 'SP', name: 'Silver',   color: '#aaaaaa' },
        { key: 'ep', label: 'EP', name: 'Electrum', color: '#c0c080' },
        { key: 'gp', label: 'GP', name: 'Gold',     color: '#c9a84c' },
        { key: 'pp', label: 'PP', name: 'Platinum', color: '#b0a0d0' },
    ];

    let coinRows = '';
    for (const def of COIN_DEFS) {
        if (!coins[def.key]) continue;
        coinRows += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">'
            + '<div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Cinzel,serif;font-size:10px;font-weight:700;flex-shrink:0;background:rgba(0,0,0,0.2);border:1px solid ' + def.color + ';color:' + def.color + ';">' + def.label + '</div>'
            + '<div style="flex:1;color:' + def.color + ';font-family:Cinzel,serif;font-size:12px;">' + def.name + ' Pieces</div>'
            + '<div style="font-family:Cinzel,serif;font-size:18px;font-weight:700;color:' + def.color + ';">' + coins[def.key].toLocaleString() + '</div>'
            + '</div>';
    }

    // --- HTML das gemas ---
    let gemRows = gems.length ? '' : '<div style="color:#8a8070;font-style:italic;font-size:14px;">None</div>';
    for (const g of gems) {
        gemRows += '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);gap:8px;">'
            + '<div style="font-size:14px;color:#e8e0d0;">💎 ' + g.name + '</div>'
            + '<div style="font-family:Cinzel,serif;font-size:12px;color:#c9a84c;flex-shrink:0;">' + g.value + '</div>'
            + '</div>';
    }

    // --- HTML das obras de arte ---
    let artRows = art.length ? '' : '<div style="color:#8a8070;font-style:italic;font-size:14px;">None</div>';
    for (const a of art) {
        artRows += '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);gap:8px;">'
            + '<div style="font-size:14px;color:#e8e0d0;">🎨 ' + a.name + '</div>'
            + '<div style="font-family:Cinzel,serif;font-size:12px;color:#c9a84c;flex-shrink:0;">' + a.value + '</div>'
            + '</div>';
    }

    // --- HTML dos itens mágicos ---
    const RARITY_COLOR = { COMMON:'#aaa', UNCOMMON:'#4caf7d', RARE:'#4a90c9', 'VERY RARE':'#9b59b6', LEGENDARY:'#e0a832', ARTIFACT:'#e74c3c' };
    let magicRows = magicItems.length ? '' : '<div style="color:#8a8070;font-style:italic;font-size:14px;">None</div>';
    for (const item of magicItems) {
        const r   = getRarity(item);
        const col = RARITY_COLOR[r.label] || '#aaa';
        if (item.isThemed) {
            magicRows += '<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">'
                + '<div style="display:flex;justify-content:space-between;gap:8px;">'
                + '<div style="font-size:14px;color:#e8e0d0;">✨ ' + item.name + '</div>'
                + '<div style="font-family:Cinzel,serif;font-size:12px;color:#c9a84c;flex-shrink:0;">' + item.value + '</div>'
                + '</div>'
                + '<div style="font-size:12px;color:#8a8070;font-style:italic;margin-top:3px;">' + item.desc + '</div>'
                + '</div>';
        } else {
            magicRows += '<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">'
                + '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">'
                + '<div style="font-size:14px;color:#e8e0d0;">⚗️ ' + item.name + '</div>'
                + '<div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">'
                + (item.attunement ? '<span style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;padding:2px 6px;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:2px;color:#c9a84c;">ATTUNE</span>' : '')
                + '<span style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;padding:2px 8px;border-radius:2px;border:1px solid ' + col + ';color:' + col + ';">' + r.label + '</span>'
                + '</div></div>'
                + '<div style="font-size:12px;color:#8a8070;font-style:italic;margin-top:4px;">' + item.desc + '</div>'
                + '</div>';
        }
    }

    // --- montar HTML final ---
    const CARD = 'background:#1c1c22;border:1px solid rgba(201,168,76,0.12);border-radius:4px;padding:20px;';
    const TITLE = 'font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid rgba(201,168,76,0.1);';

    result.innerHTML =
        // Resumo total
        '<div style="' + CARD + 'display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;border-color:rgba(201,168,76,0.25);">'
        + '<div>'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);">TOTAL VALUE (APPROX)</div>'
        + '<div style="font-family:Cinzel,serif;font-size:36px;font-weight:700;color:#c9a84c;">' + totalGP.toLocaleString() + ' GP</div>'
        + '</div>'
        + '<div style="display:flex;gap:20px;flex-wrap:wrap;">'
        + '<div style="text-align:center;"><div style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;color:#8a8070;">GEMS</div><div style="font-family:Cinzel,serif;font-size:22px;color:#e8e0d0;">' + gems.length + '</div></div>'
        + '<div style="text-align:center;"><div style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;color:#8a8070;">ART</div><div style="font-family:Cinzel,serif;font-size:22px;color:#e8e0d0;">' + art.length + '</div></div>'
        + '<div style="text-align:center;"><div style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;color:#8a8070;">MAGIC ITEMS</div><div style="font-family:Cinzel,serif;font-size:22px;color:#e8e0d0;">' + magicItems.length + '</div></div>'
        + '</div></div>'

        // Grid 3 colunas: moedas / gemas / arte
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-bottom:16px;">'
        + '<div style="' + CARD + '"><div style="' + TITLE + '">🪙 COINS</div>' + coinRows + '</div>'
        + '<div style="' + CARD + '"><div style="' + TITLE + '">💎 GEMS</div>' + gemRows + '</div>'
        + '<div style="' + CARD + '"><div style="' + TITLE + '">🎨 ART OBJECTS</div>' + artRows + '</div>'
        + '</div>'

        // Itens mágicos (largura total)
        + '<div style="' + CARD + 'margin-bottom:16px;"><div style="' + TITLE + '">⚗️ MAGIC ITEMS</div>' + magicRows + '</div>'

        + '<button onclick="generateTreasure()" style="width:100%;background:none;border:1px solid rgba(201,168,76,0.25);border-radius:2px;padding:12px;color:#c9a84c;font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;cursor:pointer;">🎲 GENERATE ANOTHER</button>';
}