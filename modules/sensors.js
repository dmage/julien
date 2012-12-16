var execute = require('./../utils').execute;

sensors = module.exports = function sensors() {
}

sensors.prototype.run = function run(cb) {
    var now = new Date();
    var result = [];
    execute('sensors', [])
        .eachLine(function(line) {
            var match = line.match(/^Core([0-9]+) Temp: +\+([0-9.]+) C/);
            if (match) {
                result.push({ name: 'cpu.' + match[1] + '.temp', timestamp: now, value: match[2] });
            }
        })
        .exit(function(code) {
            cb(result);
        });
}
