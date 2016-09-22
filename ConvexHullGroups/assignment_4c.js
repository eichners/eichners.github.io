$(document).ready(function () {
var map = L.map('map').setView([40.71,-73.93], 13);

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
    console.log(data);
    var bufferData = data;
   
    var bufferStyle = function (feature, latlng) {

        var style = {
            weight: 2,
            color:"#1381ab",
            fillColor: 'White',
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

function addGroupData() {
  $.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT ST_Transform(ST_Convexhull(ST_Collect(the_geom_webmercator)), 4326) AS the_geom FROM oddlots_brooklyn_lotarea GROUP BY schooldist &format=GeoJSON')
  .done(function (data) {
    var groupData = data;
    console.log(data);

    var groupStyle = function (feature) {
      var style = {
        weight: 2,
        color:"green",
        fillColor: 'White',
        fillOpacity: 0.5
      };
      return style;
    }

    var groupClick = function (Feature, layer) {
       var popupContent = 'Odd Lots grouped by school district and buffered by 300 meters'
       // map.on('click', function(e) {
       // alert(e.latlng); 
       // });
       layer.bindPopup(popupContent)
    }
    lotGroupsGeoJSON = L.geoJson(groupData, {
        onEachFeature: groupClick,
        style:groupStyle,
    }).addTo(map);

  addStreetView()
  });
}

function addStreetView() {
  $.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM oddlots_brooklyn_lotarea &format=GeoJSON')
  .done(function (data) {
    var lotData = data;
    console.log(data);

    var lotStyle = function (feature) {
      var style = {
        weight: 2,
        color: "red",
        fillColor: "red",
        fillOpacity: 0.5
      };
      return style;
    }

    // trying to add location to 
    // I need to create a var = span here
    // do I need an onEachFeature as well? not if event populates a span or list.
    // ran out of time
    map.on('click', function(e) {
    $('.location').append($('<span></span>').text(e.latlng)); // e is an event object 
    });
        //  $.each(data.rows, function () {
       streetViewGeoJSON = L.geoJson(lotData, {
    //  onEachFeature: locationClick,
      style:lotStyle,
    }).addTo(map);

    bufferDataGeoJSON.addTo(map);
    lotGroupsGeoJSON.addTo(map);
    streetViewGeoJSON.addTo(map);
    map.fitBounds(lotGroupsGeoJSON.getBounds());
  });
  }

});


    // gave up on following: STREETVIEW
  //// I wanted to add street view photos of closest location to lot here:
  // how do I add the lat long from console.log(data):which returns:
  // 
  // Object {type: "FeatureCollection", features: Array[439]}
      // features:
      // Array[439]
      // [0 … 99]
      // [100 … 199]
      // 100
      // :
    
      // coordinates
      // Array[2]
      // 0
      // :
      // -73.931959
      // 1
      // :
      // 40.684937
      // length
      // :
      // 2
   // var getStreetView = function (lat, lng) {
  //    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?' + $.param({
  //    size: '300x300',
  //    location: lat + ',' + lng
  //    });
//      $('.streetview').attr('src', streetviewUrl);
//    }

   // var locationClick = function (Feature, latlng) {
   //     var popupContent = getStreetViewPhoto;
   //     layer.bindPopup(popupContent)
   //   }
    //    .done(function(data) {
    //   searchLayer.addData(data.features);
    //   map.fitBounds(searchLayer.getBounds());

    //   var coordinates = data.features[0].geometry.coordinates;
    //   getStreetview(coordinates[1], coordinates[0]);
    // });


//});






