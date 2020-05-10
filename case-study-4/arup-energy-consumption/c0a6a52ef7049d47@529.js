// https://observablehq.com/@d3/stacked-bar-chart@529
import define1 from "./a33468b95d0b15b0@692.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["us-population-state-age.csv",new URL("./files/cacf3b872e296fd3cf25b9b8762dc0c3aa1863857ecba3f23e8da269c584a4cea9db2b5d390b103c7b386586a1104ce33e17eee81b5cc04ee86929f1ee599bfe",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("chart")).define("chart", ["d3","width","height","series","color","x","y","formatValue","xAxis","yAxis"], function(d3,width,height,series,color,x,y,formatValue,xAxis,yAxis)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);


// gridlines in y axis function
function make_y_gridlines() {		
  return d3.axisLeft(y)
      .ticks(5)
}

// add the Y gridlines
svg.append("g")			
.attr("class", "grid")
.attr("transform", "translate(45,0)")
.call(make_y_gridlines()
    .tickSize(-width)
    .tickFormat("")
)
.selectAll(".tick")
.select("line")
.attr("stroke", "#ccc")
.attr("stroke-opacity", "0.7")

svg.selectAll(".domain")
.attr("stroke-width", "0")

  svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
      .attr("fill", d => color(d.key))
      .attr("class", "group-cluster")
    .selectAll("rect")
    .data(d => d)
    .join("rect")
      .attr("x", (d, i) => x(d.data.name))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
    .append("title")
      .text(d => `${d.key} ${d.key}
${formatValue(d.data[d.key])}`);

svg.selectAll(".group-cluster")
.data(series)
.selectAll("text")
.data(d=>d)
.join("text")
  .attr("class","inline-label")
  .attr("fill", "white")
  .attr("x", (d, i) => x(d.data.name)+(x.bandwidth()/2)-10)
  .attr("y", d => (y(d[1])+(y(d[0]) - y(d[1]))/2)+4)
  .text(d => `${formatValue(d.data[d.key])}`);

  svg.append("g")
    .call(xAxis);

  svg.append("g")
      .call(yAxis);

  return svg.node();
}
);

main.variable(observer("key")).define("key", ["legend","color"], function(legend,color){return(
legend({color, title: "Age (years)"})
)});

  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){
    return(
    d3.csvParse(await FileAttachment("us-population-state-age.csv").text(), (d, i, columns) => (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d))
    )
});
  main.variable(observer("series")).define("series", ["d3","data"], function(d3,data){
    return(
d3.stack()
    .keys(data.columns.slice(1))
  (data)
    .map(d => (d.forEach(v => v.key = d.key), d))
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.23)
)});
  main.variable(observer("y")).define("y", ["d3","series","height","margin"], function(d3,series,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .rangeRound([height - margin.bottom-6, margin.top])
)});
  main.variable(observer("color")).define("color", ["d3","series"], function(d3,series){return(
d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    //.range(d3.schemeSpectral[series.length])
    .range( [ '#d53e4f', '#fc8d59', '#fdd053', '#c3d567', '#89d1d0', '#3288bd' ] )
    .unknown("#ccc")
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x"], function(height,margin,d3,x){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom-6})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%e %b '%y")))
    .call(g => g.selectAll(".domain").remove())
  
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], function(margin,d3,y){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6, "s"))
    .call(g => g.selectAll(".domain").remove())
)});
  main.variable(observer("formatValue")).define("formatValue", function(){return(
x => isNaN(x) ? "N/A" : x.toLocaleString("en")
)});
  main.variable(observer("height")).define("height", function(){return(
400
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 10, right: 10, bottom: 20, left: 40}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  return main;
}
