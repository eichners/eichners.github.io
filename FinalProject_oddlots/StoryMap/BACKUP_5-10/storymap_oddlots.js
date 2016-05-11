$(document).ready(function () {
  cartodb.createVis('map', 'https://eichnersara.cartodb.com/api/v2/viz/83b96ef2-13b1-11e6-953b-0e787de82d45/viz.json', {
    cartodb_logo: false
  })
  .done(function (vis, layers) {
    // layers and sublayers not available outside of this createVus().done() function)
    var map = vis.getNativeMap();
    brooklynTaxLotLayer = layers[1].getSubLayer(0);
            sublayer.setInteraction(true);
            tooltip:false;
    queensTaxLotLayer = layers[1].getSubLayer(1);
            //sublayer.setInteraction(true);
            tooltip:false;
    brooklynOddLotLayer= layers[1].getSubLayer(2);
            //sublayer.setInteraction(true);
           
    queensOddLotLayer= layers[1].getSubLayer(3);
            //sublayer.setInteraction(true);
            //option:option;
  });
});