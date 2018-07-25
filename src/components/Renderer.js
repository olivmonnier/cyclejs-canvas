import xs from "xstream";
import { div, iframe } from "@cycle/dom";
import isolate from "@cycle/isolate";
import TextInput from "./input";
import JsInput from "./jsInput";

function model(htmlInputValue$, jsInputValue$, cssInputValue$) {
  return xs
    .combine(htmlInputValue$, jsInputValue$, cssInputValue$)
    .map(([html, js, css]) => ({ html, js, css }))
    .startWith({ html: '', js: '', css: '' });
}

function view(html$, htmlInputDOM$, jsInputDOM$, cssInputDOM$) {
  return xs
    .combine(html$, htmlInputDOM$, jsInputDOM$, cssInputDOM$)
    .map(([html, htmlInputVTree, jsInputVTree, cssInputVTree]) =>
      div([
        htmlInputVTree,
        jsInputVTree,
        cssInputVTree,
        iframe({
          attrs: {
            srcdoc: html,
            sandbox: "allow-scripts"
          }
        })
      ])
    );
}

function preview(html, js, css) {
  return `
    <html>
      <head>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${js}
        </script>
      </body>
    </html>
    `;
}

function Renderer(sources) {
  const htmlInputProps = xs.of({ label: "HTML: " });
  const htmlInput = TextInput({ DOM: sources.DOM, props: htmlInputProps });

  const jsInputProps = xs.of({ label: "JS: " });
  const jsInput = JsInput({ DOM: sources.DOM, props: jsInputProps });

  const cssInputProps = xs.of({ label: "CSS: " });
  const cssInput = TextInput({ DOM: sources.DOM, props: cssInputProps });

  const values$ = model(htmlInput.value, jsInput.value, cssInput.value);
  const html$ = values$.map(({ html, js, css}) => preview(html, js, css));
  const vdom$ = view(html$, htmlInput.DOM, jsInput.DOM, cssInput.DOM);

  return {
    DOM: vdom$,
    values: values$,
    html: html$
  };
}

const IsolatedRenderer = function(sources) {
  return isolate(Renderer)(sources);
};

export default IsolatedRenderer;
