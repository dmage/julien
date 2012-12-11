#!/usr/bin/env node
var Scheduler = require('./scheduler');

var spawn = require('child_process').spawn;

x = new Scheduler([
    {
        run: function(cb) {
            var now = new Date();
            var data = "";
            var ifconfig = spawn('ifconfig', []);
            ifconfig.stdin.end();
            ifconfig.stdout.on('data', function(chunk) {
                data += chunk;
            });
            ifconfig.on('exit', function(code) {
                var result = [];
                var lines = data.split(/\n/);
                var iface = null;
                for (var i = 0; i < lines.length; ++i) {
                    var line = lines[i];
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
                }
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
