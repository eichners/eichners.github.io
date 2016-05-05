// This script demonstrates some simple things one can do with leaflet.js


var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);


// create global variables we can use for layer controls
var oddLotsGeoJSON;
// var pawnShopsGeoJSON; 
// var neighborhoodsGeoJSON;


// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
// let's add the subway lines
$.getJSON'https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM bk_oddlots &format=GeoJSON'), 
.done(function (data) {
    // ensure jQuery has pulled all data out of the geojson file
    var oddLotsLayer = data;

    var lottStyle = function (feature){

        var value = feature.properties.lottype;
        var fillColor = null;
        if(value >= 0 && value <=0.1){
            fillColor = "#fee5d9";
        }
        if(value === '6'){
            fillColor = "#fcbba1";
        }
        if(value === '7'){
            fillColor = "#fc9272";
        }
        if(value === '9'){
            fillColor = "#fb6a4a";
        }
        if(value === 'null') { 
            fillColor = "#de2d26";
        }
    
// this var style = is for all the other styles of each neighborhood
        var style = {
            weight: 1,
            opacity: .1,
            color: 'red',
            fillOpacity: 0.75,
            fillColor: fillColor
        };
// return --this is needed for 
        return style;
    }

    var lotClick = function (feature, layer) {
        layer.bindPopup("This odd lot address is " + <strong>feature.properties.address</strong>  + "and it is owned by " + <strong>feature.properties.ownername</strong>);
    }
//This is a loop below: We've used one for each layer
    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: povertyStyle,
        onEachFeature: povertyClick
    }).addTo(map);


    // create layer controls
    createLayerControls(); 

});


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
    };

    var overlayMaps = {
        "Pawn Shops": pawnShopsGeoJSON,
        "Subway Lines": subwayLinesGeoJSON,
        "Povery Map": neighborhoodsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}






