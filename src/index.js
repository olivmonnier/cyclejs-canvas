import './styles.scss';
import xs from "xstream";
import { run } from "@cycle/run";
import { div, makeDOMDriver } from "@cycle/dom";
import NavTabs from './components/navTabs';
import NavContent from './components/navContent';
import makeLogDriver from './drivers/log';

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

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver("#app"),
  LOG: makeLogDriver()
});
