import random

NAMES = ["Arthos", "Lyra", "Dorian", "Kael", "Seraphina", "Thorne", "Elara", "Gareth", "Isolde", "Fenris"]
RACES = ["Human", "Elf", "Dwarf", "Orc", "Halfling", "Gnome", "Tiefling", "Dragonborn"]
CLASSES = ["Warrior", "Mage", "Rogue", "Cleric", "Ranger", "Paladin", "Bard", "Monk"]
TRAITS = ["Brave", "Cunning", "Wise", "Charismatic", "Strong", "Agile", "Intelligent", "Resilient"]
GOALS = [
    "Seek revenge for a fallen comrade",
    "Find a lost artifact of great power",
    "Uncover the secrets of an ancient civilization",
    "Protect their homeland from an impending threat",
    "Become the most renowned adventurer in the realm",
]

def generate_npc():
    return {
        "name": random.choice(NAMES),
        "race": random.choice(RACES),
        "class": random.choice(CLASSES),
        "trait": random.choice(TRAITS),
        "goal": random.choice(GOALS),
    }
