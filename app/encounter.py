import random
from typing import List, Dict, Optional

# ---------------------------
# Thresholds de XP por nível e dificuldade (D&D 5e oficial)
# ---------------------------
XP_THRESHOLDS = {
    1:  {"easy": 25,   "medium": 50,   "hard": 75,   "deadly": 100},
    2:  {"easy": 50,   "medium": 100,  "hard": 150,  "deadly": 200},
    3:  {"easy": 75,   "medium": 150,  "hard": 225,  "deadly": 400},
    4:  {"easy": 125,  "medium": 250,  "hard": 375,  "deadly": 500},
    5:  {"easy": 250,  "medium": 500,  "hard": 750,  "deadly": 1100},
    6:  {"easy": 300,  "medium": 600,  "hard": 900,  "deadly": 1400},
    7:  {"easy": 350,  "medium": 750,  "hard": 1100, "deadly": 1700},
    8:  {"easy": 450,  "medium": 900,  "hard": 1400, "deadly": 2100},
    9:  {"easy": 550,  "medium": 1100, "hard": 1600, "deadly": 2400},
    10: {"easy": 600,  "medium": 1200, "hard": 1900, "deadly": 2800},
    11: {"easy": 800,  "medium": 1600, "hard": 2400, "deadly": 3600},
    12: {"easy": 1000, "medium": 2000, "hard": 3000, "deadly": 4500},
    13: {"easy": 1100, "medium": 2200, "hard": 3400, "deadly": 5100},
    14: {"easy": 1250, "medium": 2500, "hard": 3800, "deadly": 5700},
    15: {"easy": 1400, "medium": 2800, "hard": 4300, "deadly": 6400},
    16: {"easy": 1600, "medium": 3200, "hard": 4800, "deadly": 7200},
    17: {"easy": 2000, "medium": 3900, "hard": 5900, "deadly": 8800},
    18: {"easy": 2100, "medium": 4200, "hard": 6300, "deadly": 9500},
    19: {"easy": 2400, "medium": 4900, "hard": 7300, "deadly": 10900},
    20: {"easy": 2800, "medium": 5700, "hard": 8500, "deadly": 12700},
}

CR_XP = {
    "0": 10, "1/8": 25, "1/4": 50, "1/2": 100,
    "1": 200, "2": 450, "3": 700, "4": 1100,
    "5": 1800, "6": 2300, "7": 2900, "8": 3900,
    "9": 5000, "10": 5900, "11": 7200, "12": 8400,
    "13": 10000, "14": 11500, "15": 13000, "16": 15000,
    "17": 18000, "18": 20000, "19": 22000, "20": 25000,
    "21": 33000, "22": 41000, "23": 50000, "24": 62000,
    "30": 155000,
}

def get_multiplier(count: int) -> float:
    if count == 1: return 1.0
    if count == 2: return 1.5
    if count <= 6: return 2.0
    if count <= 10: return 2.5
    if count <= 14: return 3.0
    return 4.0

def cr_to_float(cr: str) -> float:
    if cr == "1/8": return 0.125
    if cr == "1/4": return 0.25
    if cr == "1/2": return 0.5
    try: return float(cr)
    except: return 0.0

