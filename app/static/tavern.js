// =============================================================
// TAVERN GENERATOR
// =============================================================

// ---- NAMES ----
const TAVERN_ADJ = [
    "Golden","Silver","Rusty","Broken","Wandering","Sleeping","Drunken","Laughing",
    "Howling","Crimson","Black","Iron","Copper","Emerald","Amber","Pale","Hungry",
    "Lucky","Forgotten","Cursed","Blessed","Dancing","Roaring","Whispering","Salty",
    "Shattered","Gilded","Weeping","Smiling","Crooked","Hollow","Burning","Frozen",
    "Ancient","Blind","Bold","Brave","Cozy","Dark","Dim","Dusty","Fading","Grim",
    "Haunted","Merry","Muddy","Noisy","Quiet","Ragged","Scarred","Smoky","Tired",
];

const TAVERN_NOUN = [
    "Dragon","Flagon","Barrel","Sword","Shield","Anchor","Goblin","Wizard","Crown",
    "Hearth","Lantern","Raven","Wolf","Bear","Fox","Boar","Stag","Eagle","Serpent",
    "Hammer","Anvil","Coin","Candle","Tankard","Boot","Glove","Cloak","Dagger",
    "Skull","Rose","Thistle","Oak","Pine","Stone","River","Mountain","Moon","Star",
    "Maiden","Knight","Pilgrim","Sailor","Ranger","Minstrel","Merchant","Soldier",
    "Ghost","Specter","Demon","Angel","Titan","Giant","Dwarf","Elf","Halfling",
];

const TAVERN_SUFFIX = [
    "Inn","Tavern","Alehouse","Lodge","Rest","Retreat","Haven","Hideaway","Hole",
    "Den","Cellar","Pit","House","Hall","Keep","Post","Stop","Spot","Corner",
];

// ---- TIPOS ----
const TAVERN_TYPES = {
    tavern:   { label: "Roadside Tavern",     emoji: "🍺" },
    inn:      { label: "Inn & Tavern",         emoji: "🏠" },
    port:     { label: "Port Alehouse",        emoji: "⚓" },
    criminal: { label: "Criminal Den",         emoji: "🗡️" },
    noble:    { label: "Noble Establishment",  emoji: "👑" },
};

// ---- PROPRIETÁRIOS ----
const OWNER_RACES = ["Human","Dwarf","Halfling","Half-Elf","Gnome","Tiefling","Orc","Elf"];
const OWNER_NAMES_HUMAN = ["Aldric","Brenna","Corwin","Delia","Edran","Fiona","Gareth","Hilda","Ivar","Jessa","Kellan","Lorna","Marten","Nessa","Oswin","Petra","Quinn","Rolf","Sable","Tomas","Ursa","Vance","Wren","Xander","Yara","Zane"];
const OWNER_NAMES_DWARF = ["Balin","Brunhilde","Dolgrin","Fargrim","Gimra","Harbek","Kildrak","Morda","Orsik","Rurik","Tordek","Vistra","Brottor","Eberk","Gromnir","Thorin","Veit"];
const OWNER_NAMES_HALFLING = ["Alton","Beau","Cora","Danry","Eldon","Fendolin","Garret","Haela","Ignis","Jinny","Kellen","Lyle","Merric","Nora","Osborn","Perrin","Quin","Rosie","Shaena","Tobold","Vani","Wendell"];
const OWNER_NAMES_OTHER = ["Aelindra","Caelynn","Fenris","Zephyrine","Malachar","Seraphel","Drizzt","Vex","Yennefer","Lucien","Moira","Theron","Calista","Oberon","Seren","Valdris","Nyx","Oryn"];

const OWNER_TRAITS = [
    "missing two fingers on the left hand","has a glass eye that never blinks","laughs at everything, even bad news",
    "speaks in a permanent whisper","has a scar from ear to chin","constantly cleans the same mug",
    "never looks customers in the eye","knows everyone's name after hearing it once","hums an unrecognizable tune all day",
    "keeps a loaded crossbow under the bar","has a pet rat that sits on their shoulder","lost a bet and now wears a ridiculous hat",
    "was clearly a soldier once","smells strongly of pipe smoke","quotes old proverbs no one has ever heard",
    "has ink-stained fingers and writes constantly","is suspiciously well-read for a tavern keeper",
    "treats every customer like a long-lost relative","is missing an ear and pretends not to notice",
    "always has a story about 'the old days'","never drinks their own product","tastes everything before serving it",
];

