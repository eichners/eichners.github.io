
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
		        return L.polygon(latlng);
		    },

		    onEachFeature: function(feature, layer){
	        	//console.log(feature);
	        	layer.bindPopup ('This odd lot address is ' +  feature.properties.address + ' and it is owned by ' + feature.properties.ownername + '.');
	    	},
 
		style: function (feature) {
			//var lotType = feature.properties.lottype;
	  		var style = {
	            fillOpacity: 0.9,
	            fillColor: 'orange',
	           	//stroke: 0.5,
	          	//color: 'black'
	      	};	      	    
	    
	        if (feature.properties.lottype === '6') {
            style.fillColor = 'green';
          	}

          	else if (feature.properties.ownertype === 'M') {
            style.fillColor = 'red';
          	}
		
			return style;
			}	
				
	    }).addTo(map);   

	    // oddLotsLayer.onEachLayer(function( Layer){
	    // console.log(feature.geometry.properties.lottype);
	//});
	
	map.fitBounds(oddLotsLayer.getBounds());
});
});

  