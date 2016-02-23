
var GMap = function(config){
    var that = this;
    that.config = config;
    that.doc = document;

    that.dependencies();
    that.doc.initGmap = function(){
        that.init();
    };

   // that.doc = null;

};

GMap.prototype.init = function(){
    // at this time google maps must exists
    var that = this;

    that.map =  new google.maps.Map(that.el(),
        {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
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
