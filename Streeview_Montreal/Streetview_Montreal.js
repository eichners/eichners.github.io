// 1. change default serach markers to circles
// 2. connect each listing marker to a streetview
// 3. put that streetview into a popup

$(document).ready(function () {
    var map = L.map('map').setView([45.489502,-73.578873], 10);
	var getStreetView;


// SEARCH LAYER 
    var searchLayer = L.geoJson(null, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.label);
    		//where does label come from?
    		console.log(feature);
            layer.on('click', function(e) {
                coordinate = (e.lat,lng);
                // console.log(e.lat,lng);	
            });
        }
    }).addTo(map);
	
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
maxZoom: 19
}).addTo(map);

	
// MAPZEN SEARCH FUNCTION 	
    $('.search').keyup(function () {
        searchLayer.clearLayers();

        var urlSearch = 'https://search.mapzen.com/v1/search?' + $.param({
            text: $(this).val(),
            api_key: 'search-g79j5Zc',
            size: 5,
            'boundary.circle.lon':'-73.8073471',
        	'boundary.circle.lat':'45.5544945',
        	'boundary.circle.radius':'35'
        });
            // rectangle bounds : -73.978157,45.335013,-73.297005,45.718885
    	    // center: 45.5544945,-73.8073471, RADIUS 35 KM

    	$.getJSON(urlSearch)
    	.done(function (data) {
    	    searchLayer.addData(data.features);
    	    map.fitBounds(searchLayer.getBounds());
         });
    });


// LISTINGS MARKERS, POPUPS with text and  STREETVIEW 
$.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM listings &format=GeoJSON')
    .done(function (data) {
        var listings = data;
        console.log(data);
       // L.geoJson(data, {
        // set streetView: latlng variable here?		 
		 
// CREATE CIRCLE MARKER LAYER FROM GEOJSON LATLNG POINTS
            var listingsPointToLayer = function (feature, latlng) {

                var listingPrice = feature.properties.price 
                //console.log(data);          

                var listingMarker = L.circleMarker(latlng, {
                        radius: markerRadius(listingPrice),
                        stroke: false,
                        fillOpacity: 0.5,
                        fillColor: markerColor(listingPrice)                    
                    });
                return listingMarker;
            }

            function markerRadius (listingPrice) {
                return  listingPrice > 3000 ? 30 :
                        listingPrice > 2000 ? 25 :
                        listingPrice > 1000 ? 20 :
                        listingPrice > 500 ? 15 :
                        listingPrice > 250 ? 10 :
                        listingPrice > 150 ? 8 :
                        listingPrice > 100 ? 6 :
                        listingPrice > 0 ? 4 :
                                2 ;
            }

            function markerColor (listingPrice) {
                return  listingPrice > 3000 ? '#2171b5' :
                        listingPrice > 2000 ? '#1588f' :
                        listingPrice > 1000 ? '#72b3f4' :
                        listingPrice > 500 ? '#fe8a17' :
                        listingPrice > 250 ? '#fe8a17' :
                        listingPrice > 150 ? '#FF0080' :
                        listingPrice > 100 ? '#ff084a' :
                        listingPrice > 0 ? 'red' :
                                '#1A68B2' ;
            }
		

// CREATE LISTENER LAYER TO CONNECT LISTINGS POINTS TO POPUP WINDOWS
        var listingClick = function (feature, layer) {
    		//onEachFeature: function(feature, layer){
            // add an event handler and eventually put a streetview in it
                layer.on('click', function () {
                    console.log(layer.getLatLng());

        			// divs that will hold popup content:
        			var $content = $('<div></div>');
                    //var $streetViewDiv = $('<br/><div></div>');
                    // need jquery funciton here to add new html element to content for streetview
                    $content.text('This place is in the neighborhood: ' +  feature.properties.neighbourhood + ' and it costs $' + feature.properties.price + ' a night.' );


// STREET VIEW OF LISTING LOCATION called with click, part of onEachFeature       
                    // add an additional div with the streetview and style it separately
                    function getStreetView(latlng) {
                        var lat = latlng.lat;
                        var lng = latlng.lng;
                        var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?' + $.param({
                            size: '300x200',
                            location: lat + ',' + lng
                        });
                        var $image = $('<img></img>');
                        console.log(streetviewUrl);
                        $image.attr('src', streetviewUrl);
                        $content.append($image)                
                    }

                getStreetView(layer.getLatLng());
                layer.bindPopup ($content.html()).openPopup();
            });  
        } 
    L.geoJson(listings, {
        pointToLayer: listingsPointToLayer,
        onEachFeature: listingClick
    }).addTo(map);    
    



// GET LISTINGS DATA AND SHOW IN SEPARATE LIST
  var url = 'https://eichnersara.cartodb.com/api/v2/sql?' + $.param({
    q: 'SELECT COUNT(listings) AS total, MIN(price) AS minimum, MAX(price) AS maximum, AVG(price) AS average FROM listings'
    });
    $.getJSON(url)

     .done(function (data) {
	  console.log(url);

      $('.total').text(data.rows[0].total);
	  $('.average').text(data.rows[0].average);
	  $('.minimum').text(data.rows[0].minimum);
      $('.maximum').text(data.rows[0].maximum);

    });
}); 
});
