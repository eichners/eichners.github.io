
// SCHOOL DEMOGRAPHICS MAP: FINAL PROJECT 

var map = L.map('map');
    map.fitBounds([
    [40.685626, -73.956567],
    [40.700211, -73.989289]
]);
var OpenMapSurfer_Grayscale = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
     minZoom: 11,
    maxZoom: 19,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
// var CartoDB_DarkMatterNoLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
//     subdomains: 'abcd',
//     maxZoom: 19
// });
// set a tile layer to be CartoDB tiles 
// var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
//   attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
// });

// add these tiles to our map
map.addLayer(OpenMapSurfer_Grayscale);

// set data layer as global variable so we can use it in the layer control below
var d13PolygonGeoJSON;
var SchoolDemographicsGeoJSON;
// //var demographicsCTPerSqMileGeoJSON;

// var leaflet_GeoJSON;

// function addDemographicsCT2013() {
// $.getJSON("geojson/DemogPerSqMi_CT_2013.geojson", functionI(data) {
//     var CT2013DemographicsStyle = data;

//     var CT2013Style = function (feature, layer)
// })
// // carry on with this function to add census tract demographic data
// }


addDistrict13(); 

function addDistrict13() {
// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
$.getJSON( "geojson/D13_polygon.geojson", function( data ) {
    var d13Polygon = data;
    // })addToMap;
    // should I be creating this style with a function or just by defining variable d13Style?
    var d13Style = function (feature, latlng) {

        var style = {
            weight: 2,
            color:"#1381ab",
            fillColor: 'White',
            fillOpacity: 0.5
        };
        return style;
    };
  
    d13PolygonGeoJSON = L.geoJson(d13Polygon, {
        style: d13Style,
     }).addTo(map);

    addSchoolData();
});
}

function addSchoolData() {

// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
$.getJSON( "geojson/SchoolDemographics_WGS84_.geojson", function( data ) {
    var dataset = data; // d3
    // draw the dataset on the map
    plotDataset(dataset);
    //console.log(data);
    //create the sidebar with links to fire polygons on the map
    createDropdown(dataset);
    
});
    // function to plot the dataset passed to it -- does this mean I can now access data with d when using d3?
    function plotDataset(dataset) {
    SchoolDemographicsGeoJSON = L.geoJson(dataset, {
        style: schoolStyle,
        onEachFeature: schoolsOnEachFeature


    }).addTo(map);
    }
       // createLayerControls(); 
}

    var schoolStyle = function (feature, geometry) {
        var schoolType = feature.properties.charter; 

        var style = {
           weight: 1,
            color:'Black',
            fillOpacity: .9,
            fillColor:schoolColor(schoolType)
        };
        return style;
    }

    function schoolColor(schoolType) {

        if (schoolType ==="charter") {
            fillColor = "#3798d2"
        } 
             else {
             fillColor = "#9bcc31"
             };
        return fillColor;   
    }
      


// empty L.popup so we can fire it outside of the map
var popup = new L.Popup();

// set up a counter so we can assign an ID to each layer
var count = 0;

// on each feature function that loops through the dataset, binds popups, and creates a count
var schoolsOnEachFeature = function(Feature, layer){


    // ...layer) refers to leaflet layer.on function below : that is considered a layer
    // *** parameters to feed into function should be dataset -- features
    var schoolInfo = (Feature.properties);
    // bind some feature properties to a pop up with an .on("click", ...) command. Do this so we can fire it both on and off the map
    layer.on("click", function (e) {
        var bounds = layer.getBounds();
        var popContent = Feature.properties.School + "<br ><strong>Total Enrollment 2015: </strong>" + Feature.properties.TotalEnroll 
        + "<br /><strong>Black: </strong>" + (Feature.properties.PerBlack*100).toFixed(1) + "%" + "<br>" 
        + "<strong>White: </strong>" +  (Feature.properties.PerWhite*100).toFixed(1) + "%"  + "<br>" 
        + "<strong>Asian: </strong>" +  (Feature.properties.PerAsian*100).toFixed(1) + "%" 
        + "<br>" + "<strong>Hispanic: </strong>" +  (Feature.properties.PerHispanic*100).toFixed(1) + "%"
        + "<br>" + "<strong>Percent qualifying for free lunch: </strong>" + Feature.properties.PercFreeLunch + "%"
        + "<br>" + "<strong>Percent English Language Learners: </strong>" + Feature.properties.PercELLs + "%";
        popup.setLatLng(bounds.getCenter());
        popup.setContent(popContent);
        map.openPopup(popup);

    });

    // add an ID to each layer so we can fire the popup outside of the map
    layer._leaflet_id = 'schoolsLayerID' + count; 
    // only do this count once
    // draw pie for first selected -- 
    if (count == 0) {
        updatePie(Feature),
        updatePie2(Feature), updatePie3(Feature);
    } 
        count++;
}



