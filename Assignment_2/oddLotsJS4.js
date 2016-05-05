
var map = L.map('map').setView([40.71,-73.93], 12);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
maxZoom: 19
}).addTo(map);

NYBBstyle = function (feature) {
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
    console.log('is it adding polygon layer?');


var lotStyle;
var lotClick;

lotStyle = function (feature){

    var value = feature.properties.lottype;
    if(value === '1'){
        fillColor = "#fee5d9";
        color = "#fee5d9";
    }
    if(value === '6'){
        fillColor = "#A6D5FF";
        color = '#A6D5FF';
    }
    if(value === '7'){
        fillColor = "#40C9C9";
        color = '#40C9C9';
    }
    if(value === '9'){
        fillColor = "#FC923A";
        color = '#FC923A';
    }
    if(value === '8') { 
        fillColor = "#FF8563";
        color = '#FF8563';
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


//LOT CLICK BINDPOPUP
lotClick = function (feature, dataLayer) {
    dataLayer.bindPopup("This odd lot address is " + 
        "<strong>" + feature.properties.address + "</strong>" + 
        " and it is owned by " + 
        "<strong>" + feature.properties.ownername + "</strong>");
}

var NYBBgeoJSON = L.geoJson(null, {
        style: NYBBstyle     
}).addTo(map);

var dataLayer = L.geoJson(null, {  
        style: lotStyle,
        onEachFeature: lotClick,
}).addTo(map);

var Choice;
var NYBBstyle

$.getJSON( "geojson/nybb.geojson", function( data ) {
    var NYBBpolygon = data;   
    NYBBgeoJSON.addData(data);
    NYBBgeoJSON.bringToBack();
});


/// CHOICE/OPTION FUNCTION 
Choice = function addDataToMap(dataLayer, feature) {
// log out parameters
//$('.choice').change(function () {
    console.log('something');
    var sql = 'SELECT * FROM bk_oddlots_copy';
    console.log(feature);
    if (feature === 'lottype') {
    }
    else {
        sql += " WHERE lottype = '" + feature + "'";
    }
    console.log(sql);

    var url = 'https://eichnersara.cartodb.com/api/v2/sql?' + $.param({
        q: sql,
        format: 'GeoJSON'        
    });
   
    $.getJSON(url).done(function (data) {
        console.log(data);
        dataLayer.clearLayers();
        dataLayer.addData(data);
        map.fitBounds(dataLayer.getBounds());
        dataLayer.bringToFront();
    });
} 

$(document).ready(function () {
    console.log('is it adding oddlots layer?');
    $('.choice').change(function () {
        Choice(dataLayer, $(this).val());//Choice);
    })
    .change(); 
})









