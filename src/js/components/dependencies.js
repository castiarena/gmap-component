(function(win,doc){
    'use strict';

    /**
     * Creador de dependencias
     * @param _url
     * @param _config
     * @constructor
     */
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
            sc = doc.createElement(that.config.type);
        sc.id = that.config.id;
        sc.src = that.config.api !== null ? that.config.url.replace(that.config.api.search, that.config.api.key) : that.config.url;
        doc.getElementsByTagName(that.config.elementString)[0].appendChild(sc);
    };

    Dependencie.prototype.remove = function(){
        var that = this,
            sc = doc.getElementById(that.config.id);
        doc.getElementsByTagName(that.config.elementString)[0].removeChild(sc);
    };


    win.Dependencie = Dependencie;

})(window,document);

