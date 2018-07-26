import xs from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';

function logDriver() {
  const oldLog = console.log;
  const incomingLogs$ = xs.create({
    start: function(listener) {
      const methods = ['log', 'error', 'warn'];
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
      const methods = ['log', 'error', 'warn'];
      methods.forEach(function(method) {
        const oldMethod = console[method];

        console[method] = function(m) {
          oldMethod.apply(console, arguments);
        } 
      });
    }
  }).startWith({ type: null, message: '' });

  return adapt(incomingLogs$);
}

function makeLogDriver() {
  return logDriver;
}

export default makeLogDriver;