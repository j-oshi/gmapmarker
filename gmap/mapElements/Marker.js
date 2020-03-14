const Marker = (title, location, src, content, color, map, index) => {
    // let marker = new google.maps.Marker({position: location});
    let marker = new google.maps.OverlayView();

    marker.draw = function() {
        let div = marker.div;
        if (!div) {
            div = marker.div = document.createElement('div');
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
            let hContent = document.createTextNode(title);
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

            if (typeof (index.marker_id) !== 'undefined') {
                div.dataset.marker_id = index.marker_id;
            }
            
            google.maps.event.addDomListener(div.children[0], "click", function (event) {
                div.children[0].parentNode.classList.add("full-marker");
                div.children[0].parentNode.style.zIndex = '9999';
                div.children[0].classList.add("full-image-marker");
                div.children[0].nextSibling.style.display = 'block';
                div.children[0].parentNode.children[2].style.display = 'block';
                // thisObject.map.setCenter(pointX.x,point.y);
                // console.log(point);
            });

            google.maps.event.addDomListener(div.children[2], "click", function (event) {
                div.children[2].parentNode.classList.remove("full-marker");
                div.children[2].parentNode.children[0].classList.remove("full-image-marker");
                div.children[2].previousSibling.style.display = "none";
                div.children[2].style.display = "none";
                google.maps.event.trigger(div, "click");
                div.children[2].parentNode.style.zIndex = '10';
            });
            
            if (typeof(index.marker_id) !== 'undefined') {
                div.dataset.marker_id = index.marker_id;
            }
		
		// google.maps.event.addDomListener(div, "click", function(event) {			
		// 	google.maps.event.trigger(marker.div, "click");
		// });	
            var panes = marker.getPanes();
            panes.overlayImage.appendChild(div);
        }

        let pointXY = marker.getProjection().fromLatLngToDivPixel(location);

        if (pointXY) {
            div.style.left = pointXY.x + 'px';
            div.style.top = pointXY.y + 'px';
        }
    };

    marker.setMap(map);

    return {
        debug: marker,
    }
}

export default Marker;