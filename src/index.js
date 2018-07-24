import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import Renderer from "./components/Renderer";

function main(sources) {
  return Renderer(sources);
}

run(main, {
  DOM: makeDOMDriver("#app")
});
