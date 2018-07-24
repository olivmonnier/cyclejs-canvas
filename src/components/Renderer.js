import xs from "xstream";
import { div, iframe } from "@cycle/dom";
import isolate from "@cycle/isolate";
import TextInput from "./input";

function model(htmlInputValue$, jsInputValue$, cssInputValue$) {
  return xs
    .combine(htmlInputValue$, jsInputValue$, cssInputValue$)
    .map(
      ([html, js, css]) => `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
         ${html}
          <script>${js}</script>
        </body>
      </html>
    `
    )
    .startWith("");
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
            srcdoc: values,
            sandbox: "allow-scripts"
          }
        })
      ])
    );
}

function Renderer(sources) {
  const htmlInputProps = xs.of({ label: "HTML: " });
  const htmlInput = TextInput({ DOM: sources.DOM, props: htmlInputProps });

  const jsInputProps = xs.of({ label: "JS: " });
  const jsInput = TextInput({ DOM: sources.DOM, props: jsInputProps });

  const cssInputProps = xs.of({ label: "CSS: " });
  const cssInput = TextInput({ DOM: sources.DOM, props: cssInputProps });

  const values$ = model(htmlInput.value, jsInput.value, cssInput.value);
  const vdom$ = view(values$, htmlInput.DOM, jsInput.DOM, cssInput.DOM);

  return {
    DOM: vdom$,
    html: values$
  };
}

const IsolatedRenderer = function(sources) {
  return isolate(Renderer)(sources);
};

export default IsolatedRenderer;
