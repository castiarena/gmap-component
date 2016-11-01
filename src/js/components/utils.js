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