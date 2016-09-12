'use strict';

var pmx         = require('pmx');
var probe       = pmx.probe();
var _           = require('lodash');

// Default probes
module.exports = function () {
  // default probes
  var probes = {
    dumpname    :  {
      metric  : probe.metric({
        name        : 'Last dump name',
        value       : 'N/A'
      }),
      options : {
        description : 'Last dump of given database'
      }
    },
    dumpdate     : {
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
