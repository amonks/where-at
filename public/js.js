var map;


function initialize() {
    vex.defaultOptions.className = 'vex-theme-plain';

    vex.dialog.alert($("#readme").html())

    var mapOptions = {
        disableDefaultUI: true,
        panControl: false,
        zoomControl: true,
        zoom: 10,
        mapTypeControl: true,
        mapTypeControlOptions: {
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
var drawingManager = new google.maps.drawing.DrawingManager({
    // drawingMode: null,
    drawingMode: google.maps.drawing.OverlayType.MARKER,
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
                output = "m" + (event.overlay.getPosition() + "");
                constructMarker(output);
                break;
                // case google.maps.drawing.OverlayType.RECTANGLE:
                //     output = "r" + (event.overlay.getBounds() + "");
                //     break;
                // case google.maps.drawing.OverlayType.CIRCLE:
                //     output = "c" + (event.overlay.getCenter() + "")
                //     output = output + (event.overlay.getRadius() + "");
                //     break;
            default:
                path = event.overlay.getPath();
                var encodeString = google.maps.geometry.encoding.encodePath(path);
                output = "p" + encodeString;
                break;
        };
        output = output.replace(/\(/g, '').replace(/\)/g, '').replace(' ', '');
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


// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.3.3
var LZString = {
  
  
  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  _f : String.fromCharCode,
  
  compressToBase64 : function (input) {
    if (input == null) return "";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    
    input = LZString.compress(input);
    
    while (i < input.length*2) {
      
      if (i%2==0) {
        chr1 = input.charCodeAt(i/2) >> 8;
        chr2 = input.charCodeAt(i/2) & 255;
        if (i/2+1 < input.length) 
          chr3 = input.charCodeAt(i/2+1) >> 8;
        else 
          chr3 = NaN;
      } else {
        chr1 = input.charCodeAt((i-1)/2) & 255;
        if ((i+1)/2 < input.length) {
          chr2 = input.charCodeAt((i+1)/2) >> 8;
          chr3 = input.charCodeAt((i+1)/2) & 255;
        } else 
          chr2=chr3=NaN;
      }
      i+=3;
      
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      
      output = output +
        LZString._keyStr.charAt(enc1) + LZString._keyStr.charAt(enc2) +
          LZString._keyStr.charAt(enc3) + LZString._keyStr.charAt(enc4);
      
    }
    
    return output;
  },
  
  decompressFromBase64 : function (input) {
    if (input == null) return "";
    var output = "",
        ol = 0, 
        output_,
        chr1, chr2, chr3,
        enc1, enc2, enc3, enc4,
        i = 0, f=LZString._f;
    
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
    while (i < input.length) {
      
      enc1 = LZString._keyStr.indexOf(input.charAt(i++));
      enc2 = LZString._keyStr.indexOf(input.charAt(i++));
      enc3 = LZString._keyStr.indexOf(input.charAt(i++));
      enc4 = LZString._keyStr.indexOf(input.charAt(i++));
      
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      
      if (ol%2==0) {
        output_ = chr1 << 8;
        
        if (enc3 != 64) {
          output += f(output_ | chr2);
        }
        if (enc4 != 64) {
          output_ = chr3 << 8;
        }
      } else {
        output = output + f(output_ | chr1);
        
        if (enc3 != 64) {
          output_ = chr2 << 8;
        }
        if (enc4 != 64) {
          output += f(output_ | chr3);
        }
      }
      ol+=3;
    }
    
    return LZString.decompress(output);
    
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    var output = "",
        i,c,
        current,
        status = 0,
        f = LZString._f;
    
    input = LZString.compress(input);
    
    for (i=0 ; i<input.length ; i++) {
      c = input.charCodeAt(i);
      switch (status++) {
        case 0:
          output += f((c >> 1)+32);
          current = (c & 1) << 14;
          break;
        case 1:
          output += f((current + (c >> 2))+32);
          current = (c & 3) << 13;
          break;
        case 2:
          output += f((current + (c >> 3))+32);
          current = (c & 7) << 12;
          break;
        case 3:
          output += f((current + (c >> 4))+32);
          current = (c & 15) << 11;
          break;
        case 4:
          output += f((current + (c >> 5))+32);
          current = (c & 31) << 10;
          break;
        case 5:
          output += f((current + (c >> 6))+32);
          current = (c & 63) << 9;
          break;
        case 6:
          output += f((current + (c >> 7))+32);
          current = (c & 127) << 8;
          break;
        case 7:
          output += f((current + (c >> 8))+32);
          current = (c & 255) << 7;
          break;
        case 8:
          output += f((current + (c >> 9))+32);
          current = (c & 511) << 6;
          break;
        case 9:
          output += f((current + (c >> 10))+32);
          current = (c & 1023) << 5;
          break;
        case 10:
          output += f((current + (c >> 11))+32);
          current = (c & 2047) << 4;
          break;
        case 11:
          output += f((current + (c >> 12))+32);
          current = (c & 4095) << 3;
          break;
        case 12:
          output += f((current + (c >> 13))+32);
          current = (c & 8191) << 2;
          break;
        case 13:
          output += f((current + (c >> 14))+32);
          current = (c & 16383) << 1;
          break;
        case 14:
          output += f((current + (c >> 15))+32, (c & 32767)+32);
          status = 0;
          break;
      }
    }
    
    return output + f(current + 32);
  },
  

  decompressFromUTF16 : function (input) {
    if (input == null) return "";
    var output = "",
        current,c,
        status=0,
        i = 0,
        f = LZString._f;
    
    while (i < input.length) {
      c = input.charCodeAt(i) - 32;
      
      switch (status++) {
        case 0:
          current = c << 1;
          break;
        case 1:
          output += f(current | (c >> 14));
          current = (c&16383) << 2;
          break;
        case 2:
          output += f(current | (c >> 13));
          current = (c&8191) << 3;
          break;
        case 3:
          output += f(current | (c >> 12));
          current = (c&4095) << 4;
          break;
        case 4:
          output += f(current | (c >> 11));
          current = (c&2047) << 5;
          break;
        case 5:
          output += f(current | (c >> 10));
          current = (c&1023) << 6;
          break;
        case 6:
          output += f(current | (c >> 9));
          current = (c&511) << 7;
          break;
        case 7:
          output += f(current | (c >> 8));
          current = (c&255) << 8;
          break;
        case 8:
          output += f(current | (c >> 7));
          current = (c&127) << 9;
          break;
        case 9:
          output += f(current | (c >> 6));
          current = (c&63) << 10;
          break;
        case 10:
          output += f(current | (c >> 5));
          current = (c&31) << 11;
          break;
        case 11:
          output += f(current | (c >> 4));
          current = (c&15) << 12;
          break;
        case 12:
          output += f(current | (c >> 3));
          current = (c&7) << 13;
          break;
        case 13:
          output += f(current | (c >> 2));
          current = (c&3) << 14;
          break;
        case 14:
          output += f(current | (c >> 1));
          current = (c&1) << 15;
          break;
        case 15:
          output += f(current | c);
          status=0;
          break;
      }
      
      
      i++;
    }
    
    return LZString.decompress(output);
    //return output;
    
  },


  
  compress: function (uncompressed) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data_string="", 
        context_data_val=0, 
        context_data_position=0,
        ii,
        f=LZString._f;
    
    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }
      
      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == 15) {
                context_data_position = 0;
                context_data_string += f(context_data_val);
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
          
          
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }
    
    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == 15) {
              context_data_position = 0;
              context_data_string += f(context_data_val);
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == 15) {
            context_data_position = 0;
            context_data_string += f(context_data_val);
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
        
        
      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }
    
    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == 15) {
        context_data_position = 0;
        context_data_string += f(context_data_val);
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }
    
    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == 15) {
        context_data_string += f(context_data_val);
        break;
      }
      else context_data_position++;
    }
    return context_data_string;
  },
  
  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = "",
        i,
        w,
        bits, resb, maxpower, power,
        c,
        f = LZString._f,
        data = {string:compressed, val:compressed.charCodeAt(0), position:32768, index:1};
    
    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }
    
    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = 32768;
        data.val = data.string.charCodeAt(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }
    
    switch (next = bits) {
      case 0: 
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = 32768;
              data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1: 
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = 32768;
              data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2: 
        return "";
    }
    dictionary[3] = c;
    w = result = c;
    while (true) {
      if (data.index > data.string.length) {
        return "";
      }
      
      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = 32768;
          data.val = data.string.charCodeAt(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0: 
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = 32768;
              data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1: 
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = 32768;
              data.val = data.string.charCodeAt(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2: 
          return result;
      }
      
      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
      
      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result += entry;
      
      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;
      
      w = entry;
      
      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
      
    }
  }
};

