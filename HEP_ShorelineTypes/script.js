//$(document).ready(function () {

var map = L.map('map').setView([40.71,-73.93], 9);

L.tileLayer('https://api.mapbox.com/styles/v1/eichners/cjqvwjoam3d7p2smt18p3nssn/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWljaG5lcnMiLCJhIjoiY2lrZzVneDI4MDAyZ3VkbTZmYWlyejUzayJ9.vEGckM-D3AjV4jXmdibXyw', 

// for mapbox basemap with Leaflet: Use the 3rd party / Carto id and access token. copy and put full code inside L.tileLayer()
{
    tileSize: 512,
    zoomOffset: -1,
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
  console.log('anything');


// create global variables we can use for layer controls
var shorelinesHarborGeoJSON;
var shorelinesNorthGeoJSON;
var livingShorelineGeoJSON;
var shorelinesProjectGeoJSON;


// 1. ADD SHORELINE DATA
addShorelinesHarbor(); 

function addShorelinesHarbor() {

  $.getJSON( "geojson/ShorelineType_Harbor_wsg84.geojson", function( data ) {
    var ShorelinesHarbor = data;   

      // 1.SHORELINE STYLE
      var shorelineStyle = function (feature) {
        var value = feature.properties.shoretype;
        if(value === "Engineered"){
            color = "#5ea8e5";
        }
        if(value === "Natural"){
           // fillColor = "green";
            color = "#bad85f";
        }
        if(value === "do not display"){
           // fillColor = "#3969B8";
            color = "green";
            fillOpacity = 0.1;
        }
        var style = {
            weight: 3,
            color:color
        };
        return style;
      }
      console.log('is polyline layer loading?');

      // 2. SHORELINE CLICK / BINDPOPUP
      var shorlineClick = function (feature, layer) {
          // HIDE NULL VALUES
          var ATTRIBUTE = feature.properties.ATTRIBUTE;
            if (ATTRIBUTE == null) {
            ATTRIBUTE = "";
          } else {
            var ATTRIBUTE = feature.properties.ATTRIBUTE;
          };

        layer.bindPopup("<strong>" +
        feature.properties.shoretype +" Shoreline" + "</strong>" + "<br>" +
        ATTRIBUTE);
      }

    shorelinesHarborGeoJSON = L.geoJson(ShorelinesHarbor, {
        style: shorelineStyle, 
        onEachFeature: shorlineClick    
  });

addLivingShorelinePoints(); 
});
}

// 1. ADD SHORELINE DATA
addShorelinesNorth(); 

function addShorelinesNorth() {

  $.getJSON( "geojson/ShorelineType_North.geojson", function( data ) {
    var ShorelinesNorth = data;   

      // 1.SHORELINE STYLE
      var shorelineStyle = function (feature) {
        var value = feature.properties.shoretype;
        if(value === "Engineered"){
            color = "#5ea8e5";
        }
        if(value === "Natural"){
           // fillColor = "green";
            color = "#bad85f";
        }
        if(value === "do not display"){
           // fillColor = "#3969B8";
            color = "green";
            fillOpacity = 0.1;
        }
        var style = {
            weight: 2,
            color:color
        };
        return style;
      }
      console.log('is polyline layer loading?');

      // 2. SHORELINE CLICK / BINDPOPUP
      var shorlineClick = function (feature, layer) {
          // HIDE NULL VALUES
          var ATTRIBUTE = feature.properties.ATTRIBUTE;
            if (ATTRIBUTE == null) {
            ATTRIBUTE = "";
          } else {
            var ATTRIBUTE = feature.properties.ATTRIBUTE;
          };
          // HIDE DO NOT DISPLAY POPUPS
          // just delete the data from dataset: to do later

        layer.bindPopup("<strong>" +
        feature.properties.shoretype +" Shoreline" + "</strong>" + "<br>" +
        ATTRIBUTE);
      }

    shorelinesNorthGeoJSON = L.geoJson(ShorelinesNorth, {
        style: shorelineStyle, 
        onEachFeature: shorlineClick    
  });

addLivingShorelinePoints(); 
});
}

// LIVING SHORELINE POINTS
function addLivingShorelinePoints() {

$.getJSON("geojson/LivingShorelines_Points_merged.geojson", function(data) {
    var LivingShorelinePoints = data;   
  
        // POINT MARKER STYLE
        var LivingShorelineStyle = function (feature, latlng) {
          return L.circleMarker(latlng, {

                radius: 6,
                fillOpacity: 1,
                fillColor: "#8e8e8d",
                weight: 0,
                });
              }
        
        // ON POINT CLICK   
        var LivingShorelineClick = function (feature, layer) {
          // change popup color for point data: 
          
          // hide null values
          var Project_Na = feature.properties.Project_Na;
            if (Project_Na == null) {
            Project_Na = "";
          } else {
            var Project_Na = feature.properties.Project_Na;
          };
          var Type = feature.properties.Type;
            if (Type == null) {
            Type = "None recorded";
          } else {
            var Type = feature.properties.Type;
          };
            var status = feature.properties.status;
            if (status == null) {
            status = "None recorded ";
          } else {
            var status = feature.properties.status;
          };
          // POPUP TEXT
            layer.bindPopup("<strong>" + "Living Shorelines Project: " + Project_Na + "</strong>" + "</br>" + "Type: " +
                Type + ", " + "</br>" + "Status: " + status);
        }

      livingShorelineGeoJSON = L.geoJson(LivingShorelinePoints, {
      pointToLayer: LivingShorelineStyle,
      onEachFeature: LivingShorelineClick
    });
   addShorelinesProject(); 
 });
}

// SHORELINE PROJECTS (SHORELINE TYPE PHOTOS AND SHORELINE PORJECT PHOTOS)
function addShorelinesProject() {

$.getJSON("geojson/ShorelinesProject.geojson", function(data) {
    var ShorelinesProject = data;   
    console.log("anything?");
  
        // POINT MARKER STYLE
        var ShorelinesProjectStyle = function (feature, latlng) {
          return L.circleMarker(latlng, {

                radius: 6,
                fillOpacity: 0.9,
                fillColor: "#FF1493",
                weight: 0,
                });
              }
        
        // ON POINT CLICK   
        var ShorelinesProjectClick = function (feature, layer) {
          // change popup color for point data: 
          // POPUP TEXT
            layer.bindPopup("<strong>" + feature.properties.type + "</strong>" + "</br>" 
              + "</br>" + "<img src='img/" + feature.properties.photo + "' width='300px'>" + "</br>" + feature.properties.text);
        }

      shorelinesProjectGeoJSON = L.geoJson(ShorelinesProject, {
      pointToLayer: ShorelinesProjectStyle,
      onEachFeature: ShorelinesProjectClick
    });

// LOAD DATA LAYERS LAST TO CONTROL ORDER: 
  shorelinesNorthGeoJSON.addTo(map);
  shorelinesHarborGeoJSON.addTo(map);
  livingShorelineGeoJSON.addTo(map);
  shorelinesProjectGeoJSON.addTo(map);
  map.fitBounds(shorelinesHarborGeoJSON.getBounds());

 });
}

 /* 
// ADD LEGEND

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    // this is an html legend instead of leaflet generated through functions
    // circles for legend are svg elements
      div.innerHTML += 
        '<h4>Shoreline Types:</h4>'+ '<p><svg class="left" width="50" height="21"><line x1="0" y1="17" x2="45" y2="17" stroke-linecap="round" style="stroke:#bad85f;stroke-width:4" class="legendSvg1"/></svg><span> Natural</span></p>' 
        + '<p><svg class="left" width="50" height="26"><line x1="0" y1="18" x2="45" y2="18" stroke-linecap="round" style="stroke:#5ea8e5;stroke-width:4" class="legendSvg2"/><span style="line-height:1"> Engineered</span></p>' 
        + '<p5><svg class="left" height="40" width="50"><circle cx="23" cy="19" r="6" class="legendSvg3"/>" /></svg><span><p style="display:inline-block"> Click to see examples of </br>shoreline types</span> </p5>'
        + '<p5></br>Shoreline Projects</p5></br>' 
       
            '<p><b>Data:   </b>' +
            '<span><a href=\"http://www.hudsonriver.org\">HEP</a></span><br /></p>';


// youtube video in three parts by mike miller for legends with svg
 /*  var div = L.DomUtil.create('div', 'info legend');
    // this is an html legend instead of leaflet generated through functions
    // circles for legend are svg elements
      div.innerHTML += 
<div id="legend">
<svg height="100" width="200">
<rect x="10" y="10" height="30" width="50" style="stroke-width:4; stroke:blue; fill:blue;fill-opacity:0.5;"/>
<line x1="10" y1="60" x2="60" y2="60" style="stroke:peru; stroke-width:2;"/>
<circle cx="25" cy="75" r="10" style="stroke-width:4;stroke:green;stroke-dasharray:2,2;fill:cyan;fill-opacity:0.5;"/>
<text x="70" y="100" style="font-family:ff-tisa-sans-web-pro, sans-serif; font-size:14px;">
Click to see examples of shoreline types
</br>shoreline types</br>
</text>

</svg>
</div>
    return div;
};

legend.addTo(map);

*/

