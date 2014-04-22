/**
 * @name SnapShotControl
 * @version 2.0
 * @author Masashi Katsumata
 * @fileoverview
 * <p>This library makes it easy to generate an image "snapshot" of your
 * interactive map, using the Google Static Maps API.</p>
 * <p>The default behavior adds a control to the map,
 * and then shows a popup with the snapshot when the control is clicked.
 * However, the control can be hidden and the generated
 * snapshot URLs can be programmatically retrieved, so the library may be used
 * in a more flexible manner.
 * </p>
 * <p>This control can detect the standard overlays (Marker, Polygon, Polyline,
 * Circle, Rectangle and Result of directions) and render them in the snapshot,
 * and in the case of a poly with many points,
 * it can pass in the points as an encoded string, resulting in a shorter URL.
 * Note that this control can't be capable of Layers (FusionLayer, KML layer, so on.)
 * </p>
 * <p>Also, the control can reproduce type of map even if it uses Styled Map type.
 * Note that  when you use Styled Map type in your interactive map,
 * a generated url is apt to be long over the limit of acceptable length of Google Server.
 * </p>
 * * <p>Be careful, you want to use this control in case directions and a styled map type,
 * you have to create a instance of this control before use them.
 * (cf. {@link "./examples.html"})
 * </p>
 * <p>Various options can be sent into the constructor to change the default
 * rendering of the snapshot.
 * </p>
 */
/**
 * @name SnapShotControlOptions
 * @class This class represents optional arguments to {@link SnapShotControl}.
 * @property {String} [buttonLabelHtml = "Say cheese!"] Specify label HTML of
 *           control button.
 * @property {String} [popupLabelHtml = ""] Specify label HTML of popup.
 * @property {String} [mapType = ""] Specify maptype for snapshot. The options
 *           are "roadmap", "satellite", "hybrid", "terrain". If it is not set,
 *           then the control detects the type of the map.
 * @property {Boolean} [hidden = false] Specify visibility when control is added
 *           to the map. If it is set to true, the button is hidden.
 * @property {String} [language = ""] Specify language for snapshot's
 *           copyrights. If it is not set, then this library detects the
 *           language of the map.
 * @property {String} [format = "png"] Specify image format for snapshot. You
 *           can choice one from "gif", "jpg", "jpg-baseline", "png8", "png32".
 *           ignored, when the {@link style} property is not set to "roadmap".
 * @property {Boolean} [usePolylineEncode = true] Specify whether to use encoded
 *           polys in the snapshot. Useful if you're sending in a big poly, and
 *           want to stay within URL limits.
 * @property {Boolean} [adjustCenter = false] Static Maps API v2 offers implicit
 *           positioning function. If it is set to true, the control uses that.
 *           (cf. <a
 *           href="http://code.google.com/apis/maps/documentation/staticmaps/#ImplicitPositioning">ImplicitPositioning</a>)
 * @property {Boolean} [adjustZoom = false] Static Maps API v2 offers implicit
 *           positioning function. If it is set to true, the control uses that.
 *           (cf. <a
 *           href="http://code.google.com/apis/maps/documentation/staticmaps/#ImplicitPositioning">ImplicitPositioning</a>)
 * @property {LatLng} [position = null] Specify a geological location which is
 *           passed to static maps. If it is not set, this control will adopt a
 *           center position of the interactive map. Note that this property is
 *           only for showPopup method.
 */

/*global self */

