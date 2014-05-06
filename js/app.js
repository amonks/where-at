var map;


function initialize() {
    vex.defaultOptions.className = 'vex-theme-plain';

    if (window.location.href === "http://www.where.kim/") {
        vex.dialog.alert($("#info").html())
    }

    var mapOptions = {
        disableDefaultUI: true,
        panControl: false,
        zoomControl: true,
        zoom: 10,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_RIGHT,
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP, 
                google.maps.MapTypeId.HYBRID, 
            ],
        },
    };
    

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


    draw();


    // geo();


    search();


    saveControl();
    saveAsControl();
    clearControl();


    var options = {
        map: map,
        position: new google.maps.LatLng(41.880454799999995, -87.6251393),
    };
    map.setCenter(options.position);

    load();


}