// function createLayerControls(){
//     // add in layer controls
//     var overlayMaps = {
//         "School racial diversity ": SchoolDemographicsGeoJSON,
//     };
//     // add control
//     L.control.layers(overlayMaps).addTo(map);   
// }

// create a container for the legend and set the location
var legend = L.control({position: 'bottomleft'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    // this is an html legend instead of leaflet generated through functions
    // circles for legend are svg elements
        div.innerHTML += 
            '<p><b>District 13, Brooklyn</b><br />' +
            '<svg class="left" width="22" height="20"><circle cx="10" cy="14" r="6" class="legendSvg1"/></svg><span>Charter School</span><br />' +
            '<svg class="left" width="22" height="20"><circle cx="10" cy="14" r="6" class="legendSvg2"/></svg><span>Public School</span><br /></p>' +
            '<p><b>Data</b><br />' +
            '<span>from the <a href=\"http://schools.nyc.gov/default.htm\">NYC DOE</a><br />' + 
            'and <a href=\"http://www.insideschools.org\">InsideSchools.org</a></span><br /></p>';
    return div;
}
// add the legend to the map
legend.addTo(map);



// function to create a list in the right hand column with links that will launch the pop-ups on the map
function createDropdown(dataset) {

    console.log(dataset);
    // use d3 to select the div and then iterate over the dataset appending a list element with a link for clicking and firing
    // first we'll create an unordered list ul elelemnt inside the <div id='list'></div>. The result will be <div id='list'><ul></ul></div>
    var school_dropdown = d3.select("#school_dropdown")
                .append("select")
                .attr("class","form-control")
                .on("change", change);

    var options = school_dropdown.selectAll("option")
            .data(dataset.features)
            .enter()
            .append("option")
            .html(function(d) {
                return d.properties.School;
            });

  function change() {
        // get id of selected and fire click
        var si = school_dropdown.property('selectedIndex');
        var leafletId = 'schoolsLayerID' + si; // leaflet array ids are set above at top of doc?
        console.log(leafletId);
        map._layers[leafletId].fire('click'); // ids are set for d3 and leaflet so both should be the same

        // get data out of selected and draw pie chart
        var s = options.filter(function (d, i) { return i === si }); 
        //.filter is standard javascript function, go through options and only return one where ids are the same
        console.log(s) // pulls out datum for this pie chart, s is a d3 object or array
        var feature = s.datum(); // s.datum()  extracts whatever is bound to this element (d3 function?)
        // draw pie chart
        updatePie(feature); 
        updatePie2(feature),
        updatePie3(feature);
    }
}

 ////**********///////// updatePie2(feature);
//   function change() {
//         var si = school_dropdown.property('selectedIndex');
//         var leafletId = 'schoolsLayerID' + si; 
//         console.log(leafletId);
//         map._layers[leafletId].fire('click'); 
//         var s = options.filter(function (d, i) { return i === si }); 

//         console.log(s) /
//         var feature = s.datum(); 
//         updatePie2(feature);
//     }


// ////**********///////// updatePie3(feature);
//   function change() {
//         var si = school_dropdown.property('selectedIndex');
//         var leafletId = 'schoolsLayerID' + si; 
//         console.log(leafletId);
//         map._layers[leafletId].fire('click'); 
//         var s = options.filter(function (d, i) { return i === si }); 
//         console.log(s)
//         var feature = s.datum();
//         updatePie3(feature);
//     }
//     }

//// *********create update pie 2 here, just like function updatePie(feature) {
// but with other data like ELL and reduced lunch}


////////////////////////PIECHART 
function updatePie(feature) { //passes in one feature from data set 

    // remove any previous content from svg
    d3.select('#d3vis').html(''); // set html(' ') to be empty: id is in new row in html doc. div there has an svg container as placeholder
    console.log(feature);
    // set up dataset

// ARRAY: 4 categories, all with same keys; labels: .... values: .... 
    var d3_dataset = [{"label":"Black", "value":100*(feature.properties.PerBlack).toFixed(1)}, 
                      {"label":"White", "value":100*(feature.properties.PerWhite).toFixed(1)}, 
                      {"label":"Asian", "value":100*(feature.properties.PerAsian).toFixed(1)},
                      {"label":"Hispanic", "value":100*(feature.properties.PerHispanic).toFixed(1)}];
                 //   {"label":"Data Not Available", "value":feature.properties.PerHispanic(null)}];     
                 // null value line says unexpected token : is a problem                 
    console.log(feature);

    // set width and height of drawing
    var width = $('.col-sm-3').width(), 
        height = width * .7, 
        radius = width / 2;

    // set color scale and range
    var color = d3.scale.ordinal() // tells d3 to pass in the string (label name) to determine color
        .range(["#2A87B5", "#bcbd22", "#ff7f0e", "#d62728", '#1A68B2']);

            //fillColor = "#ff7f0e"; fillColor = "#e53609";
    // set inner and outer radius
    var arc = d3.svg.arc() // set radius for center 
        .outerRadius(radius - 100)
        .innerRadius(50); // if not 0 this will be donut chart

    // set labels  change radius to change where text falls
    var labelArc = d3.svg.arc() // how far from edge
        .outerRadius(radius - 70) // setting label to start 100 px from edge of chart
        .innerRadius(radius - 70); // need to set both outer and inner or arc function won't work
        // we told it to anchor text in midle of string, so setting it to -10 makes labels hang off chart

    var pie = d3.layout.pie() // this is a d3 convenience function (d3.layout.whatever)
        .sort(null) // tell it to sort it by some attribute
        .value(function(d) { console.log(d); return d.value; }); // what value do we want to use? 
        // we created function with label and value so we'll pass that through an anonymous functino to pull out that d value

    var svg = d3.select("#d3vis") // selects and creates svg container 
                .append("svg")
                .attr("width", width) // set width and ht
                .attr("height", height) //explicitly sets them to be =
                .append("g")  // ** This is a way to keep drawing at center!! g container: transform property of svg to draw a g container at 00 and move to center of drawing
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); 
                // if you don't do this must figure out a way to draw pie chart in center of container

    var g = svg.selectAll(".arc") // select all class = arc elements
               .data(pie(d3_dataset)) // loading data run through pie function so certain attributes will come out of it 
               .enter() // binding the dataset defined above but also info about how wide, radius, etc. 
               .append("g") // made four of these
               .attr("class", "arc"); // classed them as arcs
               // g containers will be the slices of the pie -- g is the container for each slice  or path
               // this is one way to do this, not the only way
               // g tag will hold text as well

    g.append("path")
        .attr("d", arc) // cerate an attribute d for the path - we created arc function earlier around line 220
        .style("fill", function(d) { 
           // console.log(d); // this will show everything that has been bound to d with pie function
        return color(d.data.label); }); // now data is bound to d, setting which data to show needs another step down list : d.data.value ...
        //fill color is determined by layer


    g.append("text")  // .centroid gives centers 
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; }) // moves text around as needed
        .attr("dy", ".35em")
        .text(function(d) { return d.data.label + " (" + (d.data.value) + ")"; });

};


