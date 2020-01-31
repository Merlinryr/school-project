var marker = null;
var checkBox = document.getElementById('switch');
var bat = document.getElementById('batinput');
var maPosition = document.querySelector("div.mapboxgl-ctrl-geocoder input");

//sauvegarde des paramètres de l'utilisateur
function settings() {
  localStorage.setItem('mode', checkBox.value);
  localStorage.setItem('batiments', bat.value);
}

//appel des fonctions au chargement de la page
window.onload = function() {
  // Fonction d'initialisation qui s'exÃ©cute lorsque le DOM est chargÃ©
  initMap();
  // findLocation();
  // selectMode();

  $.get("request.php", function(data){
    console.log(data);
  });
};

// Fonction d'initialisation de la carte
function initMap() {

  //création de la map avec mapbox
  mapboxgl.accessToken =
    "pk.eyJ1IjoiY2xlbWZpcmV5IiwiYSI6ImNrNW1wMjdpZzA5cjgzZGw1bDByMGF1c24ifQ.PJXQXyl_q17DUgZGbz3tUg";
    
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    zoom: 3,
    center: [4.899, 52.372]
  });

  // map.setLayoutProperty('country-label', 'text-field', [
  //   'get',
  //   'name_' + French
  // ]);

  var layerList = document.getElementById('mode');



  function switchLayer() {

    var layerId;
    if (checkBox.checked === false) {
      layerId = "streets-v11";
    } else if (checkBox.checked === true) {
      layerId = "dark-v10";
    }

    map.setStyle('mapbox://styles/mapbox/' + layerId);
  };

  checkBox.onclick = switchLayer;

  /////////////////////////////////
  //Localisation///////////////////

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }),
  );

  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
    }),
    'top-left'
  )

  /////////////////////////////////
  //Itineraire
  map.addControl(
    new MapboxDirections({
      accessToken: mapboxgl.accessToken
    }),
    'bottom-right'
  );



  //////////////////////////////////
  //controles zoom et rotation
  map.addControl(new mapboxgl.NavigationControl());


};

function maPos() {
  maPosition.value = "Ma Position";
}

$(document).ready(function (){
});