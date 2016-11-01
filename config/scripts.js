var utils = require('./utils'),
    common = require('./common'),
    script = {
        map : 'map.js'
    };

utils.each(script, function(value , key){
    script[common.namespace + key] = common.jsRoot + value;
    delete script[key];
});

module.exports = script;