var fs = require('fs');

tail = module.exports = function tail(opts) {
    this.filename = opts.filename;
    this.buffer = new Buffer(4096);
    this.unusedBuffer = "";

    this.fd = fs.openSync(this.filename, 'r');
    this.stats = fs.fstatSync(this.fd);
    fs.readSync(this.fd, this.stats.size);
}


tail.prototype.run = function run(cb) {
    var _this = this,
        now = new Date(),
        result = [];

    var doRead = function() {
        fs.read(_this.fd, _this.buffer, 0, _this.buffer.length, null, function(err, bytesRead, buffer) {
            var b = 0;
            for (var i = 0; i < bytesRead; ++i) {
                if (_this.buffer[i] == 13 || _this.buffer[i] == 10) {
                    var buf = _this.buffer.slice(b, i);
                    var line = _this.unusedBuffer + buf.toString('utf-8', 0, buf.length);
                    result.push({ name: 'line', timestamp: now, value: line });
                    _this.unusedBuffer = "";
                    b = i + 1;
                }
            }
            var buf = _this.buffer.slice(b, bytesRead);
            _this.unusedBuffer = buf.toString('utf-8', 0, buf.length);

            if (bytesRead != 0) {
                setTimeout(doRead, 0);
            } else {
                cb(result);
            }
        });
    };
    doRead();
}
