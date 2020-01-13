// /////////////////////////////////////////////////
// VARIABLES

// Store scene dimensions
let wST = $(document.body).width();
let hST = $(document.body).height()
// Store application
let app;
// Circles containers
let ctrC1, ctrC2, ctrC3, ctrC4;
let ctrElevation;

// Background
// var bg;


// Mouse X ratio
var rX = 0.0;

// Mountain points coord
var tElevations = [
	[
		{x:-82, y:0},
		{x:-70, y:-10},
		{x:-52, y:-10},
		{x:-38, y:-23},
		{x:-20, y:-20},
		{x:-15, y:-20},
		{x:0, y:-30},
		{x:16, y:-30},
		{x:16, y:-30},
		{x:27, y:-24},
		{x:42, y:-24},
		{x:62, y:-10}
	],
	[
		{x:-82, y:0},
		{x:-75, y:7},
		{x:-67, y:7},
		{x:-40, y:-6},
		{x:-15, y:-6},
		{x:-9, y:-10},
		{x:-9, y:-10},
		{x:4, y:0},
		{x:20, y:0},
		{x:35, y:-8},
		{x:48, y:-5},
		{x:66, y:-12},
		{x:80, y:0}
	]
];
// Mountain ratio
var rElevation = {value:0};


// Initialize the app
initApp();

function initApp(){
	// Defines application parameters
	app = new PIXI.Application({
		width:wST,
		height:hST,
		backgroundColor:0x333333,
		antialias:true
	});
	// Add canvas tag to DOM
	document.body.appendChild(app.view);
	
	// Load textures
	// preloadTextures();
}

function preloadTextures(x, y, w, h) {
	// Loads actives elements
	var loader = PIXI.Loader.shared;
	// Add content
	loader
		.add("i1", "assets/scene-3-bg.jpg")
		.add("i2", "assets/scene-5-bg.jpg")
	// Loads texture content
	loader.load((loader, resources) => {
		console.log("TEXTURES Chargées");
		console.log(resources);
		
		// Display background image
		// displayImageBg();
		
		// Mountain container
		ctrElevation = new PIXI.Graphics();
		ctrElevation.x = wST * 0.5;
		ctrElevation.y = hST * 0.6;
		app.stage.addChild(ctrElevation);
		
		// Mountain anim
		TweenMax.to(rElevation, 3.7, {value:1.0, delay:0.4, ease:Back.easeOut.config(5), onUpdate:function() {
			// console.log(rElevation.value);

			// Draws PIXI Graphics
			drawElevations();
		}});
		
		
		// Circle dash creation
		ctrC1 = createCircle(60, 142, 10);
		ctrC2 = createCircle(32, 252, 20);
		ctrC3 = createDashCircle(180, 0.5, 222);
		
		// Initialization appearance animation
		ctrC1.scale.x = ctrC1.scale.y = 0;
		ctrC2.scale.x = ctrC2.scale.y = 0;
		ctrC3.scale.x = ctrC3.scale.y = 0;
		// Launch Tween animation
		TweenMax.to(ctrC1.scale, 1.4, {x:1, y:1, ease:Back.easeOut});
		TweenMax.to(ctrC2.scale, 1.2, {x:1, y:1, ease:Back.easeOut, delay:0.8});
		TweenMax.to(ctrC3.scale, 1.3, {x:1, y:1, ease:Back.easeOut.config(2), delay:0.4});
		
		// Launch game loop animation
		app.ticker.add(delta => {
			gameLoop();
		});
		
		$(window).on("mousemove", onMoveMouse);
		$(window).resize(function() {
			wST = $(document.body).width();
			hST = $(document.body).height()
			// console.log(bg.texture);
			
			app.renderer.width = wST;
			app.renderer.height = hST;
			
			var wSrc = bg.texture.orig.width;
			var hSrc = bg.texture.orig.height;
			var ratioScale = Math.max(wST / wSrc, hST / hSrc);
			bg.scale.x = bg.scale.y = ratioScale; 
			bg.x = (wST - bg.width) * 0.5;
			bg.y = (hST - bg.height) * 0.5;
		})
	});
}


function displayImageBg() {
	// Display background image 2
	bg = new PIXI.Sprite(PIXI.Texture.from("i2"));
	
	var ratioScale = Math.max(wST / bg.width, hST / bg.height);
	bg.scale.x = bg.scale.y = ratioScale; 
	bg.x = (wST - bg.width) * 0.5;
	bg.y = (hST - bg.height) * 0.5;
	bg.alpha = 0.4;
	app.stage.addChild(bg);
}


function createCircle(nbTirets, rayonInterieur, longueur) {
	// Temporary container returned at the end of the function
	var ctr = new PIXI.Container();
	// Container coords
	ctr.x = wST * 0.5;
	ctr.y = hST * 0.6;
	// Container added to scene
	app.stage.addChild(ctr);
	
	// Dash drawing
	var angle = Math.PI * 2 / nbTirets;
	var g = new PIXI.Graphics();
	// Dash line style
	g.lineStyle(1, 0xFFFFFF);
	
	for(var i = 0 ; i < nbTirets ; i++){
		var angleTemp = angle * i;
		g.moveTo(Math.cos(angleTemp) * rayonInterieur, Math.sin(angleTemp) * rayonInterieur);
		g.lineTo(Math.cos(angleTemp) * (rayonInterieur + longueur), Math.sin(angleTemp) * (rayonInterieur + longueur));
	}
	ctr.addChild(g);
	
	// Return container
	return ctr;
}

function createDashCircle(nbTirets, ratioTiret, rayon) {
	var ctr = new PIXI.Container();
	ctr.x = wST * 0.5;
	ctr.y = hST * 0.6;
	app.stage.addChild(ctr);
	
	// Dash creation
	var angle = Math.PI * 2 / nbTirets;
	
	var g = new PIXI.Graphics();
	// Dash linestyle
	g.lineStyle(1, 0xFFFFFF);
	
	for(var i = 0 ; i < nbTirets ; i++){
		var angleStart = angle * i;
		var angleEnd = angle * ratioTiret;
		g.moveTo(Math.cos(angleStart) * rayon, Math.sin(angleStart) * rayon);
		g.lineTo(Math.cos(angleStart + angleEnd) * rayon, Math.sin(angleStart + angleEnd) * rayon);
	}
	ctr.addChild(g);
	return ctr;
}


function drawElevations() {
	ctrElevation.clear();
	
	var r = rElevation.value;
	
	for(var i = 0, subE ; i < tElevations.length ; i++){
		ctrElevation.lineStyle(1, 0xFFFFFF, (i+1) / 2);
		
		subE = tElevations[i];
		// Start drawing
		ctrElevation.moveTo(subE[0].x, subE[0].y * r);
		for(var k = 1 ; k < subE.length ; k++){
			ctrElevation.lineTo(subE[k].x, subE[k].y * r);
		}
		
		// End draws from each side
		if(i === 1) {
			ctrElevation.moveTo(-wST * 0.5, 0);
			ctrElevation.lineTo(subE[0].x, subE[0].y * r);
			
			ctrElevation.moveTo(subE[k-1].x, subE[k-1].y * r);
			ctrElevation.lineTo(wST * 0.5, 0);
		}
	}
}

function onMoveMouse(e){
	rX = e.clientX / wST;
}


function gameLoop() {
	ctrC1.rotation += 0.003;
	ctrC2.rotation -= 0.001;
	ctrC2.rotation += 0.0008;
}



