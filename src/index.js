import xs from "xstream";
import { run } from "@cycle/run";
import { div, pre, makeDOMDriver } from "@cycle/dom";
import Renderer from "./components/Renderer";

function main(sources) {
  const renderer = Renderer(sources);
  const vdom$ = xs
    .combine(renderer.html, renderer.DOM)
    .map(([html, rendererVTree]) => div([rendererVTree, pre(html)]));

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver("#app")
});
