import xs from 'xstream';
import delay from 'xstream/extra/delay';
import { div, span } from '@cycle/dom';
import isolate from '@cycle/isolate';

function Code(sources) {
  let editor;
  const props$ = sources.props;
  const html$ = sources.html;
  const vdom$ = xs.combine(html$, props$).map(([html, props]) =>
    div({
      attrs: {
        style: !props.visible ? 'display: none;' : ''
      }
    }, [span('.label', props.label), div('.html')])
  )

  xs.combine(props$, html$).filter(([props, html]) => props.visible).compose(delay(100)).take(1).addListener({
    next: ([props, html]) => {
      editor = CodeMirror(document.querySelector('.html'), {
        lineNumbers: true,
        tabSize: 2,
        value: html,
        readOnly: true,
        mode: 'htmlmixed'
      });
    }
  });

  html$.addListener({
    next: html => editor && editor.setValue(html)
  });


  return {
    DOM: vdom$
  }
}

const IsolatedCode = function(sources) {
  return isolate(Code)(sources)
}

export default IsolatedCode;