# ---------------------------
# Biblioteca de Monstros — 200+ criaturas
# ---------------------------
MONSTERS = [

    # =========================================================
    # CR 0
    # =========================================================
    {"name": "Rat", "cr": "0", "type": "beast", "hp": 1, "ac": 10,
     "environments": ["dungeon", "city", "forest", "ruins"],
     "attacks": ["Bite: +0 to hit, 1 piercing"],
     "description": "A common rat. Found in packs near food sources and in dark corners."},

    {"name": "Bat", "cr": "0", "type": "beast", "hp": 1, "ac": 12,
     "environments": ["dungeon", "cave", "forest"],
     "attacks": ["Bite: +0 to hit, 1 piercing"],
     "description": "A small nocturnal mammal that navigates using echolocation."},

    {"name": "Cat", "cr": "0", "type": "beast", "hp": 2, "ac": 12,
     "environments": ["city", "forest"],
     "attacks": ["Claws: +0 to hit, 1 slashing"],
     "description": "A domestic or wild feline, agile and stealthy."},

    {"name": "Frog", "cr": "0", "type": "beast", "hp": 1, "ac": 11,
     "environments": ["swamp", "forest", "cave"],
     "attacks": ["Bite: +0 to hit, 1 piercing"],
     "description": "A small amphibian, harmless but sometimes poisonous if eaten."},

    {"name": "Raven", "cr": "0", "type": "beast", "hp": 1, "ac": 12,
     "environments": ["forest", "plains", "city", "mountain"],
     "attacks": ["Beak: +4 to hit, 1 piercing"],
     "description": "An intelligent bird associated with omens, death, and trickery."},

    {"name": "Rat Swarm", "cr": "1/4", "type": "beast", "hp": 24, "ac": 10,
     "environments": ["dungeon", "city", "ruins"],
     "attacks": ["Bites: +2 to hit, 2d6 piercing (half hp: 1d6)"],
     "tactics": "Swarm — can occupy same space as enemies. Resistance to bludgeoning/piercing/slashing.",
     "description": "A writhing mass of rats that overwhelms prey through sheer numbers."},

    {"name": "Bat Swarm", "cr": "1/4", "type": "beast", "hp": 22, "ac": 12,
     "environments": ["dungeon", "cave"],
     "attacks": ["Bites: +4 to hit, 2d4 piercing (half hp: 1d4)"],
     "tactics": "Swarm. Blindsight 60ft. Blind beyond 60ft.",
     "description": "Thousands of bats filling the air in a frenzy of wings and teeth."},

    # =========================================================
    # CR 1/8
    # =========================================================
    {"name": "Kobold", "cr": "1/8", "type": "humanoid", "hp": 5, "ac": 12,
     "environments": ["dungeon", "cave", "mountain"],
     "attacks": ["Dagger: +4 to hit, 1d4+2 piercing", "Sling: +4 to hit, 1d4+2 bludgeoning"],
     "tactics": "Pack Tactics — advantage when an ally is adjacent to target. Sets cunning traps.",
     "description": "Reptilian weaklings that compensate for their fragility with numbers and traps."},

    {"name": "Merfolk", "cr": "1/8", "type": "humanoid", "hp": 11, "ac": 11,
     "environments": ["lake", "swamp"],
     "attacks": ["Spear: +2 to hit, 1d6 piercing"],
     "description": "Aquatic humanoids equally at home in water and on land."},

    {"name": "Bandit", "cr": "1/8", "type": "humanoid", "hp": 11, "ac": 12,
     "environments": ["city", "road", "forest", "plains"],
     "attacks": ["Scimitar: +3 to hit, 1d6+1 slashing", "Crossbow: +3 to hit, 1d8+1 piercing"],
     "tactics": "Ambushes travelers. Flees when half the group is down.",
     "description": "Desperate outlaws who prey on travelers and merchants."},

    {"name": "Cultist", "cr": "1/8", "type": "humanoid", "hp": 9, "ac": 12,
     "environments": ["dungeon", "ruins", "city"],
     "attacks": ["Scimitar: +3 to hit, 1d6+1 slashing"],
     "tactics": "Dark Devotion — advantage on saves vs charm and fear.",
     "description": "Fanatics devoted to a dark deity, willing to die for their god."},

    {"name": "Guard", "cr": "1/8", "type": "humanoid", "hp": 11, "ac": 16,
     "environments": ["city", "dungeon"],
     "attacks": ["Spear: +3 to hit, 1d6+1 piercing"],
     "description": "A city guard or soldier, trained in basic combat."},

    {"name": "Stirge", "cr": "1/8", "type": "beast", "hp": 2, "ac": 14,
     "environments": ["dungeon", "swamp", "cave", "ruins"],
     "attacks": ["Blood Drain: +5 to hit, 1d4+3 piercing, attaches and drains 1d4+3 HP/turn"],
     "tactics": "Flies in and attaches to a target, draining blood. Must be killed to detach.",
     "description": "A mosquito-like creature that latches onto victims to drain their blood."},

    # =========================================================
    # CR 1/4
    # =========================================================
    {"name": "Skeleton", "cr": "1/4", "type": "undead", "hp": 13, "ac": 13,
     "environments": ["dungeon", "ruins", "graveyard"],
     "attacks": ["Shortsword: +4 to hit, 1d6+2 piercing", "Shortbow: +4 to hit, 1d6+2 piercing"],
     "tactics": "Immune to poison and exhaustion. Vulnerable to bludgeoning damage.",
     "description": "Animated bones raised by necromantic magic to serve undying masters."},

    {"name": "Zombie", "cr": "1/4", "type": "undead", "hp": 22, "ac": 8,
     "environments": ["dungeon", "ruins", "city", "graveyard"],
     "attacks": ["Slam: +3 to hit, 1d6+1 bludgeoning"],
     "tactics": "Undead Fortitude — DC 5+damage Con save to drop to 1 HP instead of 0.",
     "description": "Rotting corpses driven by a relentless hunger for the living."},

    {"name": "Wolf", "cr": "1/4", "type": "beast", "hp": 11, "ac": 13,
     "environments": ["forest", "plains", "arctic", "mountain"],
     "attacks": ["Bite: +4 to hit, 2d4+2 piercing, DC 11 Str save or knocked prone"],
     "tactics": "Pack Tactics. Knocks prey prone before going for the kill.",
     "description": "Cunning predators that hunt in coordinated packs."},

    {"name": "Goblin", "cr": "1/4", "type": "humanoid", "hp": 7, "ac": 15,
     "environments": ["dungeon", "cave", "forest", "plains"],
     "attacks": ["Scimitar: +4 to hit, 1d6+2 slashing", "Shortbow: +4 to hit, 1d6+2 piercing"],
     "tactics": "Nimble Escape — Disengage or Hide as bonus action. Hides and snipes from cover.",
     "description": "Small, sneaky creatures that raid settlements and set cunning ambushes."},

    {"name": "Mud Mephit", "cr": "1/4", "type": "elemental", "hp": 27, "ac": 11,
     "environments": ["swamp", "cave"],
     "attacks": ["Fists: +3 to hit, 1d6+1 bludgeoning", "Mud Breath: DC 11 Dex save, restrained"],
     "tactics": "Death Burst — explodes into mud on death, DC 10 Dex save or restrained.",
     "description": "A small earth-water elemental creature reeking of swamp and decay."},

    {"name": "Steam Mephit", "cr": "1/4", "type": "elemental", "hp": 21, "ac": 10,
     "environments": ["dungeon", "cave"],
     "attacks": ["Claws: +2 to hit, 2d4 slashing", "Steam Breath: DC 10 Dex save, 2d4 fire"],
     "tactics": "Death Burst — explodes in steam on death. Immune to fire and poison.",
     "description": "A small elemental that inhabits volcanic vents and hot springs."},

    {"name": "Pseudodragon", "cr": "1/4", "type": "dragon", "hp": 7, "ac": 13,
     "environments": ["forest", "dungeon", "cave"],
     "attacks": ["Bite: +4 to hit, 1d4+2 piercing", "Sting: +4 to hit, 1d4+2 piercing + DC 11 Con save or poisoned/unconscious"],
     "tactics": "Keen Senses. Magic Resistance. Used as a familiar by wizards.",
     "description": "A tiny dragon the size of a housecat, surprisingly wise and magically resistant."},

    {"name": "Pixie", "cr": "1/4", "type": "fey", "hp": 1, "ac": 15,
     "environments": ["forest"],
     "attacks": ["Shortsword: +2 to hit, 1d6-2 piercing"],
     "tactics": "Innate Spellcasting: Confusion, Dancing Lights, Detect Evil, Dispel Magic, Entangle, Fly, Polymorph, Sleep. Naturally Invisible.",
     "description": "Tiny winged fey brimming with mischief and surprisingly powerful magic."},

    {"name": "Sprite", "cr": "1/4", "type": "fey", "hp": 2, "ac": 15,
     "environments": ["forest"],
     "attacks": ["Longsword: +2 to hit, 1 slashing", "Shortbow: +6 to hit, 1 piercing + DC 10 Con save or poisoned/unconscious"],
     "tactics": "Heart Sight — can sense alignment and emotional state. Invisibility at will.",
     "description": "Tiny forest fey who serve as guardians of natural places."},

    {"name": "Kenku", "cr": "1/4", "type": "humanoid", "hp": 13, "ac": 13,
     "environments": ["city", "dungeon", "forest"],
     "attacks": ["Shortsword: +4 to hit, 1d6+2 piercing", "Shortbow: +4 to hit, 1d6+2 piercing"],
     "tactics": "Mimicry — can perfectly reproduce any sound. Ambush Tactics with advantage.",
     "description": "Cursed bird-people who can only communicate by mimicking sounds they have heard."},

    # =========================================================
    # CR 1/2
    # =========================================================
    {"name": "Orc", "cr": "1/2", "type": "humanoid", "hp": 15, "ac": 13,
     "environments": ["plains", "mountain", "dungeon", "forest"],
     "attacks": ["Greataxe: +5 to hit, 1d12+3 slashing", "Javelin: +5 to hit, 1d6+3 piercing"],
     "tactics": "Aggressive — moves toward nearest enemy as bonus action each turn.",
     "description": "Fierce warriors who live for battle and conquest."},

    {"name": "Scout", "cr": "1/2", "type": "humanoid", "hp": 16, "ac": 13,
     "environments": ["forest", "plains", "mountain", "city"],
     "attacks": ["Shortsword ×2: +4 to hit, 1d6+2 piercing", "Longbow: +4 to hit, 1d8+2 piercing"],
     "tactics": "Keen Hearing and Sight. Keeps distance and snipes from cover.",
     "description": "A skilled tracker and advance scout, dangerous at range."},

    {"name": "Shadow", "cr": "1/2", "type": "undead", "hp": 16, "ac": 12,
     "environments": ["dungeon", "ruins", "graveyard"],
     "attacks": ["Strength Drain: +4 to hit, 2d6+2 necrotic, -1d4 Str until rest"],
     "tactics": "Amorphous. Vulnerable to radiant. Sunlight Weakness. Can create new shadows from slain victims.",
     "description": "Darkness given form, draining the strength from the living with a touch."},

    {"name": "Gnoll", "cr": "1/2", "type": "humanoid", "hp": 22, "ac": 15,
     "environments": ["plains", "forest", "dungeon"],
     "attacks": ["Bite: +4 to hit, 1d4+2 piercing", "Spear: +4 to hit, 1d6+2 piercing", "Longbow: +4 to hit, 1d8+2 piercing"],
     "tactics": "Rampage — when it reduces a creature to 0 HP, moves and makes a bonus bite attack.",
     "description": "Hyena-headed humanoids who trail demons and feed on the slain."},

    {"name": "Hobgoblin", "cr": "1/2", "type": "humanoid", "hp": 11, "ac": 18,
     "environments": ["dungeon", "plains", "forest", "mountain"],
     "attacks": ["Longsword: +3 to hit, 1d8+1 slashing", "Longbow: +3 to hit, 1d8+1 piercing"],
     "tactics": "Martial Advantage — extra 2d6 when an ally is adjacent to target.",
     "description": "Militaristic goblins who form disciplined armies with strict hierarchies."},

    {"name": "Lizardfolk", "cr": "1/2", "type": "humanoid", "hp": 22, "ac": 15,
     "environments": ["swamp", "dungeon", "cave"],
     "attacks": ["Multiattack: 2 attacks", "Bite: +4 to hit, 1d6+2 piercing", "Javelin: +4 to hit, 1d6+2 piercing"],
     "tactics": "Cunning Artisan — crafts weapons and shields from slain enemies. Hold Breath 15 min.",
     "description": "Cold-blooded reptilian hunters who stalk the swamps and marshes."},

    {"name": "Thug", "cr": "1/2", "type": "humanoid", "hp": 32, "ac": 11,
     "environments": ["city", "dungeon"],
     "attacks": ["Multiattack: 2 mace attacks", "Mace: +4 to hit, 1d6+2 bludgeoning"],
     "tactics": "Pack Tactics. Intimidates and flanks. Hired muscle for crime lords.",
     "description": "A brutal enforcer, skilled in violence and intimidation."},

    {"name": "Worg", "cr": "1/2", "type": "monstrosity", "hp": 26, "ac": 13,
     "environments": ["forest", "plains", "mountain"],
     "attacks": ["Bite: +5 to hit, 2d6+3 piercing, DC 13 Str save or knocked prone"],
     "tactics": "Keen Hearing and Smell. Often ridden by goblins as mounts.",
     "description": "A large, cruel wolf of evil intelligence, often serving goblinoids as a mount."},

    {"name": "Crocodile", "cr": "1/2", "type": "beast", "hp": 19, "ac": 12,
     "environments": ["swamp", "lake"],
     "attacks": ["Bite: +4 to hit, 1d10+2 piercing, grappled DC 12 Str"],
     "tactics": "Hold Breath 15 min. Stealth in water. Drags grappled prey underwater.",
     "description": "An armored reptile that lurks in murky water waiting to ambush prey."},

    {"name": "Giant Spider", "cr": "1", "type": "beast", "hp": 26, "ac": 14,
     "environments": ["dungeon", "forest", "cave"],
     "attacks": ["Bite: +5 to hit, 1d8+3 piercing + DC 11 Con save or 2d8 poison", "Web (recharge 5-6): DC 12 Str save or restrained"],
     "tactics": "Spider Climb. Web Sense. Waits in webs for restrained prey.",
     "description": "A massive spider that ensnares prey in its sticky web before delivering a venomous bite."},

    {"name": "Harpy", "cr": "1", "type": "monstrosity", "hp": 38, "ac": 11,
     "environments": ["mountain", "ruins", "plains"],
     "attacks": ["Multiattack: 2 attacks", "Claws: +3 to hit, 2d4+1 slashing", "Luring Song: DC 11 Wis save or charmed, moves toward harpy"],
     "tactics": "Lures victims with enchanting song, then attacks from above.",
     "description": "A winged monster with the body of a woman and talons of a vulture, enchanting prey with its song."},

    # =========================================================
    # CR 1
    # =========================================================
    {"name": "Bugbear", "cr": "1", "type": "humanoid", "hp": 27, "ac": 16,
     "environments": ["dungeon", "cave", "forest"],
     "attacks": ["Morningstar: +4 to hit, 2d8+2 piercing", "Javelin: +4 to hit, 2d6+2 piercing"],
     "tactics": "Surprise Attack — +2d6 when it surprises a target. Sneaks up silently.",
     "description": "Large, hairy goblinoids known for their love of ambush and brutality."},

    {"name": "Dire Wolf", "cr": "1", "type": "beast", "hp": 37, "ac": 14,
     "environments": ["forest", "arctic", "plains", "mountain"],
     "attacks": ["Bite: +5 to hit, 2d6+3 piercing, DC 13 Str save or knocked prone"],
     "tactics": "Pack Tactics. Runs down prey and knocks it prone.",
     "description": "Massive wolves the size of ponies, feared predators of the wilderness."},

    {"name": "Ghoul", "cr": "1", "type": "undead", "hp": 22, "ac": 12,
     "environments": ["dungeon", "ruins", "graveyard"],
     "attacks": ["Bite: +2 to hit, 2d6+2 piercing", "Claws: +4 to hit, 2d4+2 slashing + DC 10 Con save or paralyzed"],
     "tactics": "Targets paralyzed creatures with bite attacks. Immune to charm and poison.",
     "description": "Undead creatures that feast on corpses and delight in paralyzing living prey."},

    {"name": "Dryad", "cr": "1", "type": "fey", "hp": 22, "ac": 11,
     "environments": ["forest"],
     "attacks": ["Club: +2 to hit, 1d4 bludgeoning", "Fey Charm: DC 14 Wis save or charmed"],
     "tactics": "Tree Stride — teleports between trees. Speaks with animals and plants. Calls woodland creatures.",
     "description": "A tree spirit bound to and protective of her forest, beautiful and deadly to those who threaten her home."},

    {"name": "Half-Ogre", "cr": "1", "type": "giant", "hp": 30, "ac": 12,
     "environments": ["plains", "mountain", "dungeon"],
     "attacks": ["Battleaxe: +5 to hit, 1d8+3 slashing", "Javelin: +5 to hit, 1d6+3 piercing"],
     "description": "The result of an ogre and human pairing, combining brute strength with some intelligence."},

    {"name": "Lion", "cr": "1", "type": "beast", "hp": 26, "ac": 12,
     "environments": ["plains"],
     "attacks": ["Bite: +5 to hit, 1d8+3 piercing", "Claws: +5 to hit, 1d6+3 slashing + DC 13 Str save or knocked prone"],
     "tactics": "Pack Tactics. Pounce — if it moves 20ft then claws, target must save or be knocked prone for bonus bite.",
     "description": "The apex predator of the savanna, hunting in coordinated prides."},

    {"name": "Tiger", "cr": "1", "type": "beast", "hp": 37, "ac": 12,
     "environments": ["forest", "plains"],
     "attacks": ["Bite: +5 to hit, 1d10+3 piercing", "Claws: +5 to hit, 1d6+3 slashing + DC 13 Str save or knocked prone"],
     "tactics": "Pounce. Keen Smell.",
     "description": "A massive striped cat, solitary and stealthy, apex predator of dense forests."},

    {"name": "Brown Bear", "cr": "1", "type": "beast", "hp": 34, "ac": 11,
     "environments": ["forest", "mountain", "plains"],
     "attacks": ["Multiattack: bite + claws", "Bite: +5 to hit, 1d8+4 piercing", "Claws: +5 to hit, 2d6+4 slashing"],
     "tactics": "Keen Smell. Charges and grapples prey.",
     "description": "A powerful forest bear, dangerous when defending territory or cubs."},

    {"name": "Quasit", "cr": "1", "type": "fiend", "hp": 7, "ac": 13,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Claws: +4 to hit, 1d4+3 piercing + DC 10 Con save or poisoned", "Scare (recharge 6): DC 10 Wis save or frightened 1 min"],
     "tactics": "Shapeshifting into bat, centipede, or toad. Invisible at will. Serves as demon familiar.",
     "description": "A tiny demon that serves as a familiar to evil spellcasters, spreading chaos gleefully."},

    {"name": "Imp", "cr": "1", "type": "fiend", "hp": 10, "ac": 13,
     "environments": ["dungeon", "city", "ruins"],
     "attacks": ["Sting: +5 to hit, 1d4+3 piercing + DC 11 Con save or 3d6 poison", "Invisibility at will"],
     "tactics": "Shapeshifting into raven, rat, or spider. Invisible at will. Devil's Sight.",
     "description": "A tiny devil that serves warlocks and wizards, whispering temptations."},

    {"name": "Specter", "cr": "1", "type": "undead", "hp": 22, "ac": 12,
     "environments": ["dungeon", "ruins", "city"],
     "attacks": ["Life Drain: +4 to hit, 3d6 necrotic, max HP reduced by damage taken"],
     "tactics": "Incorporeal Movement — passes through walls. Resistant to most damage. Sunlight Sensitivity.",
     "description": "The malevolent spirit of someone who met a violent end, burning with hatred for the living."},

    {"name": "Scarecrow", "cr": "1", "type": "construct", "hp": 36, "ac": 11,
     "environments": ["plains", "forest", "ruins"],
     "attacks": ["Multiattack: 2 claw attacks", "Claws: +3 to hit, 2d4+1 slashing", "Terrifying Glare: DC 11 Wis save or frightened"],
     "tactics": "False Appearance — looks like a normal scarecrow until it attacks.",
     "description": "An animated scarecrow imbued with dark magic, haunting fields and crossroads."},

    # =========================================================
    # CR 2
    # =========================================================
    {"name": "Ogre", "cr": "2", "type": "giant", "hp": 59, "ac": 11,
     "environments": ["plains", "mountain", "dungeon", "cave"],
     "attacks": ["Greatclub: +6 to hit, 2d8+4 bludgeoning", "Javelin: +6 to hit, 2d6+4 piercing"],
     "tactics": "Charges the biggest-looking enemy. Slow but devastating.",
     "description": "A dim-witted giant that terrorizes rural communities."},

    {"name": "Gargoyle", "cr": "2", "type": "elemental", "hp": 52, "ac": 15,
     "environments": ["city", "ruins", "dungeon", "mountain"],
     "attacks": ["Multiattack: 2 attacks", "Bite: +4 to hit, 1d6+2 piercing", "Claws: +4 to hit, 1d6+2 slashing"],
     "tactics": "False Appearance — looks like a stone statue. Resistant to nonmagical weapons.",
     "description": "Stone creatures that perch on buildings masquerading as decorations."},

    {"name": "Ghast", "cr": "2", "type": "undead", "hp": 36, "ac": 13,
     "environments": ["dungeon", "ruins", "graveyard"],
     "attacks": ["Bite: +3 to hit, 2d8+1 piercing", "Claws: +5 to hit, 2d6+3 slashing + DC 10 Con save or paralyzed"],
     "tactics": "Stench — DC 10 Con save or poisoned. Stronger ghoul that can paralyze elves too.",
     "description": "An advanced ghoul with a nauseating stench that weakens all who approach."},

    {"name": "Sea Hag", "cr": "2", "type": "fey", "hp": 52, "ac": 14,
     "environments": ["lake", "swamp"],
     "attacks": ["Claws: +5 to hit, 2d6+3 slashing", "Death Glare: DC 11 Wis save or drop to 0 HP", "Horrific Appearance: DC 11 Wis save or frightened"],
     "tactics": "Part of covens for greater power. Illusory Appearance to lure sailors.",
     "description": "A wretched hag of the deep waters, whose mere appearance can kill."},

    {"name": "Orog", "cr": "2", "type": "humanoid", "hp": 42, "ac": 18,
     "environments": ["dungeon", "mountain", "plains"],
     "attacks": ["Multiattack: 2 greataxe attacks", "Greataxe: +5 to hit, 1d12+3 slashing"],
     "tactics": "Aggressive. Elite orc warrior, often leading war parties.",
     "description": "An exceptionally powerful orc warrior, smarter and stronger than most of its kind."},

    {"name": "Duergar", "cr": "1", "type": "humanoid", "hp": 26, "ac": 16,
     "environments": ["dungeon", "cave", "mountain"],
     "attacks": ["War Pick: +4 to hit, 1d8+2 piercing", "Javelin: +4 to hit, 1d6+2 piercing"],
     "tactics": "Enlarge (recharge 5-6): grows huge, +1d4 to attacks. Invisibility at will. Resistant to poison, illusion, charm.",
     "description": "Gray dwarves of the deep Underdark, cruel and enslaving."},

    {"name": "Ankheg", "cr": "2", "type": "monstrosity", "hp": 39, "ac": 14,
     "environments": ["plains", "forest"],
     "attacks": ["Bite: +5 to hit, 2d6+3 piercing + 1d6 acid, grappled", "Acid Spray (recharge 6): DC 13 Dex save, 3d6 acid"],
     "tactics": "Burrows underground to ambush prey. Grapples and drags underground.",
     "description": "A giant insect that burrows beneath fields, spraying caustic acid at prey."},

    {"name": "Banshee", "cr": "4", "type": "undead", "hp": 58, "ac": 12,
     "environments": ["forest", "ruins", "dungeon"],
     "attacks": ["Corrupting Touch: +4 to hit, 3d6 necrotic", "Horrifying Visage: DC 13 Wis save or aged 1d4×10 years", "Wail (1/day): DC 13 Con save or drop to 0 HP"],
     "tactics": "Incorporeal. Detects life within 5 miles. The Wail is lethal even through walls.",
     "description": "The spirit of a vain elf, cursed to wail through the night, her scream bringing death."},

    {"name": "Carrion Crawler", "cr": "2", "type": "monstrosity", "hp": 51, "ac": 13,
     "environments": ["dungeon", "cave"],
     "attacks": ["Multiattack: 1 bite + 8 tentacles", "Tentacles: +8 to hit, 1 piercing + DC 13 Con save or poisoned/paralyzed", "Bite: +4 to hit, 2d4+2 piercing"],
     "tactics": "Spider Climb. Paralyzes prey with tentacles then eats at leisure.",
     "description": "A many-tentacled scavenger that haunts dungeon corridors, paralysing prey with venomous feelers."},

    {"name": "Cult Fanatic", "cr": "2", "type": "humanoid", "hp": 33, "ac": 13,
     "environments": ["dungeon", "ruins", "city"],
     "attacks": ["Multiattack: 2 dagger attacks", "Dagger: +4 to hit, 1d4+2 piercing", "Spells: Inflict Wounds, Hold Person, Spiritual Weapon"],
     "tactics": "Dark Devotion. Casts Hold Person then Inflict Wounds on paralyzed targets.",
     "description": "A fanatical priest of a dark god, willing to sacrifice everything for their deity."},

    {"name": "Nothic", "cr": "2", "type": "aberration", "hp": 45, "ac": 15,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Multiattack: 2 claw attacks", "Claws: +4 to hit, 1d6+2 slashing", "Weird Insight: contested Perception vs Deception, learns deepest secret", "Rotting Gaze: DC 12 Con save, 3d6 necrotic"],
     "tactics": "Keen Sight. Rotting Gaze punishes anyone who stares. Unnerves with secret knowledge.",
     "description": "A maddened wizard warped by forbidden knowledge of undeath into a cyclopean aberration."},

    {"name": "Peryton", "cr": "2", "type": "monstrosity", "hp": 33, "ac": 13,
     "environments": ["mountain", "forest", "plains"],
     "attacks": ["Multiattack: 2 attacks", "Gore: +5 to hit, 1d8+3 piercing", "Talons: +5 to hit, 2d4+3 piercing"],
     "tactics": "Dive Attack — if flies 30ft and hits with gore, +1d8 and target DC 13 Str save or knocked prone.",
     "description": "A winged monstrosity with a deer's head and eagle's body, hunting humanoids for their hearts."},

    {"name": "Wererat", "cr": "2", "type": "humanoid", "hp": 33, "ac": 12,
     "environments": ["city", "dungeon", "ruins"],
     "attacks": ["Multiattack: 2 attacks", "Bite: +4 to hit, 1d4+2 piercing + DC 11 Con save or lycanthropy", "Hand Crossbow: +4 to hit, 1d6+2 piercing"],
     "tactics": "Immune to nonmagical non-silvered weapons. Hides in city sewers and criminal guilds.",
     "description": "A lycanthrope in rat form, cunning criminal and spreader of lycanthropy."},

    {"name": "Will-o'-Wisp", "cr": "2", "type": "undead", "hp": 22, "ac": 19,
     "environments": ["swamp", "dungeon", "ruins"],
     "attacks": ["Shock: +4 to hit, 2d8 lightning"],
     "tactics": "Ephemeral — can't wear or carry anything. Incorporeal. Lures travelers into danger with light.",
     "description": "A ball of eerie light that haunts swamps and bogs, leading travellers to their doom."},

    # =========================================================
    # CR 3
    # =========================================================
    {"name": "Werewolf", "cr": "3", "type": "humanoid", "hp": 84, "ac": 11,
     "environments": ["forest", "plains", "city"],
     "attacks": ["Multiattack: 2 attacks", "Bite: +5 to hit, 2d8+3 piercing + DC 12 Con save or lycanthropy", "Claws: +5 to hit, 2d4+3 slashing"],
     "tactics": "Immune to nonmagical non-silvered weapons. Hunts in wolf packs.",
     "description": "A cursed humanoid that transforms into a savage wolf-hybrid under the full moon."},

    {"name": "Green Hag", "cr": "3", "type": "fey", "hp": 82, "ac": 17,
     "environments": ["swamp", "forest", "cave"],
     "attacks": ["Claws: +6 to hit, 2d8+3 slashing", "Illusory Appearance", "Invisible Passage"],
     "tactics": "Mimicry. Forms covens for powerful magic. Makes dark bargains to corrupt souls.",
     "description": "A wicked fey who delights in corruption and despair, making deals with dire consequences."},

    {"name": "Minotaur", "cr": "3", "type": "monstrosity", "hp": 114, "ac": 14,
     "environments": ["dungeon", "cave", "ruins"],
     "attacks": ["Greataxe: +6 to hit, 2d12+4 slashing", "Gore: +6 to hit, 2d8+4 piercing"],
     "tactics": "Charge — moves 10ft and attacks, DC 14 Str save or +2d8 and knocked prone. Labyrinthine Recall.",
     "description": "A bull-headed monstrosity haunting labyrinths, driven mad by its cursed existence."},

    {"name": "Basilisk", "cr": "3", "type": "monstrosity", "hp": 52, "ac": 15,
     "environments": ["dungeon", "cave", "ruins", "mountain"],
     "attacks": ["Bite: +5 to hit, 2d6+3 piercing + 2d6 poison", "Petrifying Gaze: DC 12 Con save or petrified"],
     "tactics": "Petrifying Gaze activates at start of any creature's turn within 30ft who can see it.",
     "description": "A lizard-like beast whose gaze can turn the living to stone."},

    {"name": "Manticore", "cr": "3", "type": "monstrosity", "hp": 68, "ac": 14,
     "environments": ["mountain", "plains", "dungeon"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +5 to hit, 1d8+3 piercing", "Claws: +5 to hit, 2d4+3 slashing", "Tail Spike ×4 (ranged): +5 to hit, 1d8+3 piercing (range 100/200)"],
     "tactics": "Flies above melee range and pelts enemies with tail spikes. Regrows spikes daily.",
     "description": "A lion-bodied monster with a human face and spiked tail, cunning and cruel."},

    {"name": "Phase Spider", "cr": "3", "type": "monstrosity", "hp": 32, "ac": 13,
     "environments": ["dungeon", "forest", "cave", "plains"],
     "attacks": ["Bite: +5 to hit, 1d10+3 piercing + DC 11 Con save or 4d8 poison"],
     "tactics": "Ethereal Jaunt — shifts to Ethereal Plane as bonus action. Bites from the Ethereal then retreats.",
     "description": "A spider that phases between the material and ethereal planes to ambush prey."},

    {"name": "Displacer Beast", "cr": "3", "type": "monstrosity", "hp": 85, "ac": 13,
     "environments": ["forest", "dungeon", "plains"],
     "attacks": ["Multiattack: 2 tentacle attacks", "Tentacle: +5 to hit, 1d6+3 piercing"],
     "tactics": "Displacement — attackers have disadvantage against it until it takes damage. Avoidance.",
     "description": "A panther-like beast with six legs and tentacles, appearing to be where it is not."},

    {"name": "Hook Horror", "cr": "3", "type": "monstrosity", "hp": 75, "ac": 15,
     "environments": ["dungeon", "cave"],
     "attacks": ["Multiattack: 2 hook attacks", "Hook: +6 to hit, 2d6+4 slashing"],
     "tactics": "Echolocation 60ft. Blind beyond. Hunts in groups and calls to each other with clicks.",
     "description": "A subterranean horror that hunts in packs, navigating caves by sound."},

    {"name": "Ogre Zombie", "cr": "2", "type": "undead", "hp": 85, "ac": 8,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Morningstar: +6 to hit, 2d8+4 bludgeoning"],
     "tactics": "Undead Fortitude. Shambles forward and smashes everything in reach.",
     "description": "The reanimated corpse of an ogre, dull but terrifyingly powerful."},

    {"name": "Yuan-ti Pureblood", "cr": "1", "type": "humanoid", "hp": 40, "ac": 11,
     "environments": ["dungeon", "ruins", "forest"],
     "attacks": ["Multiattack: 2 attacks", "Scimitar: +4 to hit, 1d6+2 slashing", "Shortbow: +4 to hit, 1d6+2 piercing + DC 12 Con save or poisoned"],
     "tactics": "Innate Spellcasting: Animal Friendship (snakes), Suggestion, Poison Spray. Magic Resistance.",
     "description": "A serpentine cultist who appears nearly human, serving the yuan-ti god Merrshaulk."},

    {"name": "Wight", "cr": "3", "type": "undead", "hp": 45, "ac": 14,
     "environments": ["dungeon", "ruins", "graveyard", "mountain"],
     "attacks": ["Multiattack: 2 attacks", "Longsword: +4 to hit, 1d8+2 slashing", "Longbow: +4 to hit, 1d8+2 piercing", "Life Drain: +4 to hit, 3d6+3 necrotic, max HP reduced"],
     "tactics": "Sunlight Sensitivity. Creates zombie servants from slain humanoids. Resistant to nonmagical weapons.",
     "description": "An undead warrior animated by hatred, draining the life force of all it slays."},

    {"name": "Nightmare", "cr": "3", "type": "fiend", "hp": 68, "ac": 13,
     "environments": ["dungeon", "plains"],
     "attacks": ["Hooves: +6 to hit, 2d8+3 fire"],
     "tactics": "Ethereal Stride — plane shifts with riders. Illumination — sheds dim light. Immune to fire.",
     "description": "A flaming horse from the lower planes, used as a mount by evil riders."},

    # =========================================================
    # CR 4
    # =========================================================
    {"name": "Ettin", "cr": "4", "type": "giant", "hp": 85, "ac": 12,
     "environments": ["plains", "mountain", "dungeon"],
     "attacks": ["Multiattack: 2 attacks", "Battleaxe: +7 to hit, 2d8+5 slashing", "Morningstar: +7 to hit, 2d8+5 piercing"],
     "tactics": "Two heads — can't be surprised. One head can react while the other sleeps.",
     "description": "A two-headed giant whose bickering heads paradoxically make it harder to surprise."},

    {"name": "Ghost", "cr": "4", "type": "undead", "hp": 45, "ac": 11,
     "environments": ["dungeon", "ruins", "city", "graveyard"],
     "attacks": ["Withering Touch: +5 to hit, 4d6+3 necrotic", "Horrifying Visage: DC 13 Wis save or frightened", "Possession: DC 13 Cha save or possessed"],
     "tactics": "Incorporeal Movement. Ethereal Sight. Resistant to most damage.",
     "description": "The restless spirit of someone who died with powerful unfinished business."},

    {"name": "Wereboar", "cr": "4", "type": "humanoid", "hp": 78, "ac": 11,
     "environments": ["forest", "plains"],
     "attacks": ["Multiattack: 2 attacks", "Maul: +5 to hit, 2d6+3 bludgeoning", "Tusk: +5 to hit, 2d6+3 slashing + DC 12 Con save or lycanthropy"],
     "tactics": "Charge — moves 20ft and attacks, +2d6 and DC 13 Str save or knocked prone. Relentless (1/day): reduce damage to 1 HP.",
     "description": "A lycanthrope that transforms into a powerful boar, relentless and nearly unstoppable."},

    {"name": "Weretiger", "cr": "4", "type": "humanoid", "hp": 120, "ac": 12,
     "environments": ["forest", "plains"],
     "attacks": ["Multiattack: 4 attacks (2 bite + 2 claw in tiger form)", "Bite: +5 to hit, 1d10+3 piercing", "Claws: +5 to hit, 1d8+3 slashing + DC 14 Str save or knocked prone"],
     "tactics": "Pounce. Keen Hearing and Smell. Immune to nonmagical non-silvered weapons.",
     "description": "An elegant lycanthrope that transforms into a massive tiger, proud and deadly."},

    {"name": "Couatl", "cr": "4", "type": "celestial", "hp": 97, "ac": 19,
     "environments": ["forest", "ruins", "dungeon"],
     "attacks": ["Bite: +8 to hit, 1d6+5 piercing + DC 13 Con save or poisoned/unconscious", "Constrict: +6 to hit, 2d6+3 bludgeoning, grappled DC 15"],
     "tactics": "Innate Spellcasting: Detect Evil, Cure Wounds, Lesser Restoration, Detect Thoughts. Shielded Mind. Magic Weapons.",
     "description": "A benevolent serpentine celestial with feathered wings, protecting sacred places."},

    {"name": "Helmed Horror", "cr": "4", "type": "construct", "hp": 60, "ac": 20,
     "environments": ["dungeon", "ruins", "city"],
     "attacks": ["Multiattack: 3 longsword attacks", "Longsword: +6 to hit, 1d8+4 slashing"],
     "tactics": "Immune to 3 spells of creator's choice. Magic Resistance. Spell Immunity. Flies.",
     "description": "An empty suit of armour animated to guard vaults, immune to specific spells."},

    {"name": "Incubus", "cr": "4", "type": "fiend", "hp": 66, "ac": 13,
     "environments": ["city", "dungeon", "ruins"],
     "attacks": ["Claws: +5 to hit, 2d6+3 slashing", "Charm: DC 15 Wis save or charmed 1 day", "Draining Kiss: DC 15 Con save or 5d6 psychic + max HP reduced"],
     "tactics": "Shapeshifting. Telepathy. Etherealness. Magic Resistance. Seduces and drains life through kisses.",
     "description": "A demon of seduction that infiltrates mortal societies to corrupt and consume souls."},

    {"name": "Succubus", "cr": "4", "type": "fiend", "hp": 66, "ac": 13,
     "environments": ["city", "dungeon", "ruins"],
     "attacks": ["Claws: +5 to hit, 2d6+3 slashing", "Charm: DC 15 Wis save or charmed 1 day", "Draining Kiss: DC 15 Con save or 5d6 psychic + max HP reduced"],
     "tactics": "Shapeshifting. Telepathy. Etherealness. Magic Resistance.",
     "description": "A demon of seduction and manipulation, collecting souls through temptation."},

    {"name": "Shadow Demon", "cr": "4", "type": "fiend", "hp": 66, "ac": 13,
     "environments": ["dungeon", "ruins", "city"],
     "attacks": ["Claws: +5 to hit, 2d6+3 cold", "Vulnerability to radiant and fire"],
     "tactics": "Incorporeal Movement. Shadow Stealth — hides in dim light. Immune to cold, lightning, poison, nonmagical weapons.",
     "description": "A demon stripped of physical form, lurking in shadows and seeking to devour light."},

    {"name": "Flameskull", "cr": "4", "type": "undead", "hp": 40, "ac": 13,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Fire Ray ×2: +5 to hit, 3d6 fire each", "Spells: Fireball (6d6), Magic Missile, Shield"],
     "tactics": "Illumination — 30ft bright light. Rejuvenation — returns in 1 hour unless holy water sprinkled on remains.",
     "description": "A flaming skull animated by a powerful lich, guarding treasures and hurling fireballs."},

    # =========================================================
    # CR 5
    # =========================================================
    {"name": "Troll", "cr": "5", "type": "giant", "hp": 84, "ac": 15,
     "environments": ["dungeon", "cave", "swamp", "forest", "mountain"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +7 to hit, 1d6+4 piercing", "Claw: +7 to hit, 2d6+4 slashing"],
     "tactics": "Regenerates 10 HP/turn unless hit by fire or acid. Keen Smell.",
     "description": "Massive regenerating monsters feared across the wilderness for their relentless hunger."},

    {"name": "Vampire Spawn", "cr": "5", "type": "undead", "hp": 82, "ac": 15,
     "environments": ["dungeon", "ruins", "city"],
     "attacks": ["Multiattack: 2 attacks", "Claws: +6 to hit, 2d4+3 slashing", "Bite: +6 to hit, 1d6+3 + 3d6 necrotic, regains HP"],
     "tactics": "Spider Climb. Forbiddance — can't enter residence without invite. Regenerates 10 HP/turn.",
     "description": "A vampire thrall serving a master, not yet possessing the full power of true undead lordship."},

    {"name": "Revenant", "cr": "5", "type": "undead", "hp": 136, "ac": 13,
     "environments": ["dungeon", "ruins", "plains", "city"],
     "attacks": ["Multiattack: 2 fist attacks", "Fist: +7 to hit, 3d6+4 bludgeoning", "Vengeful Glare: DC 15 Wis save or paralyzed 1 min"],
     "tactics": "Undying — returns 24h after destruction in new body until revenge is complete.",
     "description": "An undead driven purely by vengeance, returning again and again until its killer is destroyed."},

    {"name": "Beholder Zombie", "cr": "5", "type": "undead", "hp": 93, "ac": 15,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Bite: +6 to hit, 4d10+3 piercing", "Eye Ray: +5 to hit, random effect"],
     "tactics": "Eye Ray — roll d4: 1=Fire (4d8), 2=Necrotic (3d8), 3=Negative Energy (60ft cone, DC 14 Con or 10d8 necrotic), 4=Disintegrate (DC 14 Dex or 7d8+2 force).",
     "description": "The reanimated corpse of a beholder, a nightmarish undead predator."},

    {"name": "Hill Giant", "cr": "5", "type": "giant", "hp": 105, "ac": 13,
     "environments": ["plains", "mountain", "forest"],
     "attacks": ["Multiattack: 2 greatclub attacks", "Greatclub: +8 to hit, 3d8+5 bludgeoning", "Rock: +8 to hit, 3d10+5 bludgeoning (range 60/240)"],
     "tactics": "Greatclub sweeps everything within reach. Hurls rocks at range.",
     "description": "The lowest of the true giants, dimwitted and brutish, raiding and pillaging."},

    {"name": "Roper", "cr": "5", "type": "monstrosity", "hp": 93, "ac": 20,
     "environments": ["dungeon", "cave"],
     "attacks": ["Multiattack: 4 tentacles + 1 bite", "Tentacle: +7 to hit, 2d6+4 bludgeoning, grappled", "Bite: +7 to hit, 4d8+4 piercing"],
     "tactics": "False Appearance — looks like a stalagmite. Grasping Tendrils drag prey to mouth.",
     "description": "A cave predator that mimics stalactites, grabbing prey with sticky tendrils."},

    {"name": "Salamander", "cr": "5", "type": "elemental", "hp": 90, "ac": 15,
     "environments": ["dungeon", "cave", "mountain"],
     "attacks": ["Multiattack: 2 attacks", "Spear: +7 to hit, 2d6+4 piercing + 1d6 fire", "Tail: +7 to hit, 2d6+4 bludgeoning + 1d6 fire, grappled"],
     "tactics": "Heated Body — melee attackers take 1d6 fire. Heated Weapons. Immune to fire.",
     "description": "A serpentine fire elemental warrior, armed with a blazing spear."},

    {"name": "Cambion", "cr": "5", "type": "fiend", "hp": 82, "ac": 19,
     "environments": ["city", "dungeon", "ruins"],
     "attacks": ["Multiattack: 2 attacks", "Spear: +7 to hit, 1d6+4 piercing + 3d6 fire", "Fire Ray: +7 to hit, 3d6 fire (range 120)"],
     "tactics": "Innate Spellcasting: Alter Self, Command, Detect Magic, Plane Shift (self only). Magic Resistance. Fiendish Charm.",
     "description": "The half-devil offspring of a fiend and mortal, wielding infernal magic."},

    {"name": "Xorn", "cr": "5", "type": "elemental", "hp": 73, "ac": 19,
     "environments": ["dungeon", "cave", "mountain"],
     "attacks": ["Multiattack: 3 claws + 1 bite", "Claw: +6 to hit, 1d6+3 slashing", "Bite: +6 to hit, 3d6+3 piercing"],
     "tactics": "Earth Glide — burrows through earth and stone. Treasure Sense — detects gems/precious metals 60ft.",
     "description": "A strange earth elemental creature that consumes gems and precious metals."},

    # =========================================================
    # CR 6
    # =========================================================
    {"name": "Cyclops", "cr": "6", "type": "giant", "hp": 138, "ac": 14,
     "environments": ["plains", "mountain", "cave"],
     "attacks": ["Greatclub: +9 to hit, 3d8+6 bludgeoning", "Rock: +9 to hit, 4d10+6 bludgeoning"],
     "tactics": "Poor Depth Perception — disadvantage on ranged attacks beyond 30ft.",
     "description": "One-eyed giants who herd sheep and smash intruders with massive clubs."},

    {"name": "Medusa", "cr": "6", "type": "monstrosity", "hp": 127, "ac": 15,
     "environments": ["ruins", "dungeon", "cave"],
     "attacks": ["Multiattack: 3 attacks", "Snake Hair: +5 to hit, 1d4+3 + 4d6 poison", "Shortsword: +5 to hit, 2d6+3 piercing", "Petrifying Gaze: DC 14 Con save or petrified"],
     "tactics": "Averts own gaze. Uses mirrors to see around corners.",
     "description": "A cursed creature whose gaze turns all who look upon her to stone."},

    {"name": "Mummy Lord", "cr": "15", "type": "undead", "hp": 97, "ac": 17,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Multiattack: 2 attacks", "Maul: +8 to hit, 3d6+5 bludgeoning + 3d6 necrotic + DC 16 Con save or cursed", "Rotting Fist: +8 to hit, 3d6+5 bludgeoning + 3d6 necrotic"],
     "tactics": "Legendary Resistance 3/day. Legendary Actions. Lair Actions. Regenerates 10 HP/turn unless damaged by fire or radiant.",
     "description": "The undead ruler of an ancient tomb, wielding divine magic and commanding armies of undead."},

    {"name": "Chimera", "cr": "6", "type": "monstrosity", "hp": 114, "ac": 14,
     "environments": ["mountain", "plains", "dungeon"],
     "attacks": ["Multiattack: 3 attacks", "Horns: +6 to hit, 2d12+4 piercing", "Claws: +6 to hit, 2d6+4 slashing", "Bite: +6 to hit, 2d6+4 piercing", "Fire Breath (recharge 5-6): DC 13 Dex save, 7d8 fire in 15ft cone"],
     "tactics": "Three heads — difficult to surprise. Flies and breathes fire.",
     "description": "A monstrous fusion of lion, goat, and dragon, breathing fire and chaos."},

    {"name": "Wyvern", "cr": "6", "type": "dragon", "hp": 110, "ac": 13,
     "environments": ["mountain", "plains", "forest"],
     "attacks": ["Multiattack: bite + stinger", "Bite: +7 to hit, 2d6+4 piercing", "Stinger: +7 to hit, 2d6+4 piercing + DC 15 Con save or 7d6 poison"],
     "tactics": "Flies high and dives to sting. Venom is extremely potent.",
     "description": "A lesser dragon cousin with a venomous tail stinger, fierce but not intelligent."},

    {"name": "Chasme", "cr": "6", "type": "fiend", "hp": 84, "ac": 15,
     "environments": ["dungeon", "ruins", "plains"],
     "attacks": ["Multiattack: 2 attacks", "Bite: +6 to hit, 2d6+3 piercing", "Proboscis: +6 to hit, 1d6+3 piercing + 4d8 necrotic, DC 13 Con or unconscious 10 min"],
     "tactics": "Drone — DC 12 Con save within 30ft or fall asleep. Demon with fly speed.",
     "description": "A fly-like demon that puts prey to sleep with its drone before draining them with its proboscis."},

    # =========================================================
    # CR 7
    # =========================================================
    {"name": "Stone Giant", "cr": "7", "type": "giant", "hp": 126, "ac": 17,
     "environments": ["mountain", "cave", "dungeon"],
     "attacks": ["Multiattack: 2 greatclub attacks", "Greatclub: +9 to hit, 3d8+6 bludgeoning", "Rock: +9 to hit, 4d10+6 bludgeoning, DC 17 Str or knocked prone"],
     "tactics": "Stone Camouflage — advantage on Stealth in rocky terrain.",
     "description": "Reclusive giants who carve elaborate art into cave walls, viewing the surface world as a dream."},

    {"name": "Young Black Dragon", "cr": "7", "type": "dragon", "hp": 127, "ac": 18,
     "environments": ["swamp", "dungeon", "cave"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +7 to hit, 2d10+4 + 1d8 acid", "Claw: +7 to hit, 2d6+4 slashing", "Acid Breath (recharge 5-6): DC 14 Dex save, 11d8 acid in 30ft line"],
     "tactics": "Ambushes from water or darkness. Retreats to heal then returns.",
     "description": "A young dragon with scales the color of midnight, lurking in fetid swamps."},

    {"name": "Young Copper Dragon", "cr": "7", "type": "dragon", "hp": 119, "ac": 17,
     "environments": ["mountain", "dungeon", "cave"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +7 to hit, 2d10+4 piercing", "Claw: +7 to hit, 2d6+4 slashing", "Acid Breath (recharge 5-6): DC 14 Dex save, 9d8 acid in 40ft line", "Slowing Breath (recharge 5-6): DC 14 Con save or slowed"],
     "tactics": "Two breath weapons. Loves riddles and pranks. Will parley before fighting.",
     "description": "A mischievous young dragon who loves riddles, jokes, and collecting stories."},

    {"name": "Shield Guardian", "cr": "7", "type": "construct", "hp": 142, "ac": 17,
     "environments": ["dungeon", "city", "ruins"],
     "attacks": ["Multiattack: 2 fist attacks", "Fist: +7 to hit, 2d6+4 bludgeoning"],
     "tactics": "Bound — linked to an amulet. Shield — absorbs half damage dealt to owner. Regenerates 10 HP/turn. Stores spells.",
     "description": "A golem-like construct bound to protect the holder of its controlling amulet."},

    {"name": "Mind Flayer", "cr": "7", "type": "aberration", "hp": 71, "ac": 15,
     "environments": ["dungeon", "cave"],
     "attacks": ["Tentacles: +7 to hit, 2d10+4 psychic, grappled, DC 15 Int save or stunned", "Extract Brain: +7 to hit, 10d10 piercing on stunned/grappled creature"],
     "tactics": "Mind Blast (recharge 5-6): DC 15 Int save, 4d8+4 psychic + stunned. Innate: Detect Thoughts, Levitate, Plane Shift, Suggestion.",
     "description": "An alien intellect that subsists on brains, commanding thralls with its psionic power."},

    {"name": "Oni", "cr": "7", "type": "giant", "hp": 110, "ac": 16,
     "environments": ["dungeon", "city", "mountain", "forest"],
     "attacks": ["Multiattack: 2 attacks", "Greatclub: +7 to hit, 2d8+4 bludgeoning + 2d6 necrotic", "Claw: +7 to hit, 1d8+4 slashing + 1d8 necrotic"],
     "tactics": "Innate Spellcasting: Darkness, Gaseous Form, Invisibility, Charm Person, Cone of Cold, Sleep, Fly. Regenerates 10 HP/turn.",
     "description": "A horned giant of the night with magical shapeshifting abilities, hunting humans."},

    {"name": "Yuan-ti Abomination", "cr": "7", "type": "monstrosity", "hp": 127, "ac": 15,
     "environments": ["dungeon", "ruins", "forest"],
     "attacks": ["Multiattack: 3 attacks", "Constrict: +8 to hit, 2d6+5 bludgeoning, grappled", "Scimitar: +8 to hit, 3d6+5 slashing", "Longbow: +5 to hit, 1d8+2 piercing + 4d6 poison"],
     "tactics": "Innate Spellcasting: Animal Friendship (snakes), Suggestion, Polymorph. Magic Resistance.",
     "description": "The most serpentine of yuan-ti, massive half-snake abominations of the serpent god."},

    # =========================================================
    # CR 8
    # =========================================================
    {"name": "Frost Giant", "cr": "8", "type": "giant", "hp": 138, "ac": 15,
     "environments": ["arctic", "mountain"],
     "attacks": ["Multiattack: 2 greataxe attacks", "Greataxe: +9 to hit, 3d12+6 slashing", "Rock: +9 to hit, 4d10+6 bludgeoning"],
     "tactics": "Immune to cold. Commands winter wolves and remorhazes.",
     "description": "Towering giants who rule frozen wastelands, raiding coastal villages."},

    {"name": "Hydra", "cr": "8", "type": "monstrosity", "hp": 172, "ac": 15,
     "environments": ["swamp", "lake", "dungeon"],
     "attacks": ["Bite ×5 (one per head): +8 to hit, 2d10+5 piercing"],
     "tactics": "Regrows 2 heads for each head severed (unless cauterized). Multiple Reactions equal to head count.",
     "description": "A multi-headed serpentine beast that grows stronger as heads are severed."},

    {"name": "Assassin", "cr": "8", "type": "humanoid", "hp": 78, "ac": 15,
     "environments": ["city", "dungeon"],
     "attacks": ["Multiattack: 2 attacks", "Shortsword: +6 to hit, 1d6+3 piercing + 7d6 poison DC 15 Con", "Crossbow: +6 to hit, 1d8+3 piercing + 7d6 poison DC 15 Con"],
     "tactics": "Assassinate — advantage and auto-crit vs surprised targets. Evasion. Uncanny Dodge.",
     "description": "A master killer who strikes from the shadows with deadly precision and poison."},

    {"name": "Cloaker", "cr": "8", "type": "aberration", "hp": 78, "ac": 14,
     "environments": ["dungeon", "cave"],
     "attacks": ["Multiattack: 1 bite + 1 tail", "Bite: +7 to hit, 2d6+4 piercing", "Tail: +7 to hit, 1d8+4 slashing"],
     "tactics": "False Appearance — looks like a dark cloak. Moan (DC 13 Wis or frightened). Engulf — wraps around target, imposing blindness and disadvantage.",
     "description": "A manta ray-like predator that hangs from dungeon ceilings, disguised as a cloak."},

    {"name": "Fomorian", "cr": "8", "type": "giant", "hp": 149, "ac": 14,
     "environments": ["dungeon", "cave"],
     "attacks": ["Multiattack: 2 greatclub attacks", "Greatclub: +9 to hit, 3d8+6 bludgeoning", "Cursed Gaze: DC 14 Cha save or polymorphed into beast 1 min"],
     "tactics": "Evil Eye — can curse with Hideous Laughter, Frightened, or Slow. Magical sense 120ft.",
     "description": "Hideously deformed fey giants exiled to the Underdark, bitter and malevolent."},

    {"name": "Spirit Naga", "cr": "8", "type": "monstrosity", "hp": 75, "ac": 15,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Bite: +7 to hit, 2d6+4 piercing + DC 13 Con save or 7d8 poison", "Spells: Hold Person, Lightning Bolt, Multiattack with spells"],
     "tactics": "Rejuvenation — returns in 1d6 days unless killed on consecrated ground. Innate Spellcasting.",
     "description": "An evil serpentine creature of dark magic, guarding ancient treasures."},

    # =========================================================
    # CR 9
    # =========================================================
    {"name": "Bone Devil", "cr": "9", "type": "fiend", "hp": 142, "ac": 19,
     "environments": ["dungeon", "ruins", "city"],
     "attacks": ["Multiattack: 3 attacks", "Claw: +8 to hit, 1d8+4 slashing + 2d8 cold", "Sting: +8 to hit, 2d8+4 + 5d6 poison, DC 14 Con or poisoned"],
     "tactics": "Devil's Sight — sees in magical darkness. Immune to fire and poison.",
     "description": "A skeletal devil that serves as an interrogator and taskmaster in the Nine Hells."},

    {"name": "Cloud Giant", "cr": "9", "type": "giant", "hp": 200, "ac": 14,
     "environments": ["mountain", "plains"],
     "attacks": ["Multiattack: 2 morningstar attacks", "Morningstar: +12 to hit, 3d8+8 piercing", "Rock: +12 to hit, 4d10+8 bludgeoning"],
     "tactics": "Innate Spellcasting: Detect Magic, Fog Cloud, Light, Levitate, Telekinesis, Gaseous Form, Control Weather. Keen Smell.",
     "description": "Aristocratic giants who dwell among clouds, obsessed with wealth and status."},

    {"name": "Glabrezu", "cr": "9", "type": "fiend", "hp": 157, "ac": 17,
     "environments": ["dungeon", "ruins", "plains"],
     "attacks": ["Multiattack: 4 attacks", "Pincer: +9 to hit, 2d10+5 bludgeoning", "Fist: +9 to hit, 2d4+5 bludgeoning"],
     "tactics": "Innate Spellcasting: Confusion, Darkness, Dispel Magic, Mirror Image, Power Word Stun. Magic Resistance. Whisper — grants a wish in exchange for a soul.",
     "description": "A massive four-armed demon that tempts mortals with forbidden wishes before devouring them."},

    {"name": "Fire Giant", "cr": "9", "type": "giant", "hp": 162, "ac": 18,
     "environments": ["mountain", "dungeon", "cave"],
     "attacks": ["Multiattack: 2 greatsword attacks", "Greatsword: +11 to hit, 6d6+7 slashing", "Rock: +11 to hit, 4d10+7 bludgeoning"],
     "tactics": "Immune to fire. Commands fire elementals and red dragons. Master craftsmen.",
     "description": "Militant giants who dwell in volcanic fortresses, obsessed with warfare and conquest."},

    # =========================================================
    # CR 10
    # =========================================================
    {"name": "Young Red Dragon", "cr": "10", "type": "dragon", "hp": 178, "ac": 18,
     "environments": ["mountain", "dungeon", "plains"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +10 to hit, 2d10+6 + 1d6 fire", "Claw: +10 to hit, 2d6+6 slashing", "Fire Breath (recharge 5-6): DC 17 Dex save, 16d6 fire in 30ft cone"],
     "tactics": "Flies high, targets clusters with Fire Breath. Lands to finish survivors.",
     "description": "A young but terrifying dragon whose temper is as fierce as its flame."},

    {"name": "Aboleth", "cr": "10", "type": "aberration", "hp": 135, "ac": 17,
     "environments": ["dungeon", "lake", "swamp"],
     "attacks": ["Multiattack: 3 tentacle attacks", "Tentacle: +9 to hit, 2d6+5 bludgeoning + DC 14 Con save or disease", "Tail: +9 to hit, 3d6+5 bludgeoning", "Enslave (3/day): DC 14 Wis save or charmed"],
     "tactics": "Legendary Actions. Mucus Cloud underwater. Probing Telepathy reads surface thoughts.",
     "description": "An ancient alien intelligence from before the gods, seeking to enslave all life."},

    {"name": "Young Gold Dragon", "cr": "10", "type": "dragon", "hp": 178, "ac": 18,
     "environments": ["plains", "mountain", "dungeon"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +10 to hit, 2d10+6 piercing", "Claw: +10 to hit, 2d6+6 slashing", "Fire Breath (recharge 5-6): DC 17 Dex save, 16d6 fire in 30ft cone", "Weakening Breath (recharge 5-6): DC 17 Str save or disadvantage on attacks 1 min"],
     "tactics": "Two breath weapons. Often in humanoid disguise. Diplomatic before violent.",
     "description": "A noble young dragon who values honor and justice, the mightiest of good dragons."},

    {"name": "Stone Golem", "cr": "10", "type": "construct", "hp": 178, "ac": 17,
     "environments": ["dungeon", "ruins", "city"],
     "attacks": ["Multiattack: 2 slam attacks", "Slam: +10 to hit, 3d8+6 bludgeoning"],
     "tactics": "Immutable Form. Magic Resistance. Slow (recharge 5-6): DC 17 Wis save or slowed 1 min.",
     "description": "An animated statue of immense power, immune to nearly all magic."},

    # =========================================================
    # CR 11
    # =========================================================
    {"name": "Djinni", "cr": "11", "type": "elemental", "hp": 161, "ac": 17,
     "environments": ["plains", "dungeon", "city"],
     "attacks": ["Multiattack: 3 scimitar attacks", "Scimitar: +9 to hit, 2d6+5 slashing + 1d6 thunder"],
     "tactics": "Create Whirlwind. Innate Spellcasting: Detect Evil, Detect Magic, Thunderwave, Wind Walk, Conjure Elemental, Creation, Gaseous Form, Invisibility, Major Image, Plane Shift, Wish (3/day).",
     "description": "A powerful wind genie of the elemental plane of air, capricious and proud."},

    {"name": "Efreeti", "cr": "11", "type": "elemental", "hp": 200, "ac": 17,
     "environments": ["dungeon", "mountain", "plains"],
     "attacks": ["Multiattack: 2 scimitar attacks", "Scimitar: +10 to hit, 2d6+6 slashing + 2d6 fire"],
     "tactics": "Innate Spellcasting: Detect Magic, Enlarge, Gaseous Form, Invisibility, Major Image, Plane Shift, Scorching Ray, Wall of Fire, Wish (3/day). Immune to fire.",
     "description": "A fire genie of burning ambition, enslaving mortals and conquering realms."},

    {"name": "Gynosphinx", "cr": "11", "type": "monstrosity", "hp": 136, "ac": 17,
     "environments": ["ruins", "dungeon", "plains"],
     "attacks": ["Multiattack: 2 claw attacks", "Claw: +9 to hit, 2d8+5 slashing"],
     "tactics": "Legendary Actions. Legendary Resistance 3/day. Innate Spellcasting: 9th-level caster. Inscrutable — immune to divination. Poses riddles.",
     "description": "A powerful sphinx who guards ancient secrets and poses riddles to those who seek passage."},

    {"name": "Raksasha", "cr": "13", "type": "fiend", "hp": 110, "ac": 16,
     "environments": ["city", "dungeon", "ruins"],
     "attacks": ["Multiattack: 2 claw attacks", "Claw: +7 to hit, 2d6+4 slashing + 2d6 psychic"],
     "tactics": "Limited Magic Immunity — immune to spells level 6 and below. Innate Spellcasting: Detect Thoughts, Disguise Self, Mage Hand, Minor Illusion, Charm Person, Dominate Person, Fly, Plane Shift, True Seeing.",
     "description": "A manipulative fiend in the form of a tiger-headed humanoid, infiltrating mortal society."},

    # =========================================================
    # CR 12
    # =========================================================
    {"name": "Archmage", "cr": "12", "type": "humanoid", "hp": 99, "ac": 12,
     "environments": ["city", "dungeon", "ruins"],
     "attacks": ["Dagger: +6 to hit, 1d4+2 piercing", "Spells: Fireball (8d6), Lightning Bolt (8d6), Cone of Cold, Ice Storm, Counterspell, Globe of Invulnerability, Mirror Image, Time Stop"],
     "tactics": "Casts Globe of Invulnerability first. Counterspells key abilities. Teleports.",
     "description": "A master of the arcane arts who has devoted decades to magical study."},

    {"name": "Lich", "cr": "21", "type": "undead", "hp": 135, "ac": 17,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Paralyzing Touch: +12 to hit, 3d6 cold, DC 18 Con or paralyzed 1 min", "Spells: Disintegrate, Power Word Kill, Time Stop, Finger of Death, Meteor Swarm"],
     "tactics": "Legendary Resistance 3/day. Legendary Actions. Rejuvenation via phylactery. Turn Resistance.",
     "description": "A wizard who transcended death through dark ritual, now an immortal undead of immense power."},

    {"name": "Iron Golem", "cr": "16", "type": "construct", "hp": 210, "ac": 20,
     "environments": ["dungeon", "city", "ruins"],
     "attacks": ["Multiattack: 2 slam attacks", "Slam: +13 to hit, 3d8+7 bludgeoning", "Sword: +13 to hit, 3d10+7 slashing", "Poison Breath (recharge 6): DC 19 Con save, 10d8 poison in 15ft cone"],
     "tactics": "Immutable Form. Magic Resistance. Magic Weapons. Immune to poison, psychic, nonmagical weapons. Absorbs fire to heal.",
     "description": "The mightiest of golems, an unstoppable iron juggernaut impervious to most harm."},

    # =========================================================
    # CR 13
    # =========================================================
    {"name": "Adult Shadow Dragon", "cr": "13", "type": "dragon", "hp": 225, "ac": 19,
     "environments": ["dungeon", "ruins", "cave"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +11 to hit, 2d10+7 piercing", "Claw: +11 to hit, 2d6+7 slashing", "Shadow Breath (recharge 5-6): DC 19 Con save, 12d8 necrotic, max HP reduced"],
     "tactics": "Legendary Resistance 3/day. Living Shadow — half cover in dim light.",
     "description": "An adult dragon twisted by the Shadowfell into a creature of darkness and death."},

    {"name": "Beholder", "cr": "13", "type": "aberration", "hp": 180, "ac": 18,
     "environments": ["dungeon", "cave"],
     "attacks": ["Bite: +5 to hit, 4d6+2 piercing", "Eye Rays (3/turn): Charm, Paralyze, Fear, Slow, Enervation, Telekinesis, Sleep, Petrify, Disintegrate, Death rays"],
     "tactics": "Legendary Actions. Anti-Magic Eye Cone — suppresses magic in 150ft cone it looks at. Regional Effects.",
     "description": "A floating orb of alien paranoia, bristling with deadly magical eye rays."},

    {"name": "Storm Giant", "cr": "13", "type": "giant", "hp": 230, "ac": 16,
     "environments": ["mountain", "plains", "lake"],
     "attacks": ["Multiattack: 2 greatsword attacks", "Greatsword: +14 to hit, 6d6+9 slashing", "Rock: +14 to hit, 4d10+9 bludgeoning"],
     "tactics": "Innate Spellcasting: Detect Magic, Feather Fall, Levitate, Control Weather, Water Breathing, Call Lightning, Lightning Bolt, Commune, Control Water. Immune to lightning and thunder.",
     "description": "The mightiest of true giants, dwelling in mountain peaks and ocean depths, touched by divine power."},

    # =========================================================
    # CR 14
    # =========================================================
    {"name": "Death Tyrant", "cr": "14", "type": "undead", "hp": 187, "ac": 19,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Bite: +9 to hit, 4d6+5 piercing", "Eye Rays: Charm, Paralyze, Fear, Slow, Enervation, Disintegrate, Death", "Negative Energy Cone: DC 18 Con save or dead creatures become zombies"],
     "tactics": "Legendary Resistance 3/day. Legendary Actions 3/round. Undead Thralls.",
     "description": "The undead form of a beholder, with even greater hatred for all living things."},

    {"name": "Adult Blue Dragon", "cr": "16", "type": "dragon", "hp": 225, "ac": 19,
     "environments": ["plains", "dungeon", "mountain"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +12 to hit, 2d10+7 + 2d10 lightning", "Claw: +12 to hit, 2d6+7 slashing", "Tail: +12 to hit, 2d8+7 bludgeoning", "Lightning Breath (recharge 5-6): DC 23 Dex save, 16d10 lightning in 120ft line"],
     "tactics": "Legendary Resistance 3/day. Legendary Actions. Lightning Breath devastates lines of enemies. Lair Actions.",
     "description": "A vain adult dragon that collects subjects, treating its territory as a kingdom."},

    # =========================================================
    # CR 15
    # =========================================================
    {"name": "Purple Worm", "cr": "15", "type": "monstrosity", "hp": 247, "ac": 18,
     "environments": ["dungeon", "cave", "plains"],
     "attacks": ["Multiattack: bite + sting", "Bite: +14 to hit, 3d8+9 piercing, DC 19 Dex or swallowed", "Tail Sting: +14 to hit, 3d6+9 + 12d6 poison, DC 19 Con or poisoned"],
     "tactics": "Tunneler — digs through stone. Swallows targets whole (6d6 acid/turn inside).",
     "description": "A colossal burrowing worm that can swallow adventurers whole."},

    {"name": "Adult Green Dragon", "cr": "15", "type": "dragon", "hp": 207, "ac": 19,
     "environments": ["forest", "dungeon"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +11 to hit, 2d10+6 + 2d6 poison", "Claw: +11 to hit, 2d6+6 slashing", "Poison Breath (recharge 5-6): DC 18 Con save, 16d6 poison in 60ft cone"],
     "tactics": "Legendary Resistance 3/day. Amphibious. Innate Spellcasting. Manipulates and schemes.",
     "description": "A deceitful adult dragon who rules vast forests and manipulates others for sport."},

    # =========================================================
    # CR 16
    # =========================================================
    {"name": "Marilith", "cr": "16", "type": "fiend", "hp": 189, "ac": 18,
     "environments": ["dungeon", "ruins", "plains"],
     "attacks": ["Multiattack: 7 attacks", "Longsword ×6: +9 to hit, 2d8+5 slashing", "Tail: +9 to hit, 2d10+5 bludgeoning, grappled DC 19"],
     "tactics": "Legendary Resistance 3/day. Reactive — extra reaction/turn. Teleports 120ft. Magic Resistance.",
     "description": "A six-armed demon general commanding legions with terrifying martial skill."},

    {"name": "Adult Red Dragon", "cr": "17", "type": "dragon", "hp": 256, "ac": 19,
     "environments": ["mountain", "dungeon", "plains"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +14 to hit, 2d10+9 + 2d6 fire", "Claw: +14 to hit, 2d6+9 slashing", "Tail: +14 to hit, 2d8+9 bludgeoning", "Fire Breath (recharge 5-6): DC 21 Dex save, 18d6 fire in 60ft cone"],
     "tactics": "Legendary Resistance 3/day. 3 Legendary Actions. Lair Actions. Immune to fire.",
     "description": "The most feared adult dragon — an engine of destruction and domination."},

    # =========================================================
    # CR 17
    # =========================================================
    {"name": "Death Knight", "cr": "17", "type": "undead", "hp": 180, "ac": 20,
     "environments": ["dungeon", "ruins", "plains"],
     "attacks": ["Multiattack: 3 greatsword attacks", "Greatsword: +11 to hit, 2d6+7 + 5d8 necrotic", "Hellfire Orb (recharge 5-6): DC 18 Dex save, 10d6 fire + 10d6 necrotic in 20ft sphere"],
     "tactics": "Legendary Resistance 3/day. Marshal Undead. Spell immunity (levels 1-5). Spells: Animate Dead, Dispel Magic, Hold Person.",
     "description": "A fallen paladin bound to undeath, commanding vast undead legions with hellfire."},

    {"name": "Androsphinx", "cr": "17", "type": "monstrosity", "hp": 199, "ac": 17,
     "environments": ["ruins", "dungeon", "plains"],
     "attacks": ["Multiattack: 2 claw attacks", "Claw: +12 to hit, 3d10+6 slashing"],
     "tactics": "Legendary Resistance 3/day. Legendary Actions. Inscrutable. Innate Spellcasting: 9th level. Roar (3/day): DC 18 Wis save or frightened/deafened.",
     "description": "The mighty male sphinx, guardian of sacred places and keeper of ancient lore."},

    # =========================================================
    # CR 18
    # =========================================================
    {"name": "Demilich", "cr": "18", "type": "undead", "hp": 80, "ac": 20,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Howl (recharge 5-6): DC 15 Con save, 10d6 necrotic (max HP reduced)", "Life Drain: DC 20 Con save, 5d6+5 necrotic + soul imprisoned on fail"],
     "tactics": "Legendary Resistance 3/day. Legendary Actions. Turn Immunity. Avoidance. Magic Resistance. Immune to everything except magic weapons and spells.",
     "description": "The withered remnant of a lich reduced to a skull, paradoxically even more dangerous."},

    {"name": "Sibriex", "cr": "18", "type": "fiend", "hp": 150, "ac": 19,
     "environments": ["dungeon", "ruins"],
     "attacks": ["Multiattack: 3 attacks", "Chain: +10 to hit, 2d6+6 bludgeoning + grappled", "Bite: +10 to hit, 4d8+6 piercing + DC 20 Con or diseased"],
     "tactics": "Legendary Resistance 3/day. Warp Creature — permanently mutates creatures. Innate Spellcasting.",
     "description": "A ancient, bloated demon that warps reality and mutates all it touches."},

    # =========================================================
    # CR 19-20
    # =========================================================
    {"name": "Balor", "cr": "19", "type": "fiend", "hp": 262, "ac": 19,
     "environments": ["dungeon", "ruins", "plains"],
     "attacks": ["Multiattack: 2 attacks", "Longsword (fire): +14 to hit, 3d8+8 slashing + 3d8 lightning", "Whip (entangle): +14 to hit, 2d6+8 slashing + 3d6 fire, target restrained"],
     "tactics": "Legendary Resistance 3/day. Death Throes — explodes when killed, DC 20 Dex save, 20d6 fire + 20d6 force. Fly 80ft. Fire Aura — 3d6 fire to adjacent creatures.",
     "description": "A demon lord of terrifying power wreathed in flame, the mightiest of tanarri demons."},

    {"name": "Pit Fiend", "cr": "20", "type": "fiend", "hp": 300, "ac": 19,
     "environments": ["dungeon", "ruins", "plains"],
     "attacks": ["Multiattack: 4 attacks", "Bite: +14 to hit, 4d6+8 piercing + DC 21 Con or diseased", "Claw: +14 to hit, 2d10+8 slashing", "Mace: +14 to hit, 4d6+8 bludgeoning + DC 21 Con or poisoned"],
     "tactics": "Legendary Resistance 3/day. Magic Resistance. Innate Spellcasting. Aura of Fear 20ft. Commands devil armies.",
     "description": "The most powerful of devils, a commander of legions in the Blood War."},

    {"name": "Ancient Red Dragon", "cr": "24", "type": "dragon", "hp": 546, "ac": 22,
     "environments": ["mountain", "dungeon", "plains"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +17 to hit, 2d10+10 + 4d6 fire", "Claw: +17 to hit, 2d6+10 slashing", "Tail: +17 to hit, 2d8+10 bludgeoning", "Fire Breath (recharge 5-6): DC 24 Dex save, 26d6 fire in 90ft cone"],
     "tactics": "Legendary Resistance 3/day. 3 Legendary Actions. Lair Actions. Immune to fire.",
     "description": "The most feared dragon alive — ancient, cunning, and catastrophically powerful."},

    {"name": "Ancient Gold Dragon", "cr": "24", "type": "dragon", "hp": 546, "ac": 22,
     "environments": ["mountain", "plains", "dungeon"],
     "attacks": ["Multiattack: 3 attacks", "Bite: +17 to hit, 2d10+10 piercing", "Claw: +17 to hit, 2d6+10 slashing", "Fire Breath (recharge 5-6): DC 24 Dex save, 26d6 fire in 90ft cone", "Weakening Breath (recharge 5-6): DC 24 Str save or disadvantage on attacks 1 min"],
     "tactics": "Legendary Resistance 3/day. 3 Legendary Actions. Lair Actions. Immune to fire. Change Shape.",
     "description": "The pinnacle of dragonkind, ancient, wise, and devastatingly powerful in battle."},

    {"name": "Tarrasque", "cr": "30", "type": "monstrosity", "hp": 676, "ac": 25,
     "environments": ["plains", "city"],
     "attacks": ["Multiattack: 5 attacks", "Bite: +19 to hit, 4d12+10 piercing", "Claw: +19 to hit, 4d8+10 slashing", "Horn: +19 to hit, 4d10+10 piercing", "Tail: +19 to hit, 4d6+10 bludgeoning", "Frightful Presence: DC 17 Wis save or frightened"],
     "tactics": "Legendary Resistance 3/day. Reflects spells on 1-5. Immune to fire, poison. Regenerates 30 HP/turn. Siege Monster — double damage to structures.",
     "description": "The most destructive creature in existence. A force of nature that cannot be permanently slain without a Wish spell."},
]

# Remove any malformed entries
MONSTERS = [m for m in MONSTERS if "name" in m and "cr" in m]


def get_monsters_for_encounter(
    level: int,
    party_size: int,
    difficulty: str,
    environment: str
) -> Dict:
    """Gera um encontro completo usando as regras do D&D 5e."""

    difficulty = difficulty.lower()
    environment = environment.lower()

    threshold = XP_THRESHOLDS.get(level, XP_THRESHOLDS[20])
    budget_min = threshold[difficulty] * party_size

    next_diff = {"easy": "medium", "medium": "hard", "hard": "deadly", "deadly": None}
    next_key = next_diff[difficulty]
    budget_max = (threshold[next_key] * party_size) if next_key else budget_min * 1.5

    eligible = [m for m in MONSTERS if environment in m.get("environments", [])]
    if not eligible:
        eligible = list(MONSTERS)

    cr_ranges = {
        "easy":   (max(0, level - 5), max(1, level - 1)),
        "medium": (max(0, level - 3), level),
        "hard":   (max(0, level - 2), level + 1),
        "deadly": (max(1, level - 1), level + 3),
    }
    cr_min, cr_max = cr_ranges[difficulty]

    def cr_in_range(m):
        v = cr_to_float(m["cr"])
        return cr_min * 0.5 <= v <= cr_max

    ranged = [m for m in eligible if cr_in_range(m)]
    if not ranged:
        ranged = eligible

    best_selected = []
    best_score = float('inf')

    for _ in range(200):
        candidate = []
        pool = random.sample(ranged, min(len(ranged), len(ranged)))
        for monster in pool:
            test = candidate + [monster]
            adj = sum(CR_XP.get(x["cr"], 0) for x in test) * get_multiplier(len(test))
            if adj <= budget_max * 1.05:
                candidate.append(monster)
                adj_now = sum(CR_XP.get(x["cr"], 0) for x in candidate) * get_multiplier(len(candidate))
                if adj_now >= budget_min * 0.85:
                    break

        if not candidate:
            continue

        adj_final = sum(CR_XP.get(x["cr"], 0) for x in candidate) * get_multiplier(len(candidate))
        score = abs(adj_final - budget_min)

        if adj_final >= budget_min * 0.75 and score < best_score:
            best_score = score
            best_selected = candidate

    if not best_selected:
        closest = min(ranged, key=lambda m: abs(CR_XP.get(m["cr"], 0) - budget_min))
        best_selected = [closest]

    selected = best_selected

    grouped = {}
    for m in selected:
        key = m["name"]
        if key not in grouped:
            grouped[key] = {"monster": m, "count": 0}
        grouped[key]["count"] += 1

    raw_xp = sum(CR_XP.get(g["monster"]["cr"], 0) * g["count"] for g in grouped.values())
    multiplier = get_multiplier(len(selected))
    adjusted_xp = int(raw_xp * multiplier)
    xp_per_player = adjusted_xp // party_size

    party_threshold = XP_THRESHOLDS.get(level, XP_THRESHOLDS[20])
    real_difficulty = "Easy"
    if adjusted_xp >= party_threshold["deadly"] * party_size:
        real_difficulty = "Deadly"
    elif adjusted_xp >= party_threshold["hard"] * party_size:
        real_difficulty = "Hard"
    elif adjusted_xp >= party_threshold["medium"] * party_size:
        real_difficulty = "Medium"

    monsters_out = []
    for g in grouped.values():
        m = g["monster"]
        monsters_out.append({
            "name": m["name"],
            "count": g["count"],
            "cr": m["cr"],
            "type": m["type"],
            "hp": m["hp"],
            "ac": m["ac"],
            "attacks": m.get("attacks", []),
            "tactics": m.get("tactics", ""),
            "description": m.get("description", ""),
            "xp_each": CR_XP.get(m["cr"], 0),
        })

    return {
        "monsters": monsters_out,
        "environment": environment,
        "difficulty_requested": difficulty,
        "difficulty_actual": real_difficulty,
        "raw_xp": raw_xp,
        "adjusted_xp": adjusted_xp,
        "xp_per_player": xp_per_player,
        "multiplier": multiplier,
        "monster_count": len(selected),
    }