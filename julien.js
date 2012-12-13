#!/usr/bin/env node
var Scheduler = require('./scheduler'),
    Sender = require('./sender');

var net = require('./modules/net');
var http = require('http');

var sender = new Sender();
sender._do_send = function _do_send(queue) {
    console.log(+new Date(), queue);
    queue.forEach(function(data) {
        var path = '/api/write?object=dmage-host&signal=' + data.name + '&value=' + data.value;
        http.get({
            hostname: 'dmage.ru',
            port: 3000,
            path: path,
            method: 'GET'
        }, function() {
        });
    });
}

var initTasks = new Scheduler();
initTasks.throttle = 100;
initTasks.concurrentLimit = 1;

var periodicTasks = new Scheduler();
periodicTasks.throttle = 0;
periodicTasks.concurrentLimit = 10;

var netTask = function(cb, task) {
    var now = + new Date();
    new net().run(function(netResult) {
        sender.dispatch(netResult);
        periodicTasks.addTask(netTask, (task.runAt || now) + 1000);
        cb();
    });
}

initTasks.addTask(netTask);
