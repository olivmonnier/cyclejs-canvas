import xs from 'xstream';
import { pre, div, span } from '@cycle/dom';
import isolate from '@cycle/isolate';

function Code(sources) {
  const props$ = sources.props.startWith({ html: '', visible: false });
  const vdom$ = props$.map(({html, visible}) =>
    div({
      attrs: {
        style: !visible ? 'display: none;' : ''
      }
    }, [span('.label', 'Output'), pre(html)])
  )

  return {
    DOM: vdom$
  }
}

const IsolatedCode = function(sources) {
  return isolate(Code)(sources)
}

export default IsolatedCode;