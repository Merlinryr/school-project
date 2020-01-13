var wST, hST, xM = 0;
var app, stage;
var ctr1, ctr2, ctr3, g1, g2, g3, p1, p2, p3, ratioScr;
var rI = 0.0;
var ratioInertie = 0.0;

var db;
var tKeyFrames = [
	{x:0, y:0, s:0},
	{x:800, y:0, s:0.5},
	{x:800, y:150, s:0.75},
	{x:1200, y:150, s:0.99},
]

var tParalax_1 = [
	{
		type:"rect",
		x:0, y:0, w:500, h:250,
		fillColor:{color:0xFF0000, alpha:1.0},
		paralax:[
			{
				prop:"x",
				keyFrames:[
					{ratio:0.0, value:0},
					{ratio:0.5, value:200},
					{ratio:0.75, value:200},
					{ratio:0.85, value:400},
				]
			},
			{
				prop:"y",
				keyFrames:[
					{ratio:0.0, value:0},
					{ratio:0.5, value:0},
					{ratio:0.75, value:200}
				]
			},
			{
				prop:"rotation",
				keyFrames:[
					{ratio:0.85, value:0},
					{ratio:0.9, value:Math.PI}
				]
			},
			{
				prop:"alpha",
				keyFrames:[
					{ratio:0.9, value:1.0},
					{ratio:0.95, value:0.0}
				]
			}
		]
	}
]
var tParalax_2 = [
	{
		type:"rect",
		x:500, y:250, w:500, h:250,
		fillColor:{color:0x00FF00, alpha:1.0},
		lineStyle:{width:5, color:0x00CCFF, alpha:1.0},
	}
]
var plx1, plx2;



/*
// Afficher 0.99 dans la console
console.log(tKeyFrames[3].s)

// Faites une boucle pour parcourir tous les éléments du tableau.
for(var i = 0 ; i < tKeyFrames.length ; i++) {
	console.log("Valeur i :", i);
	// Au sein de la boucle
	// Affichez les valeurs des clés x
	console.log(tKeyFrames[i].x);
	// Affichez les valeurs des clés y si elles sont supérieures à 0
	if(tKeyFrames[i].y > 0) {
		console.log(tKeyFrames[i].y);
	}
}
*/

$(document).ready(function() {
    // Stocke les dimensions de la scène
    wST = $(document.body).width();
    hST = $(document.body).height();
    console.log("Stage Size :", wST, hST);
	
	// Référence le debug
	db = $(".db");
	
	// Initialise l'application
    initApp(wST, hST, 0xFFFFFF);
})

function initApp(w, h, bg =  0x1099bb) {
    // Création de l'application PIXI
    app = new PIXI.Application({ width: w, height: h, backgroundColor: bg, resolution:1 , antialias:true});
    // Ajout du noeud canvas associé au DOM
    $(".ctr-canvas").append(app.view);
    
    // Référence le stage
    stage = app.stage;
	
	// Dessine les éléments
	drawRatioScroll();
	drawElts();
	
	// Création des éléments paralax
	plx1 = new Paralax(tParalax_1);
	stage.addChild(plx1);
	
	plx2 = new Paralax(tParalax_2);
	stage.addChild(plx2);
	
	// Initialise les événements
	initEvents();
	
    // Gameloop
    app.ticker.add((delta) => {
		animElts();
    });
}

function initEvents() {
	$(document).mousemove(function(e) {
        xM = e.pageX;
		
		// Actualise le ratio
		updateRatioScroll();
    });
}

function drawRatioScroll() {
	ratioScr = new PIXI.Graphics();
	ratioScr.beginFill(0);
	ratioScr.drawRect(0, 10, 1, 5);
	stage.addChild(ratioScr);
}
function updateRatioScroll() {
	ratioScr.clear();
	ratioScr.beginFill(0);
	ratioScr.drawRect(0, 10, xM, 5);
}

