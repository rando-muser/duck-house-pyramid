/**
 *     assets.image`myImageName`
 *     assets.tilemap`myTilemapName`
 *     assets.tile`myTileName`
 *     assets.animation`myAnimationName`
 *     assets.song`mySongName`
 * 
 * https://arcade.makecode.com/reference
 * 
 * Game plan:
 * 1. Show intro sequence
 * 2. Dive into pile of stuff
 * 3. Profit (find people)
 * 
 * 1. interact w npc 
 * 2. items do more
 */
console.log('hi');

const img_personLeft = assets.image`myImage`;
const img_personRight = assets.image`myImage0`;
const img_personSit = assets.image`myImage14`;
const img_playerFloat = assets.image`myImage10`;
const img_playerStand = assets.image`myImage1`;
const img_playerRightWalk = assets.image`myImage11`;
const img_playerLeftWalk = assets.image`myImage12`;
const img_playerRightStand = assets.image`myImage20`;
const img_playerLeftStand = assets.image`myImage21`;
const img_playerPull = assets.image`myImage13`;
const img_playerDown = assets.image`myImage9`;
const img_background = assets.image`myImage2`;
const img_hook = assets.image`myImage3`;
const img_oxygen = assets.image`myImage7`;
const img_kayak = assets.image`kayak`;
const img_hat = assets.image`hat`;
const img_fishingrod = assets.image`fishing rod`;
const img_gloves = assets.image`gloves`;
const img_lifevest = assets.image`lifevest`;
const img_blank = assets.image`myImage4`;
const img_openingPlayer = assets.image`myImage5`;
const img_openingBackground = assets.image`myImage6`;
const img_destroyedBackground = assets.image`myImage19`;
const img_bubble1 = assets.image`myImage8`;
const img_insideBackground = assets.image`inside`;
const img_arrowDown = assets.image`arrowDown`;
const img_arrowLeft = assets.image`arrowLeft`;
const img_arrowRight = assets.image`arrowRight`;
const img_npc0 = assets.image`npc0`;
const img_npc1 = assets.image`npc1`;
const img_npc2 = assets.image`npc2`;
const img_npc3 = assets.image`npc3`;

const tile_enter = assets.tile`myTile6`;

const tilemap_homebase = assets.tilemap`level`;
const tilemap_blank = assets.tilemap`level2`;

//preserver, o2, hat, fishing rod, lifevest, kayak, gloves
const imgList_items = [img_hook, img_oxygen, img_hat, img_fishingrod, img_lifevest, img_kayak, img_gloves];
const imgList_npcs = [img_npc0, img_npc1, img_npc2, img_npc3];
const bubbleSprites = [img_bubble1];

const text_thanks = ["Thank you so much!", "I am extremely grateful.", "I don't know what to say... Thanks!", "FINALLY.", "FREEDOM!!", "...", "What's going on!?", "You're my savior!"];
const text_hint = ["This is some 'earthquake', i'll say!", "I saw something swimming through the tennis balls...", "So, like, why isn't there any glass around here?", "I'm going home.", "Why isn't the rest of the city damaged?", "It's just like earlier today...", "GET ME OUTTA HERE!!", "Nope. I'm moving.", "You're not that loner bandit guy, right?", "At least the pet store's out of business.", "I miss my dog. :(", "Have you seen my son!? It's his birthday."];
const text_item = ["Yay, another life preserver!", "Take a deep breath.",  "I love this hat!", "Maybe I can reach someone with this.", "To help people float to the surface!", "Like a waterslide!", "That's odd."]

const chance = [0.005, 0.005, 0.0003, 0.0001, 0.0001];
//------spawn:--person--item--

//setup variables
let personSprites = [sprites.create(img_blank)];
let itemSprites = [sprites.create(img_blank)];
let effectSprites = [sprites.create(img_blank)];
let npcSprites = [sprites.create(img_blank)];
let inventoryNames = ["Hooks"];
let itemAmounts = [3, 1];
let inventory = [2, 0];
let depth = 0;
let tutorial = -1;
let npcs = [0, 0, 0, 0]