const OWNER_ATTITUDES = ["cheerful and talkative","gruff but fair","paranoid and suspicious","warm and motherly",
    "cold and businesslike","philosophical and slow-speaking","nervous and jumpy","proud and boastful",
    "melancholy but professional","sly and calculating"];

// ---- ATMOSFERA ----
const ATMO_SOUNDS = {
    tavern:   ["the crack of dice on a wooden table","a bard playing an off-key lute","drunken arguments about local politics","the clinking of tankards","someone snoring loudly in the corner"],
    inn:      ["the creak of floorboards upstairs","muffled conversation through thin walls","a baby crying somewhere above","the innkeeper calling out room numbers","travelers swapping road stories"],
    port:     ["rowdy sea shanties","fistfights breaking out and ending quickly","the groan of ships through the walls","sailors betting on arm-wrestling","someone singing badly about a mermaid"],
    criminal: ["hushed conversations that stop when you enter","the scrape of chairs being pushed back","coded phrases passed between regulars","suspiciously long silences","knives being sharpened"],
    noble:    ["soft lute and harp music","refined conversation and polite laughter","the pop of fine wine corks","clinking of crystal glasses","servants moving quietly between tables"],
};

const ATMO_SMELLS = {
    tavern:   ["spilled ale and sawdust","woodsmoke and roasting meat","wet dog and mud","pipe smoke and cheap tallow candles","sweat and old leather"],
    inn:      ["fresh bread from the kitchen","lavender in the linens","horse and hay from the stable door","cooking oil and herbs","a faint smell of mildew"],
    port:     ["salt, fish, and tar","cheap rum and unwashed sailors","seaweed and brine","pipe tobacco and engine grease","the sharp smell of fresh catches"],
    criminal: ["stale smoke and cheap spirits","blood — old and dried","nervous sweat","the chemical tang of alchemical goods","something burnt that no one explains"],
    noble:    ["expensive perfume and pomade","roasting pheasant and fine herbs","fresh flowers in crystal vases","imported spices","beeswax candles and polished wood"],
};

const ATMO_LIGHTING = {
    tavern:   ["dim — a handful of tallow candles","warm — a roaring hearth does most of the work","inconsistent — bright near the bar, dark in the corners"],
    inn:      ["well-lit with oil lanterns on every table","warm and welcoming","bright in the common room, shadowy in the hall"],
    port:     ["smoky and dim","barely lit — half the candles have burned out","harsh lamplight near the bar, total darkness elsewhere"],
    criminal: ["deliberately dark","a single lamp behind the bar","patchy — you can barely see who's sitting next to you"],
    noble:    ["brilliantly lit with dozens of candles","warm chandelier light","elegant sconces casting flattering golden light"],
};

const ATMO_CONDITION = {
    tavern:   ["well-worn but honest","showing its age but still standing","tables carved with decades of initials","floors sticky with spilled ale","rough but comfortable"],
    inn:      ["reasonably clean","tidy but clearly overworked","clean enough for most travelers","comfortable if modest","neat and organized"],
    port:     ["a total wreck held together by stubbornness","rough as the sea outside","furniture that has been repaired too many times","battle-scarred walls and a lopsided bar","smells worse than it looks"],
    criminal: ["deliberately unmarked — no sign, no name","the kind of place you find if you're supposed to find it","sparse furniture arranged for quick exits","every table has sightlines to the door","looks abandoned from outside"],
    noble:    ["impeccably maintained","finer than most inns in the region","polished wood, clean linens, real art on the walls","the kind of place that makes you feel underdressed","warm, well-appointed, and expensive-looking"],
};

