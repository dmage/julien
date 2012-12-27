ifUpdated = module.exports = function ifUpdated(check) {
    this.check = check;
    this.prev = {};
}

ifUpdated.prototype.run = function run(cb) {
    var prev = this.prev;
    this.check.run(function(result) {
        var filtered = [];
        for (var i = 0; i < result.length; ++i) {
            var c = result[i],
                p = prev[c.name];
            if (typeof p !== 'undefined') {
                if (p.timestamp < c.timestamp) {
                    filtered.push(c);
                }
            } else {
                filtered.push(c);
            }
            prev[result[i].name] = result[i];
        }
        cb(filtered);
    });
}
