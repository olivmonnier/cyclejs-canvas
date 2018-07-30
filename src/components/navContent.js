import xs from 'xstream';
import isolate from '@cycle/isolate';
import TextInput from './input';
import JsInput from './jsInput';
import Preview from './preview';
import Code from './code';
import Console from './console';
import { div } from '../../node_modules/@cycle/dom';

function model(htmlInputValue$, jsInputValue$, cssInputValue$) {
  return xs
    .combine(htmlInputValue$, jsInputValue$, cssInputValue$)
    .map(([html, js, css]) => ({ html, js, css }))
    .startWith({ html: '', js: '', css: '' });
}

function NavContent(sources) {
  const htmlInputProps = sources.tabs.map(({ html }) => ({ label: "HTML: ", visible: html }));
  const htmlInput = TextInput({ DOM: sources.DOM, props: htmlInputProps });

  const jsInputProps = sources.tabs.map(({ js }) => ({ label: "JS: ", visible: js }));
  const jsInput = JsInput({ DOM: sources.DOM, props: jsInputProps });

  const cssInputProps = xs.of({ label: "CSS: " });
  const cssInput = TextInput({ DOM: sources.DOM, props: cssInputProps });

  const values$ = model(htmlInput.value, jsInput.value, cssInput.value);
  const preview = Preview({ props: values$ });

  const code = Code({ html: preview.html });
  
  const terminal = Console({ DOM: sources.DOM, logs: sources.LOG });

  const vdom$ = xs.combine(htmlInput.DOM, jsInput.DOM, cssInput.DOM, preview.DOM, code.DOM, terminal.DOM)
    .map(([htmlInputVTree, jsInputVTree, cssInputVTree, previewVTree, codeVTree, terminalVTree]) => 
      div([
        htmlInputVTree,
        cssInputVTree,
        jsInputVTree,
        previewVTree,
        terminalVTree,
        codeVTree
      ])
    )

  return {
    DOM: vdom$,
    values: values$
  }
}

const IsolatedNavContent = function(sources) {
  return isolate(NavContent)(sources);
}

export default IsolatedNavContent;