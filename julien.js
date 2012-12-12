#!/usr/bin/env node
var Scheduler = require('./scheduler');

var net = require('./modules/net');

x = new Scheduler([
    {
        run: function(cb) {
            new net().run(cb);
        },
        delay: 1000
    }
]);