personSprites[0].destroy();
itemSprites[0].destroy();
effectSprites[0].destroy();
npcSprites[0].destroy();
personSprites.pop();
itemSprites.pop();
effectSprites.pop();
npcSprites.pop();

let numberSaved = 0;
let direction = -1; //0 = right, 1 = down, 2 = left, 3 = up, -1 = not moving
let state = -1; //for opening
let usingHook = false;
let tutorialCheck = false;

//setup sprites
//player = player sprite, enemy = person, food = item, projectile = no kind
let bg = sprites.create(img_blank, SpriteKind.Projectile);
bg.z == -10000;
let hook = sprites.create(img_blank, SpriteKind.Projectile);

//setup text sprites
let title = textsprite.create("");
let subtitle = textsprite.create("");
let depthMeter = textsprite.create("");

//ME (the player)
let me = sprites.create(img_blank, SpriteKind.Player);

//----- OPENING -----
bg.setImage(img_openingBackground);
me.setImage(img_openingPlayer);
bg.setPosition(100, 60);
me.setPosition(0, 90);
for (let i = 0; i < 30; i++) {
    bg.x--;
    me.x++;
    pause(4*i);
}
controller.pauseUntilAnyButtonIsPressed();
color.FadeToWhite.startScreenEffect(200);
pause(200);
bg.setImage(img_destroyedBackground);
color.clearFadeEffect();
title.setText("Duck House: Pyramid");
title.setOutline(2, 15);
title.setMaxFontHeight(2);
title.setPosition(80, 20);
subtitle.setText("Press any button");
subtitle.setOutline(1, 2);
subtitle.setPosition(110, 115)
animation.runMovementAnimation(title, animation.animationPresets(animation.bobbing), 3000, true)
scene.cameraShake(8, 250)
pause(250);
scene.cameraShake(4, 250)
pause(250);
scene.cameraShake(2, 250)
pause(500);
controller.pauseUntilAnyButtonIsPressed();
color.FadeToBlack.startScreenEffect(500);
pause(500)
bg.setImage(img_blank);
title.setText("");
subtitle.setText("");

//setup scene
function changeStateTo(target: number) {
    if (target == 0) {
        depthMeter.setText("Depth: 0");
        depthMeter.setOutline(1, 6);
        depthMeter.setPosition(90, 5);
        clear(personSprites);
        clear(itemSprites);
        clear(npcSprites);
        state = 0;
        scene.setBackgroundImage(img_blank);
        bg.setImage(img_background);
        bg.setFlag(SpriteFlag.Ghost, true);
        bg.setPosition(80, 180);
        info.setLife(10 * 10);
        scene.setTileMapLevel(tilemap_blank);
        me.setImage(img_playerFloat);
        me.setPosition(80, 60); 
        controller.moveSprite(me, 0, 0);
        me.ay = 0;
        me.vy = 0;
        inventory[0] = 2;
        depth = 0;
    }
    else if (target == 1) {
        depthMeter.setText("Depth: Surface");
        depthMeter.setOutline(1, 6);
        depthMeter.setPosition(90, 5);
        bg.setImage(img_blank);
        clear(personSprites);
        clear(itemSprites);
        state = 1;
        scene.setBackgroundImage(img_insideBackground);
        info.setLife(1);
        scene.setTileMapLevel(tilemap_homebase);
        me.setImage(img_playerFloat);
        me.setPosition(100, 60); 
        controller.moveSprite(me, 50, 0);
        me.ay = 150;
        spawnNpcs();

        color.startFade(color.Black, color.originalPalette)
        pause(500);
    }
}

//Settings/save data
/* 
    to save:
    # people saved (score)
*/

if (blockSettings.exists("score") == false) {
    blockSettings.writeNumber("score", 0);
    blockSettings.writeNumber("tutorial", -1);
    blockSettings.writeNumberArray("npcs", [0, 0, 0, 0])
}
info.setScore(blockSettings.readNumber("score"));
tutorial = blockSettings.readNumber("tutorial");
npcs = blockSettings.readNumberArray("npcs");

