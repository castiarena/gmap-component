var utils = require('./utils'),
    common = require('./common'),
    style = {
        map : 'map.scss',
        demo : 'demo.scss'
    };

utils.each(style, function(value , key){
    style[common.namespace + key] = common.sassRoot + value;
    delete style[key];
});

module.exports = style;