//QUERY FOR CENTROIDS: SELECT *, ST_AsText(ST_Centroid(the_geom)) FROM matta_clark_lots_queens
// GOALS
// use this for mustache popups; 
// tie popup background color to lot classification
// Get street view for each lot in addition to other data

// This code document is a mess because I really didn't know how to go aobut using the sublayers or mustache in this context, let 
// alone with event listeners, etc. so lots of extra code I started trying out is still here. 
// moving to a different set of documents to try to accomplish one of these goals! This will serve
// as exploration map for the time being since data is loaded and styled.
// hover windows still a problem.

var brooklynOddLots;
var queensOddLots;
var brooklynTaxLots;
var queensTaxlots;

var hoverBrooklyn;


$(document).ready(function () {
  cartodb.createVis('map', 'https://eichnersara.cartodb.com/api/v2/viz/2f16f194-1799-11e6-abfd-0e5db1731f59/viz.json', {
    cartodb_logo: false
    //infowindow: true,
    //tooltip: true,
  })
  .done(function (vis, layers) {
    // layers and sublayers not available outside of this createVus().done() function)
    var map = vis.getNativeMap();

    //BROOKLYN BASE TAX MAP
    brooklynTaxLots = layers[1].getSubLayer(0);
           brooklynTaxLots.setInteraction(true);
   //          brooklynTaxLots.on('mouseover', function() {
   //  			$('#map').css('cursor', 'pointer');
			// });
			// brooklynTaxLots.on('mouseout', function() {
   // 		 		$('#map').css('cursor', 'auto');
			// });

            // brooklynTaxLots.tooltip.set({
            // 	mouseover: false});

          // brooklynTaxLots.on ('mouseover', function(e) {
          // 	$('.cartodb-tooltip').css({'display':'none'});
          // });
    //QUEENS BASE TAX MAP          
    queensTaxlots = layers[1].getSubLayer(1);
    //        queensTaxlots.setInteraction(true);
    //       queensTaxlots.on('mouseover', function(e,latlng, pos, data, layerNumber) {
    //      	$('.cartodb-tooltip').css({'display':'none'});
    //      });

    //BROOKLYN ODDLOTS
    brooklynOddLots= layers[1].getSubLayer(2);
            brooklynOddLots.setInteraction(true);
            //brooklynOddLots.on ('mouseover', function(e,latlng, pos, data, layerNumber) {
          	//$('.cartodb-tooltip').css({'display':'true'});
          //});
            //brooklynOddLots.on(map.on('click', function(e) {
    			//alert(e.latlng);
			//}));

    //QUEENS GMC ODDLOTS       
    queensOddLots= layers[1].getSubLayer(3);
            queensOddLots.setInteraction(true);
             // sublayer.on('featureOver', function(e, latlng, pos, data, layerNumber) {
             //            cartodb.log.log(e, latlng, pos, data, layerNumber);
             //            $("#hover").css({'display':'none','left':pos.x-75,'bottom':($(window).height()-pos.y+20), 'cursor': 'pointer'});
             //            $("#hover").find('p').text(data.place);
              
              });
});

  // $('.brooklynLots').click(function () {
  //   // Now when someone clicks on a button on the page
  //   // we can interact with the sublayer that we put in
  //   // our variable     var listingClick = function (feature, layer) {
  //   		//onEachFeature: function(feature, layer){
  //           // add an event handler and eventually put a streetview in it
  //               layer.on('click', function () {
  //                   console.log(layer.PointFromPolygon());

  //       			// divs that will hold popup content:
  //       			var $content = $('<div></div>');
  //                   //var $streetViewDiv = $('<br/><div></div>');
  //                   // need jquery funciton here to add new html element to content for streetview
  //                   $content.text('This place is in the neighborhood: ' +  feature.properties.neighbourhood + ' and it costs $' + feature.properties.price + ' a night.' );


// STREET VIEW OF LISTING LOCATION called with click, part of onEachFeature       
        //             // add an additional div with the streetview and style it separately
        //             function getStreetView(latlng) {
        //             	var PointFromPolygon = function ()
        //                 var lat = latlng.lat;
        //                 var lng = latlng.lng;
        //                 var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?' + $.param({
        //                     size: '300x200',
        //                     location: lat + ',' + lng
        //                 });
        //                 var $image = $('<img></img>');
        //                 console.log(streetviewUrl);
        //                 $image.attr('src', streetviewUrl);
        //                 $content.append($image)                
        //             }

        //         getStreetView(layer.getLatLng());
        //         layer.bindPopup ($content.html()).openPopup();
        //     });  
        // } 
    
//   });


//   });
// });
