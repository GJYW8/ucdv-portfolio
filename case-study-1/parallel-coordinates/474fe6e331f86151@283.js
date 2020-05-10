// https://observablehq.com/@ravengao/parallel-coordinates-for-discriminate-patterns@283
export default function define(runtime, observer) {
  const main = runtime.module();

  main.variable(observer()).define(["html"], function(html){return(
html`<style>

svg {
  font: 12px sans-serif;
}

.axis {
  font-size: 12px;
  font-family: 'Muli', sans-serif;
  opacity: 0.5;
}

.background path {
  fill: none;
  stroke: #ddd;
  shape-rendering: crispEdges;
}

.foreground path {
  fill: none;
  stroke: steelblue;
}

.background path:hover,
.foreground path:hover {
  stroke-width: 3px;
}

.brush .extent {
  fill-opacity: .3;
  stroke: #fff;
  shape-rendering: crispEdges;
}

.axis line,
.axis path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.axis text {
    fill:black;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
}
pre {
  width: 100%;
  height: 300px;
  margin: 6px 12px;
  tab-size: 40;
  font-size: 10px;
  overflow: auto;
}
</style>`
)});
  main.variable(observer("parallel_coordinates")).define("parallel_coordinates", ["d3","DOM","output","sample_data"], function(d3,DOM,output,sample_data)
{
    var generateDiagram = function( sample_data ) {
      const margin = {top: 30, right: 10, bottom: 10, left: 10};
      const width = 600 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      const svg = d3.select(DOM.svg(width + margin.left + margin.right, height+margin.top + margin.bottom));
      const svg_adjusted = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // parallel coord rendering part
      const x = d3.scalePoint().range([0, width]).padding(1);
      const y = {};
      const line = d3.line();
      const axis = d3.axisLeft();
      let background;
      let foreground;

      let tempArr = [];
      tempArr.push(sample_data);

      sample_data = tempArr;

      // output of selection
      const out = d3.select(output)  
      out.text(d3.tsvFormat(sample_data.slice(0,24)));
      

      let findMaxArray = [ sample_data[0].Impressions_relative, sample_data[0].Spending_relative, sample_data[0].Revenue_relative ];
      // define max value and add some upper spacing
      var maxValue = Math.max( ...findMaxArray ) * 1.05;

      const dimensions_preset = {
        Impressions_relative: [0, maxValue],
        Spending_relative: [0, maxValue],
        Revenue_relative: [0, maxValue],
      };

      let dimensions = d3.keys(sample_data[0])
      x.domain(dimensions);
      
      // select certain dimensions
      let tempDimensions = []
      tempDimensions = [ dimensions[2], dimensions[4], dimensions[6] ]
      dimensions = tempDimensions;

      dimensions.forEach(d => {
        if (d in dimensions_preset) {
          y[d] = d3.scaleLinear()
              .domain(dimensions_preset[d] || d3.extent(sample_data, element => +element[d]))
              .range([height, 0]);
        }
      }
      );

      const colorDomain = [0, 1]; // y[colorDimention].domain() // we should make this the same with network view
      const colorDimention = "Revenue_relative";
      const lineColor = d => d3.scaleSequential(colorDomain, d3.interpolateRdYlGn)(d[colorDimention]);


      // Add grey background lines for context.
      background = svg_adjusted.append("g")
          .attr("class", "background")
        .selectAll("path")
          .data(sample_data)
        .enter().append("path")
          .attr("d", path);

      // Add blue foreground lines for focus.
      foreground = svg_adjusted.append("g")
          .attr("class", "foreground")
        .selectAll("path")
          .data(sample_data)
        .enter().append("path")
          .attr("d", path)
          .attr("data-popup","Data")
          .style("stroke", lineColor);

      // Add a group element for each dimension.
      const g = svg_adjusted.selectAll(".dimension")
          .data(dimensions)
        .enter().append("g")
          .attr("class", "dimension")
          .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

      // Add an axis and title.
      g.append("g")
          .attr("class", "axis")
          .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
          .style("text-anchor", "middle")
          .attr("y", -15)
          .text(function(d) { return d.replace("_relative",""); });

      // Add and store a brush for each axis.
      g.append("g")
          .attr("class", "brush")
          .each(function(d) { 
              d3.select(this).call(y[d].brush = d3.brushY()
                .extent([[-10,0], [10,height]])
                .on("brush", brush)           
                .on("end", brush)
                )
            })
        .selectAll("rect")
          .attr("x", -8)
          .attr("width", 16);

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) {
          if (p in dimensions_preset) {
            return [x(p), y[p](d[p])]; 
          }
        }
      ));    
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {  
        var actives = [];
        svg.selectAll(".brush")
          .filter(function(d) {
                y[d].brushSelectionValue = d3.brushSelection(this);
                return d3.brushSelection(this);
          })
          .each(function(d) {
              // Get extents of brush along each active selection axis (the Y axes)
                actives.push({
                    dimension: d,
                    extent: d3.brushSelection(this).map(y[d].invert)
                });
          });
        
        var selected = [];
        // Update foreground to only display selected values
        foreground.style("display", function(d) {
            let isActive = actives.every(function(active) {
                let result = active.extent[1] <= d[active.dimension] && d[active.dimension] <= active.extent[0];
                return result;
            });
            // Only render rows that are active across all selectors
            if(isActive) selected.push(d);
            return (isActive) ? null : "none";
        });
        
        // Render data as asimple grid
        (actives.length>0)?out.text(d3.tsvFormat(selected)):out.text(d3.tsvFormat(sample_data));
    }
    return svg.node();
  }

  let diagrams = [];

  // get svg objects
  sample_data.forEach( row => {
    diagrams.push( generateDiagram(row) );
  } );

  let diagramsHtml = "";
  // extract outHtml
  diagrams.forEach( row => {
    var s = new XMLSerializer();
    var str = s.serializeToString(row);
    diagramsHtml = diagramsHtml+str;
  } );

  var container = document.createElement("div");
  container.innerHTML = diagramsHtml;

  return container;

});
  main.variable(observer("output")).define("output", function()
{ 
// print data raw
//  const pre = document.createElement("pre"); return pre; 
}
);
  main.variable(observer("sample_data")).define("sample_data", ["d3"], function(d3){return(
d3.json('../data/final-adgroups-by-town.json')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
