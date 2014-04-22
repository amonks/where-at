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
