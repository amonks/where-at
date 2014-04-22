var map;

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


    draw();


    // geo();


    search();


    saveControl();


    var options = {
        map: map,
        position: new google.maps.LatLng(41.880454799999995, -87.6251393),
    };
    map.setCenter(options.position);


    load();


}

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


function draw() {
    drawingManager.setMap(map);

    //After creating 'drawingManager' object in if block 
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        output = "";
        switch (event.type) {
            case google.maps.drawing.OverlayType.MARKER:
                output = output + "m" + (event.overlay.getPosition() + "");
                constructMarker(output);
                break;
            // case google.maps.drawing.OverlayType.RECTANGLE:
            //     output = output + "r" + (event.overlay.getBounds() + "");
            //     break;
            // case google.maps.drawing.OverlayType.CIRCLE:
            //     output = output + "c" + (event.overlay.getCenter() + "")
            //     output = output + (event.overlay.getRadius() + "");
            //     break;
            default:
                path = event.overlay.getPath();
                output = output + "p";
                for (var i = 0; i < path.length; i++) {
                    output = output + (path.getAt(i) + ';')
                };
                constructPolyline(output);
                break;
        };
        output = "|" + output.replace(/\(/g, '').replace(/\)/g, '').replace(' ', '');
        console.log(output);
        save.add(output);
    });
}

/*!
* jQuery URL Shortener 1.0
* https://github.com/hayageek/jQuery-URL-shortener
*
* Date: 24-Oct-2013
*/
(function(c){var a=false;var b=false;c.getScript("https://apis.google.com/js/client.js",function(){(function d(){if(gapi.client){a=true;gapi.client.setApiKey(c.urlShortener.settings.apiKey);gapi.client.load("urlshortener",c.urlShortener.settings.version,function(){b=true})}else{window.setTimeout(d,10)}})()});c.urlShortener=function(d){var e={};var f={};c.extend(e,c.urlShortener.settings,d);(function h(){if(a&&b){if(e.longUrl!=undefined){i(e)}else{if(e.shortUrl!=undefined){g(e)}}}else{window.setTimeout(h,10)}})();function i(j){var l={longUrl:j.longUrl};var k=gapi.client.urlshortener.url.insert({resource:l});k.execute(function(m){if(m.id!=null){if(j.success){j.success.call(this,m.id)}}else{if(j.error){j.error.call(this,m.error)}}})}function g(j){var l={shortUrl:j.shortUrl,projection:j.projection};var k=gapi.client.urlshortener.url.get(l);k.execute(function(m){if(m.longUrl!=null){if(j.success){if(j.projection==undefined){j.success.call(this,m.longUrl)}else{j.success.call(this,m)}}}else{if(j.error){j.error.call(this,m.error)}}})}};c.urlShortener.settings={apiKey:"AIzaSyDIPa8VjR1Iybo-vl60dd3CpSmw2zyMfvA",version:"v1"}}(jQuery));



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
    var pointsLog = logstring.replace('p', '').replace(/\(/g, '').replace(/\)/g, '').split(';');

    var latlngs = new google.maps.MVCArray();


    for (var i = pointsLog.length - 2; i >= 0; i--) {
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
    var currentPoint = logstring.replace('m', '').replace(/\(/g, '').replace(/\)/g, '').split(', ')

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
    var currentZoom = logstring.replace('z', '').replace(/\(/g, '').replace(/\)/g, '');
    map.setZoom(parseInt(currentZoom));
}

function constructCenter(logstring) {
    var currentCenter = logstring.replace('c', '').replace(/\(/g, '').replace(/\)/g, '');
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
            console.log(overlayArray[i]);
            if (overlayArray[i].indexOf("z") !== -1) {
                constructZoom(overlayArray[i])
            }
            if (overlayArray[i].indexOf("c") !== -1) {
                constructCenter(overlayArray[i])
            }
            if (overlayArray[i].indexOf("p") !== -1) {
                constructPolyline(overlayArray[i]);
                save.add(overlayArray[i]);
            }
            if (overlayArray[i].indexOf("m") !== -1) {
                constructMarker(overlayArray[i]);
                save.add(overlayArray[i]);
            }
        };
    };
}




/**
 * The SaveControl adds a control to the map that saves the current save state
 */

function SaveControl(controlDiv, map) {

    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map
    controlDiv.style.padding = '5px';

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '2px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to set the map to Home';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>Share</b>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function() {
        save.save();
    });

}

var save = new SaveData;


// constructor for save state

function SaveData() {
    this.drawLog = "";
};
SaveData.prototype.save = function() {
    console.log(this.base64());
    longUrl = window.location.href.split('?')[0] + "?" + this.base64()
    jQuery.urlShortener({
        longUrl: longUrl,
        success: function(shortUrl) {
            alert(shortUrl);
            console.log(shortUrl);
            window.location = shortUrl;
        },
        error: function(err) {
            alert(JSON.stringify(err));
        }
    });
};
SaveData.prototype.base64 = function() {
    return btoa(this.metadata() + this.drawLog);
};
SaveData.prototype.metadata = function() {
    var output = "";
    output += "z" + map.zoom + "|";
    output += "c" + map.getCenter().toString();
    return output;
};
SaveData.prototype.add = function(input) {
    this.drawLog += input;
};


google.maps.event.addDomListener(window, 'load', initialize);



function saveControl() {


    // create save control div

    // Create the DIV to hold the control and
    // call the SaveControl() constructor passing
    // in this DIV.
    var saveControlDiv = document.createElement('div');
    var saveControl = new SaveControl(saveControlDiv, map);

    saveControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(saveControlDiv);


}


function search() {

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

    var options = {
        map: map,
        position: new google.maps.LatLng(41.880454799999995, -87.6251393),
    };
}