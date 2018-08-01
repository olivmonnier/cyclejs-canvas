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
  const htmlInputProps = sources.tabs.map(({ html }) => ({ label: "HTML", visible: html }));
  const htmlInput = TextInput({ DOM: sources.DOM, props: htmlInputProps });

  const jsInputProps = sources.tabs.map(({ js }) => ({ label: "JS", visible: js }));
  const jsInput = JsInput({ DOM: sources.DOM, props: jsInputProps });

  const cssInputProps = sources.tabs.map(({ css }) => ({ label: "CSS", visible: css }));
  const cssInput = TextInput({ DOM: sources.DOM, props: cssInputProps });

  const values$ = model(htmlInput.value, jsInput.value, cssInput.value);
  const previewProps = xs.combine(values$, sources.tabs).map(([values, tabs]) => ({ values, visible: tabs.preview }));
  const preview = Preview({ props: previewProps });

  const codeProps = xs.combine(preview.html, sources.tabs).map(([html, tabs]) => ({ html, visible: tabs.output }));
  const code = Code({ props: codeProps });
  
  const terminalProps = sources.tabs.map(({ terminal }) => ({ visible: terminal }))
  const terminal = Console({ DOM: sources.DOM, logs: sources.LOG, props: terminalProps });

  const vdom$ = xs.combine(htmlInput.DOM, jsInput.DOM, cssInput.DOM, preview.DOM, code.DOM, terminal.DOM)
    .map(([htmlInputVTree, jsInputVTree, cssInputVTree, previewVTree, codeVTree, terminalVTree]) => 
      div('.content', [
        div('.row', [
          htmlInputVTree,
          cssInputVTree,
          jsInputVTree,
          previewVTree,
        ]),
        div('.row', [
          codeVTree,
          terminalVTree
        ])
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