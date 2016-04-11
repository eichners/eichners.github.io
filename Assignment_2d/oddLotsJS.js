var map = L.map('map').setView([40.71,-73.93], 12);

// set a tile layer to be CartoDB tiles

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
maxZoom: 19
}).addTo(map);


// create global variables we can use for layer controls
var oddLotsGeoJSON;
var NYBBgeoJSON;
//var ownerTypeGeoJSON;


addNYBB(); 

function addNYBB() {
$.getJSON( "geojson/nybb.geojson", function( data ) {
    var NYBBPolygon = data; 

    var NYBBstyle = function (feature) {
        var value = feature.properties.BoroCode;
        if(value === 3){
            fillColor = "#3f3f3f";
            color = "black";
            fillOpacity = 0.8;
        }
        if(value === 1){
            fillColor = "orange";
            color = "black";
            fillOpacity: 0.6;
        }
        if(value === 2){
            fillColor = "#3969B8";
            color = "black";
            fillOpacity = 0.6;
        }
        if(value === 4){
            fillColor = "green";
            color = "black";
            fillOpacity = 0.6;
        }
        if(value === 5){
            fillColor = "yellow";
            color = "black";
            fillOpacity = 0.6;
        }
        var style = {
            weight: 1,
            color:color,
            fillColor: fillColor,
            fillOpacity: fillOpacity
        };
        return style;
    }
    console.log(data);

    NYBBgeoJSON = L.geoJson(NYBBPolygon, {
        style: NYBBstyle
    });

    addOddLotsData();
});
}

function addOddLotsData() {
$.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM bk_oddlots &format=GeoJSON', 
function (data) {
    var oddLotsLayer = data;

    var lotStyle = function (feature){

        var value = feature.properties.lottype;
        if(value === '1'){
            fillColor = "#fee5d9";
            color = "#fee5d9";
        }
        if(value === '6'){
            fillColor = "#5CB3FF";
            color = '#5CB3FF';
        }
        if(value === '7'){
            fillColor = "#00B2B2";
            color = '#00B2B2';
        }
        if(value === '9'){
            fillColor = "#FA550F";
            color = '#FA550F';
        }
        if(value === '8') { 
            fillColor = "#46a346";
            color = '#46a346';
        }
    
        var style = {
            weight: 3,
            opacity: 0.9,
            color: color,
            fillOpacity: 0.9,
            fillColor: fillColor
        };

        //console.log(feature);
        return style;
    }

    var lotClick = function (feature, layer) {
        layer.bindPopup("This odd lot address is " + 
            "<strong>" + feature.properties.address + "</strong>" + 
            " and it is owned by " + 
            "<strong>" + feature.properties.ownername + "</strong>");
    }

    oddLotsGeoJSON = L.geoJson(oddLotsLayer, {
        style: lotStyle,
        onEachFeature: lotClick
    });

    NYBBgeoJSON.addTo(map);
    oddLotsGeoJSON.addTo(map);
    map.fitBounds(oddLotsGeoJSON.getBounds());
});
}

//addOwnerData();
//});

function addDataToMap(dataLayer, choice) {
$('.choice').change(function () {
    var sql = 'SELECT * FROM bk_oddlots';
          if ($(this).val() === 'lottype') {
          }
          else {
          sql = "'WHERE lottype = '" + ($(this).val() + "'" );
          }
    var url = 'https://eichnersara.sartodb.com/api/v2/sql?' + $.param({
    q: 'sql' + choice,
    format: 'GeoJSON'        
    });
    $.getJSON(url)

    .done(function (data) {
    var ownerData = data;
    
    dataLayer.clearLayers();
    dataLayer.addData(data);
    });
 });

    $(document).ready(function () {
        var OwnerData = L.geoJson(null).addTo(map);
        //addTileLayer(map);
        addDataToMap(dataLayer, choice);

        $('.choice').change(function () {
            addDataToMap(dataLayer, $(this).val());
            // Seems like this is repeating addDataToMap from above. is this where there is a problem? 
        // not sure if this function should include the other addToMap calls
        // ownerTypeGeoJSON.addTo(map);
        });
    }); 
} 









