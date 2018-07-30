import xs from "xstream";
import { run } from "@cycle/run";
import { div, makeDOMDriver } from "@cycle/dom";
import NavTabs from './components/navTabs';
import NavContent from './components/navContent';
// import TextInput from './components/input';
// import JsInput from './components/jsInput';
// import Preview from './components/preview';
// import Code from './components/code';
// import Console from './components/console';
import makeLogDriver from './drivers/log';

// function model(htmlInputValue$, jsInputValue$, cssInputValue$) {
//   return xs
//     .combine(htmlInputValue$, jsInputValue$, cssInputValue$)
//     .map(([html, js, css]) => ({ html, js, css }))
//     .startWith({ html: '', js: '', css: '' });
// }

// function view(navTabsDOM$, htmlInputDOM$, jsInputDOM$, cssInputDOM$, previewDOM$, codeDOM$, consoleDOM$) {
//   return xs
//     .combine(navTabsDOM$, htmlInputDOM$, jsInputDOM$, cssInputDOM$, previewDOM$, codeDOM$, consoleDOM$)
//     .map(([navTabsVTree, htmlInputVTree, jsInputVTree, cssInputVTree, previewVTree, codeVTree, consoleVTree]) =>
//       div('.container', [
//         navTabsVTree,
//         div([
//           htmlInputVTree,
//           cssInputVTree,
//           jsInputVTree,
//           previewVTree,
//           consoleVTree,
//           codeVTree
//         ])
//       ])
//     );
// }

function main(sources) {
  const navTabs = NavTabs({ DOM: sources.DOM });
  const navContent = NavContent({ DOM: sources.DOM, tabs: navTabs.state, LOG: sources.LOG });
  const vdom$ = xs.combine(navTabs.DOM, navContent.DOM)
    .map(([navTabsVTree, navContentVTree]) =>
      div('.container', [
        navTabsVTree,
        navContentVTree
      ])
    )

  // const htmlInputProps = xs.of({ label: "HTML: " });
  // const htmlInput = TextInput({ DOM: sources.DOM, props: htmlInputProps });

  // const jsInputProps = xs.of({ label: "JS: " });
  // const jsInput = JsInput({ DOM: sources.DOM, props: jsInputProps });

  // const cssInputProps = xs.of({ label: "CSS: " });
  // const cssInput = TextInput({ DOM: sources.DOM, props: cssInputProps });

  // const values$ = model(htmlInput.value, jsInput.value, cssInput.value);
  // const preview = Preview({ props: values$ });

  // const code = Code({ html: preview.html });
  
  // const terminal = Console({ DOM: sources.DOM, logs: sources.LOG });

  // const vdom$ = view(navTabs.DOM, htmlInput.DOM, jsInput.DOM, cssInput.DOM, preview.DOM, code.DOM, terminal.DOM);

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver("#app"),
  LOG: makeLogDriver()
});
