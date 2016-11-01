var utils = (function(){
    'use strict';

    return {
        getUserDistance : function (map){
            var userBounds = map.getBounds(),
                nortEast = userBounds.getNorthEast(),
                southWest = userBounds.getSouthWest();
            return this.getDistance(nortEast.lat() , nortEast.lng() ,southWest.lat() , southWest.lng() , 'km') * 1000;
        },

        getDistance: function(lat1, lon1, lat2, lon2, unit) {
            var pi = Math.PI,
                radLat1 = pi * lat1/180,
                radLat2 = pi * lat2/180,
                theta = lon1-lon2,
                radTheta = pi * theta/180,
                dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);

            dist = Math.acos(dist);
            dist = dist * 180/pi;
            dist = dist * 60 * 1.1515;

            if (unit == "km") {
                dist = dist * 1.609344
            }
            return dist.toFixed(3);
        }
    }

})();

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


/** <import>components/utils.js</import> **/
/** <import>components/geolocation.js</import> **/
/** <import>components/dependencies.js</import> **/

(function(win,doc){
    'use strict';

    var GMap = function(config){
        var that = this;
        that.config         = config;
        that.geolocation    = config.geolocation || false;
        that.libraries      = config.libraries || null;
        that.map            = null;
        that.position       = that.config.position || null;
        that.markers        = {};
        that.peremeters     = {};
        that.dependencie    = null;

        that.dependencies();


        // expose method globally for access from google maps api
        win.initGmap = function(){
            return that.init();
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


        // eventos
        google.maps.event.addListenerOnce(that.map, 'idle', function(){
            // do something only the first time the map is loaded
            that.setMarker('user', that.position);

        });

        google.maps.event.addListener(that.map, 'idle', function(){
            // do something only the first time the map is loaded
            //that.peremeters['user'].setRadius( utils.getUserDistance(that.map) * 0.03 );

        });


    };

    GMap.prototype.setMarker = function(type, position){
        var that = this;

        var center = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1.0,
            fillColor: "#2f4f90",
            strokeOpacity: 1.0,
            strokeColor: "#2f4f90",
            strokeWeight: 1.0,
            scale: 5
        } , perimeter = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 0.2,
            fillColor: "#2f4f90",
            strokeOpacity: 1,
            strokeColor: "#2f4f90",
            strokeWeight: 4,
            scale: 20
        };
        that.markers[type + '-center'] = new google.maps.Marker({
            position: position,
            icon: center,
            map: that.map
        });

        that.markers[type + '-perimeter'] = new google.maps.Marker({
            position: position,
            icon: perimeter,
            map: that.map
        });

    };

    GMap.prototype.setPeremeter =  function(type, position){
        var that = this;
        that.peremeters[type] = new google.maps.Circle({
            center: position,
            radius: utils.getUserDistance(that.map) * 0.03,
            strokeColor: "transparent",
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: "#2f4f90",
            fillOpacity: 0.3,
            map: that.map
        });
    };

    GMap.prototype.el = function() {
        var that = this;
        return doc.getElementById(that.config.content);
    };



    GMap.prototype.dependencies = function(){

        var that = this;
        that.dependencie = new Dependencie(
            'https://maps.googleapis.com/maps/api/js?key=|KEY|&callback=initGmap',
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

    win.GMap = GMap;

})(window,document);
