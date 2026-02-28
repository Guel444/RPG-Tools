// =============================================================
// PLOT HOOK GENERATOR
// =============================================================

function phPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function phPickN(arr, n) {
    const copy = [...arr], res = [];
    for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        res.push(copy.splice(idx, 1)[0]);
    }
    return res;
}
function phPickW(items) {
    // weighted pick: items = [{value, weight}]
    const total = items.reduce((s,i) => s + i.weight, 0);
    let r = Math.random() * total;
    for (const item of items) { r -= item.weight; if (r <= 0) return item.value; }
    return items[items.length-1].value;
}

// ---- TÍTULOS ----
const TITLE_VERB = [
    "The Fall of","The Shadow of","The Secret of","The Last","The Stolen","The Forgotten",
    "The Curse of","The Hunt for","The Blood of","The Price of","The Weight of","The Return of",
    "The Trial of","The Siege of","The Betrayal of","The Silence of","The Eye of","The Hand of",
    "Children of","Servants of","Heirs of","The Mask of","The Throne of","The Grave of",
];
const TITLE_NOUN = [
    "the Iron King","the Old Forest","the Sunken City","the Pale Moon","the Golden Flame",
    "the Shattered Crown","the Red Mountain","the Nameless God","the Last Oracle","the Blind Tower",
    "the Waking Dead","the Silver Chain","the Broken Oath","the Drowned Bell","the Hollow Throne",
    "the Laughing Skull","the Three Moons","the Ember Court","the Weeping Stone","the Final Door",
    "the Frozen Sea","the Undying Flame","the Buried King","the Seventh Seal","the Black Compass",
];

