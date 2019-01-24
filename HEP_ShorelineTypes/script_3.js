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
                Type + ", " + "</br>" +
                "Status: " + status);
        }

      livingShorelineGeoJSON = L.geoJson(LivingShorelinePoints, {
      pointToLayer: LivingShorelineStyle,
      onEachFeature: LivingShorelineClick
    });

// LOAD DATA LAYERS LAST TO CONTROL ORDER: 
  shorelinesNorthGeoJSON.addTo(map);
  shorelinesHarborGeoJSON.addTo(map);
  livingShorelineGeoJSON.addTo(map);
  map.fitBounds(shorelinesHarborGeoJSON.getBounds());

 });
}



