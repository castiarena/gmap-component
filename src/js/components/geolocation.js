
var geo  = (function(win){
    'use strict';

    var _ = {
        position: function(events){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(events.onSuccess);
            } else {
                if(events.onError && typeof events.onError === 'function'){
                    events.onError();
                }else{
                    throw new Error('You don`t send an action to error on geolocation');
                }
            }
        }
    };

    return {
        get: function(method,events){
            return _[method](events);
        }
    };

})(window);