//START GAME
if (tutorial == -1) {
    newGame(0);
}
else {
    changeStateTo(1);
}

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    direction = 1;
})

controller.down.onEvent(ControllerButtonEvent.Released, function () {
    direction = -1;
})

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    direction = 0;
    if (usingHook == false && state == 0) {
        if (inventory[0] > 0) {
            timer.background(function () {
                hookPerson(0);
                state = 0;
            })
        }
        else {
            me.say("I'm out!", 300);
            direction = -1;
        }
    }
})

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    direction = 2;
    if (usingHook == false && state == 0) {
        if (inventory[0] > 0) {
            timer.background(function () {
                hookPerson(2);
                state = 0;
            })
        }
        else {
            me.say("I'm out!", 300);
            direction = -1;
        }
    }
})

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    direction = 3;
    if (state == 1 && me.isHittingTile(CollisionDirection.Bottom)) {
        me.vy = -100;
    }
})

controller.up.onEvent(ControllerButtonEvent.Released, function () {
    direction = -1;
})

controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (state == 0) {
        saveData();
        changeStateTo(1);
    }
    else if (game.ask("Clear all saved data?")){
        blockSettings.clear();
        game.reset();
    }
})

scene.onOverlapTile(SpriteKind.Player, tile_enter, () => {
    if (state == 1) {
        changeStateTo(0);
    }
});

//ON GAME UPDATE

game.onUpdate(() => {
    if (state == 0) {
        if (usingHook) {
            me.setImage(img_playerPull);
        }
        else if (direction == 1) { //when pressing down
            me.setImage(img_playerDown);
            scroll(1);
            swimEffect(0.2);
            breathe(0.1);
            if (Math.random() < chance[0]) {
                spawnPerson();
            }
            else if (Math.random() < chance[1]) {
                spawnItem(-1);
            }
            else if (Math.random() < chance[2]) {
                me.sayText("That's a LOT of people!", 2000, true);
                for (let i = 0; i < randint(3, 7); i++) {
                    spawnPerson();
                }
            }
            else if (Math.random() < (chance[3]*(1+(depth/50)))) {
                timer.background( function () {
                    color.startFadeFromCurrent(color.Black, 500);
                    pause(500);
                    color.startFadeFromCurrent(color.originalPalette, 500);
                    pause(500);
                })
            }
            else if (Math.random() < (chance[4]*(1+(depth/50)))) {
                scene.cameraShake(4, 1000);
                me.sayText("ANOTHER SHAKE!!!", 1000, true);
            }
        }
        else if (direction == -1) { //not moving
            scroll(0.25);
            breathe(0.02);
            me.setImage(img_playerFloat);
        }
        else if (direction == 3) {
            breathe(0.05)
            scene.cameraShake(2, 50)
            me.setImage(img_playerFloat);
        }
    }
    else if (state == 1) {
        if (me.vy == 0 && me.vx == 0) {
            if (me.image == img_playerRightWalk || me.image == img_playerRightStand) {
                me.setImage(img_playerRightStand);
            }
            else if (me.image == img_playerLeftWalk || me.image == img_playerLeftStand) {
                me.setImage(img_playerLeftStand);
            }
            else {
                me.setImage(img_playerStand);
            }
        }
        else if (direction == 3 || (me.isHittingTile(CollisionDirection.Bottom) == false)) {
            me.setImage(img_playerFloat);
        }
        else if (direction == 0) {
            if (me.vx == 0) {
                me.setImage(img_playerRightStand);
            }
            else {
                me.setImage(img_playerRightWalk);
            }
        }
        else if (direction == 2) {
            if (me.vx == 0) {
                me.setImage(img_playerLeftStand)
            }
            else {
                me.setImage(img_playerLeftWalk);
            }
        }
    }
    else if (state == -2) {
        if (direction == 0) {
            if (me.vx == 0) {
                me.setImage(img_playerRightStand);
            }
            else {
                me.setImage(img_playerRightWalk);
            }
        }
        else if (direction == 2) {
            if (me.vx == 0) {
                me.setImage(img_playerLeftStand)
            }
            else {
                me.setImage(img_playerLeftWalk);
            }
        }
    }
    else if (state == -3) {
        if (tutorial == 1 || tutorial == 3) {
            let tempSprite = itemSprites[itemSprites.length - 1];
            if (tutorial == 3) {
                tempSprite = personSprites[personSprites.length - 1];
            }
            if (direction == 2 && tempSprite.x <= me.x && usingHook == false) {
                usingHook = true;
                
                timer.background(function() {
                    hookPerson(2);
                    state = -3;
                    tutorial++;
                    console.log("Grab complete. Tutorial: " + tutorial);
                })
            }
            else if (direction == 0 && tempSprite.x >= me.x && usingHook == false) {
                usingHook = true;

                timer.background(function () {
                    hookPerson(0);
                    state = -3;
                    tutorial++;
                    console.log("Grab complete. Tutorial: " + tutorial)
                })
            }
        }
        else if (direction == 1) { //when pressing down
            me.setImage(img_playerDown);
            scroll(1);
            swimEffect(0.2);
            breathe(0.1);
            if (Math.random() < chance[0] && tutorial == 2) {
                spawnPerson();
                console.log("tutorialCheck: " + tutorialCheck + " is now opposite.")
                tutorialCheck = true;
            }
            else if (Math.random() < chance[1]) {
                spawnItem(-1);
                if (tutorial == 0) {
                    tutorialCheck = true;
                }
            }
        }
        else if (direction == -1 || direction == 0 || direction == 2) { //not moving
            scroll(0.25);
            breathe(0.02);
            me.setImage(img_playerFloat);
        }
        else if (direction == 3) {
            breathe(0.05)
            scene.cameraShake(2, 50)
            me.setImage(img_playerFloat);
        }
    }
    else {
        console.logValue("state", -1);
    }
});

