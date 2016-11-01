module.exports = (function utils(){
    return {
        each: function(obj, callback){
            Object.keys(obj).forEach(function(key){
                return typeof callback === 'function' ? callback(obj[key], key) : (function(){
                    console.log('ERROR!');
                    return process.exit();
                })();
            })
        }
    }
})();