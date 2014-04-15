
// namespace
var mapDraw = {}


var poly;
var map;

function initialize() {
    var mapOptions = {
        disableDefaultUI: true,
        panControl: true,
        zoomControl: false,
        zoom: 15,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Create the DIV to hold the control and
  // call the DrawControl() constructor passing
  // in this DIV.
  var drawControlDiv = document.createElement('div');
  var drawControl = new DrawControl(drawControlDiv, map);

  drawControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(drawControlDiv);

    newPolyLine({
        strokeColor: randomColor(),
        strokeOpacity: 1.0,
        strokeWeight: 3
    });

    // Add a listener for the click event
    // I ought to change this to allow dragging
    google.maps.event.addListener(map, 'click', addLatLng);

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
}


function DrawControl(controlDiv, map) {

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
  controlUI.title = 'Click to start a new path [dumb ux right here]';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>New Path (lol)</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to
  // Chicago
  google.maps.event.addDomListener(controlUI, 'click', function() {
    newPolyLine({
        strokeColor: randomColor(),
        strokeOpacity: 1.0,
        strokeWeight: 3
    });
  });

}

// function to initialize a new path
function newPolyLine(polyOptions) {
    poly = new google.maps.Polyline(polyOptions);
    poly.setMap(map);
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


/**
 * Handles click events on a map, and adds a new point to the Polyline.
 * @param {google.maps.MouseEvent} event
 */

function addLatLng(event) {

    var path = poly.getPath();

    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    path.push(event.latLng);

    // Add a new marker at the new plotted point on the polyline.
    // var marker = new google.maps.Marker({
    //   position: event.latLng,
    //   title: '#' + path.getLength(),
    //   map: map
    // });
}


// function to return a random hex color
// classic elegant solution from http://paulirish.com/2009/random-hex-color-code-snippets/
function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

google.maps.event.addDomListener(window, 'load', initialize);
