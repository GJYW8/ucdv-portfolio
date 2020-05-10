// https://observablehq.com/@jiazhewang/prettyjson@35
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# prettyJSON`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
## Usage
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
~~~js
import { prettyJSON } from "@jiazhewang/prettyjson"
~~~
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
## Implementation
`
)});
  main.variable(observer("prettyJSON")).define("prettyJSON", function(){return(
json => {
  return JSON.stringify(json, function(k,v){
    for(var p in v) {
      if(v[p] instanceof Object) {
        return v;
      }
    }
    return JSON.stringify(v, null, 1);
  }, 2)
    .replace(/\\n/g, '')
    .replace(/\\/g, '')
    .replace(/\"\[/g, '[')
    .replace(/\]\"/g,']')
    .replace(/\"\{/g, '{')
    .replace(/\}\"/g,' }')
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
## Test
`
)});
  main.variable(observer("dataSample1")).define("dataSample1", function(){return(
[
  { region: 'East', sales: 4684.44 },
  { region: 'North', sales: 4137.09 },
  { region: 'NorthEast', sales: 2681.46 },
  { region: 'SouthEast', sales: 2447.01 },
  { region: 'SouthWest', sales: 818.59 },
  { region: 'NorthWest', sales: 1303.50 },
]
)});
  main.variable(observer("prettySample1")).define("prettySample1", ["prettyJSON","dataSample1"], function(prettyJSON,dataSample1){return(
prettyJSON(dataSample1)
)});
  main.variable(observer()).define(["md","prettySample1"], function(md,prettySample1){return(
md`
view in markdown

~~~json
${prettySample1}
~~~
`
)});
  return main;
}
