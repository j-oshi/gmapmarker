import FetchData from '../mapElements/LoadData.js';
import Marker from '../mapElements/Marker.js';
import loadCss from '../mapElements/LoadCss.js';

const MarkerFactory = (url, map) => {
    const createMarker = () => {
        let bounds = new google.maps.LatLngBounds();
        loadCss();
        FetchData(url).then((response) => {
            if (response.data.length > 0) {
                response.data.map(markerData =>  {
                    const { title, lat, lng, src, content, color, index } = markerData;
                    let position = new google.maps.LatLng(lat, lng);
                    bounds.extend(position);
                    // Create marker object
                    let marker = Marker(title, position, src, content, color, map, {marker_id: index});
                    console.log(marker);
                }
            )}
        });
        // Center the map to fit all markers on the screen
        map.fitBounds(bounds);
    }
    return {
        createMarker,
    }   
}

export default MarkerFactory;