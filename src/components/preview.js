import xs from 'xstream';
import { iframe } from "@cycle/dom";
import isolate from "@cycle/isolate";

function transformHtml(html, js, css) {
  return `
    <html>
      <head>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${js}
        </script>
      </body>
    </html>
    `;
}

function getIframeHtml(htmlString) {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(htmlString, 'text/html');
  const script = document.createElement('script');
  script.innerHTML = `
    window.onerror = function(message, source, lineno, colno, error) {
      console.error(message, source, lineno, colno, error)
    }

    methods = ['log', 'error', 'warn'];
    methods.forEach(function(method) {
      var oldMethod = console[method];
      console[method] = function(m) {
        parent.console[method](m);
        oldMethod.apply(console, arguments);
      } 
    });
  `
  doc.body.appendChild(script);

  return doc.firstChild.outerHTML;
}

function Preview(sources) {
  const props$ = sources.props.startWith({ html: '', js: '', css: '' });
  const html$ = props$.map(({ html, js, css }) => transformHtml(html, js, css));
  const iframeHtml$ = xs.from(html$).map(html => getIframeHtml(html));
  const vdom$ = iframeHtml$.map(html =>
    iframe({
      attrs: {
        srcdoc: html,
        sandbox: "allow-scripts allow-same-origin"
      }
    })
  )

  return {
    DOM: vdom$,
    html: html$
  };
}

const IsolatedPreview = function(sources) {
  return isolate(Preview)(sources);
};

export default IsolatedPreview;