// ////////////////////////PIECHART  #2
function updatePie2(feature) { //passes in one feature from data set 

    // remove any previous content from svg
    d3.select('#d3vis2').html(''); // set html(' ') to be empty: id is in new row in html doc. div there has an svg container as placeholder
     console.log(feature);
    // set up dataset

// ARRAY: 4 categories, all with same keys; labels: .... values: .... 
    var d3_dataset2 = [{"label":"Free lunch", "value":feature.properties.PercFreeLunch},
                       {"label":"other", "value":100-(feature.properties.PercFreeLunch)}]; 

    // set width and height of drawing
    var width = $('.col-sm-3').width(), 
        height = width *.65, 
        radius = width / 2;

    // // set color scale and range
    var color = d3.scale.ordinal() // tells d3 to pass in the string (label name) to determine color
        .range(["#F7D009", "#B8B8B8"]);

            //fillColor = "#ff7f0e"; fillColor = "#e53609";
    // set inner and outer radius
    var arc = d3.svg.arc() // set radius for center 
        .outerRadius(radius - 100)
        .innerRadius(50); // if not 0 this will be donut chart

    // set labels  change radius to change where text falls
    var labelArc = d3.svg.arc() // how far from edge
        .outerRadius(radius - 70) // setting label to start 100 px from edge of chart
        .innerRadius(radius - 70); // need to set both outer and inner or arc function won't work
        // we told it to anchor text in midle of string, so setting it to -10 makes labels hang off chart

    var pie2 = d3.layout.pie() // this is a d3 convenience function (d3.layout.whatever)
        .sort(null) // tell it to sort it by some attribute
        .value(function(d) { console.log(d); return d.value; }); // what value do we want to use? 
        // we created function with label and value so we'll pass that through an anonymous functino to pull out that d value

    var svg2 = d3.select("#d3vis2") // selects and creates svg container 
                .append("svg")
                .attr("width", width) // set width and ht
                .attr("height", height) //explicitly sets them to be =
                .append("g")  // ** This is a way to keep drawing at center!! g container: transform property of svg to draw a g container at 00 and move to center of drawing
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); 
                // if you don't do this must figure out a way to draw pie chart in center of container

    var g2 = svg2.selectAll(".arc") // select all class = arc elements
               .data(pie2(d3_dataset2)) // loading data run through pie function so certain attributes will come out of it 
               .enter() // binding the dataset defined above but also info about how wide, radius, etc. 
               .append("g") 
               .attr("class", "arc"); // classed them as arcs
               // g containers will be the slices of the pie 

    g2.append("path")
        .attr("d", arc) // cerate an attribute d for the path - we created arc function earlier around line 220
        .style("fill", function(d) { 
        return color(d.data.label); }); 

    g2.append("text")  // .centroid gives centers 
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; }) // moves text around as needed
        .attr("dy", ".35em")
        .text(function(d) { return d.data.label + " (" + (d.data.value) + ")"; });
};

