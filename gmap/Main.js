import loadGoogleApi from './mapElements/LoadGoogleApi.js';
import GoogleMap from './mapElements/Map.js';
import MarkerFactory from './Factories/MarkersFactory.js'

const Map = (elTag) => {
    
    let mapEl = document.getElementById(elTag.mapContainerTag);
    if (mapEl) {

        loadGoogleApi(elTag.mapKey);
        console.time('test');
        // Check if googlemap api exist
        let apiExist = setInterval(() => {
            if (typeof google != 'undefined') {
                console.log("Exists!");
                clearInterval(apiExist);

                let { mapContainerTag, location, mapData } = elTag;

                // Load map
                let map = GoogleMap(mapContainerTag, location);
                map.init();

                if (elTag.addMarker) {
                    let markers = MarkerFactory(mapData, map.init());
                    markers.createMarker();
                }
            }
        }, 50);
        console.timeEnd('test');
    }
    
}

export default Map;
