import xs from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';

const methods = ['log', 'error', 'warn'];

function logDriver() {
  const incomingLogs$ = xs.create({
    start: function(listener) {
      methods.forEach(function(method) {
        const oldMethod = console[method];

        console[method] = function(m) {
          listener.next({ 
            type: method, 
            message: typeof m !== 'string' ? JSON.stringify(m) : m 
          });
          oldMethod.apply(console, arguments);
        } 
      });
    },
    stop: function() {
      methods.forEach(function(method) {
        const oldMethod = console[method];

        console[method] = function(m) {
          oldMethod.apply(console, arguments);
        } 
      });
    }
  })
  .startWith({ type: null, message: '' })
  .remember();

  return adapt(incomingLogs$);
}

function makeLogDriver() {
  return logDriver;
}

export default makeLogDriver;