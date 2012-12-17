#!/usr/bin/env node
var Scheduler = require('./scheduler'),
    Sender = require('./sender');

var net = require('./modules/net'),
    sensors = require('./modules/sensors');
var http = require('http'),
    os = require('os');

var sender = new Sender();
sender._do_send = function _do_send(queue) {
    var self_host_name = os.hostname();

    //console.log(+new Date(), queue);
    console.log(+new Date(), "_do_send queue length: " + queue.length);
    queue.forEach(function(data) {
        data.object = data.object || self_host_name;
        var path = '/api/write?object=' + data.object + '&signal=' + data.name + '&value=' + data.value;
        http.get({
            hostname: 'dmage.ru',
            port: 3000,
            path: path,
            method: 'GET'
        }, function() {
        });
    });
}

var config = [
    { check: new net(), delay: 5000 },
    { check: new sensors(), delay: 5000 }
];

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
