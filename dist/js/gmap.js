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
var marker = '';
/** <import>components/geolocation.js</import> **/
/** <import>components/markers.js</import> **/


var GMap = function(config){
    var that = this;
    that.config = config;
    that.doc = document;
    that.map = null;
    that.position = that.config.position || null;
    that.markers = {};
    that.peremeters = {};


    that.dependencies();
    that.doc.initGmap = function(){
        that.init();
    };

   // that.doc = null;

};

GMap.prototype.init = function(){
    // at this time google maps must exists
    var that = this;


    /**
     * check if needs geolocation
     */
    if(that.config.geolocation && that.position === null){
        geo.get('position',{
            onSuccess:function(position){
                that.position = { lat: position.coords.latitude , lng: position.coords.longitude};
                that.createMap();
            }
        });
    }else{
        that.createMap();
    }


};

GMap.prototype.createMap = function(){
    var that = this;
    that.map =  new google.maps.Map(
        that.el(), {
            center: that.position,
            zoom: 16
        });
    that.setMarker('user', that.position);
    that.setPeremeter('user',that.position);
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
    var that = this,
        sc = that.doc.createElement('script');
    sc.src = 'https://maps.googleapis.com/maps/api/js?key='+that.config.api+'&callback=document.initGmap';
    that.doc.getElementsByTagName('head')[0].appendChild(sc);
};
