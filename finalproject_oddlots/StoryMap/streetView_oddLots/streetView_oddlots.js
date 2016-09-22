$(document).ready(function () {
var map = L.map('map').setView([40.64,-73.96], 13);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
maxZoom: 19
}).addTo(map);

 // console.log('anything');
var bufferDataGeoJSON;
var lotGroupsGeoJSON;
var streetViewGeoJSON;


addBufferData(); 

function addBufferData() {
//function addBufferedData() {
 $.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT ST_Transform(ST_Buffer(the_geom_webmercator, 300), 4326) AS the_geom FROM oddlots_brooklyn_lotarea &format=GeoJSON')
   .done(function (data) {
    //console.log(data);
    var bufferData = data;
   
    var bufferStyle = function (feature, latlng) {

        var style = {
            weight: 1,
            color:"#1381ab",
            fillColor: '#f4f4f0',
            fillOpacity: 0.5
        };
        return style;
    };
  
    bufferDataGeoJSON = L.geoJson(bufferData, {
        style: bufferStyle,
     }).addTo(map);

    addGroupData();
  });
}

// GROUP FUNCTION CONVEX HULL
function addGroupData() {
  $.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT ST_Transform(ST_Convexhull(ST_Collect(the_geom_webmercator)), 4326) AS the_geom FROM oddlots_brooklyn_lotarea GROUP BY schooldist &format=GeoJSON')
  .done(function (data) {
    var groupData = data;
    //console.log(data);

    var groupStyle = function (feature) {
      var style = {
        weight: 1.5,
        color:"#3E7BB6",
        fillColor: 'White',
        fillOpacity: 0.5
      };
    return style;
  }

// BIND POUPUP ON GROUPINGS
  // var groupClick = function (Feature, layer) {
  //   var popupContent = 'Odd Lots grouped by school district and buffered by 300 meters'
  //      // map.on('click', function(e) {
  //      // alert(e.latlng); 
  //      // });
  //   layer.bindPopup(popupContent)
  // }
  lotGroupsGeoJSON = L.geoJson(groupData, {
    //onEachFeature: groupClick,
    style:groupStyle,
  }).addTo(map);

  addStreetView()
  });
}


// STREET VIEW FUNCTIONS
var getStreetView;
//var streetviewUrl;
var datalayer;
var latlng;

function addStreetView() {
  $.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT *, ST_X(ST_Centroid(the_geom)) AS long, ST_Y(ST_Centroid(the_geom)) AS lat FROM oddlots_brooklyn_lotarea &format=GeoJSON')
  .done(function (data) {
    var lotData = data;
   // console.log(data);




// LOT STYLES
  var lotStyle = function (feature) {
    //console.log(feature);
    var style = {
      weight: 2,
      color: "red",
      fillColor: "red",
      fillOpacity: 0.5
    };
    return style;
  }
    var lat;
    var lng;
// // STREET VIEW OF LISTING LOCATION called with click, part of onEachFeature       
  var locationClick = function (feature, layer) {
      layer.on('click', function (){
        console.log(feature.properties);
        // log returns: {"type":"Point","coordinates":[-74.0203155304032,40.65304806905]}
        console.log('click');
        lat = feature.properties.lat;
        lng = feature.properties.long;
      var $content = $('<div></div>');
       //$content.text('Owner: ' +  feature.properties.ownername + '<br/>' + feature.properties.address);
      var location = (lat + ',' + lng);
          console.log(lat, lng);

  // CALL STREETVIEW WITH CLICK AND SEND IT TO POPUP WINDOW 

      function getStreetView(layer, properties) {

        console.log(feature.properties.long);
   
        var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?' + $.param({
          size: '300x200',
          location: location
        });
        var $image = $('<img></img>');
        console.log(streetviewUrl);
        // log returns: https://maps.googleapis.com/maps/api/streetview?size=300x200&location=%22%2C%7B
        $image.attr('src', streetviewUrl);
        $content.append($image)                
      }

      getStreetView(layer, data);
      layer.bindPopup ($content.html()).openPopup();
    });
  };

      streetViewGeoJSON = L.geoJson(lotData, {
      onEachFeature: locationClick,
      style:lotStyle,
  }).addTo(map);
 
    bufferDataGeoJSON.addTo(map);
    lotGroupsGeoJSON.addTo(map);
    streetViewGeoJSON.addTo(map);
    //map.fitBounds(streetViewGeoJSON.getBounds());
 
});
};
});
