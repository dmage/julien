var os = require('os');

if (os.platform == 'Darwin') {
    module.exports = require('./net-bsd');
} else {
    module.exports = require('./net-linux');
}
