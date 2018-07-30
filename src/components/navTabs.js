import xs from 'xstream';
import { div, label, input } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { access } from 'fs';

function NavTabs(sources) {
  const inputHtml$ = sources.DOM.select('.inputHtml').events('change').mapTo('html');
  const inputCss$ = sources.DOM.select('.inputCss').events('change').mapTo('css');
  const inputJs$ = sources.DOM.select('.inputJs').events('change').mapTo('js');
  const inputPreview$ = sources.DOM.select('.inputPreview').events('change').mapTo('preview');
  const inputConsole$ = sources.DOM.select('.inputConsole').events('change').mapTo('console');

  const state$ = xs.merge(inputHtml$, inputCss$, inputJs$, inputPreview$, inputConsole$)
    .fold((acc, state) => {
      acc[state] = !acc[state];
      return acc;
    }, {
      html: false,
      css: false,
      js: false,
      preview: false,
      console: false,
      output: false
    })

  const vdom$ = state$.map(state =>
    div([
      label([
        input('.inputHtml', { attrs: { type: 'checkbox' } }),
        'html'
      ]),
      label([
        input('.inputCss', { attrs: { type: 'checkbox'} }),
        'css'
      ]),
      label([
        input('.inputJs', { attrs: { type: 'checkbox'} }),
        'js'
      ]),
      label([
        input('.inputPreview', { attrs: { type: 'checkbox'} }),
        'preview'
      ]),
      label([
        input('.inputOutput', { attrs: { type: 'checkbox'} }),
        'output'
      ]),
      label([
        input('.inputConsole', { attrs: { type: 'checkbox'} }),
        'console'
      ])
    ])
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