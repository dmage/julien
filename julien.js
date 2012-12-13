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

x = new Scheduler([
    {
        run: function(cb) {
            console.log('run');
            new net().run(cb);
        },
        delay: 5000
    }
], function(result) {
    console.log('dispatch');
    sender.dispatch(result);
});
