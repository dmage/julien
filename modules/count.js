ifUpdated = module.exports = function ifUpdated(opts, check) {
    this.check = check;
}

ifUpdated.prototype.run = function run(cb) {
    this.check.run(function(result) {
        cb([{ name: '', timestamp: new Date(), value: result.length }]);
    });
}
