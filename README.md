[![NPM](https://nodei.co/npm/yocto-pm2-mongodb-dump.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/yocto-pm2-mongodb-dump/)

![alt text](https://david-dm.org/yoctore/yocto-pm2-mongodb-dump.svg "Dependencies Status")
[![Code Climate](https://codeclimate.com/github/yoctore/yocto-pm2-mongodb-dump/badges/gpa.svg)](https://codeclimate.com/github/yoctore/yocto-pm2-mongodb-dump)
[![Test Coverage](https://codeclimate.com/github/yoctore/yocto-pm2-mongodb-dump/badges/coverage.svg)](https://codeclimate.com/github/yoctore/yocto-pm2-mongodb-dump/coverage)
[![Issue Count](https://codeclimate.com/github/yoctore/yocto-pm2-mongodb-dump/badges/issue_count.svg)](https://codeclimate.com/github/yoctore/yocto-pm2-mongodb-dump)
[![Build Status](https://travis-ci.org/yoctore/yocto-pm2-mongodb-dump.svg?branch=master)](https://travis-ci.org/yoctore/yocto-pm2-mongodb-dump)


## Overview

This module provide mongodump command and dump metrics from pm2 agent for keymetrics or for your own tools.

This module support SSL, Auth config for secure mongodatabase

It's recommended to use an user with specific rights to connection on your database to retrieve metrics with [mongodump](https://docs.mongodb.com/manual/reference/program/mongodump/).

## How to install

```javascript
pm2 install yocto-pm2-mongodb-dump
```

## How to use with keymetrics

Read Keymetrics documentation : http://pm2.keymetrics.io/docs/usage/monitoring/#keymetrics-monitoring.


## How to use with your own tools.

Step 1 : You need just change the mode use on module config, and set your own name. (by default is keymetrics)

```bash
pm2 set yocto-pm2-mongodb:mode YOUR_CONFIG_NAME
```

Step 2 : Use your own tools with pm2 API to get metrics

# yocto-pm2-mongodb-dump
