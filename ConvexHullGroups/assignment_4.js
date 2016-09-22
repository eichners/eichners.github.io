$(document).ready(function () {
var map = L.map('map').setView([40.71,-73.93], 12);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
maxZoom: 19
}).addTo(map);

  console.log('anything');
  
 $.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT ST_Transform(ST_Buffer(the_geom_webmercator, 300), 4326) AS the_geom FROM bk_oddlots_copy &format=GeoJSON')
   .done(function (data) {
    L.geoJson(data, {
        
        style: function (feature)  {
            var value = feature.properties.lottype;
                var style = {
                stroke: false,
                fillOpacity: 0.2,
                fillColor: 'red'
                };
           return style;
        }
        }).addTo(map);  
    });
   $.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT ST_Transform(ST_Convexhull(ST_Collect(the_geom_webmercator)), 4326) AS the_geom FROM bk_oddlots_copy GROUP BY schooldist &format=GeoJSON')
   .done(function (data) {
    L.geoJson(data, {

        style: function (feature) {
           // var value = feature.properties.lottype;
                var style = {
                stroke: 2,
        color: 'white',
                fillOpacity: 0.5,
                fillColor: 'green'
                };
           return style;
        }
            var lotClick = function (feature, dataLayer) {
        dataLayer.bindPopup("This odd lot is in school district " + 
            "<strong>" + feature.properties.schooldist + "</strong>");
    }

    oddLotsGeoJSON = L.geoJson(dataLayer, {
        style: lotStyle,
        onEachFeature: lotClick
    });
        }).addTo(map);  
    });
});