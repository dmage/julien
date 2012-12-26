delta = module.exports = function delta(check) {
    this.check = check;
    this.prev = {};
}

delta.prototype.run = function run(cb) {
    var prev = this.prev;
    this.check.run(function(result) {
        var deltas = [];
        for (var i = 0; i < result.length; ++i) {
            var c = result[i],
                p = prev[c.name];
            if (typeof p !== 'undefined') {
                if (p.timestamp < c.timestamp) {
                    deltas.push({ name: c.name, timestamp: c.timestamp, value: c.value - p.value });
                }
            }
            prev[result[i].name] = result[i];
        }
        cb(deltas);
    });
}
