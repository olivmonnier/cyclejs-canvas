import xs from "xstream";
import { div, span, br, textarea } from "@cycle/dom";
import isolate from "@cycle/isolate";

function intent(domSource) {
  return domSource
    .select(".input")
    .events("input")
    .map(ev => ev.target.value)
    .startWith("");
}

function model(newValue$, props$) {
  return xs.merge(props$, newValue$).remember();
}

function view(props$, value$) {
  return xs
    .combine(props$, value$)
    .map(([props, value]) =>
      div([span(props.label), br(), textarea(".input")])
    );
}

function TextInput(sources) {
  const change$ = intent(sources.DOM);
  const value$ = model(change$, sources.props);
  const vdom$ = view(sources.props, value$);

  return {
    DOM: vdom$,
    value: value$
  };
}

const IsolatedTextInput = function(sources) {
  return isolate(TextInput)(sources);
};

export default IsolatedTextInput;
