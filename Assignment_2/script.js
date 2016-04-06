
//'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'


//$(document).ready(function () {
//var map = L.map('map').setView([40.731649,-73.977814], 10);

function addTileLayer(map) {
	L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
	   attribution: 'Map tiles by <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	    maxZoom: 18
	}).addTo(map);
}
var oddLotsData;
  
  // add sql data from cartodb odd lots file	
  function addDataToMap(dataLayer) {
	var url = 'https://eichnersara.cartodb.com/api/v2/sql?' + $.param({
	    q: 'SELECT * FROM bk_oddlots ORDER BY address DESC LIMIT 500',
	    format: 'GeoJSON'
	});
	   $.getJSON(url)

	   .done(function (data) {
		   var oddlotsLayer = data
		   var lotStyle = {
		     	color: '#ff4000',
		     	fillColor : "#ff4000",
		        weight: 3,
	        	opacity: .9
	        };

		var lotClick = function (feature, layer) {
			layer.bindPopup("<strong>" + feature.properties.address + "</strong>" + "," + "<br/>" + feature.properties.ownername );
		    }
		    
		    oddLotsData = L.geoJson(oddlotsLayer, {
		    	style: lotStyle,
		    	onEachFeature: lotClick
		    }).addTo(map); 
	     
	      map.fitBounds(oddLotsData.getBounds());

		});
					// double quotes in sql means column, single quotes are for strings so all text is single quotes
	$('.choice').change(function () {
		var sql = 'SELECT * FROM bk_oddlots';
		if ($(this).val() === 'ownertype') {
		}
		else if ($(this).val() === 'null'){}
		else { 
			sql = "WHERE ownertype = '" +  ($(this).val()) + "'";
		}
	    var url = 'https://eichnersara.cartodb.com/api/v2/sql?' + $.param({
	      q: 'sql', 
	      format: 'GeoJSON'
	    });
	    $.getJSON(url)

      	.done(function (data) {
      	 console.log(data);
        oddLotsData.clearLayers();
        oddLotsData.addData(data);
	  	});

	$(document).ready(function () {
		var map = L.map('map').setView([40.731649,-73.977814], 10);
		var dataLayer = L.geoJson(null).addTo(map);

	  	addTileLayer(map);
	    addDataToMap(dataLayer, $(this).val()); 
	    	});
 // var dataLayer = L.geoJson(null).addTo(map);
		});
		};
	

//});
	