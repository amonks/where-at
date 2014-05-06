

function clearControl() {


    // create clear control div

    // Create the DIV to hold the control and
    // call the ClearControl() constructor passing
    // in this DIV.
    var clearControlDiv = document.createElement('div');
    var clearControl = new ClearControl(clearControlDiv, map);

    clearControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(clearControlDiv);


}





/**
 * The ClearControl adds a control to the map that clears the current clear state
 */

function ClearControl(controlDiv, map) {

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
    controlUI.title = 'Click to start a new map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>Clear</b>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function() {
        window.location.href = '/';
    });

}