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
  const htmlInputProps = sources.tabs.map(({ html }) => ({ label: 'HTML', visible: html, mode: 'htmlmixed' }));
  const htmlInput = TextInput({ DOM: sources.DOM, props: htmlInputProps });

  const jsInputProps = sources.tabs.map(({ js }) => ({ label: 'ES6', visible: js, mode: 'javascript' }));
  const jsInput = JsInput({ DOM: sources.DOM, props: jsInputProps });

  const cssInputProps = sources.tabs.map(({ css }) => ({ label: 'CSS', visible: css, mode: 'css' }));
  const cssInput = TextInput({ DOM: sources.DOM, props: cssInputProps });

  const values$ = model(htmlInput.value, jsInput.value, cssInput.value);
  const previewProps = sources.tabs.map(({ preview }) => ({ label: 'Preview', visible: preview }));
  const preview = Preview({ props: previewProps, values: values$ });

  const codeProps = sources.tabs.map(({ output }) => ({ label: 'Output', visible: output }));
  const code = Code({ props: codeProps, html: preview.html });
  
  const terminalProps = sources.tabs.map(({ terminal }) => ({ label: 'Console', visible: terminal }))
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