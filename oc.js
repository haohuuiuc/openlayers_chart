function init(){
	var map = new OpenLayers.Map('map');
	var lon = -90;
	var lat = 40;
	var zoom = 7;

	var wms = new OpenLayers.Layer.WMS("OpenLayers WMS",
		"http://vmap0.tiles.osgeo.org/wms/vmap0?",
		{layers: 'basic'},
		{isBaseLayer: true}
		);

	var request = OpenLayers.Request.GET({
		url: "site.json",
		callback: handler
	});
	function handler(request){
		console.log(request);	
	}
	
	
	var vectors = new OpenLayers.Layer.GML("Siting Frenquency",
	 "", {
	 	format: OpenLayers.Format.GeoJSON,
	 	//styleMap: styleMap,
	 	isBaseLayer: false,
	 	projection: new OpenLayers.Projection("EPSG:4326")
	 });
	
	map.addLayers([wms,vectors]);
	map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);
}
