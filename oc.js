/*
Import google chart(old version) to openlayers
*/

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
	
	map.addLayer(wms);
	map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);

	var vector = createBarChart("site.json", ['Supply','CSP','Biorefinery'], [30,40], "0,1", "a,0", "FF0000|00FF00|0000FF");
	map.addLayer(vector);

	var options = {
		onSelect: function(r){
			//construct popup message
			var msg = "<strong>" + r.attributes["Name"] + "</strong><br/>";
			msg += "Supply siting prob: " + (100*r.attributes["Supply"]).toFixed(2) + "%<br/>";
			msg += "CSP siting prob: " + (100*r.attributes["CSP"]).toFixed(2) + "%<br/>";
			msg += "Biorefinery siting prob: " + (100*r.attributes["Biorefinery"]).toFixed(2) + "%<br/>";

			var popup = new OpenLayers.Popup("chicken",
				new OpenLayers.LonLat(r.geometry.x, r.geometry.y),
				new OpenLayers.Size(200,120),
				msg,
				true);
			map.addPopup(popup);
		}
	}
	var select = new OpenLayers.Control.SelectFeature(vector, options);
	map.addControl(select);
	select.activate();
	
}
/*
This function generalize the spatial data chart creation based on google chart api
*/
function createBarChart(geojson_file, attr, chs_a, chds_t, chbh_t, chco_t){
	var context = {
		getChartURL: function(feature) {
			var values = "";
			attr.forEach(function(item, index){
				if(index != attr.length - 1)
					values += feature.attributes[item] + ',';
				else
					values += feature.attributes[item]
			});

			var charturl = 'http://chart.apis.google.com/chart?cht=bvg&chs=' + chs_a[0] + 'x' + chs_a[1] + '&chds=' + chds_t + '&chbh=' + chbh_t + '&chd=t:' + values + '&chco=' + chco_t  + '&chf=bg,s,ffffff00';

			// hide x,y axis
			charturl += '&chxt=x,y&chxs=0,000000,10,0,_,000000|1,000000,10,0,_,000000&chxl=0%3a||1%3a|';

			return charturl;
		}
	};

	var template = {
		fillOpacity: 1.0,
		externalGraphic: "${getChartURL}",
		graphicWidth: chs_a[0],
		graphicHeight: chs_a[1],
		strokeWidth: 0
	};

	var style = new OpenLayers.Style(template, {context: context});
	var styleMap = new OpenLayers.StyleMap({'default': style, 'select': {fillOpacity: 0.7}});

	var vectors = new OpenLayers.Layer.GML("Siting Frenquency",
	 "site.json", {
	 	format: OpenLayers.Format.GeoJSON,
	 	styleMap: styleMap,
	 	isBaseLayer: false,
	 	projection: new OpenLayers.Projection("EPSG:4326")
	 });

	return vectors;
}