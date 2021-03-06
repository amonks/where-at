


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
    logstring = logstring.replace(/^p/g, '');

    console.log(logstring);

    var decodedPath = google.maps.geometry.encoding.decodePath(logstring);

    console.log(decodedPath.toString());

    var line = new google.maps.Polyline({
        path: decodedPath,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map: map
    });
}

function constructMarker(logstring) {
    var currentPoint = logstring.replace('m', '').replace(/\(/g, '').replace(/\)/g, '').split(',')

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


function constructType(logstring) {
    switch (logstring) {
        case "th":
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            break;
        case "tr":
            map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            break;
    }
}


function constructZoom(logstring) {
    var currentZoom = logstring.replace('z', '').replace(/\(/g, '').replace(/\)/g, '');
    map.setZoom(parseInt(currentZoom));
}

function constructCenter(logstring) {
    var currentCenter = logstring.replace('c', '').replace(/\(/g, '').replace(/\)/g, '');
    var currentCenterPoint = currentCenter.split(',');
    map.setCenter(new google.maps.LatLng(parseFloat(currentCenterPoint[0]), parseFloat(currentCenterPoint[1])))
}


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
    return LZString.decompressFromBase64(queryString);
}


// function to get the current query string (anything in the location bar after a '?'), and de-base64 it.

function getDataString() {
    var theData = $('#data').text();
    if (theData.length == 0) {
        return null;
    };
    return LZString.decompressFromBase64(theData);
}


function getOverlayArray() {
    return getDataString().split(':');
}

function load() {
    if (getDataString() !== null) {
        var overlayArray = getOverlayArray();
        console.log(overlayArray);
        for (var i = overlayArray.length - 1; i >= 0; i--) {
            console.log(overlayArray[i]);
            if (overlayArray[i].indexOf("t") == 0) {
                constructType(overlayArray[i])
            }
            if (overlayArray[i].indexOf("z") == 0) {
                constructZoom(overlayArray[i])
            }
            if (overlayArray[i].indexOf("c") == 0) {
                constructCenter(overlayArray[i])
            }
            if (overlayArray[i].indexOf("p") == 0) {
                constructPolyline(overlayArray[i]);
                save.add(overlayArray[i]);
            }
            if (overlayArray[i].indexOf("m") == 0) {
                constructMarker(overlayArray[i]);
                save.add(overlayArray[i]);
            }
        };
    };
}

