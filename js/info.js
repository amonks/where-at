

function infoControl() {


    // create Info control div

    // Create the DIV to hold the control and
    // call the InfoControl() constructor passing
    // in this DIV.
    var infoControlDiv = document.createElement('div');
    var infoControl = new InfoControl(infoControlDiv, map);

    infoControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(infoControlDiv);


}





/**
 * The InfoControl adds a control to the map that Infos the current Info state
 */

function InfoControl(controlDiv, map) {

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
    controlUI.title = 'Click for Information and Help';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>Info</b>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function() {
        vex.dialog.alert($("#readme").html())
    });

}