// ---- FREQUENTADORES ----
const PATRON_TEMPLATES = [
    // [description, type]
    ["A {adj} farmer nursing a single ale and staring at the floor", "common"],
    ["Two {adj} merchants arguing over a bill of sale", "common"],
    ["A {adj} mercenary sharpening a blade at a corner table", "adventurer"],
    ["An old {adj} woman who seems to know everyone", "local"],
    ["A {adj} bard trying to get the room's attention", "entertainer"],
    ["A cloaked {adj} figure who hasn't touched their drink", "mysterious"],
    ["A {adj} priest muttering prayers under their breath", "religious"],
    ["A {adj} off-duty guard telling war stories to anyone who'll listen", "common"],
    ["A {adj} halfling with an enormous pack who smells of adventure", "adventurer"],
    ["A {adj} gambler dealing cards alone, watching the room", "criminal"],
    ["A {adj} couple clearly on their first date and terrified", "common"],
    ["A {adj} dwarf who has clearly been here since morning", "common"],
    ["A {adj} wizard making notes in a small leather journal", "scholar"],
    ["A {adj} sailor with a parrot that keeps repeating a name", "traveler"],
    ["A {adj} local noble slumming it and enjoying every moment", "noble"],
    ["A {adj} beggar nursing a free bowl of soup in the corner", "common"],
    ["A {adj} ranger with mud-caked boots and road-worn eyes", "adventurer"],
    ["A {adj} tiefling being pointedly ignored by the other patrons", "outsider"],
    ["A {adj} herbalist with a basket of suspicious-smelling plants", "merchant"],
    ["A {adj} retired adventurer boring their neighbor with old stories", "adventurer"],
    ["A {adj} courier eating quickly before getting back on the road", "traveler"],
    ["A {adj} elf who looks mildly disgusted by their surroundings", "outsider"],
    ["A {adj} child selling flowers who somehow keeps getting back inside", "local"],
    ["A {adj} blacksmith still in apron, too tired to go home", "common"],
    ["A {adj} debt collector making increasingly uncomfortable eye contact with someone", "criminal"],
    ["A {adj} cartographer pinning a map to the table with their cups", "scholar"],
    ["A {adj} cleric healing a patron's hangover for a copper", "religious"],
    ["A {adj} bounty hunter with a wanted poster and a patient expression", "adventurer"],
    ["A {adj} gnome inventor whose bag keeps emitting small sparks", "scholar"],
    ["A {adj} widow who comes here every evening at the same time", "local"],
];

const PATRON_ADJ = ["nervous","cheerful","sullen","loud","quiet","scarred","well-dressed","ragged","one-eyed","enormous","tiny","ancient","young","sunburned","pale","red-faced","tattooed","bald","bearded","hooded"];

// ---- CARDÁPIO ----
const FOODS = [
    { name: "Roasted boar ribs",         desc: "Slow-cooked and falling off the bone",           price: "4 sp" },
    { name: "Mutton stew",               desc: "Thick, peppery, served with black bread",         price: "2 sp" },
    { name: "Salted herring",            desc: "With pickled onions and rye crackers",             price: "1 sp" },
    { name: "Traveler's pottage",        desc: "Oats, root vegetables, and mystery meat",          price: "1 sp" },
    { name: "Roast chicken",             desc: "Half a bird with herb gravy and turnips",          price: "3 sp" },
    { name: "Cheese board",             desc: "Three local cheeses and a heel of bread",           price: "2 sp" },
    { name: "Eel pie",                   desc: "River eel in a flaky crust, surprisingly good",   price: "3 sp" },
    { name: "Venison haunch",            desc: "Smoky, tender, with wild mushroom sauce",          price: "6 sp" },
    { name: "Bread and dripping",        desc: "Day-old bread with rendered fat and salt",         price: "3 cp" },
    { name: "Pickled eggs",              desc: "Six in a jar, vinegary and filling",               price: "5 cp" },
    { name: "Smoked sausage plate",      desc: "Three links with mustard and boiled cabbage",      price: "2 sp" },
    { name: "Fish chowder",             desc: "Creamy, with clams and chunks of white fish",       price: "2 sp" },
    { name: "Lamb skewers",              desc: "Charred on the outside, pink inside, with flatbread","price": "3 sp" },
    { name: "Vegetable soup",            desc: "Whatever was in the garden, simmered all day",    price: "1 sp" },
    { name: "Potato dumplings",          desc: "Heavy, filling, served with sour cream",           price: "2 sp" },
    { name: "Pheasant in wine sauce",    desc: "Clearly a noble dish — how is it so cheap?",      price: "8 sp" },
    { name: "Spiced lentil soup",        desc: "Warming, filling, favored by monks and pilgrims", price: "1 sp" },
    { name: "Baked apple",              desc: "Stuffed with honey, cinnamon, and walnuts",         price: "1 sp" },
    { name: "Honeyed ham slice",         desc: "Thick cut, glazed, with roasted carrots",          price: "4 sp" },
    { name: "Oatcake with butter",       desc: "Simple, fresh-baked, eaten by half the room",     price: "3 cp" },
];

