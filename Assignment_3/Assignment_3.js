$(document).ready(function () {
  // Create a map centered on NYC
var map = L.map('map').setView([40.71,-73.93], 12);

// set a tile layer to be CartoDB tiles

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
maxZoom: 19
}).addTo(map);

// add 311 complaint data, style circlemarkers 
//function addComplaintData() {
$.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM table_311_noise_complaints_09_2015_se &format=GeoJSON') 
   .done(function (data) {
      //var complaintsLayer = 
      L.geoJson(data, {
  
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        },

        onEachFeature: function (feature, layer) {
        layer.bindPopup("Address: " + 
            "<strong>" + feature.properties.incident_address  + "</strong>" + 
            " Complaint description: " + 
            "<strong>" + feature.properties.descriptor + "</strong>");
        },
     
        style: function (feature) {
            var value = feature.properties.complaint_type;
            if(value === 'Noise - Helicopter'){
                fillColor = "#B2DF8A";
            }
            if(value === 'Noise - Commercial'){
                fillColor = "#33A02C";
            }
            if(value === 'Noise - House of Worship'){
                fillColor = "#FB9A99";
            }
            if(value === 'Noise - Street/Sidewalk'){
                fillColor = "#E31A1C";
            }
            if(value === 'Noise - Vehicle') { 
                fillColor = "#FDBF6F";
            }
             if(value === 'Noise - Park') { 
                fillColor = "#FF7F00";
            }
            if(value === 'Noise') { 
                fillColor = "#3E7BB6";
            }
            if(value === 'Collection Truck Noise') { 
                fillColor = "#7B00B4";
            }
        
            var style = {
                radius: 3,
                stroke: false,
                fillOpacity: 0.5,
                fillColor: fillColor
            }
            //console.log(data);
            return style;
        }
        //complaintsGeoJSON = L.geoJson(complaintsLayer, {
        //     style: complaintStyle,
        //     onEachFeature: complaintClick 
        }).addTo(map);
});


///////////////////////////////////////////////////////////////////////////////
// >>>>>>>  MASK CANVAS plugin code, from the demo source  >>>>>>>>>>>>>>>>
// should this whole block of code be wrapped in a mask layer specific function? 

L.control.scale().addTo(map);

  var initRadius = 500;
  $('input.range').attr('value', initRadius);

//line 83 Uncaught TypeError: L.TileLayer.MaskCanvas is not a function
  var coverageLayer = new L.TileLayer.MaskCanvas({
      radius: 5, 
      useAbsoluteRadius: true, 
      opacity: 0.5, 
      color: '#000', 
      radius: initRadius, 
      noMask: false, 
  });

// I am basing this code on the source from the plugin github pages
// I don't see where id is defined. I assume this is a URL where the data is called from because it gets added to the URL and .json
// how should the url be added and id be defined? I tried below:
    var loadOverlay = function(id) {
        var url = 'https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM table_311_noise_complaints_09_2015_se' + '.json';
        $.getJSON(url).success(function(data) {
            coverageLayer.setData(data);
            map.fitBounds(coverageLayer.bounds);
            map.addLayer(coverageLayer);
 
        }).error(function(err) {
            alert('An error occurred', err);
        });
    };

    loadOverlay('complaints')

    $('input.range').change(function() {
    var value = $(this).val();
    coverageLayer.setRadius(value);
    });

});




