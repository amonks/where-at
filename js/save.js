var save = new SaveData;


// constructor for save state

function SaveData() {
    this.drawLog = [];
};
// SaveData.prototype.saveToShortUrl = function() {
//     console.log(this.base64());
//     longUrl = window.location.href.split('?')[0] + "?" + this.base64()
//     jQuery.urlShortener({
//         longUrl: longUrl,
//         success: function(shortUrl) {
//             alert(shortUrl);
//             console.log(shortUrl);
//             window.location = shortUrl;
//         },
//         error: function(err) {
//             alert(JSON.stringify(err));
//         }
//     });
// };
SaveData.prototype.save = function() {
    console.log(this.base64());
    var dataOutput = this.base64()
    $.post(
        "/map/new",
        {data: dataOutput},
        function(data,status){
            console.log(data);
            console.log(status);
            window.location = window.location.href.split('/')[0] + "/map/" + data;
            alert(window.location.href.split('/')[0] + "/map/" + data);
        })
};
SaveData.prototype.base64 = function() {
    return LZString.compressToBase64(this.metadata() + this.drawLog.join(':'));
};
SaveData.prototype.metadata = function() {
    var output = "";
    output += "z" + map.zoom + ":";
    output += "c" + map.getCenter().toString() + ":";
    output = output.replace(/\(/g, '').replace(/\)/g, '').replace(' ', '');
    return output;
};
SaveData.prototype.add = function(input) {
    this.drawLog.push(input);
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
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(saveControlDiv);
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
    controlText.innerHTML = '<b>Save</b>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function() {
        save.save();
    });

}