////////////////////////PIECHART  #3
function updatePie3(feature) { //passes in one feature from data set 

    // remove any previous content from svg
    d3.select('#d3vis3').html(''); // set html(' ') to be empty: id is in new row in html doc. div there has an svg container as placeholder
     // console.log(feature);
    // set up dataset

// ARRAY: 2 categories, all with same keys; labels: .... values: .... 
    var d3_dataset3 = [{"label":"ELL Students", "value":feature.properties.PercELLs},
                      {"label":"English speakers" ,"value":100-(feature.properties.PercELLs)}];
     // console.log(feature);

    // set width and height of drawing
    var width = $('.col-sm-3').width(), 
        height = width * .7, 
        radius = width / 2;

    // set color scale and range
    var color = d3.scale.ordinal()
        .range(["#EB8D13", "#B8B8B8"]);

    // set inner and outer radius
    var arc = d3.svg.arc() // set radius for center 
        .outerRadius(radius - 100)
        .innerRadius(50); // if not 0 this will be donut chart

    // set labels  change radius to change where text falls
    var labelArc = d3.svg.arc() // how far from edge
        .outerRadius(radius - 82) // setting label to start 100 px from edge of chart
        .innerRadius(radius - 82); // need to set both outer and inner or arc function won't work

    var pie3 = d3.layout.pie() // this is a d3 convenience function (d3.layout.whatever)
        .sort(null) // tell it to sort it by some attribute
        .value(function(d) { console.log(d); return d.value; }); // what value do we want to use? 

    var svg3 = d3.select("#d3vis3") // selects and creates svg container 
                .append("svg")
                .attr("width", width) // set width and ht
                .attr("height", height) //explicitly sets them to be =
                .append("g")  // ** This is a way to keep drawing at center!! g container: transform property of svg to draw a g container at 00 and move to center of drawing
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); 

    var g3 = svg3.selectAll(".arc") // select all class = arc elements
               .data(pie3(d3_dataset3)) // loading data run through pie function so certain attributes will come out of it 
               .enter() // binding the dataset defined above but also info about how wide, radius, etc. 
               .append("g") // made four of these
               .attr("class", "arc"); // classed them as arcs
               // g containers will be the slices of the pie 

    g3.append("path")
        .attr("d", arc) // cerate an attribute d for the path - we created arc function earlier around line 220
        .style("fill", function(d) { 
        return color(d.data.label); }); 

    g3.append("text")  // .centroid gives centers 
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; }) // moves text around as needed
        .attr("dy", ".35em")
        .text(function(d) { return d.data.label + " (" + (d.data.value) + ")"; });;
// try incorporating below code to get rid of overlapping labels, or labels for values less than 5%
        //.text(function(d) {
        // if(d.endAngle - d.startAngle<4*Math.PI/180){return ""}
        // return d.data.key; });

};


function addToMap() {
     // district 13 shape
d13PolygonGeoJSON.addTo(map);

// school data
SchoolDemographicsGeoJSON.addTo(map);
leaflet_GeoJSON.addToMap;
};

// function numberWithCommas(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//}
// /// to remove numbers after decimal point: 
function numberWithoutDecimals(x) {
 return x.toFixed().replace(1);
}


//

// ///////////////////////////////////////////////

  