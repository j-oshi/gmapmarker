const options = {
    mapKey: 'AIzaSyAv_L4utOkpFLav6mE4N3qH0zkVBdXz_rY',
    mapContainerTag: '#map',
    styleSheetLink: 'css/gmap-with-interactive-marker.css',
};

document.addEventListener('DOMContentLoaded', GoogleMap(options));

function GoogleMap( options ) {
    this.mapKey = options.mapKey;
    this.mapContainerTag = options.mapContainerTag || '#map';
    this.styleSheetLink = options.styleSheetLink;
    this.init = function() {
        // Check if map tag exist
        loadScript();
    }

    // call init
    this.init();
}

function loadScript() {
    // Check if map tag exist
    if (document.querySelectorAll(this.mapContainerTag).length > 0) {
        loadStyleSheet();
        // Check is script is already loaded
        let scripts = [...document.querySelectorAll("script")];
        let urlArray = scripts.map(script => script.src.includes("https://maps.googleapis.com/maps/api/js")).filter(urlExist => urlExist === true);
        if (urlArray.length > 0) {
            loadGoogleApi();
        } else {
            let scriptTag = document.createElement('script');
            scriptTag.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${this.mapKey}`);
            document.getElementsByTagName('head')[0].appendChild(scriptTag);
            loadGoogleApi();
        }
    }
}

function loadStyleSheet() {
    // Check if map tag exist
    if (document.querySelectorAll(this.mapContainerTag).length > 0) {
        // Check is stylesheet is already loaded
        let styleSheet = [...document.querySelectorAll("link")];
        let linkArray = styleSheet.map(style => style.href.includes("")).filter(linkExist => linkExist === true);
        if (linkArray.length < 1) {
            let styleTag = document.createElement('link');
            styleTag.type = 'text/css';
            styleTag.rel = 'stylesheet';
            styleTag.href = this.styleSheetLink;
            document.getElementsByTagName('head')[0].appendChild(styleTag);
        } 
    }
}

function loadGoogleApi() {
    // Recursive function to loaded api
    if (typeof google != 'undefined') {
        initMap();
    }
    else {
        setTimeout(function () { (function () { loadGoogleApi() })() }, 250);
    }
}

function initMap() {
    // setMapWindow();
    const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    let userlocation = new google.maps.LatLng(-33.890542, 151.254856);
    var userLatlng = new google.maps.LatLng(-33.890542, 151.274856);
    var mapOptions = {
        zoom: 14,
        center: userLatlng,
        disableDefaultUI: true
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    const marker = new google.maps.Marker({
        position: userlocation,
        map: map,
        icon: image,
    });
}