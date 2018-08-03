import './styles.scss';
import '../node_modules/codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
window.CodeMirror = CodeMirror;

import xs from "xstream";
import { run } from "@cycle/run";
import { div, makeDOMDriver } from "@cycle/dom";
import NavTabs from './components/navTabs';
import NavContent from './components/navContent';
import makeLogDriver from './drivers/log';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

function main(sources) {
  const navTabs = NavTabs({ DOM: sources.DOM });
  const navContent = NavContent({ DOM: sources.DOM, tabs: navTabs.state, LOG: sources.LOG });
  const vdom$ = xs.combine(navTabs.DOM, navContent.DOM)
    .map(([navTabsVTree, navContentVTree]) =>
      div('.container', [
        navTabsVTree,
        navContentVTree
      ])
    );

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver("#app"),
  LOG: makeLogDriver()
});
