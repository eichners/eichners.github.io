
$(document).ready(function () {
	var map = L.map('map').setView([40.731649,-73.977814], 10);
	  
	L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
	    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
	    maxZoom: 18

	}).addTo(map);


	$.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM bk_oddlots &format=GeoJSON')
	
	.done(function (data) {
		
		var oddLotsLayer = L.geoJson(data, {

		    pointToLayer: function (feature, latlng) {
		        return L.circleMarker(latlng);
		    },

		    onEachFeature: function(feature, layer){
	        	//console.log(feature);
	        	layer.bindPopup ('This odd lot address is ' +  feature.properties.address + ' and it is owned by ' + feature.properties.ownername + '.');
	    	},
 
		style: function (feature) {
			//console.log(feature);
			//var lotType = feature.properties.lottype;
	  		var style = {
	            fillOpacity: 1,
	            fillColor: 'black',
	           	stroke: 9,
	          	color: 'red'
	      	};	      	    
	    
	        if (feature.properties.lottype === '6') {
            style.fillColor = 'green';
          	}

          	else if (feature.properties.lottype === '8') {
            style.fillColor = 'blue';
          	}
		
			return style;
			}	
				
	    }).addTo(map); 
	    map.fitBounds(oddLotsLayer.getBounds());  
	});
	    // oddLotsLayer.onEachLayer(function( Layer){
	    // console.log(feature.properties.lottype);
	
});

  