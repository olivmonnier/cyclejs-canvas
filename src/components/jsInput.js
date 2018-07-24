import * as Babel from "@babel/standalone";
import isolate from "@cycle/isolate";
import TextInput from "./input";

function JsInput(sources) {
  const textInput = TextInput(sources);
  const newValue$ = textInput.value.map(
    value => Babel.transform(value, { presets: ["es2015"] }).code
  );

  return {
    DOM: textInput.DOM,
    value: newValue$
  };
}

const IsolatedJsInput = function(sources) {
  return isolate(JsInput)(sources);
};

export default IsolatedJsInput;
