var save = new SaveData;

var map;

var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: true,
    drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
        // drawingModes: [google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.MARKER, google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.RECTANGLE]
        drawingModes: [google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.MARKER]
    },
    polylineOptions: {
        strokeWeight: 5,
        strokeOpacity: 0.5,
        strokeColor: '#ff0000',
        clickable: false,
        zIndex: 1,
        editable: false
    },
    polygonOptions: {
        editable: false
    },
    markerOptions: {
        editable: false
    }
});

function initialize() {
    var mapOptions = {
        disableDefaultUI: true,
        panControl: false,
        zoomControl: false,
        zoom: 10,
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // add control
    var snapOpts = {
        map: map,
        buttonLabelHtml: "Share"
    };

    drawingManager.setMap(map);

    // var snapShotControl = new SnapShotControl(snapOpts);


    // log new overlays
    //After creating 'drawingManager' object in if block 
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        var output = ("|" + event.type + "");
        switch (event.type) {
            case google.maps.drawing.OverlayType.MARKER:
                output = output + (event.overlay.getPosition() + "");
                constructMarker(output);
                break;
            case google.maps.drawing.OverlayType.RECTANGLE:
                output = output + (event.overlay.getBounds() + "");
                break;
            case google.maps.drawing.OverlayType.CIRCLE:
                output = output + (event.overlay.getCenter() + "")
                output = output + (event.overlay.getRadius() + "");
                break;
            default:
                path = event.overlay.getPath();
                for (var i = 0; i < path.length; i++) {
                    output = output + (path.getAt(i) + ';')
                };
                constructPolyline(output);
                break;
        };
        console.log(output);
        save.add(output);
    });




    // Try HTML5 geolocation
    if (getQueryString !== null) {
        load();
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);

                // var infowindow = new google.maps.InfoWindow({
                //     map: map,
                //     position: pos,
                //     content: 'Location found using HTML5.'
                // });

                map.setCenter(pos);
            }, function() {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    }



    // search

    var markers = [];

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */ (
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */
        (input));

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            markers.push(marker);

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
        }

    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });


    load();


}







// automatically center on current location

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: Couldn\'t find your location.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(41.880454799999995, -87.6251393),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}


// function to return a random hex color
// classic elegant solution from http://paulirish.com/2009/random-hex-color-code-snippets/

function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}


function saveImage() {
    $('body').html2canvas();
    var queue = html2canvas.Parse();
    var canvas = html2canvas.Renderer(queue, {
        elements: {
            length: 1
        }
    });
    var img = canvas.toDataURL();
    window.open(img);
    // ImageSaver.download_data_uri(canvas.toDataURL("image/png"), "map");
    // html2canvas(document.body, {
    //     onrendered: function(canvas) {
    //         // to save the image to the user's computer with a specified filename:
    //     }
    // });
}





// constructor for save state

function SaveData() {
    this.drawLog = "";
};
SaveData.prototype.base64 = function() {
    return btoa(this.metadata() + this.drawLog);
};
SaveData.prototype.metadata = function() {
    var output = "";
    output += "zoom(" + map.zoom + ")|";
    output += "center" + map.getCenter().toString() + "|";
    return output;
};
SaveData.prototype.add = function(input) {
    this.drawLog += input;
};


google.maps.event.addDomListener(window, 'load', initialize);




// construct from logs


// sample log
//
// polygon: 
// (42.14304156290939, -88.0499267578125)
// (42.10943017110108, -87.93182373046875)
// (42.0615286181226, -88.01422119140625)
//
// circle: 
// (42.018692376843845, -87.87551879882812)
// 2845.658621411023
//
// rectangle((41.89090494447032, -87.62798309326172), (41.90585436043303, -87.62369155883789)) 
//
// marker(43.229195113965005, -90.1263427734375) 
//
// polyline(42.014611228817955, -87.89749145507812);(41.99011884096809, -87.48550415039062);(41.62160222224564, -87.40310668945312);(41.54764462357737, -87.98812866210938);(41.76926321969369, -87.79586791992188);(41.820455096140314, -87.60635375976562);(42.014611228817955, -87.89749145507812); 



function constructPolyline(logstring) {
    var currentPoint;
    var pointsLog = logstring.replace('polyline', '').replace(/\(/g, '').replace(/\)/g, '').split(';');
    console.log(pointsLog);

    var latlngs = new google.maps.MVCArray();


    for (var i = pointsLog.length - 2; i >= 0; i--) {
        console.log(pointsLog[i].split(', '));
        var currentPoint = pointsLog[i].split(', ');
        latlngs.push(new google.maps.LatLng(parseFloat(currentPoint[0]), parseFloat(currentPoint[1])));
    };


    var line = new google.maps.Polyline({
        path: latlngs,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map: map
    });
}

function constructMarker(logstring) {
    var currentPoint = logstring.replace('marker', '').replace(/\(/g, '').replace(/\)/g, '').split(', ')

    var latlngs = new google.maps.MVCArray();
    latlngs.push(new google.maps.LatLng(parseFloat(currentPoint[0]), parseFloat(currentPoint[1])));

    // add markers
    latlngs.forEach(function(pos, i) {
        createMarker({
            map: map,
            position: pos
        });
    });
}



function createMarker(opts) {
    var marker = new google.maps.Marker(opts);
    google.maps.event.addListenerOnce(marker, "click", function() {
        marker.setMap(null);
        marker = null;
    });
    return marker;
}


function constructZoom(logstring) {
    var currentZoom = logstring.replace('zoom', '').replace(/\(/g, '').replace(/\)/g, '');
    map.setZoom(parseInt(currentZoom));
}

function constructCenter(logstring) {
    var currentCenter = logstring.replace('center', '').replace(/\(/g, '').replace(/\)/g, '');
    console.log(currentCenter);
    var currentCenterPoint = currentCenter.split(', ');
    map.setCenter(new google.maps.LatLng(parseFloat(currentCenterPoint[0]), parseFloat(currentCenterPoint[1])))
}




// function to get the current query string (anything in the location bar after a '?'), and de-base64 it.

function getQueryString() {
    if (window.location.href.indexOf('?') == -1) {
        // if there's no '?', there's no query string...
        return null;
    };
    // otherwise get everything after it.
    var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
    if (queryString.length <= 1) {
        return null;
    }
    return atob(queryString);
}


function getOverlayArray() {
    return getQueryString().split('|');
}

function load() {
    if (getQueryString() !== null) {
        var overlayArray = getOverlayArray();
        for (var i = overlayArray.length - 1; i >= 0; i--) {
            if (overlayArray[i].indexOf("zoom") !== -1) {
                constructZoom(overlayArray[i])
            }
            if (overlayArray[i].indexOf("center") !== -1) {
                constructCenter(overlayArray[i])
            }
            if (overlayArray[i].indexOf("polyline") !== -1) {
                constructPolyline(overlayArray[i])
            }
            if (overlayArray[i].indexOf("polyline") !== -1) {
                constructPolyline(overlayArray[i])
            }
            if (overlayArray[i].indexOf("marker") !== -1) {
                constructMarker(overlayArray[i]);
            }
        };
    };
}
