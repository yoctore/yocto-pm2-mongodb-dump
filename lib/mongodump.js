'use strict';

var shelljs     = require('shelljs');
var pmx         = require('pmx');
var _           = require('lodash');
var path        = require('path');
var moment      = require('moment');
var fs          = require('fs-extra');
var async       = require('async');

// default interval
var interval;

/**
 * Default dump function
 */
function dump () {
  // clear interval before process we need to wti main process to start a new interval
  clearInterval(interval);
  // default command
  var mongodump = [ 'mongodump', '--port', pmx.getConf().port ].join(' ');
  // has ip
  if (_.isString(pmx.getConf().ip) && !_.isEmpty(pmx.getConf().ip)) {
    // build host
    mongodump   = [ mongodump, '-h', pmx.getConf().ip ].join(' ');
  }

  // build full command
  if (_.isString(pmx.getConf().username) && !_.isEmpty(pmx.getConf().username) &&
      _.isString(pmx.getConf().password) && !_.isEmpty(pmx.getConf().password) &&
      _.isString(pmx.getConf().authDB) && !_.isEmpty(pmx.getConf().authDB)) {
    // build command
    mongodump = [ mongodump, '-u', pmx.getConf().username, '-p',
      [ '"', pmx.getConf().password, '"' ].join(''), '--authenticationDatabase',
      pmx.getConf().authDB ].join(' ');
  }

  // here process ssl config if defined
  if (pmx.getConf().ssl !== false) {
    // enable ssl
    mongodump = [ mongodump, '--ssl' ].join(' ');

    // has ca ?
    if (pmx.getConf().sslCa) {
      // add command
      mongodump = [ mongodump, '--sslCAFile', pmx.getConf().sslCa ].join(' ');
    }

    // has key ?
    if (pmx.getConf().sslCert) {
      // add command
      mongodump = [ mongodump, '--sslPEMKeyFile', pmx.getConf().sslCert ].join(' ');
    }

    // check identify ?
    if (!pmx.getConf().checkServerIdentity) {
      // add command
      mongodump = [ mongodump, '--sslAllowInvalidHostnames' ].join(' ');
    }
  }
  // enable auth mechanism
  if (pmx.getConf().authenticationMechanism !== false &&
    !_.isEmpty(pmx.getConf().authenticationMechanism)) {
    // add command
    mongodump = [ mongodump, '--authenticationMechanism',
      [ '"', pmx.getConf().authenticationMechanism, '"' ].join('') ].join(' ');
  }

  // set default dump
  var archivePath     = path.normalize([ process.cwd(), 'dump' ].join('/'));
  // archive Date
  var archiveDate     = [ moment().format(pmx.getConf().dateFormat || 'YYYY-MM-DD--HH-mm-ss'),
    pmx.getConf().compress ? 'gz' : '' ].join(pmx.getConf().compress ? '.' : '');
  // build archive file name
  var archiveFileName = [ pmx.getConf().database, archiveDate ].join('-')

  // mongodump specific
  if (pmx.getConf().compress) {
    // add compression option
    mongodump = [ mongodump, '--gzip' ].join(' ');
  }
  // add arvhive path for export
  mongodump = [ mongodump, [
    '--archive', [ archivePath, archiveFileName ].join('/')
    ].join('=')
  ].join(' ');

  // add database
  mongodump = [ mongodump, '--db', pmx.getConf().database ].join(' ');

  // process
  shelljs.exec(mongodump, {
    async   : true,
    silent  : false
  }, function (err, out) {
    // has error ?
    if (err) {
      // process error
      return console.error('Fail : could not process mongodump process', err);
    }

    // log message
    console.log([ 'Dump processed on', [ archivePath, archiveFileName ].join('/') ].join(' '));
    // retrive metrics
    fs.stat([ archivePath, archiveFileName ].join('/'), function (err, stats) {
      // restart process to a new interval
      // engine is defined ?
      if (!_.isUndefined(pmx.getConf().engine)) {
        // get probes from files
        var probes = require('./probes')();
        // Config part
        var config = [ probes.dumpname, probes.dumpdate, probes.dumpsize ];
        // set data
        var data   = [ [ archivePath, archiveFileName ].join('/'),
          moment().format(pmx.getConf().probeDateFormat),
          stats.size / 1000000.0 ];

        // parse all probes and set value
        _.each(config, function (v, k) {
          // default metric
          var metric = data[k];
          // is keymetrics mode ?
          if (pmx.getConf().mode !== 'keymetrics') {
            // define metric
            metric = _.extend({ metric : metric, options : v.options || {} });
          }
          // set value
          v.metric.set(metric);
        });

        // storage items
        var items = [];

        // process rotate
        fs.walk(archivePath).on('data', function (item) {
          // if file ?
          if (item.stats.isFile()) {
            // add item on queue
            items.push(item);
          }
        }).on('end', function () {
          // process properly current limit
          var limit = (pmx.getConf().archiveLimit || 5);
          // has more archive than given config
          if (_.size(items) > limit) {
            // build a big storage store all
            var storeAll = _.map(items, function (item) {
              // return path
              return item.path;
            });

            // process diff calc
            var diff = _.size(items) - limit;
            console.log(diff);
            // from non needed item
            items = _.drop(items, diff);

            // keep data to process
            var keepData = _.map(items, function (item) {
              return item.path;
            });
            // read async
            async.eachSeries(storeAll, function (item, next) {
              // not data to kepp ?
              if (!_.includes(keepData, item)) {
                // remove file
                fs.remove(item, function (error) {
                  // log error message
                  if (error) {
                    // notify with error
                    pmx.notify([ 'An error occured when cleaning old backup. ', error ].join(''));
                  }
                  // go next
                  next();
                });
              } else {
                next();
              }
            }, function () {
              // end here so restart interval
              interval = setInterval(dump, pmx.getConf().refreshDelay);
            });
          } else {
            // end here so restart interval
            interval = setInterval(dump, pmx.getConf().refreshDelay);
          }
        });
      }
    });
  });
}

// start on start up
if (pmx.getConf().dumpOnstartUp) {
  // process is this config is set to true 
  dump();
} else {
  // process interval
  interval = setInterval(dump, pmx.getConf().refreshDelay);  
}