info.onLifeZero(function () {
    if (tutorial > 3) {
        changeStateTo(1);
        saveData();
    }
    else {
        me.sayText("It's hard to breathe in this stuff...", 2000, true);
        info.setLife(100);
    }
})

function scroll(speed: number) {
    for (let i = 0; i < sprites.allOfKind(SpriteKind.Enemy).length; i++) {
        let tempSprite = sprites.allOfKind(SpriteKind.Enemy)[i];
        tempSprite.y -= speed;
        if (tempSprite.y < -50) { //remove far away sprites
            tempSprite.destroy();
            removeAt(personSprites, i);
        }
    };
    for (let i = 0; i < sprites.allOfKind(SpriteKind.Food).length; i++) {
        let tempSprite = sprites.allOfKind(SpriteKind.Food)[i];
        tempSprite.y -= speed;
        if (tempSprite.y < -50) { //remove far away sprites
            tempSprite.destroy();
            removeAt(itemSprites, i);
        }
    }
    bg.y -= speed;
    if (bg.y < -60) {
        bg.y = 180;
    }
    depth+=speed/50;
    depthMeter.setText("Depth: " + Math.round(depth));
    if (depth < 30) {
        depthMeter.setOutline(1, 6)
    }
    else if (depth < 60) {
        depthMeter.setOutline(1, 5)
    }
    else if (depth < 90) {
        depthMeter.setOutline(1, 4)
    }
    else if (depth < 120) {
        depthMeter.setOutline(1, 3)
    }
    else {
        depthMeter.setOutline(1, 2)
    }
};

function breathe(speed: number) {
    if (Math.random() < speed) {
        info.changeLifeBy(-1);
    }
}

