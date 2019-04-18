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
  
  // zoom control options
  //var zoom = L.control.zoom();   // Creating zoom control
  //  zoom.addTo(map);   // Adding zoom control to the map
 

// create global variables we can use for layer controls
var shorelinesHarborGeoJSON;
var shorelinesNorthGeoJSON;
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

        layer.bindPopup("<strong>" +
        feature.properties.shoretype +" Shoreline" + "</strong>" + "<br>" +
        ATTRIBUTE );
      }

    shorelinesHarborGeoJSON = L.geoJson(ShorelinesHarbor, {
        style: shorelineStyle, 
        onEachFeature: shorlineClick    
  });

addShorelinesNorth();  
});
}

// 1. ADD SHORELINE DATA
//addShorelinesNorth(); 

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
        ATTRIBUTE );
      }

    shorelinesNorthGeoJSON = L.geoJson(ShorelinesNorth, {
        style: shorelineStyle, 
        onEachFeature: shorlineClick    
  });

addShorelinesProject(); 
});
}


// SHORELINE PROJECTS (SHORELINE TYPE PHOTOS AND SHORELINE PORJECT PHOTOS)
function addShorelinesProject() {

$.getJSON("geojson/ShorelinesProject_2.geojson", function(data) {
    var ShorelinesProject = data;   
    console.log(data);
  
        // POINT MARKER STYLE
      var ShorelinesProjectStyle = function (feature, latlng) {
          // make variables to access each type data field; "project" or "type"
          var ptType = feature.properties.category
          //console.log(data);

          var ptMarker =L.circleMarker(latlng, {
                radius: 6,
                fillOpacity: 0.9,
                fillColor: ptColor(ptType),
                weight: 0,
                });
            return ptMarker;
            }

          function ptColor (ptType) {           
              return  ptType == "Project" ? "#ed7700" : //#fc49d8
                      ptType == "Type" ? "#e84343" : //#fc9f49
                        "#7B756B" ;
          }
        // ON POINT CLICK   
        var ShorelinesProjectClick = function (feature, layer) {
          // change popup color for point data: 
          // POPUP TEXT
            layer.bindPopup("<strong>" + feature.properties.type + "</strong>" + "</br>" 
              + "</br>" + "<img src='HEP_ShorelineTypes/img/" + feature.properties.photo + "' width='300px', padding-bottom='5px'>" + "</br>" + feature.properties.text + "</br>" + "<p4>" + "Photo: " + feature.properties.photoCredit + "</p4>");
        }

      shorelinesProjectGeoJSON = L.geoJson(ShorelinesProject, {
      pointToLayer: ShorelinesProjectStyle,
      onEachFeature: ShorelinesProjectClick
    });

// LOAD DATA LAYERS LAST TO CONTROL ORDER: 
  shorelinesNorthGeoJSON.addTo(map);
  shorelinesHarborGeoJSON.addTo(map);
  //livingShorelineGeoJSON.addTo(map);
  shorelinesProjectGeoJSON.addTo(map);
  map.fitBounds(shorelinesHarborGeoJSON.getBounds());

 });
}
