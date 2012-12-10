#!/usr/bin/env node
var Scheduler = require('./scheduler');

x = new Scheduler([
    {
        run: function(cb) {
            console.log("Hello, world!");
            cb([]);
        },
        delay: 1000
    }
]);
