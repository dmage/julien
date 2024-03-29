var execute = require('./../utils').execute;

ping = module.exports = function ping(opts) {
    this.hostname = opts.hostname;
}

ping.prototype.run = function run(cb) {
    var now = new Date(),
        hostname = this.hostname;
    var result = [];
    execute('ping', ['-c', '1', '-W', '2', hostname])
        .eachLine(function(line) {
            var match = line.match(/time=([0-9.]+)/);
            if (match) {
                result.push({ name: 'time', timestamp: now, value: match[1] });
            }
        })
        .exit(function(code) {
            cb(result);
        });
}