const DRINKS = [
    { name: "House ale",            desc: "Local brew, nothing special, gets the job done",    price: "4 cp" },
    { name: "Dark stout",           desc: "Thick and bitter, favored by dwarves",              price: "6 cp" },
    { name: "Pale wheat beer",      desc: "Light and cloudy, good for hot days",               price: "5 cp" },
    { name: "Hard cider",           desc: "Tart apple, made in the valley nearby",             price: "5 cp" },
    { name: "Cheap red wine",       desc: "Rough and acidic, but it's wine",                   price: "1 sp" },
    { name: "Decent red wine",      desc: "From a southern region — actually quite good",      price: "3 sp" },
    { name: "Fine white wine",      desc: "Chilled somehow. Don't ask how.",                   price: "5 sp" },
    { name: "Honeymead",            desc: "Sweet, strong, locals swear by it",                 price: "8 cp" },
    { name: "Spiced mead",          desc: "Cloves, cinnamon, and a secret herb",               price: "1 sp" },
    { name: "Mulled wine",          desc: "Warm, spiced, served in a clay cup",                price: "1 sp" },
    { name: "Goat milk",            desc: "Fresh. Yes, some people order it.",                 price: "2 cp" },
    { name: "Herbal tea",           desc: "Chamomile, mint, and something bitter",             price: "2 cp" },
    { name: "Imported brandy",      desc: "From far away. Costs it.",                          price: "8 sp" },
    { name: "Rotgut whiskey",       desc: "Burns on the way down and the way back up",         price: "3 cp" },
    { name: "Aged whiskey",         desc: "Ten years in the barrel. Worth every copper.",      price: "6 sp" },
    { name: "Sailor's rum",         desc: "Dark, sweet, smells like a ship's hold",            price: "4 cp" },
    { name: "Elven spring water",   desc: "Suspiciously pure. Faintly luminescent.",           price: "1 sp" },
    { name: "Dwarven black brew",   desc: "More coffee than beer. Keeps you awake for days",  price: "1 sp" },
    { name: "Halfling pipeweed tea",desc: "Earthy, mild, very calming",                       price: "5 cp" },
    { name: "Mysterious purple drink",desc: "The barkeep won't say what's in it",             price: "2 sp" },
];

// ---- RUMORES ----
const RUMORS = [
    "A merchant caravan went missing three days east. No survivors found, but smoke was seen.",
    "The miller's daughter hasn't been home in a week. Her father is offering a reward.",
    "Something has been killing livestock on the farms to the north. Not wolves — the wounds are wrong.",
    "A new toll station appeared on the road last week. Nobody knows who built it or who collects it.",
    "The old keep on the hill has had lights in the windows at night. It's been abandoned for twenty years.",
    "A stranger paid in coins stamped with a kingdom that fell three centuries ago.",
    "The well in the market square has run dry. People are saying it's a curse.",
    "A bounty hunter came through looking for someone. Left in a hurry after asking questions.",
    "The river has turned faintly red upstream. The temple is calling it an omen.",
    "Wolves have been spotted wearing crude iron collars. No one knows what that means.",
    "A traveling circus arrived and one of the performers is clearly not human.",
    "The local lord hasn't been seen in two weeks. His guards say he's ill, but the healers haven't been called.",
    "Someone broke into the alchemist's shop but took nothing. The alchemist looks terrified.",
    "A child claims to have seen a ghost in the graveyard that told her the mayor's name.",
    "The road to the capital has been closed by the army. No reason given.",
    "An old hermit came into town raving about 'something waking up under the hill'.",
    "Three separate merchants have arrived with the exact same scar they can't explain.",
    "The local thieves' guild has been quiet for weeks. That's more worrying than when they were active.",
    "A ship arrived at port with no crew. Cargo intact, food still on the table.",
    "The priest was seen meeting with a hooded figure outside the temple at midnight.",
    "A reward has been posted for information about a missing book from the mage's tower.",
    "Strange music can be heard in the forest at night. Those who follow it don't come back right away.",
    "Someone has been leaving coins on the graves of people who died violently. Same coin each time.",
    "A dragon was spotted flying south three nights ago. Nobody's talking about it, which is suspicious.",
    "The fishing boats have stopped going out. The fishermen say something is in the water.",
];

