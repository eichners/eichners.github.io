
var map = L.map('map').setView([40.71,-73.93], 12);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
maxZoom: 19
}).addTo(map);


//$(document).ready(function () {
//var oddLotsGeoJSON;
var NYBBgeoJSON;
var lotStyle;
var dataLayer;
var lotClick;
var Choice;


// var dataLayer = L.geoJson(null, {
//     style: lotStyle,
//     onEachFeature: lotClick,
// });


$.getJSON( "geojson/nybb.geojson", function( data ) {
    var NYBBPolygon = data; 
    console.log('anything');
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
 //   console.log(data);

    NYBBgeoJSON = L.geoJson(NYBBPolygon, {
        style: NYBBstyle
    }).addTo(map);
});

// STYLE FUNCTION FOR LOTS
//function addOddLotsData() {
//$.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM bk_oddlots_copy &format=GeoJSON', 
//function (data) {
 //   dataLayer = data;

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

/// CHOICE/OPTION FUNCTION 
Choice = function addDataToMap(dataLayer, feature) {
    $('.choice').change(function () {
        console.log('something');
        var sql = 'SELECT * FROM bk_oddlots_copy';
        if ($(this).val() === 'lottype') {
            sql;
        }
        else {
            sql += " WHERE lottype = '" + ($(this).val() + "'" );
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
        });
        // trying to get data to load by adding .change with no arguments to show choice when nothing is selected. 
        // get error wherever I put it; when moved before $.getJSON error shows dataLayer is not defined or it's not a $.param ..change is not a function 
        // .change();      
    })
    // .change(); when tried here, maximum call stack size exceeded 
} 

$('.choice').change(function () {
    Choice(dataLayer, $(this).val());//Choice);
    console.log(Choice);
    // upon loading page nothing is logged for Choice
    // first selection: Choice logs out function text from line 23 where Choice is set. 
    // second selection shows sql and data on map shows. 
    // third selection logs sql twice
    // 4th selection logs sql 3 times
});

$(document).ready(function () {
    dataLayer = L.geoJson(null, {  
        style: lotStyle,
        onEachFeature: lotClick,
    }).addTo(map);
})


    //dataLayer = L.geoJson(data, {
        //style: lotStyle,
       // onEachFeature: lotClick,
    //});  








