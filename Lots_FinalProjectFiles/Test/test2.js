var map = L.map('map').setView([40.71,-73.93], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/eichners/cinyxauhx0000a4np96vnt14t/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWljaG5lcnMiLCJhIjoiY2lrZzVneDI4MDAyZ3VkbTZmYWlyejUzayJ9.vEGckM-D3AjV4jXmdibXyw',{
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
maxZoom: 19
}).addTo(map);


var lotStyle;
var bkLotDatageoJSON;

// TAX LOT OUTLINES
$.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM bkmappluto_lottype&format=GeoJSON', function(data){
	var bkLotDataset = data;

    console.log(bkLotDataset);
    //create the sidebar with links to fire polygons on the map
  	//  createDropdown(bkLotDataset);
});

function plotDataset(bkLotDataset) {
	bkLotDatageoJSON = L.geoJson(bkLotDataset, {
	style: taxlotStyle
		//console.log(dataset);
	//	onEachFeature: schoolsOnEachFeature
	}).addTo(map); 
}
taxlotStyle = function (feature, geometry){
	console.log(feature, geometry);
	var lottype = feature.properties.lottype;
	 var style = { 
		weight: 1,
	    opacity: 0.9,
	    color: '#bfbfbe',
	    fillOpacity: 1,
	    fillColor: '#f4f4f0',
	    fillOpacity:1
		};	 
	return style;
}


// // BROOKLYN ODD LOTS
// var lotDatageoJSON;
// $.getJSON('https://eichnersara.cartodb.com/api/v2/sql?q=SELECT * FROM oddlots_brooklyn&format=GeoJSON', function(data){
// 	var lotDataset = data;
//     plotDataset(lotDataset);
//     //console.log(data);
//     //create the sidebar with links to fire polygons on the map
//     //createDropdown(lotDataset);
// });
// function plotDataset(lotDataset) {
// 	lotDatageoJSON = L.geoJson(lotDataset, {
// 		style: lotStyle
// 	//	onEachFeature: schoolsOnEachFeature
// 	}).addTo(map); 
// }
// lotStyle = function (feature, geometry){
//  	//console.log(feature, geometry);
// 	var lottype = feature.properties.lottype;
//  	var style = { 
// 		weight: 1,
//         opacity: 0.9,
//        	color: lotColor(lottype),
//         //fillOpacity: fillOpacity(lottype),
//         fillColor: lotFillColor(lottype),
//         fillOpacity:1
// 	};	 
// return style;
// }

// }