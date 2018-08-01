import xs from 'xstream';
import { pre, code, div, span } from '@cycle/dom';
import isolate from '@cycle/isolate';

function Code(sources) {
  const props$ = sources.props;
  const html$ = sources.html;
  const vdom$ = xs.combine(html$, props$).map(([html, props]) =>
    div({
      attrs: {
        style: !props.visible ? 'display: none;' : ''
      }
    }, [span('.label', props.label), pre(code('.html', html))])
  )

  return {
    DOM: vdom$
  }
}

const IsolatedCode = function(sources) {
  return isolate(Code)(sources)
}

export default IsolatedCode;