function spawnPerson() {
    personSprites.push(sprites.create(img_personLeft, SpriteKind.Enemy));
    let arrayEnd = personSprites.length - 1;
    let tempBoolean = true;
    for (let i = 0; i < personSprites.length; i++) {
        if (imgList_npcs.indexOf(personSprites[i].image) > -1) {
            tempBoolean = false;
            break;
        }
    }
    if (Math.random() < 0.5) {
        personSprites[arrayEnd].setPosition((Math.random() + 0.2) * 40, 180);
    }
    else {
        personSprites[arrayEnd].setPosition(160 - (Math.random() + 0.2) * 40, 180)
        personSprites[arrayEnd].setImage(img_personRight);
    }
    if (Math.random() < 0.25 && (npcs[0] == 0 || npcs[1] == 0 || npcs[2] == 0 || npcs[3] == 0) && tempBoolean) {
        console.log("NPC FOUND!");
        let i = 0;
        for (let j = 0; j < 4; j++) {
            if (npcs[j] == 0) {
                i = j;
                break;
            }
        }
        let tempSprite = personSprites[arrayEnd];
        tempSprite.setImage(imgList_npcs[i]);
    }
}

function spawnItem(id: number) {
    itemSprites.push(sprites.create(img_blank, SpriteKind.Food));
    let arrayEnd = itemSprites.length - 1;
    itemSprites[arrayEnd].setPosition(Math.random() * 160, 180)
    if (id > -1) {
        itemSprites[arrayEnd].setImage(imgList_items[id])
    }
    else {
        itemSprites[arrayEnd].setImage(randomEntry(imgList_items));
    }
    itemSprites[arrayEnd].setPosition(randint(0, 160), 180);
    console.log(itemSprites.length);
    itemSprites[arrayEnd].setFlag(SpriteFlag.GhostThroughWalls, true);
}

function savePerson(saved: Sprite) {
    state = -1;
    let i = imgList_npcs.indexOf(saved.image);
    if (i > -1) {
        npcs[i] = 1;
        blockSettings.writeNumberArray("npcs", npcs)
        if (i == 0) {
            saved.sayText("Oh thank you kind stranger!", 3000, true);
            pause(4000)
            saved.sayText("I work at the pet store, all of a sudden...", 3000, true);
            pause(4000)
            saved.sayText("...It's like the floor fell.", 3000, true);
            pause(4000)
            saved.sayText("I think I saw a dog around here, if you're not busy!", 3000, true);
            pause(4000)
            saved.sayText("I'll stick with you, for safety.", 3000, true);
            pause(4000)
        }
        else if (i == 1) {
            saved.sayText("D-:", 1000, true);
            pause(2000)
            saved.sayText("!!!!!", 1000, true);
            pause(2000)
            saved.sayText("BARK! WOOF! BOOF!", 3000, true);
            pause(4000)
            saved.sayText(":-3", 1000, true);
            pause(2000)
        }
        else if (i == 2) {
            saved.sayText("IDONTNEEDHELP!", 3000, true);
            pause(4000)
            saved.sayText("I'll find my own way, thank you very much.", 3000, true);
            pause(4000)
            saved.sayText("Actually, no thanks. You get none.", 3000, true);
            pause(4000)
            saved.sayText("'cause all of this is YOUR DOING!!!", 3000, true);
            pause(4000)
            saved.sayText("I'm keeping my eye on you...", 3000, true);
            pause(4000)
        }
        else if (i == 3) {
            saved.sayText("woOOoo! Be afraid!", 3000, true);
            pause(4000)
            saved.sayText("Hehe, thanks, its scary in here.", 3000, true);
            pause(4000)
            saved.sayText("Man, what are the odds of this happening twice?", 3000, true);
            pause(4000)
            saved.sayText("Luckiest birthday ever.", 3000, true);
            pause(4000)
            saved.sayText("Now take me to my home planet!", 3000, true);
            pause(4000)
        }
    }
    else {
        saved.sayText(randomEntry(text_thanks), 3000, true);
        pause(4000);
        saved.sayText(randomEntry(text_hint), 3000, true);
        pause(4000);
    }
    let arrayPosition = personSprites.indexOf(saved);
    removeAt(personSprites, arrayPosition);
    for (let i = 0; i < 120; i++) {
        saved.y--;
        pause(1)
    }
    saved.destroy();
    numberSaved++;
    info.changeScoreBy(1);
    state = 0;
}

