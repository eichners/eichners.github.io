// FINAL PROJECT SCHOOL SIZE CHANGES: 2006 - 2015 MAP

// Goal: to create map showing growth and decline of public and charter schools over the last ten years
// - separate and show data for charters and public 
// - use different colors for different types, 
// - and different colors for growth or decline. 
// - create slider to show change from 2006 - 2015



//OTHER MAP TILES
var map = L.map('map').setView([40.689542, -73.969587], 14);

var OpenMapSurfer_Grayscale = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
     minZoom: 12,
    maxZoom: 19,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

map.addLayer(OpenMapSurfer_Grayscale);
// set data layer as global variable so we can use it in the layer control below
var leaflet_geoJSON;


var d13PolygonGeoJSON;
var SchoolSizeGeoJSON;

addDistrict13(); 

function addDistrict13() {
// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
$.getJSON( "geojson/D13_polygon.geojson", function( data ) {
    var d13Polygon = data; 

    var d13Style = function (feature, latlng) {

        var style = {
            "weight": 2,
            "color":"#1381ab",
            "fillColor": 'White',
            "fillOpacity": 0.4

        };
        return style;
    };
  
    d13PolygonGeoJSON = L.geoJson(d13Polygon, {
        style: d13Style
    });

    addSchoolSizeData();
});
}

function addSchoolSizeData() {
// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
// geojson/D13Enrollment06-15_AccurateLoc.geojson
$.getJSON( "geojson/D13_Enrollment_06-15_2.geojson", function( data ) {
    var schools = data;
      console.log(data);
    // draw the dataset on the map
    // plotDataset(dataset);
    // //creates a dropdown in the sidebar that we can use to fire map events and update the D3 chart
    // createDropdown(dataset);
    // addToMap();

// can I use a feature collection, + array of years to create a set of markers for each year? var featureCollection = properties[2006, 2007 2009, 2010, 2011, 2012, 2013, 2014, 2015]
// (Feature.properties.Growth\/dec*10)
    var schoolPointToLayer = function (features, latlng) {

        var growthDecline = features.properties.GrowthDecline;
        var publicCharter = features.properties.DBN 

        console.log(growthDecline);
   
        var schoolMarker = L.circleMarker(latlng, {
            // radius: feature.properties.Growthdecline;
            weight: 1,
            color:'black',
            fillColor: markerColor(publicCharter, growthDecline),
            fillOpacity: 0.5,
            radius: markerRadius(growthDecline)
    });
        return schoolMarker;
    }
// find top range of G/D and set if/else stuff here for radius
    function markerRadius (d) {
    return d > 600 ?  60 :
           d > 500  ? 50 :
           d > 400  ? 40 :
           d > 300  ? 30 :
           d > 200  ? 20 :
           d > 100  ? 10 :
           d >   0  ? 1 :
           d > -100 ? 10 :
           d > -200 ? 20 :
           d > -300 ? 30 :
           d > -400 ? 40 :
           d > -500 ? 50 :
           d > -600 ? 60 :
                      70 ;

    }

    function markerColor (d, f) {
      return d.substring(0,1) === "8" && f > 0 ? '#1A68B2' :

           d.substring(0,1) === "8" && f <= -1 ? '#1A68B2' :
           d.substring(0,1) === "1" && f >= 0 ? '#4CA120' :
           d.substring(0,1) === "1" && f <= 0 ? '#E82C0C' :
                    '#E82C0C' ;
                    
}
//  }

//Colors:
// deep red E82C0C
// orange F78A09
// bright blue 0439FF
// lighter blue: F7E309
// more teal blue: 1A68A1, 1A68B2

// deep green: 06A12D
// more yellow green: 4CA120
// Yellow; F7D009

// grey green: 569576

// grey’ 899692
// 808080
// 878787
// B8B8B8

    var schoolClick = function (Feature, layer) {
          /////// var popupText attemtps to make popup ignore 0 value properties and instead show first year with data for enrollment

        var popupContent = '<b>' + Feature.properties.school + '</B>' + '<BR />'
            //+ '<b>' + enrollment + '</b>' + 
            + ' Enrollment 2015: ' + Feature.properties._2015 + '<br />' +  'Growth or Decline since 2006: ' + Feature.properties.GrowthDecline;

        layer.bindPopup(popupContent)
    }

// function plotDataset(dataset) {
    SchoolSizeGeoJSON = L.geoJson(schools, {
        pointToLayer: schoolPointToLayer,
        onEachFeature: schoolClick
  });
//addTo(map);

    // create layer controls
    // createLayerControls(); 

d13PolygonGeoJSON.addTo(map);
SchoolSizeGeoJSON.addTo(map);
});
}

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    // this is an html legend instead of leaflet generated through functions
    // circles for legend are svg elements
      div.innerHTML += 
        '<b>School Enrollment Numbers:<br />Change from 2006-2015</b><br /><br />' +
        '<svg class="left" width="230" height="62"><circle cx="32" cy="32" r="30" class="legendSvg"/><circle cx="32" cy="41" r="20" class="legendSvg"/><circle cx="32" cy="51" r="10" class="legendSvg"/><circle cx="115" cy="32" r="30" class="legendSvg1"/><circle cx="115" cy="41" r="20" class="legendSvg1"/><circle cx="115" cy="51" r="10" class="legendSvg1"/><circle cx="198" cy="32" r="30" class="legendSvg2"/><circle cx="198" cy="41" r="20" class="legendSvg2"/><circle cx="198" cy="51" r="10" class="legendSvg2"/></svg><br />' +
        '<p2 font-weight:300>&nbsp;Growth &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Decline &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Growth<br />Public Schools &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Charter Schools</p> ' +
            '<p><b>Data</b><br />' +
            '<span>from the <a href=\"http://schools.nyc.gov/default.htm\">NYC DOE</a> and <a href=\"http://www.insideschools.org\">InsideSchools.org</a></span><br /></p>';

;
    return div;
};

legend.addTo(map);












