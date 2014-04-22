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
    output += "zoom(" + map.zoom + ")|";
    output += "center" + map.getCenter().toString() + "|";
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