// ---- EVENTOS ESPECIAIS ----
const SPECIAL_EVENTS = [
    "A local arm-wrestling tournament is underway — prize is a week of free drinks.",
    "A traveling merchant is auctioning off a mysterious locked chest. Nobody knows what's inside.",
    "Two rival adventuring parties are glaring at each other from opposite sides of the room.",
    "A bard is performing the ballad of a local hero — who is sitting three tables away looking embarrassed.",
    "A wedding party has taken over half the tavern and is getting progressively louder.",
    "A card sharp is taking money from travelers who should know better.",
    "Someone just accused someone else of cheating at dice. Tension is high.",
    "A young mage is showing off spells for drinks and has accidentally set something on fire.",
    "A group of monks is here on some kind of pilgrimage and seems deeply uncomfortable.",
    "The evening just got very quiet — a hooded figure walked in that the regulars clearly recognize.",
    "A local celebrity (retired adventurer, famous merchant) is holding court at the best table.",
    "A knife fight broke out and ended just before you arrived. The loser is still unconscious.",
    "Someone's beloved dog has gone missing and half the tavern has turned into a search party.",
    "A storyteller is holding the whole room captive with a tale about a local legend.",
    "A thunderstorm has trapped everyone inside. Tempers are beginning to fray.",
    "An unexpected visit from a tax collector has made half the patrons very nervous.",
    "A merchant just announced they're buying a round for the whole house. Nobody trusts it.",
    "A message arrived for someone in the bar. Nobody is claiming it.",
    "A one-sided argument between a drunk and an extremely patient goat is escalating.",
    "The cook just quit in spectacular fashion. Dinner may or may not happen.",
];

// ---- QUARTOS ----
const ROOM_OPTIONS = {
    none:    { label: "No rooms available",  price: null,    desc: "This place doesn't offer lodging." },
    floor:   { label: "Common floor",        price: "2 cp",  desc: "A spot on the common room floor. Bring your own bedroll." },
    shared:  { label: "Shared dormitory",    price: "1 sp",  desc: "A bunk in a room with 5 others. Earplugs recommended." },
    private: { label: "Private room",        price: "5 sp",  desc: "A small room with a locked door and a straw mattress." },
    quality: { label: "Quality room",        price: "8 sp",  desc: "Clean sheets, a real mattress, and a wash basin." },
    suite:   { label: "Private suite",       price: "2 gp",  desc: "A comfortable suite. Lock on the door, real furniture, actual privacy." },
};

// ---- SPECIALTIES ----
const HOUSE_SPECIALTIES = [
    "The house brew is made with a secret local herb nobody will identify.",
    "Known for a particular stew recipe that's been passed down for four generations.",
    "The only place within fifty miles that serves a particular imported spirit.",
    "Rumored to water down the drinks — the owner denies it vigorously.",
    "Famous for a dessert that travelers go out of their way to stop for.",
    "The bread is baked fresh twice a day and sells out both times.",
    "Known for hosting the best card games in the region.",
    "Has a private room that can be rented for 'discreet meetings'.",
    "The cellar is said to contain bottles of wine older than the town itself.",
    "Offers a loyalty system — your tenth drink is free, and they actually keep count.",
];

