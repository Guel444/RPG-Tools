import random

NAMES = [
    "Arthos", "Lyra", "Dorian", "Kael", "Seraphina", "Thorne", "Elara", "Gareth",
    "Isolde", "Fenris", "Mira", "Aldric", "Zephyr", "Nadia", "Corvus", "Sylara",
    "Brennan", "Talia", "Orion", "Vesper", "Caden", "Rhea", "Dax", "Lirien",
    "Brutus", "Sable", "Edric", "Yara", "Rook", "Fiora", "Lucian", "Selene",
    "Gideon", "Amara", "Vex", "Elysia", "Kieran", "Nyx", "Thalia", "Darius",
    "Seren", "Kaida", "Riven", "Liora", "Zarek", "Morgana", "Alaric", "Soren",
    "Eira", "Vanya", "Cyrus", "Isis", "Draven", "Luna", "Ragnar",
    "Talon", "Evelyn", "Dante", "Aria", "Lucius", "Sable"
]

RACES = [
    "Human", "Elf", "Dwarf", "Orc", "Halfling", "Gnome", "Tiefling",
    "Dragonborn", "Half-Elf", "Half-Orc", "Aasimar", "Tabaxi", "Kenku", "Goliath"
]

CLASSES = [
    "Warrior", "Mage", "Rogue", "Cleric", "Ranger", "Paladin", "Bard", "Monk",
    "Druid", "Warlock", "Sorcerer", "Barbarian", "Fighter", "Artificer"
]

TRAITS = [
    "Brave", "Cunning", "Wise", "Charismatic", "Strong", "Agile", "Intelligent",
    "Resilient", "Reckless", "Cautious", "Mysterious", "Honorable", "Greedy",
    "Compassionate", "Ruthless", "Cheerful", "Melancholic", "Paranoid", "Loyal", "Deceitful"
]

GOALS = [
    "Seek revenge for a fallen comrade",
    "Find a lost artifact of great power",
    "Uncover the secrets of an ancient civilization",
    "Protect their homeland from an impending threat",
    "Become the most renowned adventurer in the realm",
    "Atone for a terrible mistake made in the past",
    "Discover the truth about their mysterious origins",
    "Accumulate enough wealth to retire in comfort",
    "Overthrow a corrupt ruler terrorizing the people",
    "Find a cure for a curse afflicting someone they love",
    "Master a forbidden school of magic",
    "Unite the scattered tribes of their people",
    "Escape a powerful organization hunting them down",
    "Rebuild a destroyed temple to their deity",
    "Prove themselves worthy of a legendary title",
]

BACKSTORIES = [
    "Was raised by monks after being abandoned as a child",
    "Survived a massacre that destroyed their entire village",
    "Spent years in prison for a crime they did not commit",
    "Was once a noble who lost everything in a war",
    "Grew up on the streets, surviving by wit and theft",
    "Was a soldier who deserted after witnessing war crimes",
    "Comes from a long line of adventurers",
    "Was cursed by a witch and has been searching for a cure",
    "Made a pact with a mysterious entity in a moment of desperation",
    "Was the sole survivor of a failed expedition",
]

def generate_npc():
    return {
        "name": random.choice(NAMES),
        "race": random.choice(RACES),
        "class": random.choice(CLASSES),
        "trait": random.choice(TRAITS),
        "goal": random.choice(GOALS),
        "backstory": random.choice(BACKSTORIES),
    }