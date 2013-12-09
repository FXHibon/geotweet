
/* Affichage de la map */
var map = new OpenLayers.Map('map');
var wms = new OpenLayers.Layer.OSM("OpenLayers OSM");
map.addLayer(wms);
map.zoomToMaxExtent();

/* Liste de tout les marqueurs present sur la carte */
var markers = [];
/* Liste des tweets affichés */
var tweetsArray = [];

/* Créer un calque pour mettre des point dessus. Tweet est le nom du calque qui affiche les points. On peut mettre le nom que l’on veut */
var calqueMarkers = new OpenLayers.Layer.Markers("Tweet");

/* Requete AJAX vers geotweet.php */
function get(query, location) {

	var xhr = new XMLHttpRequest();

	// Appelée lorsque la requête AJAX se termine avec succès
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

            console.log(xhr.responseText); // Données textuelles récupérées

            var data = JSON.parse(xhr.responseText);
            handleTweets(data["statuses"]);
		}
	};

	var url;
	url = "geotweet.php?twitter_query=" + encodeURIComponent("https://api.twitter.com/1.1/search/tweets.json?q=" + encodeURIComponent(query));

	xhr.open("GET", url, true);
	xhr.send(null);
}

/* Gestion du formulaire */
function handleForm() {

	// Recuperation des données du formulaire
	var q = document.getElementById("searchField").value;
	var location = document.getElementById("locationField").value || "";
	get(q, location);
	return false;
}

// Affiche sur la map les tweets recu en parametres
function handleTweets(tweets) {

	// Supprime les marqueurs déjà présent s'il y en a
	removeAllMarkers();

	

	// Créé un marquer par tweet
	tweets.forEach(function(tweet) {
		if(tweet["coordinates"] != null) {
			tweetsArray.push(tweet);
			addMarker(tweet["coordinates"]["coordinates"]);
		}
	});

	updateUI();

}

function addMarker(coordinate) {
	console.log("adding marker " + coordinate);

	var projCarte = map.getProjectionObject();
	var projSpherique = new OpenLayers.Projection("EPSG:4326");

	// créer la postion de coordonée valeurX, valeurY
	var coord = new OpenLayers.LonLat(coordinate[0], coordinate[1]);

	// ajuste les coordonnées à la carte
	coord.transform(projSpherique,projCarte);

	// associe le calque à la map
	map.addLayer(calqueMarkers);
	
	// créer un marqueur sur le calque au coordonnée coord (créés au dessus)
	var mark = new OpenLayers.Marker(coord);
	calqueMarkers.addMarker(mark);

	// On l'ajoute dans la liste, pour pouvoir ensuite le supprimer
	markers.push(mark);
}

/* Supprime tout les marqueurs du calque */
function removeAllMarkers() {
	markers.forEach(function(marker) {
		calqueMarkers.removeMarker(marker);
	});
	markers = [];
	tweets = [];
}

function updateUI() {
	document.getElementById("info-res").innerHTML = markers.length + " tweets trouvés";
}
