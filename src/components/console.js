import { div } from '@cycle/dom';
import isolate from '@cycle/isolate';

function Console(sources) {
  const logs$ = sources.logs.fold((acc, log) => acc.concat([log]), []);
  const vdom$ = logs$.map(logs =>
    div(logs.map(log => 
      div(`${log.type ? log.type.toUpperCase() + ': ' : ''}${log.message}`))
    )
  )

  return {
    DOM: vdom$
  }
}

const IsolatedConsole = function(sources) {
  return isolate(Console)(sources);
}

export default IsolatedConsole;