function getItem(item: Sprite) {
    //preserver, o2, hat, fishing rod, lifevest, kayak, gloves
    let arrayPosition = itemSprites.indexOf(item);
    item.destroy();
    removeAt(itemSprites, arrayPosition);
    let tempNumber = imgList_items.indexOf(item.image);
    if (tempNumber == 0 || tempNumber == 3 || tempNumber == 4) {
        inventory[0]++;
    }
    else {
        if (tempNumber == 1) {
            info.changeLifeBy(100)
        }
        else if (tempNumber == 2) {
            info.changeLifeBy(20);
        }
        else if (tempNumber == 5) {
            me.sayText("AHH!!", 500, true);
            for (let i = 0; i < 400; i++) {
                scroll(1);
                pause(5);
            }
        }
        else if (tempNumber == 6) {
            info.changeLifeBy(-20);
        }
    }

    me.sayText(text_item[tempNumber], 2000, true);
}

function hookPerson(dir: number) {
    state = -1;
    usingHook = true;
    hook.setImage(img_hook);
    hook.setPosition(me.x, me.y)
    pause(200);
    let pointing = -1 * dir + 1; //right = 0 * -1 = 0 + 1 = 1; left = 2 * -1 = -2 + 1 = -1;
    console.log(pointing);
    let target = me; //shouldn't stay as me
    let found = false;
    let distance = 0;
    let startx = me.x;
    for (let i = 0; i < 100; i++) {
        hook.x = startx + (i*pointing);
        console.logValue("HookX", hook.x);
        for (let j = 0; j < sprites.allOfKind(SpriteKind.Enemy).length; j++) {
            let forSprite = sprites.allOfKind(SpriteKind.Enemy)[j];
            if (hook.overlapsWith(forSprite)) {
                target = forSprite;
                found = true;
            }
        }
        for (let j = 0; j < sprites.allOfKind(SpriteKind.Food).length; j++) {
            let forSprite = sprites.allOfKind(SpriteKind.Food)[j];
            if (hook.overlapsWith(forSprite)) {
                target = forSprite;
                found = true;
            }
        }
        if (found) {
            distance = i;
            break;
        }
        pause(10);
    }
    if (found == false) {
        if (tutorial > 3) {
            hook.setImage(img_blank);
            usingHook = false;
            direction = -1;
            inventory[0]--;
            me.sayText("I lost it!", 500)
            return;
        }
        else {
            if (tutorial == 1) {
                target = itemSprites[itemSprites.length - 1];
                hook.x = target.x;
            }
            else if (tutorial == 3) {
                target = personSprites[personSprites.length - 1];
                hook.x = target.x;
            }
        }
    }
    
    for (let i = 0; i < distance; i++) {
        hook.x -= pointing;
        target.x -= pointing;
        pause(10);
    }

    hook.setImage(img_blank);
    usingHook = false;
    direction = -1;

    if (target.kind() == SpriteKind.Enemy) {
        savePerson(target);
    }
    else if (target.kind() == SpriteKind.Food) {
        getItem(target);
    }
}

function dialogue(purpose: number) {
    return (text_thanks[Math.round(Math.random() * (text_thanks.length - 1))]);
    return ("ERROR!");
}

function removeAt(array: any[], pos: number) {
    let tempArray = [];
    for (let i = 0; i < pos; i++) {
        tempArray.push(array[i]);
    }
    for (let i = pos + 1; i < array.length; i++) {
        tempArray.push(array[i]);
    }
    if (tempArray.length != array.length - 1) {
        console.log("ERROR in the 'RemoveAt' function: Incorrect length output")
    }
    else {
    }
    return (tempArray);
}

function randomEntry(array: any[]) {
    return (array[Math.round(Math.random() * (array.length - 1))]);
}

function clear(array: any[]) {
    for (let i = 0; i < array.length; i++) {
        array[i].destroy()
    }
    array = [];
}

function saveData() {
    blockSettings.writeNumber("score", info.score());
    blockSettings.writeNumber("tutorial", tutorial);
    blockSettings.writeNumberArray("npcs", npcs);
}