// ---- GANCHOS DE ABERTURA ----
const HOOKS_BY_TONE = {
    mysterious: [
        "A sealed letter arrives bearing no sender's name — only a date, a location, and the words 'come alone or don't come at all.'",
        "A child appears at the door clutching a map drawn in a hand none of you recognize. She doesn't remember how she got it.",
        "Every mirror in town has shown the same face for three days. Nobody knows whose face it is.",
        "A merchant pays you in coins that haven't been minted in two hundred years — and has no idea where he got them.",
        "A body is found with no wounds, no expression, and no shadow. The local temple is very, very quiet about it.",
        "An old woman stops you on the road, calls you each by name, and tells you to 'finish what was started.' She vanishes before you can ask what she meant.",
        "Someone has been leaving notes under your doors. The notes describe things you did yesterday in perfect detail.",
        "A beggar presses a key into your hand and says 'they'll come for it before dawn' before collapsing. He is already dead.",
        "The town well has started pulling up objects from the bottom — personal items belonging to people who went missing years ago.",
        "You all have the same dream on the same night. In the dream, a voice gives you an address.",
    ],
    political: [
        "A noble house hires you to retrieve a document before it reaches the capital — they're not telling you what's in it.",
        "Two powerful factions both claim the same piece of land. Each side offers to pay you to resolve it 'quietly.'",
        "The governor's aide approaches you privately: someone in the council is selling secrets to a foreign power.",
        "A senator is found dead the morning of a critical vote. His allies want answers before the vote is rescheduled.",
        "A minor lord offers a substantial reward to escort a package to the capital — his rivals offer twice that to intercept it.",
        "The new trade agreement has made enemies. Someone needs to identify which faction is planning an 'accident' for the signing ceremony.",
        "A political prisoner escapes. Three different groups want to find her first, for three very different reasons.",
        "The king's heir is missing. His disappearance will destabilize the entire region if it becomes public knowledge.",
        "You are handed forged documents that implicate a local official in treason. Someone wants you to use them. Someone else wants you to destroy them.",
        "A diplomatic envoy is assassinated on your watch. Both nations are blaming your party.",
    ],
    action: [
        "A fortress is under siege and the garrison commander sends a desperate message: they need a small team to do what an army can't.",
        "A dangerous prisoner is being transferred by wagon. Three separate groups are planning to intercept it on the road.",
        "A bounty goes up for a monster that's been terrorizing a valley. The reward triples if you bring it back alive.",
        "A ship carrying vital supplies is overdue by a week. The port master offers everything he has for news of it.",
        "A dungeon thought empty for decades shows signs of fresh activity — lights, sounds, tracks going in but not coming out.",
        "A relic is being auctioned to the highest bidder tomorrow night. Your employer wants it. So does someone very dangerous.",
        "A bridge on the only road through the mountains has been destroyed. Someone did it on purpose, and the winter is coming.",
        "A caravan was raided and one survivor escaped. She saw the attackers' faces — and they were people she recognized from town.",
        "A powerful monster has claimed a mine that employs half the village. The workers are trapped inside.",
        "A rival adventuring party entered the ruins two days ago. Their employer offers you double to go in and find out what happened.",
    ],
    horror: [
        "Livestock across the valley have been found drained of blood — arranged in patterns that match pages from a book that was burned fifty years ago.",
        "A village has stopped sending messengers. The last one who came back wouldn't speak, wouldn't eat, and kept counting her fingers.",
        "People in town are waking up exhausted with no memory of their dreams — except for one recurring image they all share.",
        "A haunted manor is being demolished. The workers stopped showing up after the third one was found inside the walls.",
        "Children in the village have started speaking in an extinct language. The priests are calling it a blessing. The children are calling it something else.",
        "A traveling carnival arrived two weeks ago. Since then, seven people have joined it — and none of them seem to remember their lives before.",
        "A new cult has formed around something found at the bottom of the river. Their rituals have been getting louder. Their numbers have been growing.",
        "A plague is moving through the region. The victims don't die — they just stop being... themselves.",
        "A lighthouse keeper sends a message: 'There is something in the water. It has been here before. It remembers us.'",
        "The graveyard has been quiet for thirty years. Last week, the graves started sinking — from the inside.",
    ],
    comedy: [
        "A wizard accidentally polymorphed the town's beloved mayor into a goat. The wizard is very sorry. The goat is running for re-election.",
        "A high-profile thief stole the wrong item — a wedding ring that belonged to a very powerful grandmother. She wants it back. Personally.",
        "You are hired to protect a merchant's prize-winning pig during a festival. The pig is smarter than it looks and has its own agenda.",
        "A misdelivered letter has convinced an entire village that you are the legendary heroes of a prophecy. You are not. They are very enthusiastic.",
        "A genie was freed and granted three wishes. All three were wasted. Now the genie is your problem.",
        "The local thieves' guild staged a heist that went perfectly except they stole from the wrong house. They need your help to secretly put it all back.",
        "A noble's spoiled son ran away to become an adventurer. His father will pay handsomely to have him returned — safely and without anyone finding out.",
        "A duel is scheduled for dawn. Both duelists have hired you — separately — to help them cheat. Neither knows about the other.",
        "The kingdom's most feared assassin has retired and opened a bakery. Someone keeps sending them contracts. They just want to bake.",
        "A ghost refuses to move on until someone settles a decades-old argument about a recipe. The argument has since consumed the entire afterlife.",
    ],
    drama: [
        "A wrongly convicted prisoner is about to be executed. You have three days to find the real culprit.",
        "A dying elder calls you to her side and reveals a secret that changes everything you thought you knew about your hometown.",
        "A soldier returns from war to find his family gone and his home occupied — and is told they never existed.",
        "A child asks you to help find her father, who left six months ago and was last seen heading toward a ruin no one returns from.",
        "An old enemy seeks you out — not for revenge, but to make amends before they die. The secret they carry will complicate everything.",
        "A community is torn apart by accusations following a tragedy. Two sides have hardened. You're the only outsiders they'll listen to.",
        "A reformed criminal is being blackmailed by someone who wants them back in the life. They ask for help. Their past is darker than they said.",
        "A clan is on the verge of a blood feud over something that happened a generation ago. Someone who was there is still alive — and lying.",
        "You are asked to deliver a letter to someone who died three years ago. The person who sent it doesn't know that yet.",
        "A talented young mage is about to be expelled for a crime they didn't commit. The person who did it is the one making the accusation.",
    ],
};

