import xs from 'xstream';
import { div, label, input, span } from '@cycle/dom';
import isolate from '@cycle/isolate';

function NavTabs(sources) {
  const inputHtml$ = sources.DOM.select('.inputHtml').events('change').mapTo('html');
  const inputCss$ = sources.DOM.select('.inputCss').events('change').mapTo('css');
  const inputJs$ = sources.DOM.select('.inputJs').events('change').mapTo('js');
  const inputPreview$ = sources.DOM.select('.inputPreview').events('change').mapTo('preview');
  const inputOutput$ = sources.DOM.select('.inputOutput').events('change').mapTo('output');
  const inputConsole$ = sources.DOM.select('.inputConsole').events('change').mapTo('terminal');

  const state$ = xs.merge(inputHtml$, inputCss$, inputJs$, inputPreview$, inputOutput$, inputConsole$)
    .fold((acc, state) => {
      acc[state] = !acc[state];
      return acc;
    }, {
      html: true,
      css: false,
      js: false,
      preview: true,
      terminal: false,
      output: false
    })
  const tabs = [
    ['.inputHtml', 'html', true],
    ['.inputCss', 'css', false],
    ['.inputJs', 'js', false],
    ['.inputPreview', 'preview', true],
    ['.inputOutput', 'output', false],
    ['.inputConsole', 'console', false]
  ]
  const vdom$ = state$.map(state =>
    div('.tabs', 
      tabs.map(tab =>
        label([
          tab[1],
          input(tab[0], { attrs: Object.assign({}, { type: 'checkbox' }, (tab[2]) ? { checked: 'checked'} : {}) }),
          span('.checkmark')
        ])
      )
    )
  )

  return {
    DOM: vdom$,
    state: state$
  }
}

const IsolatedNavTabs = function(sources) {
  return isolate(NavTabs)(sources)
}

export default IsolatedNavTabs;