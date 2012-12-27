landTo = module.exports = function landTo(opts, check) {
    this.prefix = opts.prefix;
    this.check = check;
}

landTo.prototype.run = function run(cb) {
    var prefix = this.prefix;
    this.check.run(function(result) {
        var filtered = [];
        for (var i = 0; i < result.length; ++i) {
            var c = result[i];
            filtered.push({ name: prefix + c.name, timestamp: c.timestamp, value: c.value });
        }
        cb(filtered);
    });
}
