import { transform } from "@babel/standalone";
import isolate from "@cycle/isolate";
import TextInput from "./input";
 
function JsInput(sources) {
  const textInput = TextInput(sources);
  const newValue$ = textInput.value.map(
    value => {
      try {
        return transform(value, { presets: ["es2015", "stage-3"] }).code
      } catch(e) {
        return ''
      }
    }
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