// ---- ANTAGONISTAS ----
const ANTAGONISTS = {
    local: [
        { name: "A corrupt town guard captain", motive: "covering up a crime from his past", method: "intimidation, false arrests, and planted evidence" },
        { name: "A greedy merchant guild", motive: "monopolizing the region's trade routes", method: "bribery, sabotage, and hired thugs" },
        { name: "A jealous rival noble", motive: "inheriting land that was given to another", method: "legal manipulation, rumors, and quiet violence" },
        { name: "A desperate debtor", motive: "erasing a debt they can never repay", method: "theft, blackmail, and increasingly reckless plans" },
        { name: "A vengeful widow", motive: "justice for a crime the law ignored", method: "careful planning, manipulation, and hired help" },
        { name: "A charismatic cult leader", motive: "control over the vulnerable and desperate", method: "false prophecy, community isolation, and fear" },
        { name: "A disgraced healer", motive: "proving a theory no one believes", method: "dangerous experiments and covered-up failures" },
        { name: "A local crime boss", motive: "protecting their operation from exposure", method: "bribery, threats, and calculated elimination" },
    ],
    regional: [
        { name: "A bandit king", motive: "building a kingdom outside the law", method: "raids, extortion, and recruiting the desperate" },
        { name: "A rogue military commander", motive: "seizing control of a strategic territory", method: "force, propaganda, and political manipulation" },
        { name: "A merchant prince", motive: "cornering a regional market through any means", method: "economic warfare, espionage, and assassination" },
        { name: "A fanatical religious order", motive: "purging those they deem heretical", method: "trials, mob violence, and holy war" },
        { name: "A network of spies", motive: "destabilizing the region for a foreign power", method: "assassination, forged documents, and false flags" },
        { name: "A warlord", motive: "conquest and the glory of battle", method: "military force, scorched-earth tactics, and terror" },
        { name: "A lich in hiding", motive: "buying time to complete a ritual decades in the making", method: "undead proxies, blackmail, and misdirection" },
        { name: "A corrupt high priest", motive: "maintaining their power over a desperate population", method: "manufactured miracles, suppression, and divine authority" },
    ],
    epic: [
        { name: "An ancient dragon", motive: "reclaiming territory lost centuries ago", method: "manipulation of mortal factions, hoarding power, and waiting" },
        { name: "A god's forgotten servant", motive: "carrying out a divine mandate that was rescinded — but not for them", method: "catastrophic force and unshakeable conviction" },
        { name: "A council of archmages", motive: "restructuring the world's magical order by any means necessary", method: "political puppets, planar engineering, and mass memory alteration" },
        { name: "A fallen celestial", motive: "proving that mortals are undeserving of the gods' protection", method: "cultivating despair, engineering failures, and eliminating heroes" },
        { name: "A cult of the end", motive: "welcoming a prophesied apocalypse they believe will remake the world better", method: "martyrdom, sabotage of civilization's pillars, and recruitment of the powerful" },
        { name: "An undying emperor", motive: "reclaiming an empire that collapsed around them while they slept", method: "raising ancient armies, recalling old oaths, and terror" },
        { name: "A demon lord's avatar", motive: "opening a permanent rift between planes", method: "corruption of ley lines, mass sacrifice, and breeding chaos" },
        { name: "A planar entity", motive: "consuming this world to fuel its own existence", method: "slow reality erosion, dream invasion, and chosen champions" },
    ],
};

// ---- OBJETIVOS ----
const OBJECTIVES = {
    local:    ["Find the person responsible before another victim is claimed","Recover the stolen item before it changes hands","Expose the conspiracy before the vote / trial / ceremony","Protect the target long enough to reach safety","Gather enough evidence to bring the guilty to justice","Stop the ritual before it completes","Infiltrate the organization and learn the truth","Negotiate between two parties before the conflict turns violent"],
    regional: ["Disrupt the supply lines before the army can march","Secure the alliance before the enemy does","Find and destroy the source of the curse before it spreads","Retrieve the artifact before it falls into the wrong hands","Warn the capital before the border is overrun","Unite the fractured factions under one banner","Expose the traitor before they can report back","Survive long enough to deliver critical intelligence"],
    epic:     ["Seal the rift before the invasion begins in earnest","Destroy the phylactery hidden at the heart of the enemy's power","Prevent the ritual that would unmake the divine order","Recover the last fragment needed to restore the ancient ward","Stand against the returning conqueror at the gates of the last free city","Convince a god to intervene — and pay the price they demand","Navigate the politics of three factions while the world burns around you","Survive a journey through a shattered plane to recover what was lost"],
};

// ---- COMPLICAÇÕES ----
const COMPLICATIONS = [
    "One of your allies is not who they claim to be.",
    "The real villain is someone the party trusts — or owes a favor.",
    "The 'victim' is not innocent. Far from it.",
    "The item / person you're retrieving doesn't want to be retrieved.",
    "A third faction with its own agenda gets involved at the worst moment.",
    "The evidence you needed is destroyed before you reach it.",
    "One of the party has a personal connection to the antagonist.",
    "The only solution requires breaking a law — or a promise.",
    "Your employer has been lying about their motives from the start.",
    "Two innocent parties are both guilty of something different.",
    "The monster you're hunting is being controlled by something smarter.",
    "The place you need to reach has already been found by someone else.",
    "Someone in town is informing on your movements.",
    "The cure is worse than the disease.",
    "Completing the objective will harm someone who doesn't deserve it.",
    "A powerful organization wants the opposite outcome and has more resources than you.",
    "The antagonist has a legitimate grievance — they might not be entirely wrong.",
    "What you find there changes the moral calculus of the whole mission.",
    "The clock is shorter than you were told.",
    "Success requires the party to split up at exactly the wrong moment.",
];

