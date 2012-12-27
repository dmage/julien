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
        var name = c.name;
        if (prefix && name) { name = prefix + '.' + name; }
        else if (prefix) { name = prefix; }
            filtered.push({ name: name, timestamp: c.timestamp, value: c.value });
        }
        cb(filtered);
    });
}
