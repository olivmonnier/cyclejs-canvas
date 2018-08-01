import xs from 'xstream';
import { div, iframe, span } from "@cycle/dom";
import isolate from "@cycle/isolate";

const domParser = new DOMParser();

function transformHtml(html, js, css) {
  const layoutString = `<html><head></head><body></body></html>`;
  const $style = document.createElement('style');
  const $script = document.createElement('script');

  $style.innerHTML = css;
  $script.innerHTML = js;
  
  const doc = domParser.parseFromString(layoutString, 'text/html');

  doc.head.appendChild($style);
  doc.body.innerHTML = html;
  doc.body.appendChild($script)

  return indentHtml(doc.firstChild, 0).outerHTML;
}

function getIframeHtml(htmlString) {
  const doc = domParser.parseFromString(htmlString, 'text/html');
  const $script = doc.body.querySelector('script');
  const $newScript = document.createElement('script');

  $newScript.innerHTML = `
    window.onerror = function(message, source, lineno, colno, error) {
      console.error(message, source, lineno, colno, error)
    }

    var methods = ['log', 'error', 'warn'];
    methods.forEach(function(method) {
      var oldMethod = console[method];
      console[method] = function(m) {
        parent.console[method](m);
        oldMethod.apply(console, arguments);
      } 
    });
  `
  
  doc.body.insertBefore($newScript, $script);

  return doc.firstChild.outerHTML;
}

function indentHtml(node, level) {
  let textNode;
  const indentBefore = new Array(level++ + 1).join('  '),
    indentAfter  = new Array(level - 1).join('  ');

  for (let i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode('\n' + indentBefore);
    node.insertBefore(textNode, node.children[i]);

    indentHtml(node.children[i], level);

    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode('\n' + indentAfter);
      node.appendChild(textNode);
    }
  }

  return node;
}

function Preview(sources) {
  const props$ = sources.props.startWith({ values: { html: '', js: '', css: '' }, visible: true });
  const html$ = props$.map(({ values }) => {
    const { html, js, css } = values;
    return transformHtml(html, js, css)
  });
  const iframeHtml$ = html$.map(html => getIframeHtml(html));
  const vdom$ = xs.combine(iframeHtml$, props$)
    .map(([html, props]) =>
      div({
        attrs: {
          style: !props.visible ? 'display: none;' : ''
        }
      }, [
        span('.label', 'Preview'),
        iframe({
          attrs: {
            srcdoc: html,
            sandbox: "allow-scripts allow-same-origin"
          }
        })
      ])
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
