// A remplacer eventuellement par "geotweet.php?"
const URL_SERVER = "tweet.php?";


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

/* inclure joliment un tweet */
function getEmbeddedTweet(id) {
 	var xhr = new XMLHttpRequest();
	var url = "twitter_query=" + encodeURIComponent("https://api.twitter.com/1.1/statuses/oembed.json?id=" + id);

	xhr.open("GET", URL_SERVER + url, true);
	xhr.send(null);
	setTimeout(500);
	var res = JSON.parse(xhr.responseText);
	console.log(res);
	return res["html"];
}

/* Requete AJAX vers geotweet.php pour la liste des tweets*/
function get(query, location) {

	var xhr = new XMLHttpRequest();

	// Appelée lorsque la requête AJAX se termine avec succès
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            var data = JSON.parse(xhr.responseText);
            handleTweets(data["statuses"]);
		}
	};

	var url;
	url = "twitter_query=" + encodeURIComponent("https://api.twitter.com/1.1/search/tweets.json?q=" + encodeURIComponent(query));

	xhr.open("GET", URL_SERVER + url, true);
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
	console.log("supression des marqueurs");
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
	

	// On l'ajoute dans la liste, pour pouvoir ensuite le supprimer
	markers.push(mark);
}

/* Supprime tout les marqueurs du calque */
function removeAllMarkers() {
	markers.forEach(function(marker) {
		calqueMarkers.removeMarker(marker);
	});
	markers = [];
	tweetsArray = [];
}

function updateUI() {
	

	console.log("delete tweets list");
	// Mets à jour la liste des tweets
	document.getElementById("data").innerHTML = "";

	console.log("update nombre de res");
	// Mets à jour le nombre de résultats
	document.getElementById("info-res").innerHTML = markers.length + " tweets trouvés";

	

	console.log("affiche tweet");
	var div = "";
	// Affiche les tweets dans la partie droite
	tweetsArray.forEach(function(tweet) {
		console.log(tweet["id"]);
		div += getEmbeddedTweet(tweet["id"]);
	});

	document.getElementById("data").innerHTML = div;

	console.log("affiche marqueur");
	// Ajoute les marqueurs sur la map
	markers.forEach(function(mark) {
		calqueMarkers.addMarker(mark);
	});

}