game.setGameOverMessage(true, "I found everyone!");

let swimIndex = 0;

function swimEffect(intensity: number) {
    if (Math.random() < intensity) {
        effectSprites.push(sprites.create(bubbleSprites[Math.round(Math.random()*(bubbleSprites.length-1))], SpriteKind.Projectile));
        let tempSprite = effectSprites[effectSprites.length - 1];
        tempSprite.setPosition(me.x, me.y + 20);
        tempSprite.vy = (Math.random() - 0) * -100
        if (Math.random() < 0.5) {
            tempSprite.vx = (Math.random() + 1) * -20;
            tempSprite.x -= 6;
        }
        else {
            tempSprite.vx = (Math.random() + 1) * 20;
            tempSprite.x += 6;
        }
        /*let tempImage = tempSprite.image;
        tempImage.replace(3, swimIndex);
        tempSprite.setImage(tempImage);*/
        swimIndex++;
        if (swimIndex > 15) {
            console.log("loop");
            swimIndex = 1;
        }
        
        timer.after(500, () => {
            removeAt(effectSprites, effectSprites.indexOf(tempSprite))
            tempSprite.destroy();
        })
    }
}

function spawnNpcs () {
    for (let i = 0; i < 4; i++) {
        if (npcs[i] == 1) {
            npcSprites.push(sprites.create(img_blank, SpriteKind.Projectile));
            let tempSprite = npcSprites[npcSprites.length - 1];
            tempSprite.setImage(imgList_npcs[i]);
            tempSprite.setFlag(SpriteFlag.GhostThroughWalls, true);
            tiles.placeOnTile(tempSprite, tiles.getTileLocation(2+i, 6))
            tempSprite.y-=13;
        }
    }
    if (npcs[0] == 1 && npcs[1] == 1 && npcs[2] == 1 && npcs[3] == 1) {
        state = -1;
        timer.after(2000, function() {
            game.gameOver(true);
        })
    }
}

