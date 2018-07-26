import xs from "xstream";
import { run } from "@cycle/run";
import { div, pre, makeDOMDriver } from "@cycle/dom";
import TextInput from './components/input';
import JsInput from './components/jsInput';
import Preview from './components/preview';
import Code from './components/code';
import Console from './components/console';
import makeLogDriver from './drivers/log';

function model(htmlInputValue$, jsInputValue$, cssInputValue$) {
  return xs
    .combine(htmlInputValue$, jsInputValue$, cssInputValue$)
    .map(([html, js, css]) => ({ html, js, css }))
    .startWith({ html: '', js: '', css: '' });
}

function view(htmlInputDOM$, jsInputDOM$, cssInputDOM$, previewDOM$, codeDOM$, consoleDOM$) {
  return xs
    .combine(htmlInputDOM$, jsInputDOM$, cssInputDOM$, previewDOM$, codeDOM$, consoleDOM$)
    .map(([htmlInputVTree, jsInputVTree, cssInputVTree, previewVTree, codeVTree, consoleVTree]) =>
      div([
        htmlInputVTree,
        jsInputVTree,
        cssInputVTree,
        previewVTree,
        codeVTree,
        consoleVTree
      ])
    );
}

function main(sources) {
  const htmlInputProps = xs.of({ label: "HTML: " });
  const htmlInput = TextInput({ DOM: sources.DOM, props: htmlInputProps });

  const jsInputProps = xs.of({ label: "JS: " });
  const jsInput = JsInput({ DOM: sources.DOM, props: jsInputProps });

  const cssInputProps = xs.of({ label: "CSS: " });
  const cssInput = TextInput({ DOM: sources.DOM, props: cssInputProps });

  const values$ = model(htmlInput.value, jsInput.value, cssInput.value);
  const preview = Preview({ props: values$ });

  const code = Code({ html: preview.html });
  
  const terminal = Console({ DOM: sources.DOM, logs: sources.LOG });

  const vdom$ = view(htmlInput.DOM, jsInput.DOM, cssInput.DOM, preview.DOM, code.DOM, terminal.DOM);

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver("#app"),
  LOG: makeLogDriver()
});
