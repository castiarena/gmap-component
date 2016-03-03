var geo = {
    get: function(method,events){
        return this[method](events);
    },
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