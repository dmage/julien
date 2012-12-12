#!/usr/bin/env node
var Scheduler = require('./scheduler');

var execute = require('./utils').execute;

x = new Scheduler([
    {
        run: function(cb) {
            var now = new Date();
            var result = [];
            var iface = null;
            execute('ifconfig', [])
                .eachLine(function(line) {
                    var match = line.match(/^([^ ]+)/);
                    if (match) {
                        iface = {
                            name: match[1],
                            rx: undefined,
                            tx: undefined
                        };
                    } else if (line.match(/^ *$/)) {
                        if (iface) {
                            if (typeof iface.rx !== 'undefined') {
                                result.push({ name: 'net.' + iface.name + '.rx', timestamp: now, value: iface.rx });
                            }
                            if (typeof iface.tx !== 'undefined') {
                                result.push({ name: 'net.' + iface.name + '.tx', timestamp: now, value: iface.tx });
                            }
                            iface = null;
                        }
                    }

                    match = line.match(/RX bytes:([0-9]+)/);
                    if (match) {
                        iface.rx = match[1];
                    }

                    match = line.match(/TX bytes:([0-9]+)/);
                    if (match) {
                        iface.tx = match[1];
                    }
                })
                .exit(function(code) {
                    if (iface) {
                        if (typeof iface.rx !== 'undefined') {
                            result.push({ name: 'net.' + iface.name + '.rx', timestamp: now, value: iface.rx });
                        }
                        if (typeof iface.tx !== 'undefined') {
                            result.push({ name: 'net.' + iface.name + '.tx', timestamp: now, value: iface.tx });
                        }
                    }
                    cb(result);
                });
        },
        delay: 1000
    }
]);
