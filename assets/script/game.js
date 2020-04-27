let eleID = id => document.getElementById(id);
let eleCLS = cls => document.getElementsByClassName(cls);
let crtEle = () => document.createElement('div');
let set_state = (elem, styles) => Object.assign(elem.style, styles);
const MOVE = 200;
let Score = 0;
let flag = 0;
const plr = eleID('plyr');
const ground = eleID('lvl');
const score = eleID('score');

const firesound = new sound('./assets/sounds/fire.mp3');
const hitsound = new sound('./assets/sounds/hit.mp3');

document.onkeypress = e => {

    let moveRight, moveLeft, moveTop, moveBottom;

    if (e.key == 'D' || e.key == 'd') {
        moveRight = canMoveRight(plr.offsetLeft + MOVE);
        set_state(plr, { left: `${moveRight}px` });
    }
    if (e.key == 'a' || e.key == 'A') {
        moveLeft = canMoveLeft(plr.offsetLeft - MOVE);
        set_state(plr, { left: `${moveLeft}px` });
    }
    if (e.key == 'w' || e.key == 'W') {
        moveTop = canMoveTop(plr.offsetTop - MOVE);
        set_state(plr, { top: `${moveTop}px` });
    }
    if (e.key == 's' || e.key == 'S') {
        moveBottom = canMoveBottom(plr.offsetTop + MOVE);
        set_state(plr, { top: `${moveBottom}px` });
    }
}

document.onclick = e => {
    let dest = { left: e.pageX, top: e.pageY };
    fireBlet(dest);
}

function genEnemy() {

    let ene = crtEle();
    ene.classList.add('enem');

    let init = {
        PosX: Math.floor(Math.random() * (window.innerWidth - ene.offsetWidth)),
        PosY: Math.floor(Math.random() * (window.innerHeight - ene.offsetHeight))
    };

    if (canGen(init)) {
        init.PosX = 0;
        init.PosY = 0;
    }

    ground.appendChild(ene);

    set_state(ene, { left: `${init.PosX}px`, top: `${init.PosY}px` });

    function follow() {
        let XDIF = plr.offsetLeft - ene.offsetLeft;
        let YDIF = plr.offsetTop - ene.offsetTop;

        set_state(ene, { left: `${ene.offsetLeft + XDIF}px`, top: `${ene.offsetTop + YDIF}px` });
    }

    function collitionCHK() {
        if (hasIntersect(ene, plr)) {
            plr.remove();
            let gameover = crtEle('div');
            gameover.innerHTML = `<h3>Game Over<br>Refresh to start again<br>
                                    Score:${Score}</h3>`;
            gameover.classList.add('gameover');
            flag = 1;
            ground.appendChild(gameover);
            clearInterval(enemup);
            clearInterval(collup);
        }
    }
    let collup =setInterval(() => {
        follow();
        collitionCHK();
    }, 1);

}

function fireBlet(dest) {
    let blt = crtEle();
    let initXPOS = plr.offsetLeft;
    let initYPOS = plr.offsetTop;
    blt.classList.add('blt');
    ground.appendChild(blt);
    firesound.play();
    set_state(blt, { top: `${initYPOS}px`, left: `${initXPOS}px` });

    setTimeout(() => {
        set_state(blt, { top: `${dest.top}px`, left: `${dest.left}px` });
    }, 1)

    setTimeout(() => blt.remove(), 1000);

    let ene = eleCLS('enem');

    function collitionCHK() {
        var i;

        for (i = 0; i < ene.length; i++) {
            if (hasIntersect(ene[i], blt)) {
                ene[i].remove();
                blt.remove();
                hitsound.play();
                if (!flag)
                    Score++;
            }
        }
    }
    setInterval(() => {
        collitionCHK();
    }, 1);
}
function hasIntersect(ele1, ele2) {
    return ele1.offsetLeft <= ele2.offsetLeft + ele2.offsetWidth / 2 &&
        ele1.offsetLeft + ele1.offsetWidth >= ele2.offsetLeft + ele2.offsetWidth / 2 &&
        ele1.offsetTop <= ele2.offsetTop + ele2.offsetHeight / 2 &&
        ele1.offsetTop + ele1.offsetHeight >= ele2.offsetTop + ele2.offsetHeight / 2;
}

function canGen(init) {
    return (init.PosX > plr.offsetLeft - plr.offsetWidth &&
        init.PosX <= plr.offsetLeft + plr.offsetWidth * 2) &&
        (init.PosY > plr.offsetTop - plr.offsetHeight &&
            init.PosY <= plr.offsetTop + plr.offsetHeight)
}
function canMoveLeft(val) {
    if (val < 0)
        return 0;
    else return val;
}
function canMoveRight(val) {
    if (val > window.innerWidth - plr.offsetWidth)
        return window.innerWidth - plr.offsetWidth;
    else return val;
}
function canMoveTop(val) {
    if (val < 0)
        return 0;
    else return val;
}
function canMoveBottom(val) {
    if (val > window.innerHeight - plr.offsetHeight)
        return window.innerHeight - plr.offsetHeight;
    else return val;
}

let enemup = setInterval(() => {
    genEnemy();
}, 1000);

    

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}
