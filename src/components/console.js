import xs from 'xstream';
import { div, button } from '@cycle/dom';
import isolate from '@cycle/isolate';

function Console(sources) {
  const clear$ = sources.DOM
    .select('.clear').events('click').map(ev => 1).mapTo(true);
  const change$ = xs.merge(sources.logs, clear$);
  const logs$ = change$.fold((acc, x) => x == true ? [] : acc.concat([x]), [])

  const vdom$ = logs$.map(logs =>
    div([
      button('.clear', 'Clear'),
      div(logs.map(log => div(`${log.type ? log.type.toUpperCase() + ': ' : ''}${log.message}`)))
    ])
  )

  return {
    DOM: vdom$
  }
}

const IsolatedConsole = function(sources) {
  return isolate(Console)(sources);
}

export default IsolatedConsole;