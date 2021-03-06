'use strict';

var pmx         = require('pmx');
var probe       = pmx.probe();

// Default probes
module.exports = function () {
  // default probes
  var probes = {
    status      : {
      metric  : probe.metric({
        name          : 'Dump Status',
        value         : 'N/A'
      }),
      options : {
        description   : 'Current dump status'
      }
    },
    dumpdate    : {
      metric  : probe.metric({
        name          : 'Last dump date',
        value         : 'N/A',
      }),
      options : {
        description   : 'Last date for current dump'
      }
    },
    dumpsize    : {
      metric  : probe.metric({
        name          : 'Last dump size',
        value         : 'N/A'
      }),
      options : {
        unit          : 'Mb',
        description   : 'Last dump size for current dump'
      }
    }
  };

  // default statement
  return probes;
};
