var execute = require('./../utils').execute;

net = module.exports = function net() {
}

net.prototype.run = function run(cb) {
    var now = new Date();
    var result = [];
    var firstLine = true;
    execute('netstat', ['-n', '-i', '-b'])
        .eachLine(function(line) {
            var match = line.match(/^([A-Za-z0-9]+).* +([^ ]+)(?: +[^ ]+){2} +([^ ]+)(?: +[^ ]+) *$/);
            if (!match) {
                console.log('Broken netstat? ' + line);
                return;
            }
            var name = match[1],
                rx = match[2],
                tx = match[3];
            if (firstLine) {

                if (name !== 'Name' || rx !== 'Ibytes' || tx !== 'Obytes') {
                    console.log('Invalid netstat first line: ' + line);
                }
                firstLine = false;
            } else {
                result.push({ name: 'net.' + name + '.rx', timestamp: now, value: rx });
                result.push({ name: 'net.' + name + '.tx', timestamp: now, value: tx });
            }
        })
        .exit(function(code) {
            cb(result);
        });
}
