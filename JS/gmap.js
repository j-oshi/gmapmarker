const options = {
    mapKey: config.MY_KEY,
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

    function CustomMarker(latlng, map, args, title, info) {
        this.latlng = latlng;
        this.args = args;
        this.setMap(map);
        this.title = title;
        this.info = info;
    }

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.draw = function () {

        var self = this;

        var div = this.div;

        const titleText = this.title;

        const { src, content, color } = this.info;

        if (!div) {

            div = this.div = document.createElement('div');
            div.className = 'marker';
            div.style.background = color;
            div.style.border = `4px solid ${color}`;
            div.classList.add(color);

            let innerImage = document.createElement('div');
            innerImage.className = 'marker-image';
            innerImage.style.position = 'relative';
            innerImage.style.backgroundImage = `url('${src}')`;
            innerImage.style.width = '100%';
            innerImage.style.height = '50px';

            div.appendChild(innerImage);

            let innerDiv = document.createElement('div');
            innerDiv.style.position = 'relative';
            innerDiv.style.padding = '10px';
            innerDiv.style.background = 'white';
            innerDiv.style.display = 'none';
            innerDiv.style.textAlign = 'left';

            let h = document.createElement("H2")
            let hContent = document.createTextNode(titleText);
            h.appendChild(hContent);
            h.style.margin = '10px 0';
            h.style.color = color;
            innerDiv.appendChild(h);

            let s = document.createElement("span")
            let sContent = document.createTextNode("Benin");
            s.style.color = 'black';
            s.style.margin = '5px 0';
            s.appendChild(sContent);
            innerDiv.appendChild(s);

            let p = document.createElement("P")
            let pContent = document.createTextNode(content);
            p.style.color = 'grey';
            p.style.margin = '5px 0';
            p.appendChild(pContent);
            innerDiv.appendChild(p);

            div.appendChild(innerDiv);

            let btn = document.createElement("BUTTON");
            let t = document.createTextNode('\u2715');
            btn.appendChild(t);
            btn.style.position = 'absolute';
            btn.style.top = '-15px';
            btn.style.right = '-12px';
            btn.style.color = color;
            btn.style.background = 'white';
            btn.style.border = 'none';
            btn.style.padding = '1px 5px 3px';
            btn.style.display = 'none';

            div.appendChild(btn);
            div.style.position = 'absolute';

            if (typeof (self.args.marker_id) !== 'undefined') {
                div.dataset.marker_id = self.args.marker_id;
            }
            var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
            google.maps.event.addDomListener(div.children[0], "click", function (event) {
                console.log(this);
                this.parentNode.classList.add("full-marker");
                this.parentNode.style.zIndex = '9999';
                this.classList.add("full-image-marker");
                this.nextSibling.style.display = 'block';
                this.parentNode.children[2].style.display = 'block';
                google.maps.event.trigger(self, "click");
                console.log(point);
                console.log(this);
            });

            google.maps.event.addDomListener(div.children[2], "click", function (event) {
                this.parentNode.classList.remove("full-marker");
                this.parentNode.children[0].classList.remove("full-image-marker");
                this.previousSibling.style.display = "none";
                this.style.display = "none";
                google.maps.event.trigger(self, "click");
                this.parentNode.style.zIndex = '10';
            });

            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);
        }

        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

        if (point) {
            div.style.left = (point.x - 45) + 'px';
            div.style.top = (point.y - 80) + 'px';
        }
    };

    CustomMarker.prototype.remove = function () {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    };

    CustomMarker.prototype.getPosition = function () {
        return this.latlng;
    };

    fetchData('/data.json').then((data) => {
        if (data.data.length > 0) {
            data.data.map(obj => {
                const { lat, lng, title, ...info } = obj;
                let myLocation = new google.maps.LatLng(lat, lng);
                overlay = new CustomMarker(
                    myLocation,
                    map,
                    {
                        marker_id: title
                    },
                    title,
                    info,
                );
            });
        }

        const colors = data.data.reduce((total, amount) => {
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

    // console.log(test);
    // var coordInfoWindow = new google.maps.InfoWindow();
    // coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
    // coordInfoWindow.setPosition(chicago);
    // coordInfoWindow.open(map);

    // map.addListener('zoom_changed', function () {
    //     coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
    //     coordInfoWindow.open(map);
    // });
}

// let TILE_SIZE = 256;

// function createInfoWindowContent(latLng, zoom) {
//     var scale = 1 << zoom;

//     var worldCoordinate = project(latLng);

//     var pixelCoordinate = new google.maps.Point(
//         Math.floor(worldCoordinate.x * scale),
//         Math.floor(worldCoordinate.y * scale));

//     var tileCoordinate = new google.maps.Point(
//         Math.floor(worldCoordinate.x * scale / TILE_SIZE),
//         Math.floor(worldCoordinate.y * scale / TILE_SIZE));

//     return [
//         'Chicago, IL',
//         'LatLng: ' + latLng,
//         'Zoom level: ' + zoom,
//         'World Coordinate: ' + worldCoordinate,
//         'Pixel Coordinate: ' + pixelCoordinate,
//         'Tile Coordinate: ' + tileCoordinate
//     ].join('<br>');
// }

// function project(latLng) {
//     var siny = Math.sin(latLng.lat() * Math.PI / 180);

//     // Truncating to 0.9999 effectively limits latitude to 89.189. This is
//     // about a third of a tile past the edge of the world tile.
//     siny = Math.min(Math.max(siny, -0.9999), 0.9999);

//     return new google.maps.Point(
//         TILE_SIZE * (0.5 + latLng.lng() / 360),
//         TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
// }

function setMapWindow() {
    // let mapDiv = document.getElementById('map');
    window.addEventListener('resize', returnedFunction);
}

function reportWindowSize() {
    console.log(window.innerHeight);
    console.log(window.innerWidth);
}

let returnedFunction = debounce(function () {
    reportWindowSize();
}, 250)

function debounce(func, wait, immediate) {
    var timeout;

    return function executedFunction() {
        let context = this;
        let args = arguments;

        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        let callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
}

async function fetchData(url) {
    let response = await fetch(url);
    let data = await response.json();
    return Promise.resolve(data);
}
function test() {
    function CustomMarker(latlng, map, args, title, info) {
        this.latlng = latlng;
        this.args = args;
        this.setMap(map);
        this.title = title;
        this.info = info;
    }

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.draw = function () {

        var self = this;

        var div = this.div;

        const titleText = this.title;

        const { src, content, color } = this.info;

        if (!div) {

            div = this.div = document.createElement('div');
            div.className = 'marker';
            div.style.background = color;
            div.style.border = `4px solid ${color}`;
            div.classList.add(color);

            let innerImage = document.createElement('div');
            innerImage.className = 'marker-image';
            innerImage.style.position = 'relative';
            innerImage.style.backgroundImage = `url('${src}')`;
            innerImage.style.width = '100%';
            innerImage.style.height = '50px';

            div.appendChild(innerImage);

            let innerDiv = document.createElement('div');
            innerDiv.style.position = 'relative';
            innerDiv.style.padding = '10px';
            innerDiv.style.background = 'white';
            innerDiv.style.display = 'none';
            innerDiv.style.textAlign = 'left';

            let h = document.createElement("H2")
            let hContent = document.createTextNode(titleText);
            h.appendChild(hContent);
            h.style.margin = '10px 0';
            h.style.color = color;
            innerDiv.appendChild(h);

            let s = document.createElement("span")
            let sContent = document.createTextNode("Benin");
            s.style.color = 'black';
            s.style.margin = '5px 0';
            s.appendChild(sContent);
            innerDiv.appendChild(s);

            let p = document.createElement("P")
            let pContent = document.createTextNode(content);
            p.style.color = 'grey';
            p.style.margin = '5px 0';
            p.appendChild(pContent);
            innerDiv.appendChild(p);

            div.appendChild(innerDiv);

            let btn = document.createElement("BUTTON");
            let t = document.createTextNode('\u2715');
            btn.appendChild(t);
            btn.style.position = 'absolute';
            btn.style.top = '-15px';
            btn.style.right = '-12px';
            btn.style.color = color;
            btn.style.background = 'white';
            btn.style.border = 'none';
            btn.style.padding = '1px 5px 3px';
            btn.style.display = 'none';

            div.appendChild(btn);
            div.style.position = 'absolute';

            if (typeof (self.args.marker_id) !== 'undefined') {
                div.dataset.marker_id = self.args.marker_id;
            }
            var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
            google.maps.event.addDomListener(div.children[0], "click", function (event) {
                console.log(this);
                this.parentNode.classList.add("full-marker");
                this.parentNode.style.zIndex = '9999';
                this.classList.add("full-image-marker");
                this.nextSibling.style.display = 'block';
                this.parentNode.children[2].style.display = 'block';
                google.maps.event.trigger(self, "click");
                console.log(point);
                console.log(this);
            });

            google.maps.event.addDomListener(div.children[2], "click", function (event) {
                this.parentNode.classList.remove("full-marker");
                this.parentNode.children[0].classList.remove("full-image-marker");
                this.previousSibling.style.display = "none";
                this.style.display = "none";
                google.maps.event.trigger(self, "click");
                this.parentNode.style.zIndex = '10';
            });

            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);
        }

        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

        if (point) {
            div.style.left = (point.x - 45) + 'px';
            div.style.top = (point.y - 80) + 'px';
        }
    };

    CustomMarker.prototype.remove = function () {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    };

    CustomMarker.prototype.getPosition = function () {
        return this.latlng;
    };
}


