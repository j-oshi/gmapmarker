const options = {
    mapKey: config.MAP_KEY,
    mapContainerTag: '#map',
    styleSheetLink: 'css/gmap-with-interactive-marker.css',
    addMarker: true,
    mapData: '/data.json',
};

document.addEventListener('DOMContentLoaded', GoogleMap(options));

function GoogleMap(options) {
    this.mapKey = options.mapKey;
    this.mapContainerTag = options.mapContainerTag || '#map';
    this.styleSheetLink = options.styleSheetLink;
    this.addMarker = options.addMarker || false;
    this.mapData = options.mapData;

    this.init = function () {
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
    // console.log(process.env);
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
    let userLatlng = new google.maps.LatLng(-33.890542, 151.274856);
    let mapOptions = {
        zoom: 14,
        center: userLatlng,
        disableDefaultUI: true
    };

    let map = new google.maps.Map(document.getElementById('map'), mapOptions);

    const marker = new google.maps.Marker({
        position: userlocation,
        map: map,
        icon: image,
    });

    // Add marker
    if (this.addMarker) {
        loadMarkerScript(map);
    }
}

function loadMarkerScript(n) {
    // Check is script is already loaded
    let scripts = [...document.querySelectorAll("script")];
    let urlArray = scripts.map(script => script.src.includes("markers.js")).filter(urlExist => urlExist === true);
    if (urlArray.length < 1) {
        // Add marker script to body
        let scriptTag = document.createElement('script');
        scriptTag.type = "text/javascript";
        scriptTag.setAttribute('src', 'js/markers.js');
        document.body.appendChild(scriptTag);
        // Marker function
        scriptTag.addEventListener("load", () => {
            fetchData(this.mapData).then((response) => {
                if (response.data.length > 0) {
                    response.data.map(obj => {
                        const { lat, lng, title, ...info } = obj;
                        let myLocation = new google.maps.LatLng(lat, lng);
                        new CustomMarker(
                            myLocation,
                            n,
                            {
                                marker_id: title
                            },
                            title,
                            info,
                        );
                    });
                }
    
                const colors = response.data.reduce((total, amount) => {
                    if (total.indexOf(amount.color) === -1) {
                        total.push(amount.color);
                    }
                    return total;
                }, []).map(color => {
                    addRule(`.${color}:before`, {
                        'border-top': `10px solid ${color}`,
                    });
                })
    
            });
        });
    }
}

async function fetchData(url) {
    let response = await fetch(url);
    let data = await response.json();
    return Promise.resolve(data);
}

// Add style
var addRule = (function (style) {
    var sheet = document.head.appendChild(style).sheet;
    return function (selector, css) {
        var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
            return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
        }).join(";");
        sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
    };
})(document.createElement("style"));