// ---- LOCALIZAÇÕES ----
const LOCATIONS = {
    local: [
        { name: "An abandoned mill on the edge of town", desc: "The wheel still turns despite there being no water. Locals avoid it." },
        { name: "The sealed lower district", desc: "Closed after a fire three years ago. Someone has been living there since." },
        { name: "A hidden room beneath the tavern", desc: "Behind a false wall. Older than the building above it." },
        { name: "The old cemetery on the hill", desc: "No new graves in ten years — which doesn't mean no new bodies." },
        { name: "A collapsed mine shaft at the edge of the farmland", desc: "Everyone agrees it should stay closed. Not everyone agrees why." },
        { name: "The locked upper floor of the guildhall", desc: "The key went missing along with the last three people who asked about it." },
        { name: "A shrine at the crossroads that wasn't there last month", desc: "Already showing moss and weathering. That's not possible." },
        { name: "The merchant's manor at the edge of the respectable quarter", desc: "Lights on all night. No one goes in or out. The garden is dead." },
    ],
    regional: [
        { name: "A fortress perched on an impassable ridge", desc: "Considered impregnable. Someone found a way in anyway." },
        { name: "A town that was bypassed by the main road and slowly forgotten", desc: "Still inhabited. The inhabitants have some unusual customs." },
        { name: "The ruins of a monastery in the high pass", desc: "Destroyed in a war no one remembers clearly. The library survived." },
        { name: "An island in a contested lake", desc: "Three nations claim it. None of them will admit why they want it so badly." },
        { name: "A forest that appears on no map", desc: "Travelers who enter heading east come out heading west, three days later." },
        { name: "A buried city uncovered by the spring floods", desc: "Scholars are excited. The locals are terrified." },
        { name: "The border checkpoint that has changed hands four times this year", desc: "Currently unmanned. Or appears to be." },
        { name: "A mountain pass that is strategically critical and spiritually cursed", desc: "Both things can be true." },
    ],
    epic: [
        { name: "A plane-touched ruin at the convergence of ley lines", desc: "Reality is thinner here. Things that died nearby didn't stay dead." },
        { name: "The sunken capital of a civilization that should not have been able to sink", desc: "It didn't go into the water. The water came to it." },
        { name: "A palace that exists in two places simultaneously", desc: "The same hall appears in two cities, fifty miles apart. The doors connect." },
        { name: "The God's Road — a path that only appears under specific stars", desc: "It leads somewhere the gods don't want mortals to reach. They put the stars there anyway." },
        { name: "A sealed vault beneath an active volcano", desc: "The seals were designed to hold from the inside." },
        { name: "A tower that is taller on the inside than the outside by a factor of twelve", desc: "Each floor was built in a different era. The top floor hasn't been reached yet." },
        { name: "The battlefield of a war that ended a thousand years ago", desc: "The soldiers are still there. Still fighting. They don't know it's over." },
        { name: "A demiplane created by a god who abandoned it", desc: "The inhabitants adapted. They are not what they were." },
    ],
};

// ---- RECOMPENSAS ----
const REWARDS_BY_LEVEL = {
    "1-4":  { gold: "50–150 gp", extras: ["A deed to a small property","A favor from a local official","A common magic item","Membership in a guild","Reputation in the region","A map to somewhere interesting"] },
    "5-10": { gold: "300–800 gp", extras: ["An uncommon magic item","A letter of credit with a major merchant house","Access to a restricted library or archive","A safe house in the city","A ship's passage anywhere in the region","A rare piece of information"] },
    "11-16":{ gold: "2,000–5,000 gp", extras: ["A rare magic item","A minor noble title or land grant","A sworn ally with real power","Permanent access to a fortified location","A rare or unique spell","The loyalty of a skilled NPC"] },
    "17+":  { gold: "10,000–50,000 gp", extras: ["A legendary magic item","A divine boon from a grateful deity","Control of a strategic location","A permanent place in the historical record","An artifact fragment","The ability to call on a powerful faction as an ally"] },
};

