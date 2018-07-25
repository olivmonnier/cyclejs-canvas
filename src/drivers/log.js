import xs from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';

function logDriver() {
  const oldLog = console.log;
  const incomingLogs$ = xs.create({
    start: function(listener) {
      console.log = function(m) {
        listener.next(m);
        oldLog.apply(console, arguments)
      }
    },
    stop: function() {
      console.log = function(m) {
        oldLog.apply(console, arguments)
      }
    }
  }).startWith('')
  .map(log => typeof log == 'string' ? log : JSON.stringify(log));

  return adapt(incomingLogs$);
}

function makeLogDriver() {
  return logDriver;
}

export default makeLogDriver;