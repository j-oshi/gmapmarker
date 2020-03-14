const GoogleMap = (mapContainerTag, initLocation) => {
    const init = () => {
        if (typeof google != 'undefined') {
            let { lat, long } = initLocation;
            let initPosition = new google.maps.LatLng(lat, long);
            let mapOptions = {
                zoom: 14,
                center: initPosition,
                disableDefaultUI: true
            };
                    
            let map = new google.maps.Map(document.getElementById(mapContainerTag), mapOptions);
            const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';        
            new google.maps.Marker({
                position: initPosition,
                map: map,
                icon: image,
            });

            return map;
        }       
    }
    return {
        init,
    }
};

export default GoogleMap;