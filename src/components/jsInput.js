import { transform } from "@babel/standalone";
import isolate from "@cycle/isolate";
import TextInput from "./input";

function transformES6(code){
  try {
    return transform(code, { presets: ["es2015", "stage-3"] }).code
  } catch(e) {
    return ''
  }
}

function JsInput(sources) {
  const textInput = TextInput(sources);
  const newValue$ = textInput.value.map(transformES6);

  return {
    DOM: textInput.DOM,
    value: newValue$
  };
}
 
const IsolatedJsInput = function(sources) {
  return isolate(JsInput)(sources);
};
 
export default IsolatedJsInput;