//$(document).ready(function () {

//var mapboxAccessToken = 'pk.eyJ1IjoiZWljaG5lcnMiLCJhIjoiY2lrZzVneDI4MDAyZ3VkbTZmYWlyejUzayJ9.vEGckM-D3AjV4jXmdibXyw';
//40.71,-73.93], 13
var map = L.map('map').setView([40.723665,-73.958234], 18);

L.tileLayer('https://api.mapbox.com/styles/v1/eichners/ckqtpfqjm12ti17mupyiishkx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWljaG5lcnMiLCJhIjoiY2lrZzVneDI4MDAyZ3VkbTZmYWlyejUzayJ9.vEGckM-D3AjV4jXmdibXyw', 
{
   //id: 'mapbox://styles/eichners/ckqtpfqjm12ti17mupyiishkx',
   // attribution: 'Mapbox',
    tileSize: 512,
    zoomOffset: -1

}).addTo(map);


  // zoom control options
  //var zoom = L.control.zoom();   // Creating zoom control
  //  zoom.addTo(map);   // Adding zoom control to the map
// create global variables we can use for layer controls
var shorelineGeoJSON;
var biplotsGeoJSON;

// 1. ADD SHORELINE 
addShoreline(); 

function addShoreline() {

  $.getJSON( "geojson/shoreline.geojson", function( data ) {
  var shoreline = data;   
    console.log('is shorline layer loading?');
   //1.SHORELINE STYLE
     var shorelineStyle = function(feature) {
          var style = {
            weight: 1,
            color:"#FFFFFF"
        };
        return style;
  };

    shorelineGeoJSON = L.geoJson(shoreline, {
       style: shorelineStyle //, 
  });


// 2. ADD BIP lot DATA
addbiplots(); 
  });
 }
function addbiplots() {

  $.getJSON( "geojson/BIP_Lots.geojson", function( data ) {
    var biplots = data;   
console.log(data);

// color
function getColor(d) {
    return d === "State" ? "#82c444" :
           d === "Parks"  ? "#5ea8e5" :
           d === ""  ? "white" :
                      '#FFFFFF';
}
function LineColor(d) {
    return d === "State" ? "#4f8f0a" :
           d === "Parks"  ? "#1a5b91" :
           d === ""  ? "black" :
                      '#000000';
}
function getFill(d) {
    return d === "State" ? "0.8" :
           d === "Parks"  ? "0.8" :
           d === ""  ? "0.4" :
                      "0.4";
}
function lineWeight(d) {
    return d === "State" ? 3 :
           d === "Parks"  ? 3 :
           d === ""  ? .5:
                      .5;
}

// 1.BIP Lot STYLE
function style(feature) {
  return {
    fillColor: getColor(feature.properties.Owner),
    color: LineColor(feature.properties.Owner),
    fillOpacity: getFill(feature.properties.Owner),
    weight: lineWeight(feature.properties.Owner),
    opacity: 1,


  };
}

      // 2. BIP LOT CLICK / BINDPOPUP
      var lotClick = function (feature, layer) {
          // HIDE NULL VALUES
          var c_Name = feature.properties.c_Name;
            if (c_Name == null)
             {
            return false;
          } else {
           var c_Name = feature.properties.c_Name;
          };

        layer.bindPopup("<strong>" + 
        feature.properties.c_Name + "</strong>" + "<br>" +
        feature.properties.Owner + "<br>" +
        "narrative info here" + "</p6>");
      };

      // 3. BIP LOT Label / BINDTooltip / NOT WORKING
      var lotLabel = function (feature, layer) {
        layer.bindTooltip("<strong>" + feature.properties.c_Name,{permanent:true}).openTooltip();
      };

    biplotsGeoJSON = L.geoJson(biplots, {
        style: style, 
        onEachFeature: lotClick
        
  });

// LOAD DATA LAYERS LAST TO CONTROL ORDER: 
    shorelineGeoJSON.addTo(map);
    biplotsGeoJSON.addTo(map);
    map.fitBounds([
      [40.715745,-73.971548],
      [40.731584,-73.944919]
//40.723351,-73.961028

  ]);
});
}


//addbiplots(); 

