// https://observablehq.com/@j-f1/css-template-tag@148
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`
# CSS template tag

> Show off the custom CSS applied to your notebook

---

### Usage

Expanded:
`
)});
  main.variable(observer()).define(["css"], function(css){return(
css`
blockquote {
  border-left: 1px solid currentColor;
  margin-left: 0;
  padding-left: 0.5em;
}
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Collapsed:`
)});
  main.variable(observer()).define(["collapsedCSS"], function(collapsedCSS){return(
collapsedCSS('Your Label here')`
blockquote {
  border-left: 1px solid currentColor;
  margin-left: 0;
  padding-left: 0.5em;
}
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Or:`
)});
  main.variable(observer()).define(["collapsedCSS"], function(collapsedCSS){return(
collapsedCSS`
blockquote {
  border-left: 1px solid currentColor;
  margin-left: 0;
  padding-left: 0.5em;
}
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`It also supports the \`viewof\` API, so if you’re creating a library that includes styles, you can use it like this:`
)});
  main.variable(observer("viewof style")).define("viewof style", ["css"], function(css){return(
css`
blockquote {
  border-left: 1px solid currentColor;
  margin-left: 0;
  padding-left: 0.5em;
}
`
)});
  main.variable(observer("style")).define("style", ["Generators", "viewof style"], (G, _) => G.input(_));
  main.variable(observer()).define(["style"], function(style){return(
style
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Finally, it supports transforming the CSS:`
)});
  main.variable(observer("viewof style2")).define("viewof style2", ["css"], function(css){return(
css({ transform: css => css.replace(/:scope/g, '.foo') })`
:scope h3 {
  font-size: 1.5em;
}
`
)});
  main.variable(observer("style2")).define("style2", ["Generators", "viewof style2"], (G, _) => G.input(_));
  main.variable(observer()).define(["style2"], function(style2){return(
style2.textContent
)});
  main.variable(observer("viewof style3")).define("viewof style3", ["collapsedCSS"], function(collapsedCSS){return(
collapsedCSS({
  transform: css => css.replace(/:scope/g, '.bar')
})`
:scope h3 {
  font-size: 1.5em;
}
`
)});
  main.variable(observer("style3")).define("style3", ["Generators", "viewof style3"], (G, _) => G.input(_));
  main.variable(observer()).define(["style3"], function(style3){return(
style3.textContent
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
---

### Implementation
`
)});
  main.variable(observer("css")).define("css", ["tagWithOptions","interpolate","html","md"], function(tagWithOptions,interpolate,html,md){return(
tagWithOptions(({ transform }) => (...args) => {
  const source = interpolate(...args);
  const style = html`<style>`;
  style.textContent = transform ? transform(source) : source;
  const el = md`
~~~css
${source}
~~~
${style}
`;
  el.value = style.cloneNode(true);
  return el;
})
)});
  main.variable(observer("collapsedCSS")).define("collapsedCSS", ["tagWithOptions","css","html"], function(tagWithOptions,css,html){return(
tagWithOptions(opts => (...args) => {
  if (typeof opts === 'string') {
    opts = { title: opts };
  }
  const content = css(opts)(...args);
  const el = html`
    <details>
      <summary style="cursor: pointer; user-select: none">${opts.title ||
        'CSS'}</summary>
      ${content}
    </details>
  `;
  el.value = content.value;
  return el;
})
)});
  main.variable(observer("tagWithOptions")).define("tagWithOptions", function(){return(
impl => (...args) => {
  if (!Array.isArray(args[0])) {
    return impl(args[0]);
  }
  return impl({})(...args);
}
)});
  main.variable(observer("interpolate")).define("interpolate", ["dedent"], function(dedent){return(
(strings, ...interpolations) => {
  let s = '';
  for (let i = 0; i < strings.length; i++) {
    s += strings[i];
    if (i < interpolations.length && interpolations[i]) {
      s += String(interpolations[i]);
    }
  }
  return dedent(s);
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
---

### Dependencies
`
)});
  main.variable(observer("dedent")).define("dedent", async function(){return(
(await import('https://unpkg.com/dentist@1.0.3/src/index.js')).dedent
)});
  return main;
}
