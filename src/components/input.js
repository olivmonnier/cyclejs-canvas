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

function view(props$) {
  return props$
    .map(({ visible, label }) =>
      div({
        attrs: {
          style: `display: ${visible ? 'block' : 'none'}`
        }
      }, [span(".label", label), br(), textarea(".input")])
    );
}

function TextInput(sources) {
  const change$ = intent(sources.DOM);
  const vdom$ = view(sources.props);

  return {
    DOM: vdom$,
    value: change$
  };
}

const IsolatedTextInput = function(sources) {
  return isolate(TextInput)(sources);
};

export default IsolatedTextInput;
