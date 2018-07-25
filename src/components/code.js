import { pre } from '@cycle/dom';
import isolate from '@cycle/isolate';

function Code(sources) {
  const vdom$ = sources.html.map(html =>
    pre(html)
  )

  return {
    DOM: vdom$
  }
}

const IsolatedCode = function(sources) {
  return isolate(Code)(sources)
}

export default IsolatedCode;