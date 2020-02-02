var app, stage, hST, wST;

var posX, dSprite, dFilter, bg, vx, vy, container, containerTxt;

let title, subtitle, ext;

$(document).ready(function(){
    wST = $(window).width();
    hST = $(window).height();

    initApp();

    console.log(wST, hST);

});


function initApp(){
    app = new PIXI.Application({
        width: wST,
        height: hST,
        backgroundColor: 0x000000,
        antialias: true
    });
    document.body.appendChild(app.view);
    app.stage.interactive = true;

    container = new PIXI.Container();
    app.stage.addChild(container);

    containerTxt = new PIXI.Container();
    app.stage.addChild(containerTxt);

    loadTexture();
}


function loadTexture(){

    const loader = PIXI.Loader.shared;
    loader.add('bg', 'assets/background.jpg')
            .add('title', 'assets/title.png')
            .add('subtitle', 'assets/subtitle.png')
            .load(setup);

}

function setup(){
    posX = app.renderer.width / 2;


    dSprite = new PIXI.Sprite(PIXI.loader.resources.bg.texture);
    dFilter = new PIXI.filters.DisplacementFilter(dSprite);   
    dSprite.anchor.set(0.5);
    dSprite.x = app.renderer.width / 2;
    dSprite.y = app.renderer.height / 2;
    vx = dSprite.x;
    vy = dSprite.y;
    app.stage.addChild(dSprite)



    dFilter.scale.x = 0;
    dFilter.scale.y = 0;
    bg = new PIXI.Sprite(PIXI.loader.resources.bg.texture);
    bg.width = $(window).width();
    bg.height = $(window).height();
    container.filters = [dFilter];
    container.addChild(bg);





    let style = new PIXI.TextStyle({
        fontFamily: 'Big John',
        fontSize: 150,
        align: 'center',
        letterSpacing: 70,
        fill: 0x7199ae
    });

    let style2 = new PIXI.TextStyle({
        fontFamily: 'Big John',
        fontSize: 150,
        align: 'center',
        letterSpacing: 100,
        fill: 0xFFFFF
    });

    let masked = new PIXI.Sprite(PIXI.loader.resources.bg.texture);
    masked.width = $(window).width();
    masked.height = $(window).height();
    container.addChild(masked);

    title = new PIXI.Sprite(PIXI.loader.resources.title.texture);
    title.scale.x = 0.2;
    title.scale.y = 0.2;
    title.x = wST * 0.5 - (title.width * 0.5);
    title.y = hST * 0.3 - (title.height * 0.5);
    container.addChild(title);


    subtitle = new PIXI.Sprite(PIXI.loader.resources.subtitle.texture);
    subtitle.scale.x = 0.2;
    subtitle.scale.y = 0.2;
    subtitle.x = wST * 0.5 - (subtitle.width * 0.5);
    subtitle.y = hST * 0.7 - (subtitle.height * 0.5);
    container.addChild(subtitle);

    mQueries();

    app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove);

    loop();

}

function onPointerMove(eventData) {
    posX = eventData.data.global.x;
  }


  function loop() {
    requestAnimationFrame(loop);
    vx += (posX - dSprite.x) * 0.045;
    dSprite.x = vx;
    var disp = Math.floor(posX - dSprite.x);
    if (disp < 0) disp = -disp;
    var fs = map(disp, 0, 500, 0, 120);
    disp = map(disp, 0, 500, 0.1, 0.6);
    dSprite.scale.x = disp;
    dFilter.scale.x = fs;
  }

  map = function(n, start1, stop1, start2, stop2) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
  };



//   MEDIA QUERIES TITLE
function mQueries(){
    if (wST > 580 && wST <= 790){
        title.scale.x = 0.15;
        title.scale.y = 0.15;
        title.x = wST * 0.5 - (title.width * 0.5);
        title.y = hST * 0.3 - (title.height * 0.5);
        subtitle.scale.x = 0.15;
        subtitle.scale.y = 0.15;
        subtitle.x = wST * 0.5 - (subtitle.width * 0.5);
        subtitle.y = hST * 0.7 - (subtitle.height * 0.5);
    } else if(wST > 410 && wST <= 580){
        title.scale.x = 0.1;
        title.scale.y = 0.1;
        title.x = wST * 0.5 - (title.width * 0.5);
        title.y = hST * 0.3 - (title.height * 0.5);
        subtitle.scale.x = 0.1;
        subtitle.scale.y = 0.1;
        subtitle.x = wST * 0.5 - (subtitle.width * 0.5);
        subtitle.y = hST * 0.7 - (subtitle.height * 0.5); 
    } else if(wST <= 410){
        title.scale.x = 0.08;
        title.scale.y = 0.08;
        title.x = wST * 0.5 - (title.width * 0.5);
        title.y = hST * 0.3 - (title.height * 0.5);
        subtitle.scale.x = 0.08;
        subtitle.scale.y = 0.08;
        subtitle.x = wST * 0.5 - (subtitle.width * 0.5);
        subtitle.y = hST * 0.7 - (subtitle.height * 0.5);
    }
}





















