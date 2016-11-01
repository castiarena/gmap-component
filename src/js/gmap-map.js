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
            that.setPeremeter('user', that.position);

        });

        google.maps.event.addListener(that.map, 'idle', function(){
            // do something only the first time the map is loaded
            //that.peremeters['user'].setRadius( utils.getUserDistance(that.map) * 0.03 );

        });


    };

    GMap.prototype.setMarker = function(type, position){
        var that = this;

        var whiteCircle = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1.0,
            fillColor: "#2f4f90",
            strokeOpacity: 1.0,
            strokeColor: "#2f4f90",
            strokeWeight: 1.0,
            scale: 5
        };
        that.markers[type] = new google.maps.Marker({
            position: position,
            icon: whiteCircle,
            map: that.map,

        });

        that.map.addListener('dragstart',function(){
            that.markers[type].setAnimation(google.maps.Animation.Pp);
        });

        that.map.addListener('dragend',function(){
            that.markers[type].setAnimation(google.maps.Animation.Np);
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

        that.map.addListener('zoom_changed',function(){
            utils.transition(function(radius){
                that.peremeters[type].setRadius(radius);
            },{
                from:  0,
                to: utils.getUserDistance(that.map) * 0.03,
                time: 800
            })
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
