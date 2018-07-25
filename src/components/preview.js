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

function Preview(sources) {
  const props$ = sources.props.startWith({ html: '', js: '', css: '' });
  const html$ = props$.map(({ html, js, css }) => transformHtml(html, js, css))
  const vdom$ = html$.map(html =>
    iframe({
      attrs: {
        srcdoc: html,
        sandbox: "allow-scripts"
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
