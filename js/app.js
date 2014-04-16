// namespace
var mapDraw = {}

var map;

var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: true,
    drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.MARKER, google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.RECTANGLE]
    },
    polylineOptions: {
        strokeWeight: 5,
        strokeColor: '#ff0000',
        clickable: false,
        zIndex: 1,
        editable: false
    },
    polygonOptions: {
        editable: false
    },
    markerOptions: {
        title: "My house!",
        editable: false
    }
});

function initialize() {
    var mapOptions = {
        panControl: false,
        zoomControl: false,
        zoom: 10,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    drawingManager.setMap(map);

    //After creating 'drawingManager' object in if block 
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        if (event.type == google.maps.drawing.OverlayType.POLYLINE) {
            path = event.overlay.getPath();
            for (var i = 0; i < path.length; i++) {
                console.log(path.getAt(i) + "\n");
            }
        } else {
            console.log(event.type);
        };
    });

    // Try HTML5 geolocation
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

            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
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



google.maps.event.addDomListener(window, 'load', initialize);
