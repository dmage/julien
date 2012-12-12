var os = require('os');

if (os.platform() == 'darwin') {
    module.exports = require('./net-bsd');
} else {
    module.exports = require('./net-linux');
}
