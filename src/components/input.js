import xs from "xstream";
import delay from 'xstream/extra/delay';
import { div, span, textarea } from "@cycle/dom";
import isolate from "@cycle/isolate";

function view(props$) {
  return props$
    .map(({ visible, label, mode }) =>
      div({
        attrs: {
          style: !visible ? 'display: none;' : ''
        }
      }, [span(".label", label), textarea(`.input ${mode}`)])
    );
}

function TextInput(sources) {
  const props$ = sources.props
  const value$ = xs.create().startWith('');
  const vdom$ = view(props$);

  props$.compose(delay(100)).take(1).addListener({
    next: ({mode}) => {
      const editor = CodeMirror.fromTextArea(document.querySelector(`textarea.${mode}`), {
        lineNumbers: true,
        tabSize: 2,
        mode
      });

      editor.on('change', () => value$.shamefullySendNext(editor.getValue()))
    }
  })

  return {
    DOM: vdom$,
    value: value$
  };
}

const IsolatedTextInput = function(sources) {
  return isolate(TextInput)(sources);
};

export default IsolatedTextInput;
