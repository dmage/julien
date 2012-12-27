#!/usr/bin/env node
var Scheduler = require('./scheduler'),
    Sender = require('./sender');

var landTo = require('./modules/land-to');
var http = require('http'),
    os = require('os');

var sender = new Sender();
sender._do_send = function _do_send(queue) {
    var self_host_name = os.hostname();

    //console.log(+new Date(), queue);
    console.log(+new Date(), "_do_send queue length: " + queue.length);
    queue.forEach(function(data) {
        data.object = data.object || self_host_name;
        var path = '/api/write?object=' + encodeURIComponent(data.object) +
            '&signal=' + encodeURIComponent(data.name) +
            '&timestamp=' + encodeURIComponent(data.timestamp/1000) +
            '&value=' + encodeURIComponent(data.value);
        http.get({
            hostname: 'dmage.ru',
            port: 3000,
            path: path,
            method: 'GET'
        }, function() {
        }).on('error', function(e) {
            console.log(e, 'while sending', data);
        });
    });
}

var remoteConfig = require('./config');
var config = [];
for (var i = 0; i < remoteConfig.length; ++i) {
    var r = remoteConfig[i];
    var c = {
        delay: r.delay || die(),
    };
    var check = undefined;
    for (var j = 0; j < r.pipeline.length; ++j) {
        var module = require('./modules/' + r.pipeline[j].module);
        check = new module(r.pipeline[j], check);
    }
    check = new landTo({ prefix: r.landTo }, check);
    c.check = check;
    config.push(c);
}

var initTasks = new Scheduler();
initTasks.throttle = 100;
initTasks.concurrentLimit = 1;
initTasks.toString = function() { return "[initTasks]"; };

var periodicTasks = new Scheduler();
periodicTasks.throttle = 0;
periodicTasks.concurrentLimit = 10;
periodicTasks.toString = function() { return "[periodicTasks]"; };

config.forEach(function(cfg) {
    var periodic = function(cb, task) {
        cfg.check.run(function(result) {
            sender.dispatch(result);
            periodicTasks.addTask(periodic, task.runAt + cfg.delay);
            cb();
        });
    };

    var init = function(cb) {
        cfg.check.run(function(result) {
            sender.dispatch(result);
            periodicTasks.addTask(periodic, +new Date() + cfg.delay);
            cb();
        });
    };

    initTasks.addTask(init);
});