function newGame (level: number) {
    let arrow = sprites.create(img_blank, SpriteKind.Projectile);
    if (level == 0) {
        changeStateTo(1);
        pause(200);
        me.setImage(img_playerStand);
        state = -1;
        controller.moveSprite(me, 0, 0);
        pause(1000);
        me.setImage(img_playerFloat);
        me.vy = -100;
        me.sayText("HELLOOO!?", 1000);
        pause(1300);
        me.setImage(img_playerStand);
        pause(2000);
        me.setImage(img_playerPull);
        me.sayText("I'm looking for survivors of the collapse!", 3000, true);
        pause(4000);
        me.setImage(img_playerStand);
        pause(750);
        me.setImage(img_playerRightStand);
        pause(750);
        me.setImage(img_playerStand);
        pause(750);
        me.setImage(img_playerLeftStand);
        pause(750);
        me.setImage(img_playerStand);
        pause(750);
        me.sayText("Silence...", 2000, true);
        pause(2500);
        me.setImage(img_playerRightWalk);
        me.vx = 50;
        pause(500);
        me.vx = 0;
        me.setImage(img_playerRightStand);
        pause(500);
        me.sayText("They must be deeper.", 2000, true);
        pause(2500);
        state = -2;
        controller.moveSprite(me, 50, 0)
        arrow.setImage(img_arrowDown);
        arrow.setFlag(SpriteFlag.Ghost, true);
        arrow.setPosition(143, 80);
        animation.runMovementAnimation(arrow, animation.animationPresets(animation.bobbing), 2000, true)
        
        timer.background(function() {
            pauseUntil(() => me.tileKindAt(TileDirection.Bottom, tile_enter))
            arrow.setImage(img_blank);
            animation.stopAnimation(animation.AnimationTypes.All, arrow);
            changeStateTo(0);
            state = -1;
            pause(1000);
            me.setImage(img_playerDown);
            me.sayText("Its just sports equipment all the way down...", 3000, true);
            pause(4000);
            me.setImage(img_playerPull);
            me.sayText("...but the pressure is so intense...", 3000, true);
            pause(4000);
            me.setImage(img_playerFloat);
            me.sayText("...I better keep an eye on my health.", 3000, true);
            pause(4000);
            state = -3;
            tutorial = 0;
            blockSettings.writeNumber("tutorial", 0);
            arrow.setImage(img_arrowDown);
            animation.runMovementAnimation(arrow, animation.animationPresets(animation.bobbing), 2000, true)
            arrow.setPosition(80, 100);

            timer.background(function() {
                pauseUntil(() => controller.down.isPressed())
                arrow.setImage(img_blank);
                animation.stopAnimation(animation.AnimationTypes.All, arrow);

                timer.background(function() {
                    pauseUntil(() => tutorialCheck);
                    tutorialCheck = false;
                    state = -1;
                    let tempSprite = itemSprites[itemSprites.length - 1];
                    for (let i = 0; i < 200; i++) {
                        scroll(1);
                        pause(25);
                        if (tempSprite.y < (me.y)) {
                            break;
                        }
                    }
                    me.setImage(img_playerPull);
                    me.sayText("An item!", 2000, true);
                    pause(3000);
                    me.setImage(img_playerDown);
                    me.sayText("I should grab it with my life preserver.", 3000, true);
                    pause(4000);
                    me.setImage(img_playerFloat);
                    me.sayText("Maybe it can help me find people?", 3000, true);
                    pause(4000);
                    if (itemSprites[itemSprites.length - 1].x <= me.x) {
                        arrow.setImage(img_arrowLeft);
                        arrow.setPosition(20, 60);
                    }
                    else {
                        arrow.setImage(img_arrowRight);
                        arrow.setPosition(140, 60);
                    }
                    animation.runMovementAnimation(arrow, animation.animationPresets(animation.bobbing), 2000, true);
                    state = -3;
                    tutorial = 1;
                    console.log("Waiting for item grab.");
                    blockSettings.writeNumber("tutorial", 1);
                    
                    timer.background(function() {
                        pauseUntil(() => (controller.left.isPressed() || controller.right.isPressed()))
                        console.log("Item grabbed.");

                        arrow.setImage(img_blank);
                        animation.stopAnimation(animation.AnimationTypes.All, arrow);

                        timer.background(function () {

                            pauseUntil(() => tutorialCheck);
                            console.log("Person found.");

                            state = -1;
                            let tempSprite = personSprites[personSprites.length - 1];
                            for (let i = 0; i < 200; i++) {
                                scroll(1);
                                pause(25);
                                if (tempSprite.y < (me.y)) {
                                    break;
                                }
                            }
                            me.setImage(img_playerPull);
                            me.sayText("A PERSON!!", 2000, true);
                            pause(3000);
                            me.setImage(img_playerFloat);
                            tempSprite.sayText("HELP ME PLEASE!!", 2000, true);
                            pause(3000);
                            me.setImage(img_playerDown);
                            me.sayText("Quickly! The life preserver!!", 3000, true);
                            pause(4000);
                            if (tempSprite.x <= me.x) {
                                arrow.setImage(img_arrowLeft);
                                arrow.setPosition(20, 60);
                            }
                            else {
                                arrow.setImage(img_arrowRight);
                                arrow.setPosition(140, 60);
                            }
                            animation.runMovementAnimation(arrow, animation.animationPresets(animation.bobbing), 2000, true);
                            state = -3;
                            tutorial = 3;
                            blockSettings.writeNumber("tutorial", 3);

                            timer.background(function () {
                                pauseUntil(() => tutorial == 4)
                                blockSettings.writeNumber("tutorial", 4);
                                tutorial = 4;
                                console.log("tutorial over!");
                                state = 0;
                                arrow.setImage(img_blank);
                                animation.stopAnimation(animation.AnimationTypes.All, arrow);
                                game.splash("Press Menu to resurface.", "Is it really safe here?")
                            })
                        })
                    })
                })
            })
        })
    }
}