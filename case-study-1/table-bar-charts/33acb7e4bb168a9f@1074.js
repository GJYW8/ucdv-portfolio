// https://observablehq.com/@jiazhewang/introduction-to-antv@1074
import define1 from "./b259b94aa2dd91c7@35.js";
import define2 from "./d229a22b4a9fdc4b@148.js";
import define3 from "./e93997d5089d7165@2227.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["antv-banner@1.jpg",new URL("./files/360e56680895214b08aedf2a8bb1c8e67e2bc7166024e88d43f94edd8788399c64087d0371187bffd81d3e65fc4f8c339bdd716631e74e8f91db1a465dd4f63f",import.meta.url)],["chartcube.gif",new URL("./files/2d0fe5bacb19e3405c27fbbc0b15b2b04a065416f01d2dfb279d419be6828bb50e5526935793c303b7bf32db7c76c35be9a576739212be4099943f44981ac909",import.meta.url)],["graphindemo.gif",new URL("./files/546ef39f4ee31f26f22616b38d65150b403375d6d35e2f8bc99e1ac89cd74900218df47a2d07d00a4a14c34058964f8e91b7253d3ee33612768720de5cdeb104",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
 
  main.variable(observer("G2Demo2")).define("G2Demo2", ["html","data_adgroups","G2"], function*(html,data_adgroups,G2)
{
  // for Observable Cell
  const wrapper = html`<div style="text-align: center;"></div>`;
  const container = html`<div></div>`
  wrapper.appendChild(container);
  yield wrapper;
  
  // Demo Code
  
  function getTypeColor(type) {
    if (type === 'Impressions') { return '#1890ff'; }
    if (type === 'Spending') { return '#8b0000'; }
    if (type === 'Revenue') { return '#facc14'; }
  }

  // Data source: TOP 10 GMO Cultivation Countries - ISAA 2016
  const data = data_adgroups;

  const chart = new G2.Chart({
    container,
    autoFit: true,
    height: 320,
    padding: [20, 20, 20, 100]
  });

  chart.data(data);
  chart.legend(false);
  chart.tooltip({
    showMarkers: false
  });
  chart.facet('rect', {
    fields: ['class'],
    columnTitle: {
      offsetY: -15,
      style: {
        fontSize: 14,
        fontWeight: 300,
        fill: '#8d8d8d'
      }
    },
    eachView: (view, facet) => {
      view.coordinate().transpose();

      if (facet.columnIndex === 0) {
        view.axis('city', {
          tickLine: null,
          line: null,
        });
        view.axis('value', false);
      } else {
        view.axis(false);
      }
      const color = getTypeColor(facet.columnValue);
      view
        .interval()
        .adjust('stack')
        .position('city*value')
        .color('type', [color, '#ebedf0'])
        .size(20)
        .label('value*type', (value, type) => {
          if (type === '2') {
            return null;
          }
          const offset = (value < 30) ? 10 : -4;
          return {
            offset,
          };
        });
      view.interaction('element-active');
    }
  });
  chart.render();
}
);
  
  main.variable(observer()).define(["md"], function(md){return(
md`---

<br>

<br>

## Data`
)});
  main.variable(observer("data_adgroups")).define("data_adgroups", function(d3){

    var fixNr = function( nr ) {
      console.log(nr);
      return Number(nr.toFixed(2));
    }

    var formattedData = [];
    fetch("../data/final-adgroups-by-town.json")
    .then(r => r.json())
    .then(data => {

      data.forEach(element => {
        // Impressions
        var tempImpressions1 = {
          class: "Impressions",
          city: element.city,
          type: "1",
          value: fixNr(element.Impressions_relative*100)
        }

        var tempImpressions2 = {
          class: "Impressions",
          city: element.city,
          type: "2",
          value: fixNr(100-(element.Impressions_relative*100))
        }

        formattedData.push(tempImpressions1)
        formattedData.push(tempImpressions2)

        // Spending
        var tempSpending1 = {
          class: "Spending",
          city: element.city,
          type: "1",
          value: fixNr(element.Spending_relative*100)
        }

        var tempSpending2 = {
          class: "Spending",
          city: element.city,
          type: "2",
          value: fixNr(100-(element.Spending_relative*100))
        }

        formattedData.push(tempSpending1)
        formattedData.push(tempSpending2)

        // Revenue
        var tempRevenue1 = {
          class: "Revenue",
          city: element.city,
          type: "1",
          value: fixNr(element.Revenue_relative*100)
        }

        var tempRevenue2 = {
          class: "Revenue",
          city: element.city,
          type: "2",
          value: fixNr(100-(element.Revenue_relative*100))
        }

        formattedData.push(tempRevenue1)
        formattedData.push(tempRevenue2)
      });

    
    })
    .catch(e => console.log("Error"))
    
    console.log(formattedData)

    return(formattedData)});

  main.variable(observer()).define(["md"], function(md){return(
md`---

## StyleSheets`
)});
  main.variable(observer("viewof style_X6Demo")).define("viewof style_X6Demo", ["collapsedCSS"], function(collapsedCSS){return(
collapsedCSS('style_X6Demo')`
    .wrapper {
      width: 960px;
      height: 400px;
      position: relative;
      padding-left: 200px;
    }

    .sidebar {
      position: absolute;
      width: 200px;
      height: 100%;
      left: 0;
      top: 0;
      padding: 1px 0;
      font-size: 12px;
      background: #f5f5f5;
    }

    .minimap {
      position: absolute;
      width: 228px;
      height: 120px;
      top: 24px;
      right: 220px;
      border: 1px solid #ccc;
      z-index: 9;
      background: #fff;
    }

    .rectangle,
    .circle,
    .ellipse {
      border: 1px solid #000;
      text-align: center;
      cursor: pointer;
      user-select: none;
      margin: 16px auto;
    }

    .rectangle {
      width: 80px;
      height: 30px;
      line-height: 28px;
    }

    .circle {
      width: 48px;
      height: 48px;
      border-radius: 100%;
      line-height: 46px;
    }

    .ellipse {
      width: 80px;
      height: 48px;
      border-radius: 100%;
      line-height: 46px;
    }

    .container-wrapper {
      width: 760px;
      height: 400px;
      padding: 0;
      float: left;
      border: 1px solid #ccc;
      outline: none;
    }
`
)});
  main.variable(observer("style_X6Demo")).define("style_X6Demo", ["Generators", "viewof style_X6Demo"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`---

## Dependencies`
)});
  main.variable(observer("G2")).define("G2", ["require"], function(require){return(
require("@antv/g2@4.0.2")
)});
  main.variable(observer("G2Plot")).define("G2Plot", ["require"], function(require){return(
require("@antv/g2plot@1.0.1")
)});
  main.variable(observer("F2")).define("F2", ["require"], function(require){return(
require('@antv/f2@3.6.1')
)});
  main.variable(observer("G6")).define("G6", ["require"], function(require){return(
require("@antv/g6@3.4.1")
)});
  main.variable(observer("X6")).define("X6", ["require"], function(require){return(
require("https://unpkg.com/@antv/x6@0.3.1/dist/x6.min.js")
)});
  main.variable(observer("L7")).define("L7", ["require"], function(require){return(
require("@antv/l7@2.1.5")
)});
  main.variable(observer("AVA_CA")).define("AVA_CA", ["require"], function(require){return(
require("@antv/chart-advisor@0.1.3-alpha.17")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---

## Appendix

for making this Observable note

`
)});
  const child1 = runtime.module(define1);
  main.import("prettyJSON", child1);
  const child2 = runtime.module(define2);
  main.import("collapsedCSS", child2);
  main.variable(observer("TouchEmulator")).define("TouchEmulator", ["require"], function(require){return(
require('f2-touchemulator')
)});
  const child3 = runtime.module(define3);
  main.import("select", child3);
  main.variable(observer("AVA_chooseDataset")).define("AVA_chooseDataset", ["data_AVA_sample1","data_AVA_sample2","data_AVA_sample3"], function(data_AVA_sample1,data_AVA_sample2,data_AVA_sample3){return(
function AVA_chooseDataset(datasetStr) {
  const dataSample = {
    dataSample1: data_AVA_sample1,
    dataSample2: data_AVA_sample2,
    dataSample3: data_AVA_sample3
  };
  return dataSample[datasetStr];
}
)});
  return main;
}
