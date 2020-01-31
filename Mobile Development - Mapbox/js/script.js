// On initialise la latitude et la longitude de Paris (centre de la carte)
var lat = 48.852969;
var lon = 2.349903;
var macarte = null;
var marker = null;

// Fonction d'initialisation de la carte
function initMap() {

  // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    // Il est toujours bien de laisser le lien vers la source des données
    attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
    minZoom: 1,
    maxZoom: 20
  }).addTo(macarte);


};

function locate() {

  macarte.locate({
    setView: true,
    maxZoom: 16,
    watch: true
  })

  macarte.on("locationfound", e => {

    if (marker === null) {
      marker = L.marker(e.latlng).addTo(macarte);

    } else {
      marker.setLatlng(e.latlng);
    }
  })



};
// marker = L.marker([]);
// addTo(macarte)

window.onload = function() {
  // Fonction d'initialisation qui s'exécute lorsque le DOM est chargé
  initMap();
  locate();
};