function SnapShotControl(opt_opts) {
    var me = this;
    this.hProcDic_ = {};
    this.overlays_ = new google.maps.MVCArray();

    /**
     * @private
     * @desc Create a button by div-element.
     */
    this.createBtn_ = function(buttonLabel, callback) {
        /*
         * create an element of button
         */
        var btnContainer = me.createDiv_({
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "black",
            color: "black",
            backgroundColor: "white",
            cursor: "pointer",
            whiteSpace: "nowrap",
            margin: "5px",
            fontSize: "inherit",
            lineHeight: "inherit"
        });
        if (!buttonLabel.match(/</)) {
            btnContainer.style.height = "1em";
            btnContainer.style.fontSize = "12px";
            btnContainer.style.fontFace = "Arial,sans-serif";
            btnContainer.style.fontSize = "12px";
        }
        // calculating of the button label
        var btnSize = me.getHtmlSize(buttonLabel);
        if (me._is_gecko && buttonLabel.match(/</)) {
            btnSize.width += 3;
            btnSize.height += 3;
        }
        btnContainer.style.width = btnSize.width + "px";
        btnContainer.style.height = btnSize.height + "px";
        var htmlContainer = me.createDiv_({
            textAlign: "center",
            borderColor: "#D0D0D0 #707070 #707070 #D0D0D0",
            borderWidth: "1px",
            borderStyle: "solid",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            cursor: "pointer",
            fontSize: "inherit",
            lineHeight: "inherit",
            position: "static",
            height: (btnSize.height - 2) + "px"
        });
        if (!buttonLabel.match(/</)) {
            htmlContainer.style.fontFace = "Arial,sans-serif";
            htmlContainer.style.fontSize = "12px";
        }
        htmlContainer.innerHTML = buttonLabel;
        btnContainer.appendChild(htmlContainer);
        /*
         * Set callback
         */
        if (!me.isNull(callback)) {
            google.maps.event.addDomListener(htmlContainer, "click", callback);
        }
        return btnContainer;
    };
    /**
     * @private
     * @desc apply css-styles to element
     */
    this.setStyles_ = function(element, styles) {
        var s;
        if (!me.isNull(styles)) {
            for (s in styles) {
                if (s in element.style) {
                    element.style[s] = styles[s];
                }
            }
        }
        return element;
    };
    /**
     * @private
     * @desc detect null,null string and undefined
     * @param value
     * @return true : value is nothing false : value is not nothing
     */
    this.isNull = function(value) {
        if (!value && value !== 0 || value === undefined || value === "" || value === null || typeof value === "undefined") {
            return true;
        }
        return false;
    };
    /**
     * @desc Determine browser agent
     * @private
     */
    this.checkBrowserAgent = function() {
        var agt = navigator.userAgent.toLowerCase();
        me._is_ie = ((agt.indexOf("msie") !== -1) && (agt.indexOf("opera") === -1));
        me._is_ie7 = (agt.indexOf("msie 7") !== -1);
        me._is_ie8 = (me._is_ie === true && me._is_ie7 === false);
        me._is_gecko = (agt.indexOf("gecko") !== -1);
        me._is_opera = (agt.indexOf("opera") !== -1);
        me._is_chrome = (agt.indexOf("chrome") !== -1);
    };
    /**
     * @private
     * @desc create div element
     */
    this.createDiv_ = function(styles) {
        if (me.isNull(styles)) {
            styles = {};
        }
        var defStyles = {
            position: "absolute",
            fontSize: 0,
            lineHeight: 0,
            overflow: "hidden"
        };
        var ds;
        for (ds in defStyles) {
            if (!(ds in styles) && ds in defStyles) {
                styles[ds] = defStyles[ds];
            }
        }
        var divEle = document.createElement("div");
        divEle = me.setStyles_(divEle, styles);
        return divEle;
    };
    /**
     * @private
     */
    this.getHtmlSize = function(html) {
        var container = me.map_.getDiv();
        var isNeedBlock = false;
        if (!html.match(/</)) {
            html = "<span>" + html + "</span>";
        }
        var textContainer_ = document.createElement("div");
        container.appendChild(textContainer_);
        var onlineHTMLsize_ = function(text) {
            var dummyTextNode = document.createElement("span");
            textContainer_.appendChild(dummyTextNode);
            dummyTextNode.innerHTML = text;
            var children = dummyTextNode.getElementsByTagName("*");
            var i;
            for (i = 0; i < children.length; i++) {
                if (children[i].nodeType === 1) {
                    children[i].style.margin = 0;
                }
            }
            dummyTextNode.style.whiteSpace = "nowrap";
            var size = {};
            size.width = dummyTextNode.offsetWidth;
            size.height = dummyTextNode.offsetHeight;
            return size;
        };
        var ret;
        var lines = html.split(/\n/i);
        var totalSize = new google.maps.Size(1, 1);
        // "1" is margin
        var i;
        for (i = 0; i < lines.length; i++) {
            ret = onlineHTMLsize_(lines[i]);
            if (ret.width > totalSize.width) {
                totalSize.width = ret.width;
            }
            totalSize.height += ret.height;
        }
        container.removeChild(textContainer_);
        return totalSize;
    };

    /**
     * @private
     */
    this.setHookProcForMarker_ = function() {
        var mapsAPIclassName = "Marker";
        me.hProcDic_[mapsAPIclassName] = google.maps[mapsAPIclassName];
        if (mapsAPIclassName in google.maps) {
            google.maps[mapsAPIclassName] = function(opts) {
                /**
                 * @private
                 */
                var obj = me.replaceFunc_(new me.hProcDic_[mapsAPIclassName](opts), "setOptions", function(argOpts) {
                    obj.set("options", argOpts);
                    obj.setOptions_.call(obj, argOpts);
                });
                var tmpStr = typeof(opts.icon);
                if (tmpStr.toLowerCase() === "string") {
                    obj.set("iconUrl", opts.icon);
                } else {
                    if (!me.isNull(opts.icon)) {
                        var tmp = opts.icon.getArguments();
                        obj.set("iconUrl", tmp[0]);
                    }
                }
                obj.set("options", opts);
                obj.setIcon_ = obj.setIcon;
                /**
                 * @private
                 * @ignore
                 */
                obj.setIcon = function(argOpts) {
                    var tmpStr = typeof(opts.icon);
                    if (tmpStr.toLowerCase() === "string") {
                        obj.set("iconUrl", argOpts);
                    } else {
                        if (!me.isNull(opts.icon)) {
                            var tmp = argOpts.getArguments();
                            obj.set("iconUrl", tmp[0]);
                        }
                        obj.setIcon_.call(obj, argOpts);
                    }
                };
                obj = me.setFunc_(obj, "getOptions", function() {
                    return obj.get("options");
                });
                obj.set("sncOverNo", me.overlays_.getLength());
                obj.set("sncCls", mapsAPIclassName);
                me.overlays_.push(obj);
                return obj;
            };
        }
    };
    /**
     * @private
     * @ignore
     */
    this.setHookProc_ = function(mapsAPIclassName) {
        me.hProcDic_[mapsAPIclassName] = google.maps[mapsAPIclassName];
        if (mapsAPIclassName in google.maps) {
            google.maps[mapsAPIclassName] = function(opts) {

                /**
                 * @private
                 */
                var obj = me.replaceFunc_(new me.hProcDic_[mapsAPIclassName](opts), "setOptions", function(argOpts) {
                    obj.set("options", argOpts);
                    obj.setOptions_.call(obj, argOpts);
                });
                obj.set("options", opts);
                /**
                 * @private
                 * @ignore
                 */
                obj.getOptions = function() {
                    return obj.get("options");
                };
                obj.set("sncOverNo", me.overlays_.getLength());
                obj.set("sncCls", mapsAPIclassName);
                me.overlays_.push(obj);
                return obj;
            };
        }
    };

    /**
     * @private
     * @ignore
     */
    this.replaceFunc_ = function(a, b, c, d) {
        a[b + "_"] = a.b;
        a.c = d;
        return a;
    };
    /**
     * @private
     * @ignore
     */
    this.setFunc_ = function(a, b, c) {
        a.b = c;
        return a;
    };

    /**
     * @private
     * @ignore
     */
    this.setHookArg_ = function(mapsAPIclassName) {
        if (mapsAPIclassName in google.maps) {
            me.hProcDic_[mapsAPIclassName] = google.maps[mapsAPIclassName];
            google.maps[mapsAPIclassName] = function(arg1, arg2, arg3, arg4, arg5) {
                var arg_ = arguments;

                /**
                 * @private
                 * @ignore
                 */
                var obj = new me.hProcDic_[mapsAPIclassName](arg1, arg2, arg3, arg4, arg5);
                /**
                 * @private
                 * @ignore
                 */
                obj.getArguments = function() {
                    return arg_;
                };
                if ("get" in obj) {
                    obj.set("sncCls", mapsAPIclassName);
                } else {
                    /**
                     * @private
                     * @ignore
                     */
                    obj.get = function(key) {
                        if (key === "sncCls") {
                            return mapsAPIclassName;
                        }
                        return undefined;
                    };
                }
                return obj;
            };
        }
    };


    /**
     * @desc Generate new URL for snapshot. If no center is passed in, then it
     *       uses the center of the map. If the center is set to false, then the
     *       center of the snapshot is auto-calculated based on the overlay
     *       positions.
     * @param {LatLng}
     *          [mapCenterPos] Center of map
     * @return {String} URL
     */
    this.getImage = function(mapCenterPos) {
        var url = "http://" + me.server_ + "/maps/api/staticmap?";
        var bounds = me.map_.getBounds();
        var isOverlayDraw = false;

        // size
        var mapDiv = me.map_.getDiv();
        var mapSize = new google.maps.Size(mapDiv.offsetWidth, mapDiv.offsetHeight);
        if (!me.isNull(me.opts_.size)) {
            if (me.opts_.size.width > 640) {
                me.opts_.size.width = 640;
            }
            if (me.opts_.size.height > 640) {
                me.opts_.size.height = 640;
            }
            url += "size=" + me.opts_.size.width + "x" + me.opts_.size.height;
            mapSize.width = parseInt(me.opts_.size.width, 10);
            mapSize.height = parseInt(me.opts_.size.height, 10);
        } else {
            if (mapSize.width > 640) {
                mapSize.width = 640;
            }
            if (mapSize.height > 640) {
                mapSize.height = 640;
            }
            url += "size=" + mapSize.width + "x" + mapSize.height;
            mapSize.width = parseInt(mapSize.width, 10);
            mapSize.height = parseInt(mapSize.height, 10);
        }
        me.mapImgSize = mapSize;

        // map type
        var maptype = "";
        if (me.isNull(me.opts_.maptype)) {
            switch (me.map_.getMapTypeId()) {
                case google.maps.MapTypeId.SATELLITE:
                    maptype = "satellite";
                    break;
                case google.maps.MapTypeId.HYBRID:
                    maptype = "hybrid";
                    break;
                case google.maps.MapTypeId.TERRAIN:
                    maptype = "terrain";
                    break;
                case google.maps.MapTypeId.ROADMAP:
                    maptype = "roadmap";
                    break;
            }
            if (maptype !== "") {
                url += "&maptype=" + maptype;
            } else {
                var mapType = me.map_.mapTypes.get(me.map_.getMapTypeId());
                if (mapType.get("sncCls") === "StyledMapType") {
                    var arg_ = mapType.getArguments();
                    var styledStyle = styledStyle;
                    if (!me.isNull(arg_[0])) {
                        var si, ssiVal, ssi, ssi2, ssiObj, ssiTmp;
                        var style = arg_[0];
                        for (si in style) {
                            if (si in style) {
                                url += "&style=feature:" + style[si].featureType + "|element:" + style[si].elementType;
                                ssiTmp = [];
                                for (ssi in style[si].stylers) {
                                    if (ssi in style[si].stylers) {
                                        ssiObj = style[si].stylers[ssi];
                                        for (ssi2 in ssiObj) {
                                            if (ssi2[0] !== "_") {
                                                ssiVal = ssiObj[ssi2];
                                                if (ssi2 === "hue") {
                                                    ssiVal = ssiVal.replace("#", "0x");
                                                }
                                                ssiTmp.push(ssi2 + ":" + ssiVal);
                                            }
                                        }
                                    }
                                }

                                if (ssiTmp.length) {
                                    url += "|" + ssiTmp.join("|");
                                }
                            }
                        }
                    }
                } else {
                    url += "&maptype=roadmap";
                }
            }
        } else {
            url += "&maptype=" + me.opts_.maptype.toLowerCase();
        }
        if (me.opts_.language !== "") {
            url += "&hl=" + me.opts_.language;
        }
        if (!me.isNull(me.opts_.format)) {
            var imgFormat = me.opts_.format.toLowerCase();
            if (imgFormat === "jpg" || imgFormat === "jpeg") {
                url += "&format=jpg";
            } else if (imgFormat === "png") {
                url += "&format=png32";
            } else if (imgFormat === "jpg-baseline" || imgFormat === "png8" || imgFormat === "png32") {
                url += "&format=" + imgFormat;
            }
        }
        // circle, polyline, polygon, Rectangle
        var polylineVertex = [];
        me.overlays_.forEach(function(overlay, i) {
            polylineVertex = [];
            var polyClsName = overlay.get("sncCls");
            if (overlay.getMap() === me.map_ &&
                (polyClsName === "Circle" || polyClsName === "Polyline" || polyClsName === "Polygon" || polyClsName === "Rectangle")) {
                var opts = overlay.getOptions();
                var points;
                if (polyClsName === "Circle") {
                    /*
                     * circle
                     */
                    points = new google.maps.MVCArray();
                    var cLatLng = overlay.getCenter();
                    var rad = overlay.getRadius();
                    var point;
                    for (i = 0; i <= 36; i++) {
                        point = me.circlePoint_(cLatLng, i * 360 / 36, rad / 1000);
                        points.push(point);
                    }
                } else if (polyClsName === "Polyline" || polyClsName === "Polygon") {
                    /*
                     * polyline, Polygon
                     */
                    points = overlay.getPath();
                } else if (polyClsName === "Rectangle") {
                    /*
                     * Rectangle
                     */
                    var tmpBounds = overlay.getBounds();
                    var sw = tmpBounds.getSouthWest();
                    var ne = tmpBounds.getNorthEast();
                    points = new google.maps.MVCArray();
                    points.push(new google.maps.LatLng(sw.lat(), ne.lng()));
                    points.push(new google.maps.LatLng(ne.lat(), ne.lng()));
                    points.push(new google.maps.LatLng(ne.lat(), sw.lng()));
                    points.push(new google.maps.LatLng(sw.lat(), sw.lng()));
                }
                if (polyClsName === "Circle" || polyClsName === "Polygon" || polyClsName === "Rectangle") {
                    if (points.getAt(0) !== points.getAt(points.getLength() - 1)) {
                        points.push(points.getAt(0));
                    }
                }
                if (me.opts_.adjustZoom === false) {
                    polylineVertex = me.pickupVertixes_(points, bounds);
                } else {
                    polylineVertex = points.getArray();
                }
                if (polylineVertex.length) {
                    var path = "";
                    var polyOpts = overlay.getOptions();
                    var opacity = parseInt(256 * parseFloat(polyOpts.strokeOpacity), 10);
                    path = "color:" + me.normalizeColor_(polyOpts.strokeColor) + opacity.toString(16);
                    if (polyClsName === "Circle" || polyClsName === "Polygon" || polyClsName === "Rectangle") {
                        opacity = parseInt(256 * parseFloat(polyOpts.fillOpacity, 10), 10);
                        path += "|fillcolor:" + me.normalizeColor_(polyOpts.fillColor) + opacity.toString(16);
                    }
                    if (!me.isNull(polyOpts.strokeWeight)) {
                        if (polyOpts.weight !== 5) {
                            path += (path !== "" ? "|" : "") + "weight:" + polyOpts.strokeWeight;
                        }
                    }
                    url += "&path=" + path + "|";
                    if (me.opts_.usePolylineEncode === true) {
                        url += "enc:";
                        if ("geometry" in google.maps) {
                            url += google.maps.geometry.encoding.encodePath(polylineVertex);
                        } else {
                            url += me.createEncodings_(polylineVertex);
                        }
                    } else {
                        url += polylineVertex.join("|").replace(/[\(\)\s]/g, "");
                    }
                    isOverlayDraw = true;
                }
            }
        });
        // DirectionsRenderer
        polylineVertex = [];
        me.overlays_.forEach(function(overlay, i) {
            polylineVertex = [];
            var j;
            var polyClsName = overlay.get("sncCls");
            if (overlay.getMap() === me.map_ && (polyClsName === "DirectionsRenderer")) {
                var points;

                /*
                 * DirectionsRenderer
                 */
                var result = overlay.getDirections();
                if (!me.isNull(result)) {
                    var routes = result.routes;
                    for (i = 0; i < routes.length; i++) {
                        points = routes[i].overview_path;
                        if (me.opts_.adjustZoom === false) {
                            points = new google.maps.MVCArray(points);
                            polylineVertex = me.pickupVertixes_(points, bounds);
                        } else {
                            polylineVertex = points;
                        }
                        if (polylineVertex.length) {
                            var path = "";
                            var polyOpts = overlay.getOptions();
                            if (me.isNull(polyOpts)) {
                                polyOpts = {
                                    strokeOpacity: 0.5,
                                    strokeColor: "#0000FF"
                                };
                            }
                            var opacity = parseInt(256 * parseFloat(polyOpts.strokeOpacity), 10);
                            path = "color:" + me.normalizeColor_(polyOpts.strokeColor) + opacity.toString(16);

                            if (!me.isNull(polyOpts.strokeWeight)) {
                                if (polyOpts.weight !== 5) {
                                    path += (path !== "" ? "|" : "") + "weight:" + polyOpts.strokeWeight;
                                }
                            }
                            url += "&path=" + path + "|";
                            if (me.opts_.usePolylineEncode === true) {
                                url += "enc:";
                                if ("geometry" in google.maps) {
                                    url += google.maps.geometry.encoding.encodePath(polylineVertex);
                                } else {
                                    url += me.createEncodings_(polylineVertex);
                                }
                            } else {
                                url += polylineVertex.join("|").replace(/[\(\)\s]/g, "");
                            }
                            for (j = 0; j < routes[i].legs.length; j++) {
                                if (bounds.contains(routes[i].legs[j].start_location) || me.opts_.adjustZoom === true) {
                                    url += "&markers=label:" + String.fromCharCode(65 + j) + "|color:green|" +
                                        me.normalizePos_(routes[i].legs[j].start_location);
                                }
                                if (j === routes[i].legs.length - 1 &&
                                    (me.opts_.adjustZoom === true || bounds.contains(routes[i].legs[j].end_location))) {
                                    url += "&markers=label:" + String.fromCharCode(65 + j + 1) + "|color:green|" +
                                        me.normalizePos_(routes[i].legs[j].end_location);
                                }
                            }
                            isOverlayDraw = true;
                        }
                    }
                }
            }
        });
        // markers
        var markerLatLng;
        var markerSize;
        var markerAlphaNumeric;
        var markerColor;
        var optStr = "";
        var markerIcon = "";
        var markerConditions = {};
        var markerIconDic = {};
        var markerIconCnt = 0;
        me.overlays_.forEach(function(overlay, i) {
            if (overlay.getMap() === me.map_ && overlay.get("sncCls") === "Marker") {
                markerLatLng = overlay.getPosition();
                ///if (overlay.getVisible() && (bounds.contains(markerLatLng) === true || me.opts_.adjustZoom === true)) {
                if ((bounds.contains(markerLatLng) === true || me.opts_.adjustZoom === true)) {
                    optStr = "";

                    /* size */
                    markerSize = overlay.get("ssSize");
                    if (!me.isNull(markerSize)) {
                        markerSize = markerSize.toLowerCase();
                        if (markerSize === "tiny" || markerSize === "mid" || markerSize === "small") {
                            optStr += (optStr !== "" ? "|" : "") + "size:" + markerSize;
                        }
                    }

                    /* alphanumeric-character */
                    markerAlphaNumeric = overlay.get("ssCharacter");
                    if (!me.isNull(markerAlphaNumeric) && markerSize !== "tiny") {
                        if (markerAlphaNumeric.match(/^[a-zA-Z0-9]/)) {
                            optStr = +"label:" + markerAlphaNumeric.substr(0, 1).toUpperCase();
                        }
                    }
                    /* color */
                    markerColor = overlay.get("ssColor");
                    if (!me.isNull(markerColor)) {
                        optStr += (optStr !== "" ? "|" : "") + "color:" + me.normalizeColor_(markerColor);
                    }
                    /* icon */
                    if (markerIconCnt < 6) {
                        markerIcon = overlay.getIcon();
                        if (!me.isNull(markerIcon)) {
                            markerIcon = overlay.get("iconUrl");
                            optStr += (optStr !== "" ? "|" : "") + "icon:" + markerIcon;
                            if (!(markerIcon in markerIconDic)) {
                                markerIconDic[markerIcon] = markerIconCnt++;
                            }
                            if (me.isNull(overlay.getShadow())) {
                                optStr += (optStr !== "" ? "|" : "") + "shadow:false";
                            }
                        }
                    }
                    if (!(optStr in markerConditions)) {
                        markerConditions[optStr] = "";
                    }
                    markerLatLng = me.normalizePos_(markerLatLng);
                    markerConditions[optStr] += (markerConditions[optStr] !== "" ? "|" : "") + markerLatLng;
                }
            }
        });
        var ost;
        for (ost in markerConditions) {
            if (ost in markerConditions) {
                url += "&markers=" + ost + (ost !== "" ? "|" : "") + markerConditions[ost];
                isOverlayDraw = true;
            }
        }

        // zoom level
        var zoom = me.map_.getZoom();
        if (me.opts_.adjustZoom === false || isOverlayDraw === false) {
            if (zoom > 20) {
                zoom = "21+";
            }
            url += "&zoom=" + zoom;
        }
        // center position
        if (mapCenterPos !== false) {
            if (me.isNull(mapCenterPos)) {
                mapCenterPos = me.map_.getCenter();
            }
            //if (isOverlayDraw === false || isOverlayDraw === true && me.opts_.adjustCenter === true) {
            url += '&center=' + me.normalizePos_(mapCenterPos);
            //}
        }
        url += "&sensor=" + me.sensor_;
        if (url.length > 2000) {
            window.alert("Error: the request url is too long!");
            url = "";
        }
        me.imgUrl_ = url;
        return url;
    };

    /**
     * @private
     */
    this.circlePoint_ = function(orig, hdng, dist) {
        var R = 6371;
        var oX, oY;
        var x, y;
        var d = dist / R;
        hdng = hdng * Math.PI / 180;
        oX = orig.lng() * Math.PI / 180;
        oY = orig.lat() * Math.PI / 180;
        y = Math.asin(Math.sin(oY) * Math.cos(d) + Math.cos(oY) * Math.sin(d) * Math.cos(hdng));
        x = oX + Math.atan2(Math.sin(hdng) * Math.sin(d) * Math.cos(oY), Math.cos(d) - Math.sin(oY) * Math.sin(y));
        y = y * 180 / Math.PI;
        x = x * 180 / Math.PI;
        return new google.maps.LatLng(y, x);
    };

    /**
     * @private
     */
    this.pickupVertixes_ = function(pathAry, bounds) {
        var vertexLatLng;
        var pathStr = "";
        var addedList = [];
        var vertexAry = [];
        var url = "";
        var drawFlagList = new Array(pathAry.getLength());
        addedList.length = pathAry.getLength();
        drawFlagList[0] = bounds.contains(pathAry.getAt(0));
        addedList[0] = 0;
        if (drawFlagList[0] === true) {
            vertexAry.push(pathAry.getAt(0));
            addedList[0] = 1;
        }
        var j, lineBound;
        for (j = 1; j < pathAry.getLength(); j++) {
            addedList[j] = 0;
            drawFlagList[j] = bounds.contains(pathAry.getAt(j));
            if (drawFlagList[j - 1] === true || drawFlagList[j] === true) {
                if (drawFlagList[j - 1] === false && addedList[j - 1] === 0) {
                    vertexAry.push(pathAry.getAt(j - 1));
                }
                vertexAry.push(pathAry.getAt(j));
                addedList[j] = 1;
            } else {
                lineBound = new google.maps.LatLngBounds(pathAry.getAt(j - 1), pathAry.getAt(j));
                drawFlagList[j] = bounds.intersects(lineBound);
                if (drawFlagList[j] === true) {
                    if (drawFlagList[j - 1] === false && addedList[j - 1] === 0) {
                        vertexAry.push(pathAry.getAt(j - 1));
                    }
                    vertexAry.push(pathAry.getAt(j));
                    addedList[j] = 1;
                } else if (drawFlagList[j - 1] === true) {
                    if (addedList[j - 1] === 0) {
                        vertexAry.push(pathAry.getAt(j - 1));
                    }
                    vertexAry.push(pathAry.getAt(j));
                    addedList[j] = 1;
                }
            }
        }
        return vertexAry;
    };
    /**
     * @private
     * @param {LatLng}
     *          position
     */
    this.normalizePos_ = function(position) {
        return position.toUrlValue().replace(/[^0-9\.\,\-]/, "");
    };
    /**
     * @private
     */
    this.normalizeColor_ = function(color) {
        return color.replace("#", "0x");
    };
    /**
     * Specifies control options.
     * @param {SnapShotControlOptions} [opt_opts] Specifies options for control behavior.
     */
    this.setOptions = function(opt_opts) {
        var defaultOptions = {
            "buttonLabelHtml": "Say cheese!",
            "popupLabelHtml": "",
            "mapType": "",
            "size": "",
            "hidden": false,
            "adjustZoom": false,
            "adjustCenter": false,
            "language": "",
            "format": "png",
            "usePolylineEncode": true,
            "controlPositon": google.maps.ControlPosition.TOP_RIGHT,
            "positon": null
        };
        var i;
        if (!me.isNull(opt_opts)) {
            for (i in defaultOptions) {
                if (!(i in opt_opts) && i in defaultOptions) {
                    opt_opts[i] = defaultOptions[i];
                }
            }
        } else {
            opt_opts = defaultOptions;
        }
        me.opts_ = opt_opts;
    };

    /**
     * @desc Generate new snapshot URL and show popup with image and URL.
     * @param {SnapShotControlOptions} [opt_opts] Specifies options for control behavior.
     *  Note that buttonLabelHtml, hidden and controlPositon property are ignored.
     */
    this.showPopup = function(opt_opts) {
        var mapCenterPos = null;
        if (!me.isNull(opt_opts)) {
            me.setOptions(opt_opts);
        }
        if (!me.isNull(opt_opts)) {
            if ("position" in opt_opts) {
                mapCenterPos = opt_opts.position;
            }
        }
        var imgUrl = me.getImage(mapCenterPos);
        var bodyEleSize;
        var bodyEle;
        bodyEle = document.getElementsByTagName("body")[0];
        bodyEleSize = me.getPageSize_();
        var popupContainer = me.createDiv_({
            "left": 0,
            "top": 0,
            "width": bodyEleSize.width + "px",
            "height": bodyEleSize.height + "px",
            "backgroundColor": "black",
            "margin": 0,
            "padding": 0,
            "MozUserSelect": "none",
            "WebkitUserSelect": "none",
            "visibility": "hidden"
        });
        var time = new Date();
        var eleID = "p" + time.getTime();
        popupContainer.name = eleID;
        popupContainer.id = eleID;
        bodyEle.appendChild(popupContainer);
        var js = "var ele=document.getElementById(\"" + eleID + "\");" + "ele.parentNode.removeChild(ele);" +
            "ele=document.getElementById(\"tbl_" + eleID + "\");" + "ele.parentNode.removeChild(ele);";
        var tableHtml = "<table class='snapshotcontrol_popup'>" + "<tbody>";
        if ("popupLabelHtml" in me.opts_) {
            tableHtml += "<thead><tr><th style='text-align:left'><div id='title'>" + me.opts_.popupLabelHtml +
                "</div></th></tr></thead>";
        }
        tableHtml += "<tr><td style='text-align;center;'><center><img src='" + imgUrl +
            "' style='border:1px solid black;'></center></td></tr>" + "<tr><td><input type='text' style='width:" +
            me.mapImgSize.width + "px;' value='" + imgUrl + "'></td></tr>" + "<tr><td><center><input type='button' value='close' " +
            "onclick='javascript:" + js + "'></center></td></tr>" + "</tbody>" + "</table>";
        var tableHtmlSize = me.getHtmlSize(tableHtml);
        var w, h;
        w = tableHtmlSize.width + 10;
        if (w < me.mapImgSize.width) {
            w = me.mapImgSize.width + 10;
        }
        h = tableHtmlSize.height + 10;
        if (h < me.mapImgSize.height) {
            h = me.mapImgSize.height + 70;
        }
        var tableContainer = me.createDiv_({
            left: 0,
            "top": 0,
            "width": w + "px",
            "height": h + "px"
        });
        tableContainer.style.backgroundColor = "white";
        tableContainer.style.width = 0;
        tableContainer.style.height = 0;
        tableContainer.style.padding = "5px";
        tableContainer.style.border = "1px solid black";
        tableContainer.id = "tbl_" + eleID;
        tableContainer.name = "tbl_" + eleID;
        tableContainer.style.left = (Math.floor(bodyEleSize.width - w) / 2) + "px";
        tableContainer.style.top = (Math.floor(bodyEleSize.height - h) / 2) + "px";
        tableContainer.innerHTML = tableHtml;
        tableContainer.style.left = Math.floor(bodyEleSize.width / 2) + "px";
        bodyEle.appendChild(tableContainer);
        var setOpacity = function(ele, opacity) {
            ele.style.filter = "alpha(opacity=" + opacity + ")";
            ele.style.mozOpacity = opacity / 100;
            ele.style.opacity = opacity / 100;
        };
        var feedinAnimation = function(ele, cnt, maxCnt, cntStep) {
            setOpacity(ele, cnt);
            cnt += cntStep;
            if (cnt < maxCnt) {
                setTimeout(function() {
                    feedinAnimation(ele, cnt, maxCnt, cntStep);
                }, 10);
            } else {
                setTimeout(function() {
                    me.openboard_(tableContainer, "step1", w, h, bodyEleSize);
                }, 400);
            }
        };
        setOpacity(popupContainer, 0);
        feedinAnimation(popupContainer, 1, 80, 10);
        popupContainer.style.visibility = "visible";

    };
    /**
     * @private
     */
    this.openboard_ = function(element, mode, maxW, maxH, pageSize) {
        var arg_ = arguments;
        var w, h;
        if (mode === "step1") {
            h = element.offsetHeight + Math.floor(maxH / 10);
            if (h >= maxH) {
                h = maxH;
            }
            element.style.height = h + "px";
            if (h === maxH) {
                mode = "step2";
                setTimeout(function() {
                    arg_.callee.apply(me, arg_);
                }, 100);
                return;
            }
        } else {
            w = element.offsetWidth + Math.floor(maxW / 10);
            if (w >= maxW) {
                w = maxW;
            }
            element.style.left = ((pageSize.width - w) / 2) + "px";
            element.style.width = w + "px";
            if (w === maxW) {
                return;
            }
        }
        setTimeout(function() {
            arg_.callee.apply(me, arg_);
        }, 30);
    };
    // =====================================
    // createEncodings function
    // source:
    // http://code.google.com/intl/ja/apis/maps/documentation/include/polyline.js
    // =====================================
    /**
     * @private
     */
    this.createEncodings_ = function(points) {
        var i = 0;
        var plat = 0;
        var plng = 0;
        var encoded_points = "";
        var dlat = 0;
        var dlng = 0;
        for (i = 0; i < points.length; ++i) {
            var point = points[i];
            var lat = point.lat();
            var lng = point.lng();

            var late5 = Math.floor(lat * 1e5);
            var lnge5 = Math.floor(lng * 1e5);

            dlat = late5 - plat;
            dlng = lnge5 - plng;

            plat = late5;
            plng = lnge5;

            encoded_points += this.encodeSignedNumber_(dlat) + this.encodeSignedNumber_(dlng);
        }
        return encoded_points;
    };

    /**
     * @private
     */
    this.encodeSignedNumber_ = function(num) {
        var sgn_num = num << 1;

        if (num < 0) {
            sgn_num = ~ (sgn_num);
        }

        return this.encodeNumber_(sgn_num);
    };

    /**
     * @private Encode an unsigned number in the encode format.
     */
    this.encodeNumber_ = function(num) {
        var encodeString = "";

        while (num >= 0x20) {
            encodeString += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
            num >>= 5;
        }

        encodeString += String.fromCharCode(num + 63);
        return encodeString;
    };

    /**
     * @private
     */
    // =====================================
    // Lightbox v2.04 (only getPageSize_)
    // by Lokesh Dhakar - http://www.lokeshdhakar.com
    // Last Modification: 2/9/08
    //
    // For more information, visit:
    // http://lokeshdhakar.com/projects/lightbox2/
    //
    // Licensed under the Creative Commons Attribution 2.5 License -
    // http://creativecommons.org/licenses/by/2.5/
    // - Free for use in both personal and commercial projects
    // - Attribution requires leaving author name, author link, and the license
    // info intact.
    // =====================================
    this.getPageSize_ = function() {
        var pageHeight = 0;
        var pageWidth = 0;
        var xScroll, yScroll;
        if (window.innerHeight && window.scrollMaxY) {
            xScroll = window.innerWidth + window.scrollMaxX;
            yScroll = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight) {
            // all but Explorer Mac
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else {
            // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and
            // Safari
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }
        var windowWidth, windowHeight;
        if (self.innerHeight) {
            // all except Explorer
            if (document.documentElement.clientWidth) {
                windowWidth = document.documentElement.clientWidth;
            } else {
                windowWidth = self.innerWidth;
            }
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) {
            // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) {
            // other Explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        }
        // for small pages with total height less then height of the viewport
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }
        // for small pages with total width less then width of the viewport
        if (xScroll < windowWidth) {
            pageWidth = xScroll;
        } else {
            pageWidth = windowWidth;
        }
        return new google.maps.Size(pageWidth, pageHeight);
    };

    /**
     * @desc Add control into a map.
     * @param map
     */
    this.setMap = function(map) {
        me.map_ = map;
        // create the shutter button
        if (me.opts_.hidden === false) {
            me.shutterBtn_ = me.createBtn_(me.opts_.buttonLabelHtml, function() {
                me.showPopup();
            });
            me.map_.controls[me.opts_.controlPositon].push(me.shutterBtn_);
        }
    };
    /**
     * initialize of this control
     */

    this.setOptions(opt_opts);

    // find maps domain and sensor setting
    var scripts = document.getElementsByTagName("script");
    var premier = false;
    var sensor = false;
    var server = "";
    var libraries = "";
    var regexp, i;
    for (i = 0; i < scripts.length; i++) {
        var scriptNode = scripts[i];
        regexp = scriptNode.src.match(/^http:\/\/maps\.google\.([^\/]+)\/maps\/api\/js\?&(?:amp;)?sensor=([^\&]+)/gi);
        if (regexp !== null) {
            server = RegExp.$1;
            sensor = RegExp.$2;
            regexp = scriptNode.src.match(/^http:\/\/maps\.google\..*?&(?:amp;)?libraries=([^\&]+)/gi);
            if (regexp !== null) {
                libraries = RegExp.$1;
            }

            break;
        }

    }
    this.sensor_ = sensor || false;
    this.server_ = server || "maps.google.com";
    this.libraries = libraries || "";

    if (!me.isNull(opt_opts)) {
        if (!me.isNull(opt_opts.map)) {
            me.setMap(opt_opts.map);
        }
    }

    // Set a hook procedure.
    this.setHookProcForMarker_("Marker");
    this.setHookProc_("Polyline");
    this.setHookProc_("Polygon");
    this.setHookProc_("Circle");
    this.setHookProc_("Rectangle");
    this.setHookProc_("DirectionsRenderer");
    this.setHookArg_("MarkerImage");
    this.setHookArg_("StyledMapType");
}