function drawElts() {
	ctr1 = createCtr(50);
	ctr2 = createCtr(250);
	ctr3 = createCtr(450);
	
	p1 = createPath(ctr1);
	p2 = createPath(ctr2);
	p3 = createPath(ctr3);
	
	g1 = createRect(ctr1);
	g2 = createRect(ctr2);
	g3 = createRect(ctr3);
}
function createCtr(yP) {
	var c = new PIXI.Container();
	c.x = 20;
	c.y = yP;
	stage.addChild(c);
	return c;
}
function createPath(ctr) {
	var p = new PIXI.Graphics();
	p.lineStyle(1, 0);
	p.moveTo(0, 0);
	p.lineTo(800, 0);
	p.lineTo(800, 150);
	p.lineTo(1200, 150);
	ctr.addChild(p);
	return p;
}
function createRect(ctr) {
	var r = new PIXI.Graphics();
	r.beginFill(0x00CCFF, 0.6);
	r.drawRect(0, 0, 100, 50);
	ctr.addChild(r);
	return r;
}

function animElts() {
	console.log("Pos Souris en X", xM, " / Ratio", xM/wST);
	var ratio = xM / wST;
	// Applique l'inertie au ratio
	ratioInertie += (ratio - ratioInertie) * 0.05;
	
	// Met à jour les éléments paralax
	plx1.update(ratioInertie);
	plx2.update(ratioInertie);
	
	// Déplace l'élément entre 0 et 800
	g1.x += ((ratio * 800) - g1.x) * 0.3;
	g2.x += ((ratio * 800) - g2.x) * 0.1;
	
	for(var i = 1, prevK, nextK ; i < tKeyFrames.length ; i++){
		prevK = tKeyFrames[i-1];
		nextK = tKeyFrames[i];
		
		if(ratioInertie < nextK.s){
			var r = (ratioInertie - prevK.s) / (nextK.s - prevK.s);
			g3.x = (nextK.x - prevK.x) * r + prevK.x;
			g3.y = (nextK.y - prevK.y) * r + prevK.y;
			// Sort de la boucle, 
			// pas besoin de vérifier le reste
			break;
		}
	}
}





var o = {}

// Déclare une classe
class Paralax extends PIXI.Container {
	
	// Constructeur de la classe
	constructor(tProperties) {
		// Appel le constructeur de la super classe
		super();
		
		// Stocke les propriétés
		this.props = tProperties;
		
		// Selon le type, choisi la fonction
		// pour créer l'objet 
		for(var i = 0 ; i < this.props.length ; i++){
			if(this.props[i].type === "rect"){
				this.createGraphic(this.props[i]);
			}
			else if(this.props[i].type === "img"){
				this.createImg(this.props[i]);
			}
		}
	}
	
	// Méthodes de classe
	createContainer(properties) {
		
	}
	createImg(properties) {
		
	}
	createGraphic(properties) {
		var g = new PIXI.Graphics();
		// Positionne l'objet
		g.x = properties.x;
		g.y = properties.y;
		// Est-ce qu'il y a une couleur de remplissage
		if(properties.fillColor){
			g.beginFill(
				properties.fillColor.color,
				properties.fillColor.alpha
			);
		}
		// Dessine la forme
		g.drawRect(0, 0, properties.w, properties.h);
		
		// Ajoute le rectangle comme enfant de l'instance
		this.addChild(g);
		
		// Référence l'objet dans les propriétés
		properties.ref = g;
	}
	
	update(rI) {
		// Boucle sur le tableau 
		for(var i = 0, p, ref, plx ; i < this.props.length ; i++){
			p = this.props[i];
			// Récupère la référence à l'objet
			ref = p.ref;
			// Récupère la référence à la clé paralax
			plx = p.paralax;
			// Est-ce que parlax existe
			if(plx) {
				// Boucle sur les indices de paralax
				for(var j = 0, prop, kF ; j < plx.length ; j++){
					// Récupère la propriété à animer
					prop = plx[j].prop;
					// Récupère les images-clés
					kF = plx[j].keyFrames;
					
					for(var k = 1, prevK, nextK ; k < kF.length ; k++){
						prevK = kF[k-1];
						nextK = kF[k];
						
						if(rI < nextK.ratio){
							var r = (rI - prevK.ratio) / (nextK.ratio - prevK.ratio);
							ref[prop] = (nextK.value - prevK.value) * r + prevK.value;
							
							// Sort de la boucle, 
							// pas besoin de vérifier le reste
							break;
						}
					}
					
				}
			}
		}
	}
}









