import random

RACES = [
    "Human", "Elf", "Dwarf", "Halfling", "Gnome",
    "Half-Orc", "Tiefling", "Dragonborn", "Half-Elf", "Aasimar",
    "Tabaxi", "Kenku", "Lizardfolk", "Tortle", "Firbolg",
]

CLASSES = [
    "Fighter", "Wizard", "Rogue", "Cleric", "Ranger",
    "Paladin", "Bard", "Druid", "Warlock", "Barbarian",
    "Monk", "Sorcerer", "Artificer", "Blood Hunter", "Merchant",
    "Blacksmith", "Innkeeper", "Farmer", "Guard", "Scholar",
    "Sailor", "Herbalist", "Thief", "Assassin", "Spy",
]

TRAITS = [
    "Speaks in riddles", "Constantly humming an old tune",
    "Obsessed with collecting trinkets", "Never makes eye contact",
    "Laughs at inappropriate moments", "Speaks very slowly and deliberately",
    "Always eating something", "Has a nervous habit of tapping fingers",
    "Overly formal and polite", "Tells terrible jokes",
    "Suspicious of everyone", "Excessively optimistic",
    "Haunted by a past mistake", "Unusually tall or short",
    "Has a foreign accent", "Missing a finger or ear",
    "Always cold, wears heavy clothes", "Collects rare coins",
    "Dislikes magic intensely", "Deeply superstitious",
    "Sneezes dramatically and often", "Hums battle hymns under breath",
    "Talks to inanimate objects", "Has an unusual pet",
    "Wears a mysterious locket, never opens it",
]

GOALS = [
    "Seeking revenge against a merchant guild",
    "Trying to find a lost family member",
    "Wants to retire and buy a small farm",
    "Collecting all volumes of a rare book series",
    "Searching for a cure to a rare curse",
    "Trying to pay off a large debt",
    "Wants to earn enough gold to rebuild their village",
    "Hunting a specific monster that killed their partner",
    "Trying to recover a stolen family heirloom",
    "Seeking redemption for a past betrayal",
    "Wants to prove themselves to a strict parent",
    "Searching for the truth behind a local legend",
    "Trying to escape from a powerful cult",
    "Wants to become the best at their craft",
    "Looking for somewhere safe to call home",
    "Trying to uncover corruption in the local guard",
    "Wants to discover the location of an ancient ruin",
    "Seeking knowledge of their true heritage",
    "Trying to protect a secret that could start a war",
    "Wants to see the world before they die",
]

BACKSTORY_TEMPLATES = [
    "Born into poverty, {name} learned to survive through wit and determination. A chance encounter with an adventuring party changed everything.",
    "{name} was once a respected {class_name} until a terrible incident destroyed their reputation. Now they wander, searching for a way to reclaim their honor.",
    "Raised in a remote monastery, {name} recently ventured into the wider world for the first time, overwhelmed but eager.",
    "{name} comes from a long line of {race} artisans, but has always felt called to a different path.",
    "A mysterious letter arrived one day, changing {name}'s life forever. They've been chasing the truth ever since.",
    "{name} survived a disaster that claimed many lives. The guilt drives them, though they rarely speak of it.",
    "Apprenticed young to a traveling merchant, {name} has seen much of the world — perhaps too much.",
    "{name} claims to have no past worth mentioning, but their eyes tell a different story.",
    "A forgotten child of nobility, {name} was cast out and has built a new identity entirely on their own terms.",
    "After decades of quiet life, {name} was forced into adventure by circumstances entirely outside their control.",
]

FIRST_NAMES = [
    "Aldric", "Seraphine", "Torvin", "Mira", "Dunstan",
    "Lyra", "Gareth", "Isolde", "Finn", "Thessa",
    "Orin", "Calista", "Rodric", "Vanya", "Bram",
    "Elara", "Caspian", "Nira", "Oswin", "Zephyra",
    "Hadwin", "Sable", "Corvin", "Tilda", "Mordecai",
    "Sylva", "Theron", "Wren", "Edric", "Lirien",
    "Kira", "Aldous", "Fendrel", "Sorel", "Paxon",
    "Rhiannon", "Drust", "Maelis", "Gorin", "Tessaly",
]

LAST_NAMES = [
    "Ashford", "Stormwind", "Blackthorn", "Ironfist", "Silverveil",
    "Duskmantle", "Brightwater", "Coldstone", "Dawnridge", "Embervale",
    "Goldenleaf", "Grimshaw", "Holloway", "Ironwood", "Knightfall",
    "Longstride", "Morrowfield", "Nightwhisper", "Oakheart", "Pendleton",
    "Quicksilver", "Ravenscar", "Shadowmere", "Thornwood", "Underhill",
    "Valorstone", "Whitlock", "Yarrow", "Zenith", "Moonvale",
]


def generate_npc() -> dict:
    race       = random.choice(RACES)
    class_name = random.choice(CLASSES)
    first      = random.choice(FIRST_NAMES)
    last       = random.choice(LAST_NAMES)
    name       = f"{first} {last}"
    trait      = random.choice(TRAITS)
    goal       = random.choice(GOALS)
    template   = random.choice(BACKSTORY_TEMPLATES)
    backstory  = template.format(name=first, race=race, class_name=class_name)

    return {
        "name":       name,
        "race":       race,
        "class_name": class_name,   # consistent key — matches schema & DB
        "trait":      trait,
        "goal":       goal,
        "backstory":  backstory,
    }