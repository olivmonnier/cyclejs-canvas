import xs from "xstream";
import { run } from "@cycle/run";
import { div, iframe, makeDOMDriver } from "@cycle/dom";
import TextInput from "./components/input";

function model(htmlInputValue$, jsInputValue$, cssInputValue$) {
  return xs
    .combine(htmlInputValue$, jsInputValue$, cssInputValue$)
    .map(([html, js, css]) => ({ html, js, css }));
}

function view(values$, htmlInputDOM$, jsInputDOM$, cssInputDOM$) {
  return xs
    .combine(values$, htmlInputDOM$, jsInputDOM$, cssInputDOM$)
    .map(([values, htmlInputVTree, jsInputVTree, cssInputVTree]) =>
      div([
        htmlInputVTree,
        jsInputVTree,
        cssInputVTree,
        iframe({
          attrs: {
            srcdoc: `
              <html>
                <head>
                  <style>${values.css}</style>
                </head>
                <body>
                ${values.html}
                  <script>${values.js}</script>
                </body>
              </html>          
          `,
            sandbox: "allow-scripts"
          }
        })
      ])
    );
}

function main(sources) {
  const htmlInputProps = xs.of({ label: "HTML" });
  const htmlInput = TextInput({ DOM: sources.DOM, props: htmlInputProps });

  const jsInputProps = xs.of({ label: "JS" });
  const jsInput = TextInput({ DOM: sources.DOM, props: jsInputProps });

  const cssInputProps = xs.of({ label: "CSS" });
  const cssInput = TextInput({ DOM: sources.DOM, props: cssInputProps });

  const values$ = model(htmlInput.value, jsInput.value, cssInput.value);
  const vdom$ = view(values$, htmlInput.DOM, jsInput.DOM, cssInput.DOM);

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver("#app")
});