// App variables
var app, landing, bgClr, wST, hST, xM = 0, yM = 0;


// Text style
var style;


// PIXI Graphics element ---- PART INTRO
var intro, title, ctrLines, lines;


// PIXI Graphics element | style ---- PART I
var p1, menu, ctrMenu, nav1;



// Random variable getting random length for generated lines
var maxH = 400, minH = 60;
function getRdmH(){
    return Math.random() * (maxH - minH) + minH;
}
// Random variable getting random weight for generated lines
var maxW = 3, minW = 1;
function getRdmW(){
    return Math.random() * (maxW - minW) + minW;
}

var dur = 1.5; // Common animation duration

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// MAIN FUNCTIONS

$(document).ready(function(){
    wST = $(window).width();
    hST = $(window).height();
    bgClr = 0x000000;

    console.log(hST, wST);


    initApp();
    // loadComplete();
    // switchBg();
})

function initApp(){

    app = new PIXI.Application({
        width: wST,
        height: hST,
        transparent: true,
        antialias: true,
        resolution: 1
    })

    // Ajoute le canvas
    $("body").append(app.view);

    // Stage creation
    landing = app.stage;

    // Elements creation
    drawElts();

    // Getting mouse X|Y position
    mEvent();

}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// ELEMENTS CREATION

function drawElts(){

    drawIntro();

    switchBg();
}


function drawIntro(){
    // -------------------------------------------------------------
    // Lines container
    intro = new PIXI.Container();
    // Centre la zone
	intro.x = 0;
    intro.y = 0;
    intro.height = hST;
    intro.width = wST;
    landing.addChild(intro);

    // -------------------------------------------------------------
    // Lines container
    ctrLines = new PIXI.Container();
    // Centre la zone
	ctrLines.x = -1;
    ctrLines.y = 0;
    ctrLines.z = -1;
    intro.addChild(ctrLines);

    // -------------------------------------------------------------
    // Title main font style
    style = new PIXI.TextStyle();
    style.fontSize = 300;
    style.fontFamily = "Big John";
    style.fontWeight = 100;
    style.align = 'center';
    style.fill = 0x000000;
    style.zIndex = 30;

    // -------------------------------------------------------------
    // Main title 'MERLIN'
    title = new PIXI.Text("MERLIN", style);
    landing.addChild(title);
    title.x = (wST / 2) - (title.width / 2);
    title.y = (hST / 2) - (title.height / 2);

    // -------------------------------------------------------------
    // Calls generate lines function
    generateLines();

}

function drawP1(){
    // -------------------------------------------------------------
    // Part I container
    p1 = new PIXI.Container();
    // Centre la zone
	p1.x = 0;
    p1.y = 0;
    p1.height = hST;
    p1.width = wST;
    landing.addChild(p1);

    // -------------------------------------------------------------
    // Menu font style
    style = new PIXI.TextStyle();
    style.fontSize = 50;
    style.fontFamily = "Roboto Light";
    style.fontWeight = 500;
    style.align = 'center';
    style.fill = 0x000000;
    style.zIndex = 30;

    // -------------------------------------------------------------
    // Menu container
    ctrMenu = new PIXI.Container();
    // Centre la zone
	ctrMenu.x = 0;
    ctrMenu.y = 0;
    ctrMenu.height = hST;
    ctrMenu.width = wST;
    p1.addChild(ctrMenu);
    ctrMenu.alpha = 0;

    nav1 = new PIXI.Text("lien 1", style);
    ctrMenu.addChild(nav1);
    nav1.x = (wST * 0.5) - (nav1.width * 0.5);
    nav1.y = hST * 0.2;


    // -------------------------------------------------------------
    // Menu TXT
    menu = new PIXI.Text("MENU", style);
    p1.addChild(menu);
    menu.x = (wST * 0.5) - (menu.width * 0.5);
    menu.y = hST * 0.2;
    menu.interactive = true;
    menu.click = function (e) {
        openMenu();
        console.log('menu ouvert');
        };

    
}


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// EVENT CREATION


// -------------------------------------------------------------
// Get mouse X and mouse Y on move
function mEvent() {
	$(document).mousemove(function(e) {
        xM = e.pageX;
        yM = e.pageY;
        // console.clear();
        // console.log(Xm, Ym);
    });
}

// -------------------------------------------------------------
// Get random color used to colorize random generated lines
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// -------------------------------------------------------------
// Generate lines on mouse move X
function generateLines(){
    $(document).mousemove(function(e) {
        // Pour chaque mouvement de souris
        for(var i = 0; i < 50; i++){
            // Créer un objet line
            line = new PIXI.Graphics();

            line.lineStyle(2, getRandomColor());
            line.moveTo(xM, yM);
            line.lineTo(xM, getRdmH());
            ctrLines.addChild(line);
            line.scale.y = 0;

            TweenMax.to(line.scale, 0.5, {y:hST*0.5, onUpdate:refreshLine});
        }

    });
}

// -------------------------------------------------------------
// Lines movement
function refreshLine(){
    TweenMax.to(line.scale, 3, {y:0, ease: Power3.easeOut});
}

// -------------------------------------------------------------
// When user is clicking > change background + remove lines
function switchBg() {
	$("body").click(function(e) {
		// Progressive opacity removal
		TweenMax.to(ctrLines, dur*2.5, {alpha: 0});
		// Progressive bg color change
        TweenMax.to('body', dur, {backgroundColor: "#FFFFFF", opacity: 1, ease:Power3.easeIn});
		// Removing container from stage after 3 sec
		setTimeout(function(){
			intro.removeChild(ctrLines);
        }, 3000);
        
    // Set body's height to 3 * window.height
    // $("body").css('height', "300vh");
    
    // Remove event
    $("body").off('click');

    
    drawP1();
    });
}


function openMenu(){
    TweenMax.to(ctrMenu, 0.3, {alpha: 1, ease:Power2.easeIn});
    TweenMax.to(menu, 0.2, {alpha: 0});
}

