// ---- MAIN GENERATOR ----
function generateTavern() {
    const tavernType = document.getElementById('tav-type').value;
    const size       = document.getElementById('tav-size').value;
    const reputation = document.getElementById('tav-rep').value;
    const result     = document.getElementById('tavernResult');

    // Nome
    const name = tavernPick(TAVERN_ADJ) + ' ' + tavernPick(TAVERN_NOUN) + (Math.random() > 0.4 ? ' ' + tavernPick(TAVERN_SUFFIX) : '');

    // Dono
    const race = tavernPick(OWNER_RACES);
    const namePool = race === 'Dwarf' ? OWNER_NAMES_DWARF : race === 'Halfling' ? OWNER_NAMES_HALFLING : Math.random() > 0.4 ? OWNER_NAMES_HUMAN : OWNER_NAMES_OTHER;
    const ownerName = tavernPick(namePool);
    const ownerTrait = tavernPick(OWNER_TRAITS);
    const ownerAttitude = tavernPick(OWNER_ATTITUDES);

    // Atmosfera
    const sound    = tavernPick(ATMO_SOUNDS[tavernType]);
    const smell    = tavernPick(ATMO_SMELLS[tavernType]);
    const lighting = tavernPick(ATMO_LIGHTING[tavernType]);
    const condition = tavernPick(ATMO_CONDITION[tavernType]);

    // Frequentadores (3-6 dependendo do tamanho)
    const patronCount = { small: 3, medium: 4, large: 6 }[size] || 4;
    const patrons = tavernPickN(PATRON_TEMPLATES, patronCount).map(p =>
        p[0].replace('{adj}', tavernPick(PATRON_ADJ))
    );

    // Cardápio
    const foodCount  = { small: 3, medium: 4, large: 5 }[size] || 4;
    const drinkCount = { small: 4, medium: 5, large: 7 }[size] || 5;
    const foods  = tavernPickN(FOODS, foodCount);
    const drinks = tavernPickN(DRINKS, drinkCount);

    // Rumores
    const rumorCount = { suspicious: 3, infamous: 3, respectable: 2, legendary: 2 }[reputation] || 2;
    const rumors = tavernPickN(RUMORS, rumorCount);

    // Evento especial
    const event = tavernPick(SPECIAL_EVENTS);

    // Quartos
    const roomTypes = {
        tavern:   ['none','floor','shared'],
        inn:      ['shared','private','quality'],
        port:     ['floor','shared','private'],
        criminal: ['none','floor','shared'],
        noble:    ['private','quality','suite'],
    };
    const roomKey = tavernPick(roomTypes[tavernType]);
    const room = ROOM_OPTIONS[roomKey];

    // Especialidade
    const specialty = tavernPick(HOUSE_SPECIALTIES);

    // Reputação cor
    const repColors = { respectable:'#4caf7d', suspicious:'#e0a832', infamous:'#e74c3c', legendary:'#9b59b6' };
    const repColor = repColors[reputation] || '#4a90c9';

    const typeInfo = TAVERN_TYPES[tavernType];

    // ---- RENDER ----
    const S  = 'background:#1c1c22;border:1px solid rgba(201,168,76,0.12);border-radius:4px;padding:20px;';
    const T  = 'font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid rgba(201,168,76,0.1);';
    const LI = 'padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:14px;color:#e8e0d0;line-height:1.5;';

    // Header
    let html = '<div style="' + S + 'border-color:rgba(201,168,76,0.3);margin-bottom:20px;">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">'
        + '<div>'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:6px;">' + typeInfo.emoji + ' ' + typeInfo.label.toUpperCase() + '</div>'
        + '<div style="font-family:Cinzel,serif;font-size:28px;font-weight:700;color:#c9a84c;line-height:1.2;">The ' + name + '</div>'
        + '<div style="font-size:14px;color:#8a8070;margin-top:8px;font-style:italic;">' + specialty + '</div>'
        + '</div>'
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start;">'
        + '<span style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;padding:4px 10px;border-radius:2px;border:1px solid ' + repColor + ';color:' + repColor + ';">' + reputation.toUpperCase() + '</span>'
        + '<span style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;padding:4px 10px;border-radius:2px;border:1px solid rgba(201,168,76,0.25);color:#c9a84c;">' + size.toUpperCase() + '</span>'
        + '</div></div></div>';

    // Grid principal
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:16px;">';

    // Atmosfera
    html += '<div style="' + S + '">'
        + '<div style="' + T + '">🌫️ ATMOSPHERE</div>'
        + '<div style="' + LI + '"><span style="color:#8a8070;">Lighting: </span>' + lighting + '</div>'
        + '<div style="' + LI + '"><span style="color:#8a8070;">Smells of: </span>' + smell + '</div>'
        + '<div style="' + LI + 'border:none;"><span style="color:#8a8070;">You hear: </span>' + sound + '</div>'
        + '<div style="margin-top:10px;padding:8px;background:rgba(201,168,76,0.04);border-radius:2px;font-size:13px;color:#8a8070;font-style:italic;">'
        + 'The place is ' + condition + '.'
        + '</div></div>';

    // Proprietário
    html += '<div style="' + S + '">'
        + '<div style="' + T + '">🧑 PROPRIETOR</div>'
        + '<div style="font-family:Cinzel,serif;font-size:16px;color:#e8e0d0;margin-bottom:4px;">' + ownerName + '</div>'
        + '<div style="font-size:13px;color:#8a8070;margin-bottom:10px;">' + race + ' · ' + ownerAttitude + '</div>'
        + '<div style="font-size:14px;color:#e8e0d0;line-height:1.5;">' + ownerName.split(' ')[0] + ' ' + ownerTrait + '.</div>'
        + '</div>';

    // Quartos
    html += '<div style="' + S + '">'
        + '<div style="' + T + '">🛏️ LODGING</div>';
    if (room.price) {
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
            + '<div style="font-family:Cinzel,serif;font-size:14px;color:#e8e0d0;">' + room.label + '</div>'
            + '<div style="font-family:Cinzel,serif;font-size:14px;color:#c9a84c;">' + room.price + ' / night</div>'
            + '</div>'
            + '<div style="font-size:13px;color:#8a8070;">' + room.desc + '</div>';
    } else {
        html += '<div style="font-size:14px;color:#8a8070;font-style:italic;">' + room.desc + '</div>';
    }
    html += '</div>';

    html += '</div>'; // end grid

    // Frequentadores (largura total)
    html += '<div style="' + S + 'margin-bottom:16px;">'
        + '<div style="' + T + '">👥 NOTABLE PATRONS</div>'
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:4px;">'
        + patrons.map(p => '<div style="' + LI + 'border-bottom:none;padding:5px 0;">• ' + p + '.</div>').join('')
        + '</div></div>';

    // Cardápio
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:16px;">';

    // Comidas
    html += '<div style="' + S + '">'
        + '<div style="' + T + '">🍖 FOOD</div>'
        + foods.map(f =>
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;' + LI + 'gap:8px;">'
            + '<div><div style="font-size:14px;color:#e8e0d0;">' + f.name + '</div>'
            + '<div style="font-size:12px;color:#8a8070;font-style:italic;">' + f.desc + '</div></div>'
            + '<div style="font-family:Cinzel,serif;font-size:12px;color:#c9a84c;flex-shrink:0;">' + f.price + '</div>'
            + '</div>'
        ).join('')
        + '</div>';

    // Bebidas
    html += '<div style="' + S + '">'
        + '<div style="' + T + '">🍺 DRINKS</div>'
        + drinks.map(d =>
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;' + LI + 'gap:8px;">'
            + '<div><div style="font-size:14px;color:#e8e0d0;">' + d.name + '</div>'
            + '<div style="font-size:12px;color:#8a8070;font-style:italic;">' + d.desc + '</div></div>'
            + '<div style="font-family:Cinzel,serif;font-size:12px;color:#c9a84c;flex-shrink:0;">' + d.price + '</div>'
            + '</div>'
        ).join('')
        + '</div>';

    html += '</div>'; // end cardápio grid

    // Rumores
    html += '<div style="' + S + 'margin-bottom:16px;">'
        + '<div style="' + T + '">💬 RUMORS & WHISPERS</div>'
        + rumors.map((r, i) =>
            '<div style="' + LI + (i === rumors.length-1 ? 'border:none;' : '') + 'display:flex;gap:10px;">'
            + '<span style="color:#c9a84c;font-family:Cinzel,serif;flex-shrink:0;">' + (i+1) + '.</span>'
            + '<span>' + r + '</span></div>'
        ).join('')
        + '</div>';

    // Evento especial
    html += '<div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:4px;padding:16px;margin-bottom:16px;">'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.6);margin-bottom:8px;">⚡ TONIGHT\'S EVENT</div>'
        + '<div style="font-size:15px;color:#e8e0d0;">' + event + '</div>'
        + '</div>';

    // Botão
    html += '<button onclick="generateTavern()" style="width:100%;background:none;border:1px solid rgba(201,168,76,0.25);border-radius:2px;padding:12px;color:#c9a84c;font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background=\'rgba(201,168,76,0.08)\'" onmouseout="this.style.background=\'none\'">🎲 GENERATE ANOTHER TAVERN</button>';

    result.innerHTML = html;
}

function tavernPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function tavernPickN(arr, n) {
    const copy = [...arr], result = [];
    for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}