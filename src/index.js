import xs from "xstream";
import { run } from "@cycle/run";
import { div, pre, makeDOMDriver } from "@cycle/dom";
import Preview from "./components/preview";

function main(sources) {
  const preview = Preview(sources);
  const vdom$ = xs
    .combine(preview.html, preview.DOM)
    .map(([html, previewVTree]) => div([previewVTree, pre(html)]));

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver("#app")
});
