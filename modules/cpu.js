var execute = require('./../utils').execute,
    os = require('os');

cpu = module.exports = function cpu() {
}

cpu.prototype.run = function run(cb) {
    var now = new Date();
    var result = [];
    var cpusInfo = os.cpus();
    for (var i = 0; i < cpusInfo.length; ++i) {
        for (var m in cpusInfo[i].times) {
            result.push({ name: i + '.' + m, timestamp: now, value: cpusInfo[i].times[m] });
        }
    }
    cb(result);
}
