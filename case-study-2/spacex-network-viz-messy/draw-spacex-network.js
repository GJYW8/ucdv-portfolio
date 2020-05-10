// https://observablehq.com/@philipp-ulm/network-of-stack-overflow-tags@527
export default function define(runtime, observer) {
  const main = runtime.module();

  main.variable(observer()).define(["drawChart"], function(drawChart) {
    return (
      drawChart()
    )
  });


  main.variable(observer("drawChart")).define("drawChart", ["data", "d3", "width", "height", "color", "drag", "invalidation"], function(data, d3, width, height, color, drag, invalidation) {
    return (
      function drawChart() {
        const links = data.links.map(d => Object.create(d))
        const nodes = data.nodes.map(d => Object.create(d))
        
        const radius = 2;
        
        var tooltip = d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.name).distance(10).strength(2))
          .force("collide", d3.forceCollide(15))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("charge", d3.forceManyBody().strength(-300))
          .force("x", d3.forceX())
          .force("y", d3.forceY());

        const svg = d3.create("svg")
          .attr("viewBox", [0, 0, width, height])

        const link = svg.append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.5)
          .selectAll("line")
          .data(links)
          .join("line")
          .attr("stroke-width", d => Math.sqrt(d.value) / 1);
        
        const node = svg.append("g")
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", radius)
          .attr("fill", color)
          .attr("data-target", d => d.group)
          .call(drag(simulation))
          .on('mouseover.fade', fade(0.1))
          .on('mouseout.fade', fade(1));
        
        const textElems = svg.append('g')
          .selectAll('text')
          .data(nodes)
          .join('text')
          .text(d => d.name)
          .attr("class", "rl")
          .call(drag(simulation))
          .on('mouseover.fade', fade(0.1))
          .on('mouseout.fade', fade(1));

        simulation.on("tick", () => {
          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
          node
            .attr("cx", function(d) {
              return d.x = Math.max((radius + 1), Math.min(width - (radius + 1), d.x));
            })
            .attr("cy", function(d) {
              return d.y = Math.max((radius + 1), Math.min(height - (radius + 1), d.y));
            });
          textElems
            .attr("x", d => d.x + 10)
            .attr("y", d => d.y +5 )
            //.attr("visibility", "hidden");
        });

        function fade(opacity) {
          return d => {
            node.style('opacity', function(o) {
              return isConnected(d, o) ? 1 : opacity
            });
            textElems.style('visibility', function(o) {
              return isConnected(d, o) ? "visible" : "hidden"
            });
            link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
            if (opacity === 1) {
              node.style('opacity', 1)
              textElems.style('visibility', 'hidden')
              link.style('stroke-opacity', 0.3)
            }
          };
        }

        const linkedByIndex = {};
        links.forEach(d => {
          linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
        });

        function isConnected(a, b) {
          return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
        }

        invalidation.then(() => simulation.stop());

        return svg.node()
      }
    )
  });
  main.variable(observer("height")).define("height", function() {
    return (
    850
    )
  });

  main.variable(observer("drag")).define("drag", ["d3"], function(d3) {
    return (
      simulation => {

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }
    )
  });

  main.variable(observer("color")).define("color", ["d3"], function(d3) {
    const scale = d3.scaleOrdinal(["#FF7000", "#FF0000", "deeppink", "#000", "green"]);
    return d => scale(d.group)
  });

  main.variable(observer("data")).define("data", ["d3"], function(d3) {
    return (
      d3.json("../data/_spacex-d3-data.json")
    )
  });

  main.variable(observer("d3")).define("d3", ["require"], function(require) {
    return (
      require("d3@5")
    )
  });

  return main;
}