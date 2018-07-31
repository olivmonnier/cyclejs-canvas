import xs from 'xstream';
import { pre, div } from '@cycle/dom';
import isolate from '@cycle/isolate';

function Code(sources) {
  const props$ = sources.props.startWith({ html: '', visible: false });
  const vdom$ = props$.map(({html, visible}) =>
    div({
      attrs: {
        style: `display: ${visible ? 'block' :  'none'}`
      }
    }, html)
  )

  return {
    DOM: vdom$
  }
}

const IsolatedCode = function(sources) {
  return isolate(Code)(sources)
}

export default IsolatedCode;