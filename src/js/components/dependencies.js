function Dependencie(_url, _config) {
    var config = _config,
        that = this;

    that.config = {
        type: config.type || 'script',
        elementString: config.elementString || 'head' ,
        api: !config ? null : {key: config.api.key, search: (config.api.search || 'KEY')} ,
        url: _url,
        id: config.name || new Date().getTime() + '-dependencie'
    };

    (function(){
        that.insert();
    }())
}


Dependencie.prototype.insert = function(){
    var that = this,
        sc = document.createElement(that.config.type);
    sc.id = that.config.id;
    sc.src = that.config.api !== null ? that.config.url.replace(that.config.api.search, that.config.api.key) : that.config.url;
    document.getElementsByTagName(that.config.elementString)[0].appendChild(sc);
};

Dependencie.prototype.remove = function(){
    var that = this,
        sc = document.getElementById(that.config.id);
    document.getElementsByTagName(that.config.elementString)[0].removeChild(sc);
};