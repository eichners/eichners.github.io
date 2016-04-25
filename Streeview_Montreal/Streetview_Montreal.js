// 1. change default serach markers to circles
// 2. connect each listing marker to a streetview
// 3. put that streetview into a popup

$(document).ready(function () {
    var map = L.map('map').setView([45.489502,-73.578873], 10);
	var getStreetView;


// STREETVIEW FUNCTION TO BE SET WTIH LISTINGS LOCATION:
// I moved this into the object that sets the popup windows. should it stay here?
	// lalt long have to come from listings layer define outside of that object
    //function getStreetview(lat, lng) {
    //var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?' + $.param({
     //       size: '300x300',
     //       location: lat + ',' + lng
       // });
    //    $('.streetview').attr('src', streetviewUrl);
    //}	

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
        L.geoJson(data, {
        // set streetView: latlng variable here?		 
		 
    // CREATE CIRCLE MARKER LAYER FROM GEOJSON LATLNG POINTS
            pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng);
            },
		
    // CREATE LISTENER LAYER TO CONNECT LISTINGS POINTS TO POPUP WINDOWS
    		onEachFeature: function(feature, layer){
            // I want to add an event handler and eventually put a streetview in it
                layer.on('click', function () {
        			// divs that will hold popup content -- STREET VIEW HERE TOO?:
        			var $content = $('<div></div>');
                    var $streetViewDiv = $('<div></div>');
    
                    $content.text('This place is in the neighborhood: ' +  feature.properties.neighbourhood + ' and it costs $' + feature.properties.price + ' a night.');

    // STREET VIEW OF LISTING LOCATION called with click, part of onEachFeature ****  right now lat and long don't seem to be defined and popup window is not adding streetview image           
                    // add an additional div with the streetview and style it separately
                    function getStreetView(feature, latlng) {
                    
                        var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?' + $.param({
                            size: '300x200',
                            location: lat + ',' + lng
                        });
                        $('.streetview').attr('src', streetviewUrl);
                        var coordinates = data.features[0].geometry.coordinates;
                        getStreetView(coordinates[1], coordinates[0]);
                    }
                    // .addClass('streetview');
                    // $streetViewDiv.append(getStreetView);
                    
              $('.streetview-image');
          //  };
            layer.bindPopup ($content.html()).openPopup();
          });    
        },
				
            style: function (feature) {
                var value = feature.properties.listings;
                    var style = {
                        radius: 4,
                        stroke: false,
                        fillOpacity: 0.5,
                        fillColor: 'red'
                    };
                return style;
            }
 
      }).addTo(map);  
//    });


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
//});