// ---- CONEXÕES (sub-ganchos) ----
const SIDE_HOOKS = [
    "A witness saw something they shouldn't have — and is about to disappear.",
    "Someone who should be dead is living quietly under a false name nearby.",
    "The antagonist's second-in-command is having doubts — and is watching for an opportunity.",
    "An old journal found at the scene fills in the history — but raises harder questions.",
    "A child in the area knows exactly where something important is hidden.",
    "A local eccentric has been tracking this situation for years and has files.",
    "A rival group is one step ahead and isn't hostile — yet.",
    "The location has a guardian that isn't the antagonist's and isn't friendly to either side.",
    "One of the minor NPCs in this story is connected to someone in the party's past.",
    "There's a second objective the employer didn't mention — because they don't know about it yet.",
    "A red herring has been deliberately planted — someone wants you looking the wrong direction.",
    "The real victim in this story isn't who hired you.",
    "An old treaty or law, if invoked correctly, changes everything.",
    "Someone nearby owes the antagonist a debt they haven't paid — and is about to.",
    "A piece of evidence was moved recently. Someone else is investigating.",
];

// ---- URGÊNCIA ----
const URGENCY = [
    "The window is three days. After that, the opportunity — or the victim — will be gone.",
    "A larger force is already moving. You'll lose the advantage if you wait.",
    "The ritual / trial / ceremony is at the next new moon. That's six days.",
    "The informant can only hold their silence for so long before they're found out.",
    "The weather closes the pass in two weeks. After that, it's impassable until spring.",
    "Someone else has been hired to do the same job. They have a head start.",
    "The victim is running out of time. The healers give them a week.",
    "If the document reaches the capital, it's too late to suppress it.",
    "The siege begins at dawn. There's one night to change the outcome.",
    "Every day of delay costs lives the party will have to account for.",
    "The antagonist knows someone is asking questions. They're already covering tracks.",
    "A political window is closing — in three days, the faction that could help you will be gone.",
    "The creature / force is growing stronger. It was manageable last week. It isn't now.",
    "A witness is being moved at dawn. This is the last chance to reach them.",
    "The artifact is being sold in forty-eight hours. After that, it's gone forever.",
];

// ---- TONALIDADE visual ----
const TONE_STYLES = {
    mysterious: { color: '#9b59b6', icon: '🌙', label: 'MYSTERIOUS' },
    political:  { color: '#4a90c9', icon: '⚖️', label: 'POLITICAL'  },
    action:     { color: '#e0a832', icon: '⚔️', label: 'ACTION'     },
    horror:     { color: '#e74c3c', icon: '💀', label: 'HORROR'     },
    comedy:     { color: '#4caf7d', icon: '🎭', label: 'COMEDY'     },
    drama:      { color: '#c9a84c', icon: '🎬', label: 'DRAMA'      },
};

const SCALE_LABELS = { local: '🏘️ LOCAL', regional: '🗺️ REGIONAL', epic: '🌍 EPIC' };

