var execute = require('./../utils').execute;

sensors = module.exports = function sensors() {
}

sensors.prototype.run = function run(cb) {
    var now = new Date();
    var result = [];
    execute('sensors', [])
        .eachLine(function(line) {
            var match = line.match(/^([A-Za-z0-9. _+-]+): +\+?([0-9.]+) C/);
            if (match) {
                var name = match[1],
                    value = match[2];
                name = name.replace(/ /g, '_');
                result.push({ name: 'sensors.temperature.' + name, timestamp: now, value: value });
            }

            var match = line.match(/^([A-Za-z0-9. _+-]+): +\+?([0-9.]+) V/);
            if (match) {
                var name = match[1],
                    value = match[2];
                name = name.replace(/ /g, '_');
                result.push({ name: 'sensors.voltage.' + name, timestamp: now, value: value });
            }

            var match = line.match(/^([A-Za-z0-9. _+-]+): +([0-9.]+) RPM/);
            if (match) {
                var name = match[1],
                    value = match[2];
                name = name.replace(/ /g, '_');
                result.push({ name: 'sensors.rpm.' + name, timestamp: now, value: value });
            }
        })
        .exit(function(code) {
            cb(result);
        });
}
