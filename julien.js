#!/usr/bin/env node
var Scheduler = require('./scheduler'),
    Sender = require('./sender');

var net = require('./modules/net');

var sender = new Sender();
x = new Scheduler([
    {
        run: function(cb) {
            new net().run(cb);
        },
        delay: 1000
    }
], function(result) {
    sender.dispatch(result);
});