// ---- MAIN ----
function generatePlotHook() {
    const tone   = document.getElementById('ph-tone').value;
    const scale  = document.getElementById('ph-scale').value;
    const level  = document.getElementById('ph-level').value;
    const result = document.getElementById('plotResult');

    const title       = phPick(TITLE_VERB) + ' ' + phPick(TITLE_NOUN);
    const hook        = phPick(HOOKS_BY_TONE[tone]);
    const antagonist  = phPick(ANTAGONISTS[scale]);
    const objective   = phPick(OBJECTIVES[scale]);
    const complication= phPick(COMPLICATIONS);
    const location    = phPick(LOCATIONS[scale]);
    const reward      = REWARDS_BY_LEVEL[level];
    const rewardExtra = phPick(reward.extras);
    const sideHooks   = phPickN(SIDE_HOOKS, 2);
    const urgency     = phPick(URGENCY);
    const toneStyle   = TONE_STYLES[tone];

    const S   = 'background:#1c1c22;border:1px solid rgba(201,168,76,0.12);border-radius:4px;padding:20px;';
    const T   = 'font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(201,168,76,0.1);';
    const ROW = 'padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:14px;color:#e8e0d0;line-height:1.6;';
    const LBL = 'font-size:11px;font-family:Cinzel,serif;letter-spacing:1px;color:#8a8070;display:block;margin-bottom:3px;';

    let html =
        // Header
        '<div style="' + S + 'border-color:rgba(201,168,76,0.3);margin-bottom:20px;">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">'
        + '<div>'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.5);margin-bottom:6px;">'
        + toneStyle.icon + ' ' + toneStyle.label + ' &nbsp;·&nbsp; ' + SCALE_LABELS[scale]
        + '&nbsp;·&nbsp; LEVEL ' + level
        + '</div>'
        + '<div style="font-family:Cinzel,serif;font-size:26px;font-weight:700;color:#c9a84c;line-height:1.2;">' + title + '</div>'
        + '</div>'
        + '<span style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1px;padding:4px 12px;border-radius:2px;border:1px solid ' + toneStyle.color + ';color:' + toneStyle.color + ';flex-shrink:0;">'
        + toneStyle.label + '</span>'
        + '</div></div>'

        // Hook de abertura — destaque total
        + '<div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:4px;padding:20px;margin-bottom:20px;">'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(201,168,76,0.6);margin-bottom:10px;">🎣 THE HOOK</div>'
        + '<div style="font-size:16px;color:#e8e0d0;line-height:1.7;font-style:italic;">' + hook + '</div>'
        + '</div>'

        // Grid: antagonista + localização
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:16px;">'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">🎭 ANTAGONIST</div>'
        + '<div style="font-family:Cinzel,serif;font-size:15px;color:#e8e0d0;margin-bottom:6px;">' + antagonist.name + '</div>'
        + '<div style="' + ROW + '"><span style="' + LBL + '">MOTIVE</span>' + antagonist.motive + '</div>'
        + '<div style="' + ROW + 'border:none;"><span style="' + LBL + '">METHOD</span>' + antagonist.method + '</div>'
        + '</div>'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">📍 LOCATION</div>'
        + '<div style="font-family:Cinzel,serif;font-size:15px;color:#e8e0d0;margin-bottom:8px;">' + location.name + '</div>'
        + '<div style="font-size:14px;color:#8a8070;font-style:italic;line-height:1.6;">' + location.desc + '</div>'
        + '</div>'

        + '</div>'

        // Objetivo + complicação
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:16px;">'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">🎯 OBJECTIVE</div>'
        + '<div style="font-size:15px;color:#e8e0d0;line-height:1.6;">' + objective + '</div>'
        + '</div>'

        + '<div style="' + S + 'border-color:rgba(192,57,43,0.2);">'
        + '<div style="' + T + 'color:rgba(192,57,43,0.6);border-color:rgba(192,57,43,0.15);">⚠️ COMPLICATION</div>'
        + '<div style="font-size:15px;color:#e8e0d0;line-height:1.6;">' + complication + '</div>'
        + '</div>'

        + '</div>'

        // Urgência
        + '<div style="background:rgba(192,57,43,0.06);border:1px solid rgba(192,57,43,0.2);border-radius:4px;padding:16px;margin-bottom:16px;">'
        + '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:rgba(192,57,43,0.7);margin-bottom:8px;">⏳ WHY NOW</div>'
        + '<div style="font-size:15px;color:#e8e0d0;line-height:1.6;">' + urgency + '</div>'
        + '</div>'

        // Conexões + recompensa
        + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-bottom:16px;">'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">🔗 THREADS TO PULL</div>'
        + sideHooks.map((h, i) =>
            '<div style="' + ROW + (i === sideHooks.length-1 ? 'border:none;' : '') + 'display:flex;gap:10px;">'
            + '<span style="color:#c9a84c;font-family:Cinzel,serif;flex-shrink:0;">' + (i+1) + '.</span>'
            + '<span>' + h + '</span></div>'
        ).join('')
        + '</div>'

        + '<div style="' + S + '">'
        + '<div style="' + T + '">💰 REWARD</div>'
        + '<div style="display:flex;justify-content:space-between;align-items:center;' + ROW + '">'
        + '<span style="' + LBL + 'margin:0;">GOLD</span>'
        + '<span style="font-family:Cinzel,serif;font-size:18px;color:#c9a84c;">' + reward.gold + '</span>'
        + '</div>'
        + '<div style="' + ROW + 'border:none;">'
        + '<span style="' + LBL + '">BONUS</span>'
        + '<span style="font-size:14px;color:#e8e0d0;">' + rewardExtra + '</span>'
        + '</div>'
        + '</div>'

        + '</div>'

        // Botão
        + '<button onclick="generatePlotHook()" style="width:100%;background:none;border:1px solid rgba(201,168,76,0.25);border-radius:2px;padding:12px;color:#c9a84c;font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background=\'rgba(201,168,76,0.08)\'" onmouseout="this.style.background=\'none\'">🎲 GENERATE ANOTHER HOOK</button>';

    result.innerHTML = html;
}