function CustomMarker(latlng, map, args, title, info) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
    this.title = title;
    this.info = info;
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function () {

    let thisObject = this;

    let div = this.div;

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
        let sContent = document.createTextNode("Test");
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

        if (typeof (thisObject.args.marker_id) !== 'undefined') {
            div.dataset.marker_id = thisObject.args.marker_id;
        }
        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
        google.maps.event.addDomListener(div.children[0], "click", function (event) {
            console.log(this);
            this.parentNode.classList.add("full-marker");
            this.parentNode.style.zIndex = '9999';
            this.classList.add("full-image-marker");
            this.nextSibling.style.display = 'block';
            this.parentNode.children[2].style.display = 'block';
            google.maps.event.trigger(thisObject, "click");
            console.log(point);
            console.log(this);
        });

        google.maps.event.addDomListener(div.children[2], "click", function (event) {
            this.parentNode.classList.remove("full-marker");
            this.parentNode.children[0].classList.remove("full-image-marker");
            this.previousSibling.style.display = "none";
            this.style.display = "none";
            google.maps.event.trigger(thisObject, "click");
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