if( typeof module !== 'undefined' && module != null ) {
  module.exports = LZString
}
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
SaveData.prototype.saveAs = function() {
    console.log(this.base64());
    var dataOutput = this.base64()
    $.post(
        "/",
        {data: dataOutput},
        function(data,status){
            console.log(data);
            console.log(status);
            window.history.pushState('Object', 'Title', "/map/" + data);
            vex.dialog.alert("<p>Saved Successfully!</p><p>This new map's URL is <a href='/map/" + data + "'>/map/" + data + "/</a></p>");
        })
};
SaveData.prototype.save = function() {
    console.log(this.base64());
    var dataOutput = this.base64()
    $.post(
        window.location.href,
        {data: dataOutput},
        function(data,status){
            console.log(data);
            console.log(status);
            window.history.pushState('Object', 'Title', "/map/" + data);
            vex.dialog.alert("<p>Saved Successfully!</p><p>This map's URL is <a href='/map/" + data + "'>/map/" + data + "/</a></p>");
        })
};
SaveData.prototype.base64 = function() {
    return LZString.compressToBase64(this.metadata() + this.drawLog.join(':'));
};
SaveData.prototype.metadata = function() {
    var output = "";
    switch (map.getMapTypeId()) {
        case 'roadmap':
            output += "tr:";
            break;
        case 'hybrid':
            output += "th:";
            break;
    };
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

function saveAsControl() {
    // create save control div

    // Create the DIV to hold the control and
    // call the SaveControl() constructor passing
    // in this DIV.
    var saveAsControlDiv = document.createElement('div');
    var saveAsControl = new SaveAsControl(saveAsControlDiv, map);

    saveAsControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(saveAsControlDiv);
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
    controlUI.title = 'Click to save this map';
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
/**
 * The SaveControl adds a control to the map that saves the current save state
 */

function SaveAsControl(controlDiv, map) {

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
    controlUI.title = 'Click to save a new copy of this map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>Save A Copy</b>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function() {
        save.saveAs();
    });

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
/*! vex.js, vex.dialog.js 2.0.1 */
(function(){var a;a=function(a){var b,c;return b=!1,a(function(){var d;return d=(document.body||document.documentElement).style,b=void 0!==d.animation||void 0!==d.WebkitAnimation||void 0!==d.MozAnimation||void 0!==d.MsAnimation||void 0!==d.OAnimation,a(window).bind("keyup.vex",function(a){return 27===a.keyCode?c.closeByEscape():void 0})}),c={globalID:1,animationEndEvent:"animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend",baseClassNames:{vex:"vex",content:"vex-content",overlay:"vex-overlay",close:"vex-close",closing:"vex-closing",open:"vex-open"},defaultOptions:{content:"",showCloseButton:!0,escapeButtonCloses:!0,overlayClosesOnClick:!0,appendLocation:"body",className:"",css:{},overlayClassName:"",overlayCSS:{},contentClassName:"",contentCSS:{},closeClassName:"",closeCSS:{}},open:function(b){return b=a.extend({},c.defaultOptions,b),b.id=c.globalID,c.globalID+=1,b.$vex=a("<div>").addClass(c.baseClassNames.vex).addClass(b.className).css(b.css).data({vex:b}),b.$vexOverlay=a("<div>").addClass(c.baseClassNames.overlay).addClass(b.overlayClassName).css(b.overlayCSS).data({vex:b}),b.overlayClosesOnClick&&b.$vexOverlay.bind("click.vex",function(b){return b.target===this?c.close(a(this).data().vex.id):void 0}),b.$vex.append(b.$vexOverlay),b.$vexContent=a("<div>").addClass(c.baseClassNames.content).addClass(b.contentClassName).css(b.contentCSS).append(b.content).data({vex:b}),b.$vex.append(b.$vexContent),b.showCloseButton&&(b.$closeButton=a("<div>").addClass(c.baseClassNames.close).addClass(b.closeClassName).css(b.closeCSS).data({vex:b}).bind("click.vex",function(){return c.close(a(this).data().vex.id)}),b.$vexContent.append(b.$closeButton)),a(b.appendLocation).append(b.$vex),c.setupBodyClassName(b.$vex),b.afterOpen&&b.afterOpen(b.$vexContent,b),setTimeout(function(){return b.$vexContent.trigger("vexOpen",b)},0),b.$vexContent},getAllVexes:function(){return a("."+c.baseClassNames.vex+':not(".'+c.baseClassNames.closing+'") .'+c.baseClassNames.content)},getVexByID:function(b){return c.getAllVexes().filter(function(){return a(this).data().vex.id===b})},close:function(a){var b;if(!a){if(b=c.getAllVexes().last(),!b.length)return!1;a=b.data().vex.id}return c.closeByID(a)},closeAll:function(){var b;return b=c.getAllVexes().map(function(){return a(this).data().vex.id}).toArray(),(null!=b?b.length:void 0)?(a.each(b.reverse(),function(a,b){return c.closeByID(b)}),!0):!1},closeByID:function(d){var e,f,g,h,i;return f=c.getVexByID(d),f.length?(e=f.data().vex.$vex,i=a.extend({},f.data().vex),g=function(){return i.beforeClose?i.beforeClose(f,i):void 0},h=function(){return f.trigger("vexClose",i),e.remove(),i.afterClose?i.afterClose(f,i):void 0},b?(g(),e.unbind(c.animationEndEvent).bind(c.animationEndEvent,function(){return h()}).addClass(c.baseClassNames.closing)):(g(),h()),!0):void 0},closeByEscape:function(){var b,d,e;return e=c.getAllVexes().map(function(){return a(this).data().vex.id}).toArray(),(null!=e?e.length:void 0)?(d=Math.max.apply(Math,e),b=c.getVexByID(d),b.data().vex.escapeButtonCloses!==!0?!1:c.closeByID(d)):!1},setupBodyClassName:function(b){return b.bind("vexOpen.vex",function(){return a("body").addClass(c.baseClassNames.open)}).bind("vexClose.vex",function(){return c.getAllVexes().length?void 0:a("body").removeClass(c.baseClassNames.open)})},hideLoading:function(){return a(".vex-loading-spinner").remove()},showLoading:function(){return c.hideLoading(),a("body").append('<div class="vex-loading-spinner '+c.defaultOptions.className+'"></div>')}}},"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):window.vex=a(jQuery)}).call(this),function(){var a;a=function(a,b){var c,d;return null==b?a.error("Vex is required to use vex.dialog"):(c=function(b){var c;return c={},a.each(b.serializeArray(),function(){return c[this.name]?(c[this.name].push||(c[this.name]=[c[this.name]]),c[this.name].push(this.value||"")):c[this.name]=this.value||""}),c},d={},d.buttons={YES:{text:"OK",type:"submit",className:"vex-dialog-button-primary"},NO:{text:"Cancel",type:"button",className:"vex-dialog-button-secondary",click:function(a){return a.data().vex.value=!1,b.close(a.data().vex.id)}}},d.defaultOptions={callback:function(){},afterOpen:function(){},message:"Message",input:'<input name="vex" type="hidden" value="_vex-empty-value" />',value:!1,buttons:[d.buttons.YES,d.buttons.NO],showCloseButton:!1,onSubmit:function(e){var f,g;return f=a(this),g=f.parent(),e.preventDefault(),e.stopPropagation(),g.data().vex.value=d.getFormValueOnSubmit(c(f)),b.close(g.data().vex.id)},focusFirstInput:!0},d.defaultAlertOptions={message:"Alert",buttons:[d.buttons.YES]},d.defaultConfirmOptions={message:"Confirm"},d.open=function(c){var e;return c=a.extend({},b.defaultOptions,d.defaultOptions,c),c.content=d.buildDialogForm(c),c.beforeClose=function(a){return c.callback(a.data().vex.value)},e=b.open(c),c.focusFirstInput&&e.find('input[type="submit"], textarea, input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], input[type="url"], input[type="week"]').first().focus(),e},d.alert=function(b){return"string"==typeof b&&(b={message:b}),b=a.extend({},d.defaultAlertOptions,b),d.open(b)},d.confirm=function(b){return"string"==typeof b?a.error("dialog.confirm(options) requires options.callback."):(b=a.extend({},d.defaultConfirmOptions,b),d.open(b))},d.prompt=function(b){var c;return"string"==typeof b?a.error("dialog.prompt(options) requires options.callback."):(c={message:'<label for="vex">'+(b.label||"Prompt:")+"</label>",input:'<input name="vex" type="text" class="vex-dialog-prompt-input" placeholder="'+(b.placeholder||"")+'"  value="'+(b.value||"")+'" />'},b=a.extend({},c,b),d.open(b))},d.buildDialogForm=function(b){var c,e,f;return c=a('<form class="vex-dialog-form" />'),f=a('<div class="vex-dialog-message" />'),e=a('<div class="vex-dialog-input" />'),c.append(f.append(b.message)).append(e.append(b.input)).append(d.buttonsToDOM(b.buttons)).bind("submit.vex",b.onSubmit),c},d.getFormValueOnSubmit=function(a){return a.vex||""===a.vex?"_vex-empty-value"===a.vex?!0:a.vex:a},d.buttonsToDOM=function(c){var d;return d=a('<div class="vex-dialog-buttons" />'),a.each(c,function(e,f){return d.append(a('<input type="'+f.type+'" />').val(f.text).addClass(f.className+" vex-dialog-button "+(0===e?"vex-first ":"")+(e===c.length-1?"vex-last ":"")).bind("click.vex",function(c){return f.click?f.click(a(this).parents("."+b.baseClassNames.content),c):void 0}))}),d},d)},"function"==typeof define&&define.amd?define(["jquery","vex"],a):"object"==typeof exports?module.exports=a(require("jquery"),require("vex")):window.vex.dialog=a(window.jQuery,window.vex)}.call(this);