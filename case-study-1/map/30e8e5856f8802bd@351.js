// https://observablehq.com/@yuanzf/mapbox-gl-bubble-map_immgrants-by-metropolitan-area_colo@351
export default function define(runtime, observer) {
  const main = runtime.module();
  
  main.variable(observer("link")).define("link", ["html"], function(html){return(
html`<link href='https://unpkg.com/mapbox-gl@1.9.0/dist/mapbox-gl.css' rel='stylesheet' />`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("https://d3js.org/d3.v5.min.js")
)});
  main.variable(observer("mapboxgl")).define("mapboxgl", ["require"], async function(require)
{
  let mapboxgl = await require('mapbox-gl@1.9.0');
  return mapboxgl;
}
);
  main.variable(observer("cities")).define("cities", ["d3"], async function(d3){return(
(await d3.json('../data/final-bookings-by-town.json'))
	.map(c => {
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: [+c.lon, +c.lat] },
        properties: { name: c.city, total:+c.total, count:+c.count, bulletsize:+c.bulletsize }
      }
    })
)});
  main.variable(observer("container")).define("container", ["html"], function(html){return(
html`<div style='height:650px;' />`
)});
  main.variable(observer("viewof circleColor")).define("viewof circleColor", ["html"], function(html){return(
html`<input type="color" value="#ff0400">`
)});
  main.variable(observer("circleColor")).define("circleColor", ["Generators", "viewof circleColor"], (G, _) => G.input(_));
  main.variable(observer("color0")).define("color0", ["d3","cities"], function(d3,cities){return(
d3.scaleOrdinal()
    .domain(cities.map(d => d.bulletsize))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), cities.length).reverse())
    .unknown("#ccc")
)});
  main.variable(observer("viewof circleStrokeColor")).define("viewof circleStrokeColor", ["html"], function(html){return(
html`<input type="color" value="#ffffff">`
)});
  main.variable(observer("circleStrokeColor")).define("circleStrokeColor", ["Generators", "viewof circleStrokeColor"], (G, _) => G.input(_));
  main.variable(observer("viewof bgColor")).define("viewof bgColor", ["html"], function(html){return(
html`<input type="color" value="#f8f8f9">`
)});
  main.variable(observer("bgColor")).define("bgColor", ["Generators", "viewof bgColor"], (G, _) => G.input(_));
  main.variable(observer("viewof circleOpacity")).define("viewof circleOpacity", ["html"], function(html){return(
html`<input type="number" min="0", max="1" step="0.01" value="0.65">`
)});
  main.variable(observer("circleOpacity")).define("circleOpacity", ["Generators", "viewof circleOpacity"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["mapboxgl","container","circleOpacity","circleStrokeColor","bgColor","cities"], function*(mapboxgl,container,circleOpacity,circleStrokeColor,bgColor,cities)
{
  let map = this;
  
  if (!map) {
    // Create the \`map\` object with the mapboxgl.Map constructor, referencing
    // the container div
    mapboxgl.accessToken = "pk.eyJ1IjoidmNuZG1hcCIsImEiOiJjandqNmxjdTUwMmpsNDNvNjFwYTF5cTF3In0.RzRybuhgacO63O75LtpIvw";
    map = new mapboxgl.Map({
      container,
      zoom: 1,
      style: 'mapbox://styles/vcndmap/ck8okvifp08vo1ko1jh7zva10'
    });
  }
  
  var colorRamp = {
              "property": "bulletsize",
              "stops": [
                [5, "#FF530D"],
                [8, "#FD1742"],
                [14, "#FF9D00"],
                [20, "#00E83C"],
                [30, "#825CFF"],
                [40, "#B2E3E8"],
                [50, "#B3AD75"],
                [60, "#77E7FF"],
                [80, "#FFEA26"],
                [110, "#CC0A58"],
                [140, "#B38094"]
              ]
            }
  
  let countiesLayer = {
    id: "counties_poverty",
    type: "circle",
    source: "cities",
    filter: [ ">", "bulletsize", -1 ],
    paint: {
      "circle-color": colorRamp,
      "circle-opacity": circleOpacity,
      "circle-stroke-color": circleStrokeColor,
      "circle-stroke-width": 0.75,
      "circle-radius": [
        'let', 'data_prop', ['get', 'bulletsize'],
        [
          'interpolate', ['linear'], ['zoom'],
          0.1, [
            'interpolate', ['exponential', 1], ['number', ['var', 'data_prop']],
            -1, 2,
            0, 0.5,
            100, 5
          ],
          0.5, [
            'interpolate', ['exponential', 1], ['number', ['var', 'data_prop']],
            -1, 4,
            0, 4,
            100, 30
          ]
        ]
      ]
    }
  };
  
  // Wait until the map loads, then yield the container again.
  yield new Promise(resolve => {
    if (map.loaded()) resolve(map);
    else map.on('load', () => resolve(map));
  });
  
  
  if (!map.getSource('cities')) {
    map.addSource('cities', { type: 'geojson', data: {
      type: "FeatureCollection",
      features: cities
    }});
  }
  if (map.getLayer(countiesLayer.id)) {
    map.removeLayer(countiesLayer.id);
  }
  map.addLayer(countiesLayer);
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    "color":colorRamp
    
});
 
map.on('mouseenter', 'counties_poverty', function(e) {
// Change the cursor style as a UI indicator.
map.getCanvas().style.cursor = 'pointer';
 
var coordinates = e.features[0].geometry.coordinates.slice();
var description = "<strong>"+e.features[0].properties.name + "</strong><br>Bookings: "+e.features[0].properties.count+"<br>"+"Revenue (Total): "+e.features[0].properties.total+" €";
 
// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}


// Populate the popup and set its coordinates
// based on the feature found.
popup.setLngLat(coordinates)
.setHTML(description)
.addTo(map);
});

  
map.on('mouseleave', 'counties_poverty', function() {
map.getCanvas().style.cursor = '';
popup.remove();
});
}
);
  return main;
}
