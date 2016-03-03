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
/** <import>components/geolocation.js</import> **/
/** <import>components/dependencies.js</import> **/


var GMap = function(config){
    var that = this;
    that.config         = config;
    that.geolocation    = config.geolocation || false;
    that.libraries      = config.libraries || null;
    that.doc            = document;
    that.map            = null;
    that.position       = that.config.position || null;
    that.markers        = {};
    that.peremeters     = {};
    that.dependencie    = null;

    that.dependencies();
    that.doc.initGmap = function(){
        that.init();
    };


};

GMap.prototype.init = function(){
    // at this time google maps must exists
    var that = this;


    /**
     * check if needs geolocation
     */
    if(that.geolocation && that.position === null){
        geo.get('position',{
            onSuccess:function(position){
                that.position = { lat: position.coords.latitude , lng: position.coords.longitude};
                that.createMap();
            }
        });
    }else{
        if(that.position === null){
            throw new Error('Must set a position');
        }else{
            that.createMap();
        }
    }


};

GMap.prototype.createMap = function(){
    var that = this;
    that.map =  new google.maps.Map(
        that.el(), {
            center: that.position,
            zoom: 16,
            mapTypeControl: false,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles:[
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [
                        { visibility: "simplified" }
                    ]
                },
                {
                    featureType: "transit.station",
                    elementType: "all",
                    stylers: [
                        { visibility: "off" }
                    ]
                },
                {
                    featureType: "landscape.man_made",
                    elementType: "all",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ]
        });
    that.setMarker('user', that.position);
};

GMap.prototype.setMarker = function(type, position){
    var that = this;

    that.markers[type] = new google.maps.Marker({
        position: position,
        map: that.map
    });

};

GMap.prototype.setPeremeter =  function(type, position){
    var that = this;
    that.peremeters[type] = new google.maps.Circle({
        center: position,
        radius: 800,
        strokeColor: "#333",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: "#333",
        fillOpacity: 0.15,
        map: that.map
    });
};

GMap.prototype.el = function() {
    var that = this;
    return that.doc.getElementById(that.config.content);
};



GMap.prototype.dependencies = function(){

    var that = this;
        that.dependencie = new Dependencie(
        'https://maps.googleapis.com/maps/api/js?key=|KEY|&callback=document.initGmap',
        {
            api:{
                search:'|KEY|',
                key: that.config.api
            }
        });
};


GMap.prototype.events = function(){
    var that = this;
    // TODO events
};
