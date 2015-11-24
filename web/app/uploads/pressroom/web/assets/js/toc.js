/*!
 * Modernizr v2.8.2
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */
/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */
window.Modernizr = function(window, document, undefined) {
    var version = "2.8.2", Modernizr = {}, /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    enableClasses = true, /*>>cssclasses*/
    docElement = document.documentElement, /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = "modernizr", modElem = document.createElement(mod), mStyle = modElem.style, /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem = document.createElement("input"), /*>>smile*/
    smile = ":)", /*>>smile*/
    toString = {}.toString, // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = " -webkit- -moz- -o- -ms- ".split(" "), /*>>prefixes*/
    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius
    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/
    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = "Webkit Moz O ms", cssomPrefixes = omPrefixes.split(" "), domPrefixes = omPrefixes.toLowerCase().split(" "), /*>>domprefixes*/
    /*>>ns*/
    ns = {
        svg: "http://www.w3.org/2000/svg"
    }, /*>>ns*/
    tests = {}, inputs = {}, attrs = {}, classes = [], slice = classes.slice, featureName, // used in testing loop
    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    injectElementWithStyles = function(rule, callback, nodes, testnames) {
        var style, ret, node, docOverflow, div = document.createElement("div"), // After page load injecting a fake body doesn't work so check if body exists
        body = document.body, // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
        fakeBody = body || document.createElement("body");
        if (parseInt(nodes, 10)) {
            // In order not to give false positives we create a node for each test
            // This also allows the method to scale for unspecified uses
            while (nodes--) {
                node = document.createElement("div");
                node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                div.appendChild(node);
            }
        }
        // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
        // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
        // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
        // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
        // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
        style = [ "&#173;", '<style id="s', mod, '">', rule, "</style>" ].join("");
        div.id = mod;
        // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
        // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
        (body ? div : fakeBody).innerHTML += style;
        fakeBody.appendChild(div);
        if (!body) {
            //avoid crashing IE8, if background image is used
            fakeBody.style.background = "";
            //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
            fakeBody.style.overflow = "hidden";
            docOverflow = docElement.style.overflow;
            docElement.style.overflow = "hidden";
            docElement.appendChild(fakeBody);
        }
        ret = callback(div, rule);
        // If this is done after page load we don't want to remove the body so check if body exists
        if (!body) {
            fakeBody.parentNode.removeChild(fakeBody);
            docElement.style.overflow = docOverflow;
        } else {
            div.parentNode.removeChild(div);
        }
        return !!ret;
    }, /*>>teststyles*/
    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function(mq) {
        var matchMedia = window.matchMedia || window.msMatchMedia;
        if (matchMedia) {
            return matchMedia(mq) && matchMedia(mq).matches || false;
        }
        var bool;
        injectElementWithStyles("@media " + mq + " { #" + mod + " { position: absolute; } }", function(node) {
            bool = (window.getComputedStyle ? getComputedStyle(node, null) : node.currentStyle)["position"] == "absolute";
        });
        return bool;
    }, /*>>mq*/
    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    isEventSupported = function() {
        var TAGNAMES = {
            select: "input",
            change: "input",
            submit: "form",
            reset: "form",
            error: "img",
            load: "img",
            abort: "img"
        };
        function isEventSupported(eventName, element) {
            element = element || document.createElement(TAGNAMES[eventName] || "div");
            eventName = "on" + eventName;
            // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
            var isSupported = eventName in element;
            if (!isSupported) {
                // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
                if (!element.setAttribute) {
                    element = document.createElement("div");
                }
                if (element.setAttribute && element.removeAttribute) {
                    element.setAttribute(eventName, "");
                    isSupported = is(element[eventName], "function");
                    // If property was created, "remove it" (by setting value to `undefined`)
                    if (!is(element[eventName], "undefined")) {
                        element[eventName] = undefined;
                    }
                    element.removeAttribute(eventName);
                }
            }
            element = null;
            return isSupported;
        }
        return isEventSupported;
    }(), /*>>hasevent*/
    // TODO :: Add flag for hasownprop ? didn't last time
    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    _hasOwnProperty = {}.hasOwnProperty, hasOwnProp;
    if (!is(_hasOwnProperty, "undefined") && !is(_hasOwnProperty.call, "undefined")) {
        hasOwnProp = function(object, property) {
            return _hasOwnProperty.call(object, property);
        };
    } else {
        hasOwnProp = function(object, property) {
            /* yes, this can give false positives/negatives, but most of the time we don't care about those */
            return property in object && is(object.constructor.prototype[property], "undefined");
        };
    }
    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5
    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {
            var target = this;
            if (typeof target != "function") {
                throw new TypeError();
            }
            var args = slice.call(arguments, 1), bound = function() {
                if (this instanceof bound) {
                    var F = function() {};
                    F.prototype = target.prototype;
                    var self = new F();
                    var result = target.apply(self, args.concat(slice.call(arguments)));
                    if (Object(result) === result) {
                        return result;
                    }
                    return self;
                } else {
                    return target.apply(that, args.concat(slice.call(arguments)));
                }
            };
            return bound;
        };
    }
    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss(str) {
        mStyle.cssText = str;
    }
    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ";") + (str2 || ""));
    }
    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is(obj, type) {
        return typeof obj === type;
    }
    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains(str, substr) {
        return !!~("" + str).indexOf(substr);
    }
    /*>>testprop*/
    // testProps is a generic CSS / DOM property test.
    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.
    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.
    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.
    function testProps(props, prefixed) {
        for (var i in props) {
            var prop = props[i];
            if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                return prefixed == "pfx" ? prop : true;
            }
        }
        return false;
    }
    /*>>testprop*/
    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {
                // return the property name as a string
                if (elem === false) return props[i];
                // let's bind a function
                if (is(item, "function")) {
                    // default to autobind unless override
                    return item.bind(elem || obj);
                }
                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }
    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll(prop, prefixed, elem) {
        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), props = (prop + " " + cssomPrefixes.join(ucProp + " ") + ucProp).split(" ");
        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);
        } else {
            props = (prop + " " + domPrefixes.join(ucProp + " ") + ucProp).split(" ");
            return testDOMProps(props, prefixed, elem);
        }
    }
    /*>>testallprops*/
    /**
     * Tests
     * -----
     */
    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox
    tests["flexbox"] = function() {
        return testPropsAll("flexWrap");
    };
    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/
    tests["flexboxlegacy"] = function() {
        return testPropsAll("boxDirection");
    };
    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/
    tests["canvas"] = function() {
        var elem = document.createElement("canvas");
        return !!(elem.getContext && elem.getContext("2d"));
    };
    tests["canvastext"] = function() {
        return !!(Modernizr["canvas"] && is(document.createElement("canvas").getContext("2d").fillText, "function"));
    };
    // webk.it/70117 is tracking a legit WebGL feature detect proposal
    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441
    tests["webgl"] = function() {
        return !!window.WebGLRenderingContext;
    };
    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */
    tests["touch"] = function() {
        var bool;
        if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true;
        } else {
            injectElementWithStyles([ "@media (", prefixes.join("touch-enabled),("), mod, ")", "{#modernizr{top:9px;position:absolute}}" ].join(""), function(node) {
                bool = node.offsetTop === 9;
            });
        }
        return bool;
    };
    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158
    tests["geolocation"] = function() {
        return "geolocation" in navigator;
    };
    tests["postmessage"] = function() {
        return !!window.postMessage;
    };
    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    tests["websqldatabase"] = function() {
        return !!window.openDatabase;
    };
    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests["indexedDB"] = function() {
        return !!testPropsAll("indexedDB", window);
    };
    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests["hashchange"] = function() {
        return isEventSupported("hashchange", window) && (document.documentMode === undefined || document.documentMode > 7);
    };
    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests["history"] = function() {
        return !!(window.history && history.pushState);
    };
    tests["draganddrop"] = function() {
        var div = document.createElement("div");
        return "draggable" in div || "ondragstart" in div && "ondrop" in div;
    };
    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    tests["websockets"] = function() {
        return "WebSocket" in window || "MozWebSocket" in window;
    };
    // css-tricks.com/rgba-browser-support/
    tests["rgba"] = function() {
        // Set an rgba() color and check the returned value
        setCss("background-color:rgba(150,255,150,.5)");
        return contains(mStyle.backgroundColor, "rgba");
    };
    tests["hsla"] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla
        setCss("background-color:hsla(120,40%,100%,.5)");
        return contains(mStyle.backgroundColor, "rgba") || contains(mStyle.backgroundColor, "hsla");
    };
    tests["multiplebgs"] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!
        setCss("background:url(https://),url(https://),red url(https://)");
        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background
        return /(url\s*\(.*?){3}/.test(mStyle.background);
    };
    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396
    tests["backgroundsize"] = function() {
        return testPropsAll("backgroundSize");
    };
    tests["borderimage"] = function() {
        return testPropsAll("borderImage");
    };
    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance
    tests["borderradius"] = function() {
        return testPropsAll("borderRadius");
    };
    // WebOS unfortunately false positives on this test.
    tests["boxshadow"] = function() {
        return testPropsAll("boxShadow");
    };
    // FF3.0 will false positive on this test
    tests["textshadow"] = function() {
        return document.createElement("div").style.textShadow === "";
    };
    tests["opacity"] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.
        setCssAll("opacity:.55");
        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return /^0.55$/.test(mStyle.opacity);
    };
    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   goo.gl/v3V4Gp
    tests["cssanimations"] = function() {
        return testPropsAll("animationName");
    };
    tests["csscolumns"] = function() {
        return testPropsAll("columnCount");
    };
    tests["cssgradients"] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */
        var str1 = "background-image:", str2 = "gradient(linear,left top,right bottom,from(#9f9),to(white));", str3 = "linear-gradient(left top,#9f9, white);";
        setCss(// legacy webkit syntax (FIXME: remove when syntax not in use anymore)
        (str1 + "-webkit- ".split(" ").join(str2 + str1) + // standard syntax             // trailing 'background-image:'
        prefixes.join(str3 + str1)).slice(0, -str1.length));
        return contains(mStyle.backgroundImage, "gradient");
    };
    tests["cssreflections"] = function() {
        return testPropsAll("boxReflect");
    };
    tests["csstransforms"] = function() {
        return !!testPropsAll("transform");
    };
    tests["csstransforms3d"] = function() {
        var ret = !!testPropsAll("perspective");
        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if (ret && "webkitPerspective" in docElement.style) {
            // Webkit allows this media query to succeed only if the feature is enabled.
            // `@media (transform-3d),(-webkit-transform-3d){ ... }`
            injectElementWithStyles("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(node, rule) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };
    tests["csstransitions"] = function() {
        return testPropsAll("transition");
    };
    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/
    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
    tests["fontface"] = function() {
        var bool;
        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function(node, rule) {
            var style = document.getElementById("smodernizr"), sheet = style.sheet || style.styleSheet, cssText = sheet ? sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || "" : "";
            bool = /src/i.test(cssText) && cssText.indexOf(rule.split(" ")[0]) === 0;
        });
        return bool;
    };
    /*>>fontface*/
    // CSS generated content detection
    tests["generatedcontent"] = function() {
        var bool;
        injectElementWithStyles([ "#", mod, "{font:0/0 a}#", mod, ':after{content:"', smile, '";visibility:hidden;font:3px/1 a}' ].join(""), function(node) {
            bool = node.offsetHeight >= 3;
        });
        return bool;
    };
    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan
    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5
    tests["video"] = function() {
        var elem = document.createElement("video"), bool = false;
        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, "");
                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, "");
                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "");
            }
        } catch (e) {}
        return bool;
    };
    tests["audio"] = function() {
        var elem = document.createElement("audio"), bool = false;
        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, "");
                bool.mp3 = elem.canPlayType("audio/mpeg;").replace(/^no$/, "");
                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                bool.wav = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, "");
                bool.m4a = (elem.canPlayType("audio/x-m4a;") || elem.canPlayType("audio/aac;")).replace(/^no$/, "");
            }
        } catch (e) {}
        return bool;
    };
    // In FF4, if disabled, window.localStorage should === null.
    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled
    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.
    // Because we are forced to try/catch this, we'll go aggressive.
    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files
    tests["localstorage"] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    };
    tests["sessionstorage"] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    };
    tests["webworkers"] = function() {
        return !!window.Worker;
    };
    tests["applicationcache"] = function() {
        return !!window.applicationCache;
    };
    // Thanks to Erik Dahlstrom
    tests["svg"] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, "svg").createSVGRect;
    };
    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests["inlinesvg"] = function() {
        var div = document.createElement("div");
        div.innerHTML = "<svg/>";
        return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };
    // SVG SMIL animation
    tests["smil"] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, "animate")));
    };
    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg
    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    tests["svgclippaths"] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, "clipPath")));
    };
    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr["input"] = function(props) {
            for (var i = 0, len = props.length; i < len; i++) {
                attrs[props[i]] = !!(props[i] in inputElem);
            }
            if (attrs.list) {
                // safari false positive's on datalist: webk.it/74252
                // see also github.com/Modernizr/Modernizr/issues/146
                attrs.list = !!(document.createElement("datalist") && window.HTMLDataListElement);
            }
            return attrs;
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" "));
        /*>>input*/
        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value
        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        Modernizr["inputtypes"] = function(props) {
            for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {
                inputElem.setAttribute("type", inputElemType = props[i]);
                bool = inputElem.type !== "text";
                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if (bool) {
                    inputElem.value = smile;
                    inputElem.style.cssText = "position:absolute;visibility:hidden;";
                    if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {
                        docElement.appendChild(inputElem);
                        defaultView = document.defaultView;
                        // Safari 2-4 allows the smiley as a value, despite making a slider
                        bool = defaultView.getComputedStyle && defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== "textfield" && // Mobile android web browser has false positive, so must
                        // check the height to see if the widget is actually there.
                        inputElem.offsetHeight !== 0;
                        docElement.removeChild(inputElem);
                    } else if (/^(search|tel)$/.test(inputElemType)) {} else if (/^(url|email)$/.test(inputElemType)) {
                        // Real url and email support comes with prebaked validation.
                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;
                    } else {
                        // If the upgraded input compontent rejects the :) text, we got a winner
                        bool = inputElem.value != smile;
                    }
                }
                inputs[props[i]] = !!bool;
            }
            return inputs;
        }("search tel url email datetime date month week time datetime-local number range color".split(" "));
    }
    /*>>webforms*/
    // End of test definitions
    // -----------------------
    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for (var feature in tests) {
        if (hasOwnProp(tests, feature)) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();
            classes.push((Modernizr[featureName] ? "" : "no-") + featureName);
        }
    }
    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/
    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
    Modernizr.addTest = function(feature, test) {
        if (typeof feature == "object") {
            for (var key in feature) {
                if (hasOwnProp(feature, key)) {
                    Modernizr.addTest(key, feature[key]);
                }
            }
        } else {
            feature = feature.toLowerCase();
            if (Modernizr[feature] !== undefined) {
                // we're going to quit if you're trying to overwrite an existing test
                // if we were to allow it, we'd do this:
                //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
                //   docElement.className = docElement.className.replace( re, '' );
                // but, no rly, stuff 'em.
                return Modernizr;
            }
            test = typeof test == "function" ? test() : test;
            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += " " + (test ? "" : "no-") + feature;
            }
            Modernizr[feature] = test;
        }
        return Modernizr;
    };
    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss("");
    modElem = inputElem = null;
    (function(window, document) {
        /*jshint evil:true */
        /** version */
        var version = "3.7.0";
        /** Preset options */
        var options = window.html5 || {};
        /** Used to skip problem elements */
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
        /** Not all elements can be cloned in IE **/
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
        /** Detect whether the browser supports default html5 styles */
        var supportsHtml5Styles;
        /** Name of the expando, to work with multiple documents or to re-shiv one document */
        var expando = "_html5shiv";
        /** The id for the the documents expando */
        var expanID = 0;
        /** Cached data for each document */
        var expandoData = {};
        /** Detect whether the browser supports unknown elements */
        var supportsUnknownElements;
        (function() {
            try {
                var a = document.createElement("a");
                a.innerHTML = "<xyz></xyz>";
                //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
                supportsHtml5Styles = "hidden" in a;
                supportsUnknownElements = a.childNodes.length == 1 || function() {
                    // assign a false positive if unable to shiv
                    document.createElement("a");
                    var frag = document.createDocumentFragment();
                    return typeof frag.cloneNode == "undefined" || typeof frag.createDocumentFragment == "undefined" || typeof frag.createElement == "undefined";
                }();
            } catch (e) {
                // assign a false positive if detection fails => unable to shiv
                supportsHtml5Styles = true;
                supportsUnknownElements = true;
            }
        })();
        /*--------------------------------------------------------------------------*/
        /**
         * Creates a style sheet with the given CSS text and adds it to the document.
         * @private
         * @param {Document} ownerDocument The document.
         * @param {String} cssText The CSS text.
         * @returns {StyleSheet} The style element.
         */
        function addStyleSheet(ownerDocument, cssText) {
            var p = ownerDocument.createElement("p"), parent = ownerDocument.getElementsByTagName("head")[0] || ownerDocument.documentElement;
            p.innerHTML = "x<style>" + cssText + "</style>";
            return parent.insertBefore(p.lastChild, parent.firstChild);
        }
        /**
         * Returns the value of `html5.elements` as an array.
         * @private
         * @returns {Array} An array of shived element node names.
         */
        function getElements() {
            var elements = html5.elements;
            return typeof elements == "string" ? elements.split(" ") : elements;
        }
        /**
         * Returns the data associated to the given document
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Object} An object of data.
         */
        function getExpandoData(ownerDocument) {
            var data = expandoData[ownerDocument[expando]];
            if (!data) {
                data = {};
                expanID++;
                ownerDocument[expando] = expanID;
                expandoData[expanID] = data;
            }
            return data;
        }
        /**
         * returns a shived element for the given nodeName and document
         * @memberOf html5
         * @param {String} nodeName name of the element
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived element.
         */
        function createElement(nodeName, ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createElement(nodeName);
            }
            if (!data) {
                data = getExpandoData(ownerDocument);
            }
            var node;
            if (data.cache[nodeName]) {
                node = data.cache[nodeName].cloneNode();
            } else if (saveClones.test(nodeName)) {
                node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
            } else {
                node = data.createElem(nodeName);
            }
            // Avoid adding some elements to fragments in IE < 9 because
            // * Attributes like `name` or `type` cannot be set/changed once an element
            //   is inserted into a document/fragment
            // * Link elements with `src` attributes that are inaccessible, as with
            //   a 403 response, will cause the tab/window to crash
            // * Script elements appended to fragments will execute when their `src`
            //   or `text` property is set
            return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }
        /**
         * returns a shived DocumentFragment for the given document
         * @memberOf html5
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived DocumentFragment.
         */
        function createDocumentFragment(ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createDocumentFragment();
            }
            data = data || getExpandoData(ownerDocument);
            var clone = data.frag.cloneNode(), i = 0, elems = getElements(), l = elems.length;
            for (;i < l; i++) {
                clone.createElement(elems[i]);
            }
            return clone;
        }
        /**
         * Shivs the `createElement` and `createDocumentFragment` methods of the document.
         * @private
         * @param {Document|DocumentFragment} ownerDocument The document.
         * @param {Object} data of the document.
         */
        function shivMethods(ownerDocument, data) {
            if (!data.cache) {
                data.cache = {};
                data.createElem = ownerDocument.createElement;
                data.createFrag = ownerDocument.createDocumentFragment;
                data.frag = data.createFrag();
            }
            ownerDocument.createElement = function(nodeName) {
                //abort shiv
                if (!html5.shivMethods) {
                    return data.createElem(nodeName);
                }
                return createElement(nodeName, ownerDocument, data);
            };
            ownerDocument.createDocumentFragment = Function("h,f", "return function(){" + "var n=f.cloneNode(),c=n.createElement;" + "h.shivMethods&&(" + // unroll the `createElement` calls
            getElements().join().replace(/[\w\-]+/g, function(nodeName) {
                data.createElem(nodeName);
                data.frag.createElement(nodeName);
                return 'c("' + nodeName + '")';
            }) + ");return n}")(html5, data.frag);
        }
        /*--------------------------------------------------------------------------*/
        /**
         * Shivs the given document.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function shivDocument(ownerDocument) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            var data = getExpandoData(ownerDocument);
            if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                data.hasCSS = !!addStyleSheet(ownerDocument, // corrects block display not defined in IE6/7/8/9
                "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}" + // adds styling not present in IE6/7/8/9
                "mark{background:#FF0;color:#000}" + // hides non-rendered elements
                "template{display:none}");
            }
            if (!supportsUnknownElements) {
                shivMethods(ownerDocument, data);
            }
            return ownerDocument;
        }
        /*--------------------------------------------------------------------------*/
        /**
         * The `html5` object is exposed so that more elements can be shived and
         * existing shiving can be detected on iframes.
         * @type Object
         * @example
         *
         * // options can be changed before the script is included
         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
         */
        var html5 = {
            /**
           * An array or space separated string of node names of the elements to shiv.
           * @memberOf html5
           * @type Array|String
           */
            elements: options.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
            /**
           * current version of html5shiv
           */
            version: version,
            /**
           * A flag to indicate that the HTML5 style sheet should be inserted.
           * @memberOf html5
           * @type Boolean
           */
            shivCSS: options.shivCSS !== false,
            /**
           * Is equal to true if a browser supports creating unknown/HTML5 elements
           * @memberOf html5
           * @type boolean
           */
            supportsUnknownElements: supportsUnknownElements,
            /**
           * A flag to indicate that the document's `createElement` and `createDocumentFragment`
           * methods should be overwritten.
           * @memberOf html5
           * @type Boolean
           */
            shivMethods: options.shivMethods !== false,
            /**
           * A string to describe the type of `html5` object ("default" or "default print").
           * @memberOf html5
           * @type String
           */
            type: "default",
            // shivs the document according to the specified `html5` object options
            shivDocument: shivDocument,
            //creates a shived element
            createElement: createElement,
            //creates a shived documentFragment
            createDocumentFragment: createDocumentFragment
        };
        /*--------------------------------------------------------------------------*/
        // expose html5
        window.html5 = html5;
        // shiv the document
        shivDocument(document);
    })(this, document);
    /*>>shiv*/
    // Assign private properties to the return object with prefix
    Modernizr._version = version;
    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    Modernizr._prefixes = prefixes;
    /*>>prefixes*/
    /*>>domprefixes*/
    Modernizr._domPrefixes = domPrefixes;
    Modernizr._cssomPrefixes = cssomPrefixes;
    /*>>domprefixes*/
    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq = testMediaQuery;
    /*>>mq*/
    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent = isEventSupported;
    /*>>hasevent*/
    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp = function(prop) {
        return testProps([ prop ]);
    };
    /*>>testprop*/
    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    Modernizr.testAllProps = testPropsAll;
    /*>>testallprops*/
    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles = injectElementWithStyles;
    /*>>teststyles*/
    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'
    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];
    Modernizr.prefixed = function(prop, obj, elem) {
        if (!obj) {
            return testPropsAll(prop, "pfx");
        } else {
            // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
            return testPropsAll(prop, obj, elem);
        }
    };
    /*>>prefixed*/
    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (// Add the new classes to the <html> element.
    enableClasses ? " js " + classes.join(" ") : "");
    /*>>cssclasses*/
    return Modernizr;
}(this, this.document);

var Swiper = function(selector, params) {
    "use strict";
    /*=========================
      A little bit dirty but required part for IE8 and old FF support
      ===========================*/
    if (!document.body.outerHTML && document.body.__defineGetter__) {
        if (HTMLElement) {
            var element = HTMLElement.prototype;
            if (element.__defineGetter__) {
                element.__defineGetter__("outerHTML", function() {
                    return new XMLSerializer().serializeToString(this);
                });
            }
        }
    }
    if (!window.getComputedStyle) {
        window.getComputedStyle = function(el, pseudo) {
            this.el = el;
            this.getPropertyValue = function(prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop === "float") prop = "styleFloat";
                if (re.test(prop)) {
                    prop = prop.replace(re, function() {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            };
            return this;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = start || 0, j = this.length; i < j; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    }
    if (!document.querySelectorAll) {
        if (!window.jQuery) return;
    }
    function $$(selector, context) {
        if (document.querySelectorAll) return (context || document).querySelectorAll(selector); else return jQuery(selector, context);
    }
    /*=========================
      Check for correct selector
      ===========================*/
    if (typeof selector === "undefined") return;
    if (!selector.nodeType) {
        if ($$(selector).length === 0) return;
    }
    /*=========================
      _this
      ===========================*/
    var _this = this;
    /*=========================
      Default Flags and vars
      ===========================*/
    _this.touches = {
        start: 0,
        startX: 0,
        startY: 0,
        current: 0,
        currentX: 0,
        currentY: 0,
        diff: 0,
        abs: 0
    };
    _this.positions = {
        start: 0,
        abs: 0,
        diff: 0,
        current: 0
    };
    _this.times = {
        start: 0,
        end: 0
    };
    _this.id = new Date().getTime();
    _this.container = selector.nodeType ? selector : $$(selector)[0];
    _this.isTouched = false;
    _this.isMoved = false;
    _this.activeIndex = 0;
    _this.centerIndex = 0;
    _this.activeLoaderIndex = 0;
    _this.activeLoopIndex = 0;
    _this.previousIndex = null;
    _this.velocity = 0;
    _this.snapGrid = [];
    _this.slidesGrid = [];
    _this.imagesToLoad = [];
    _this.imagesLoaded = 0;
    _this.wrapperLeft = 0;
    _this.wrapperRight = 0;
    _this.wrapperTop = 0;
    _this.wrapperBottom = 0;
    _this.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") >= 0;
    var wrapper, slideSize, wrapperSize, direction, isScrolling, containerSize;
    /*=========================
      Default Parameters
      ===========================*/
    var defaults = {
        eventTarget: "wrapper",
        // or 'container'
        mode: "horizontal",
        // or 'vertical'
        touchRatio: 1,
        speed: 300,
        freeMode: false,
        freeModeFluid: false,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerViewFit: true,
        //Fit to slide when spv "auto" and slides larger than container
        simulateTouch: true,
        followFinger: true,
        shortSwipes: true,
        longSwipesRatio: .5,
        moveStartThreshold: false,
        onlyExternal: false,
        createPagination: true,
        pagination: false,
        paginationElement: "span",
        paginationClickable: false,
        paginationAsRange: true,
        resistance: true,
        // or false or 100%
        scrollContainer: false,
        preventLinks: true,
        preventLinksPropagation: false,
        noSwiping: false,
        // or class
        noSwipingClass: "swiper-no-swiping",
        //:)
        initialSlide: 0,
        keyboardControl: false,
        mousewheelControl: false,
        mousewheelControlForceToAxis: false,
        useCSS3Transforms: true,
        // Autoplay
        autoplay: false,
        autoplayDisableOnInteraction: true,
        autoplayStopOnLast: false,
        //Loop mode
        loop: false,
        loopAdditionalSlides: 0,
        // Round length values
        roundLengths: false,
        //Auto Height
        calculateHeight: false,
        //Apply CSS for width and/or height
        cssWidthAndHeight: false,
        // or true or 'width' or 'height'
        //Images Preloader
        updateOnImagesReady: true,
        //Form elements
        releaseFormElements: true,
        //Watch for active slide, useful when use effects on different slide states
        watchActiveIndex: false,
        //Slides Visibility Fit
        visibilityFullFit: false,
        //Slides Offset
        offsetPxBefore: 0,
        offsetPxAfter: 0,
        offsetSlidesBefore: 0,
        offsetSlidesAfter: 0,
        centeredSlides: false,
        //Queue callbacks
        queueStartCallbacks: false,
        queueEndCallbacks: false,
        //Auto Resize
        autoResize: true,
        resizeReInit: false,
        //DOMAnimation
        DOMAnimation: true,
        //Slides Loader
        loader: {
            slides: [],
            //array with slides
            slidesHTMLType: "inner",
            // or 'outer'
            surroundGroups: 1,
            //keep preloaded slides groups around view
            logic: "reload",
            //or 'change'
            loadAllSlides: false
        },
        // One way swipes
        swipeToPrev: true,
        swipeToNext: true,
        //Namespace
        slideElement: "div",
        slideClass: "swiper-slide",
        slideActiveClass: "swiper-slide-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        wrapperClass: "swiper-wrapper",
        paginationElementClass: "swiper-pagination-switch",
        paginationActiveClass: "swiper-active-switch",
        paginationVisibleClass: "swiper-visible-switch"
    };
    params = params || {};
    for (var prop in defaults) {
        if (prop in params && typeof params[prop] === "object") {
            for (var subProp in defaults[prop]) {
                if (!(subProp in params[prop])) {
                    params[prop][subProp] = defaults[prop][subProp];
                }
            }
        } else if (!(prop in params)) {
            params[prop] = defaults[prop];
        }
    }
    _this.params = params;
    if (params.scrollContainer) {
        params.freeMode = true;
        params.freeModeFluid = true;
    }
    if (params.loop) {
        params.resistance = "100%";
    }
    var isH = params.mode === "horizontal";
    /*=========================
      Define Touch Events
      ===========================*/
    var desktopEvents = [ "mousedown", "mousemove", "mouseup" ];
    if (_this.browser.ie10) desktopEvents = [ "MSPointerDown", "MSPointerMove", "MSPointerUp" ];
    if (_this.browser.ie11) desktopEvents = [ "pointerdown", "pointermove", "pointerup" ];
    _this.touchEvents = {
        touchStart: _this.support.touch || !params.simulateTouch ? "touchstart" : desktopEvents[0],
        touchMove: _this.support.touch || !params.simulateTouch ? "touchmove" : desktopEvents[1],
        touchEnd: _this.support.touch || !params.simulateTouch ? "touchend" : desktopEvents[2]
    };
    /*=========================
      Wrapper
      ===========================*/
    for (var i = _this.container.childNodes.length - 1; i >= 0; i--) {
        if (_this.container.childNodes[i].className) {
            var _wrapperClasses = _this.container.childNodes[i].className.split(/\s+/);
            for (var j = 0; j < _wrapperClasses.length; j++) {
                if (_wrapperClasses[j] === params.wrapperClass) {
                    wrapper = _this.container.childNodes[i];
                }
            }
        }
    }
    _this.wrapper = wrapper;
    /*=========================
      Slide API
      ===========================*/
    _this._extendSwiperSlide = function(el) {
        el.append = function() {
            if (params.loop) {
                el.insertAfter(_this.slides.length - _this.loopedSlides);
            } else {
                _this.wrapper.appendChild(el);
                _this.reInit();
            }
            return el;
        };
        el.prepend = function() {
            if (params.loop) {
                _this.wrapper.insertBefore(el, _this.slides[_this.loopedSlides]);
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            } else {
                _this.wrapper.insertBefore(el, _this.wrapper.firstChild);
            }
            _this.reInit();
            return el;
        };
        el.insertAfter = function(index) {
            if (typeof index === "undefined") return false;
            var beforeSlide;
            if (params.loop) {
                beforeSlide = _this.slides[index + 1 + _this.loopedSlides];
                if (beforeSlide) {
                    _this.wrapper.insertBefore(el, beforeSlide);
                } else {
                    _this.wrapper.appendChild(el);
                }
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            } else {
                beforeSlide = _this.slides[index + 1];
                _this.wrapper.insertBefore(el, beforeSlide);
            }
            _this.reInit();
            return el;
        };
        el.clone = function() {
            return _this._extendSwiperSlide(el.cloneNode(true));
        };
        el.remove = function() {
            _this.wrapper.removeChild(el);
            _this.reInit();
        };
        el.html = function(html) {
            if (typeof html === "undefined") {
                return el.innerHTML;
            } else {
                el.innerHTML = html;
                return el;
            }
        };
        el.index = function() {
            var index;
            for (var i = _this.slides.length - 1; i >= 0; i--) {
                if (el === _this.slides[i]) index = i;
            }
            return index;
        };
        el.isActive = function() {
            if (el.index() === _this.activeIndex) return true; else return false;
        };
        if (!el.swiperSlideDataStorage) el.swiperSlideDataStorage = {};
        el.getData = function(name) {
            return el.swiperSlideDataStorage[name];
        };
        el.setData = function(name, value) {
            el.swiperSlideDataStorage[name] = value;
            return el;
        };
        el.data = function(name, value) {
            if (typeof value === "undefined") {
                return el.getAttribute("data-" + name);
            } else {
                el.setAttribute("data-" + name, value);
                return el;
            }
        };
        el.getWidth = function(outer, round) {
            return _this.h.getWidth(el, outer, round);
        };
        el.getHeight = function(outer, round) {
            return _this.h.getHeight(el, outer, round);
        };
        el.getOffset = function() {
            return _this.h.getOffset(el);
        };
        return el;
    };
    //Calculate information about number of slides
    _this.calcSlides = function(forceCalcSlides) {
        var oldNumber = _this.slides ? _this.slides.length : false;
        _this.slides = [];
        _this.displaySlides = [];
        for (var i = 0; i < _this.wrapper.childNodes.length; i++) {
            if (_this.wrapper.childNodes[i].className) {
                var _className = _this.wrapper.childNodes[i].className;
                var _slideClasses = _className.split(/\s+/);
                for (var j = 0; j < _slideClasses.length; j++) {
                    if (_slideClasses[j] === params.slideClass) {
                        _this.slides.push(_this.wrapper.childNodes[i]);
                    }
                }
            }
        }
        for (i = _this.slides.length - 1; i >= 0; i--) {
            _this._extendSwiperSlide(_this.slides[i]);
        }
        if (oldNumber === false) return;
        if (oldNumber !== _this.slides.length || forceCalcSlides) {
            // Number of slides has been changed
            removeSlideEvents();
            addSlideEvents();
            _this.updateActiveSlide();
            if (_this.params.pagination) _this.createPagination();
            _this.callPlugins("numberOfSlidesChanged");
        }
    };
    //Create Slide
    _this.createSlide = function(html, slideClassList, el) {
        slideClassList = slideClassList || _this.params.slideClass;
        el = el || params.slideElement;
        var newSlide = document.createElement(el);
        newSlide.innerHTML = html || "";
        newSlide.className = slideClassList;
        return _this._extendSwiperSlide(newSlide);
    };
    //Append Slide
    _this.appendSlide = function(html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).append();
        } else {
            return _this.createSlide(html, slideClassList, el).append();
        }
    };
    _this.prependSlide = function(html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).prepend();
        } else {
            return _this.createSlide(html, slideClassList, el).prepend();
        }
    };
    _this.insertSlideAfter = function(index, html, slideClassList, el) {
        if (typeof index === "undefined") return false;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).insertAfter(index);
        } else {
            return _this.createSlide(html, slideClassList, el).insertAfter(index);
        }
    };
    _this.removeSlide = function(index) {
        if (_this.slides[index]) {
            if (params.loop) {
                if (!_this.slides[index + _this.loopedSlides]) return false;
                _this.slides[index + _this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            } else _this.slides[index].remove();
            return true;
        } else return false;
    };
    _this.removeLastSlide = function() {
        if (_this.slides.length > 0) {
            if (params.loop) {
                _this.slides[_this.slides.length - 1 - _this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            } else _this.slides[_this.slides.length - 1].remove();
            return true;
        } else {
            return false;
        }
    };
    _this.removeAllSlides = function() {
        var num = _this.slides.length;
        for (var i = _this.slides.length - 1; i >= 0; i--) {
            _this.slides[i].remove();
            if (i === num - 1) {
                _this.setWrapperTranslate(0);
            }
        }
    };
    _this.getSlide = function(index) {
        return _this.slides[index];
    };
    _this.getLastSlide = function() {
        return _this.slides[_this.slides.length - 1];
    };
    _this.getFirstSlide = function() {
        return _this.slides[0];
    };
    //Currently Active Slide
    _this.activeSlide = function() {
        return _this.slides[_this.activeIndex];
    };
    /*=========================
     Wrapper for Callbacks : Allows additive callbacks via function arrays
     ===========================*/
    _this.fireCallback = function() {
        var callback = arguments[0];
        if (Object.prototype.toString.call(callback) === "[object Array]") {
            for (var i = 0; i < callback.length; i++) {
                if (typeof callback[i] === "function") {
                    callback[i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        } else if (Object.prototype.toString.call(callback) === "[object String]") {
            if (params["on" + callback]) _this.fireCallback(params["on" + callback], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        } else {
            callback(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
    };
    function isArray(obj) {
        if (Object.prototype.toString.apply(obj) === "[object Array]") return true;
        return false;
    }
    /**
     * Allows user to add callbacks, rather than replace them
     * @param callback
     * @param func
     * @return {*}
     */
    _this.addCallback = function(callback, func) {
        var _this = this, tempFunc;
        if (_this.params["on" + callback]) {
            if (isArray(this.params["on" + callback])) {
                return this.params["on" + callback].push(func);
            } else if (typeof this.params["on" + callback] === "function") {
                tempFunc = this.params["on" + callback];
                this.params["on" + callback] = [];
                this.params["on" + callback].push(tempFunc);
                return this.params["on" + callback].push(func);
            }
        } else {
            this.params["on" + callback] = [];
            return this.params["on" + callback].push(func);
        }
    };
    _this.removeCallbacks = function(callback) {
        if (_this.params["on" + callback]) {
            _this.params["on" + callback] = null;
        }
    };
    /*=========================
      Plugins API
      ===========================*/
    var _plugins = [];
    for (var plugin in _this.plugins) {
        if (params[plugin]) {
            var p = _this.plugins[plugin](_this, params[plugin]);
            if (p) _plugins.push(p);
        }
    }
    _this.callPlugins = function(method, args) {
        if (!args) args = {};
        for (var i = 0; i < _plugins.length; i++) {
            if (method in _plugins[i]) {
                _plugins[i][method](args);
            }
        }
    };
    /*=========================
      Windows Phone 8 Fix
      ===========================*/
    if ((_this.browser.ie10 || _this.browser.ie11) && !params.onlyExternal) {
        _this.wrapper.classList.add("swiper-wp8-" + (isH ? "horizontal" : "vertical"));
    }
    /*=========================
      Free Mode Class
      ===========================*/
    if (params.freeMode) {
        _this.container.className += " swiper-free-mode";
    }
    /*==================================================
        Init/Re-init/Resize Fix
    ====================================================*/
    _this.initialized = false;
    _this.init = function(force, forceCalcSlides) {
        var _width = _this.h.getWidth(_this.container, false, params.roundLengths);
        var _height = _this.h.getHeight(_this.container, false, params.roundLengths);
        if (_width === _this.width && _height === _this.height && !force) return;
        _this.width = _width;
        _this.height = _height;
        var slideWidth, slideHeight, slideMaxHeight, wrapperWidth, wrapperHeight, slideLeft;
        var i;
        // loop index variable to avoid JSHint W004 / W038
        containerSize = isH ? _width : _height;
        var wrapper = _this.wrapper;
        if (force) {
            _this.calcSlides(forceCalcSlides);
        }
        if (params.slidesPerView === "auto") {
            //Auto mode
            var slidesWidth = 0;
            var slidesHeight = 0;
            //Unset Styles
            if (params.slidesOffset > 0) {
                wrapper.style.paddingLeft = "";
                wrapper.style.paddingRight = "";
                wrapper.style.paddingTop = "";
                wrapper.style.paddingBottom = "";
            }
            wrapper.style.width = "";
            wrapper.style.height = "";
            if (params.offsetPxBefore > 0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore; else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter > 0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter; else _this.wrapperBottom = params.offsetPxAfter;
            }
            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - this.slides[0].getWidth(true, params.roundLengths)) / 2;
                    _this.wrapperRight = (containerSize - _this.slides[_this.slides.length - 1].getWidth(true, params.roundLengths)) / 2;
                } else {
                    _this.wrapperTop = (containerSize - _this.slides[0].getHeight(true, params.roundLengths)) / 2;
                    _this.wrapperBottom = (containerSize - _this.slides[_this.slides.length - 1].getHeight(true, params.roundLengths)) / 2;
                }
            }
            if (isH) {
                if (_this.wrapperLeft >= 0) wrapper.style.paddingLeft = _this.wrapperLeft + "px";
                if (_this.wrapperRight >= 0) wrapper.style.paddingRight = _this.wrapperRight + "px";
            } else {
                if (_this.wrapperTop >= 0) wrapper.style.paddingTop = _this.wrapperTop + "px";
                if (_this.wrapperBottom >= 0) wrapper.style.paddingBottom = _this.wrapperBottom + "px";
            }
            slideLeft = 0;
            var centeredSlideLeft = 0;
            _this.snapGrid = [];
            _this.slidesGrid = [];
            slideMaxHeight = 0;
            for (i = 0; i < _this.slides.length; i++) {
                slideWidth = _this.slides[i].getWidth(true, params.roundLengths);
                slideHeight = _this.slides[i].getHeight(true, params.roundLengths);
                if (params.calculateHeight) {
                    slideMaxHeight = Math.max(slideMaxHeight, slideHeight);
                }
                var _slideSize = isH ? slideWidth : slideHeight;
                if (params.centeredSlides) {
                    var nextSlideWidth = i === _this.slides.length - 1 ? 0 : _this.slides[i + 1].getWidth(true, params.roundLengths);
                    var nextSlideHeight = i === _this.slides.length - 1 ? 0 : _this.slides[i + 1].getHeight(true, params.roundLengths);
                    var nextSlideSize = isH ? nextSlideWidth : nextSlideHeight;
                    if (_slideSize > containerSize) {
                        if (params.slidesPerViewFit) {
                            _this.snapGrid.push(slideLeft + _this.wrapperLeft);
                            _this.snapGrid.push(slideLeft + _slideSize - containerSize + _this.wrapperLeft);
                        } else {
                            for (var j = 0; j <= Math.floor(_slideSize / (containerSize + _this.wrapperLeft)); j++) {
                                if (j === 0) _this.snapGrid.push(slideLeft + _this.wrapperLeft); else _this.snapGrid.push(slideLeft + _this.wrapperLeft + containerSize * j);
                            }
                        }
                        _this.slidesGrid.push(slideLeft + _this.wrapperLeft);
                    } else {
                        _this.snapGrid.push(centeredSlideLeft);
                        _this.slidesGrid.push(centeredSlideLeft);
                    }
                    centeredSlideLeft += _slideSize / 2 + nextSlideSize / 2;
                } else {
                    if (_slideSize > containerSize) {
                        if (params.slidesPerViewFit) {
                            _this.snapGrid.push(slideLeft);
                            _this.snapGrid.push(slideLeft + _slideSize - containerSize);
                        } else {
                            if (containerSize !== 0) {
                                for (var k = 0; k <= Math.floor(_slideSize / containerSize); k++) {
                                    _this.snapGrid.push(slideLeft + containerSize * k);
                                }
                            } else {
                                _this.snapGrid.push(slideLeft);
                            }
                        }
                    } else {
                        _this.snapGrid.push(slideLeft);
                    }
                    _this.slidesGrid.push(slideLeft);
                }
                slideLeft += _slideSize;
                slidesWidth += slideWidth;
                slidesHeight += slideHeight;
            }
            if (params.calculateHeight) _this.height = slideMaxHeight;
            if (isH) {
                wrapperSize = slidesWidth + _this.wrapperRight + _this.wrapperLeft;
                if (!params.cssWidthAndHeight || params.cssWidthAndHeight === "height") {
                    wrapper.style.width = slidesWidth + "px";
                }
                if (!params.cssWidthAndHeight || params.cssWidthAndHeight === "width") {
                    wrapper.style.height = _this.height + "px";
                }
            } else {
                if (!params.cssWidthAndHeight || params.cssWidthAndHeight === "height") {
                    wrapper.style.width = _this.width + "px";
                }
                if (!params.cssWidthAndHeight || params.cssWidthAndHeight === "width") {
                    wrapper.style.height = slidesHeight + "px";
                }
                wrapperSize = slidesHeight + _this.wrapperTop + _this.wrapperBottom;
            }
        } else if (params.scrollContainer) {
            //Scroll Container
            wrapper.style.width = "";
            wrapper.style.height = "";
            wrapperWidth = _this.slides[0].getWidth(true, params.roundLengths);
            wrapperHeight = _this.slides[0].getHeight(true, params.roundLengths);
            wrapperSize = isH ? wrapperWidth : wrapperHeight;
            wrapper.style.width = wrapperWidth + "px";
            wrapper.style.height = wrapperHeight + "px";
            slideSize = isH ? wrapperWidth : wrapperHeight;
        } else {
            //For usual slides
            if (params.calculateHeight) {
                slideMaxHeight = 0;
                wrapperHeight = 0;
                //ResetWrapperSize
                if (!isH) _this.container.style.height = "";
                wrapper.style.height = "";
                for (i = 0; i < _this.slides.length; i++) {
                    //ResetSlideSize
                    _this.slides[i].style.height = "";
                    slideMaxHeight = Math.max(_this.slides[i].getHeight(true), slideMaxHeight);
                    if (!isH) wrapperHeight += _this.slides[i].getHeight(true);
                }
                slideHeight = slideMaxHeight;
                _this.height = slideHeight;
                if (isH) wrapperHeight = slideHeight; else {
                    containerSize = slideHeight;
                    _this.container.style.height = containerSize + "px";
                }
            } else {
                slideHeight = isH ? _this.height : _this.height / params.slidesPerView;
                if (params.roundLengths) slideHeight = Math.ceil(slideHeight);
                wrapperHeight = isH ? _this.height : _this.slides.length * slideHeight;
            }
            slideWidth = isH ? _this.width / params.slidesPerView : _this.width;
            if (params.roundLengths) slideWidth = Math.ceil(slideWidth);
            wrapperWidth = isH ? _this.slides.length * slideWidth : _this.width;
            slideSize = isH ? slideWidth : slideHeight;
            if (params.offsetSlidesBefore > 0) {
                if (isH) _this.wrapperLeft = slideSize * params.offsetSlidesBefore; else _this.wrapperTop = slideSize * params.offsetSlidesBefore;
            }
            if (params.offsetSlidesAfter > 0) {
                if (isH) _this.wrapperRight = slideSize * params.offsetSlidesAfter; else _this.wrapperBottom = slideSize * params.offsetSlidesAfter;
            }
            if (params.offsetPxBefore > 0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore; else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter > 0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter; else _this.wrapperBottom = params.offsetPxAfter;
            }
            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - slideSize) / 2;
                    _this.wrapperRight = (containerSize - slideSize) / 2;
                } else {
                    _this.wrapperTop = (containerSize - slideSize) / 2;
                    _this.wrapperBottom = (containerSize - slideSize) / 2;
                }
            }
            if (isH) {
                if (_this.wrapperLeft > 0) wrapper.style.paddingLeft = _this.wrapperLeft + "px";
                if (_this.wrapperRight > 0) wrapper.style.paddingRight = _this.wrapperRight + "px";
            } else {
                if (_this.wrapperTop > 0) wrapper.style.paddingTop = _this.wrapperTop + "px";
                if (_this.wrapperBottom > 0) wrapper.style.paddingBottom = _this.wrapperBottom + "px";
            }
            wrapperSize = isH ? wrapperWidth + _this.wrapperRight + _this.wrapperLeft : wrapperHeight + _this.wrapperTop + _this.wrapperBottom;
            if (parseFloat(wrapperWidth) > 0 && (!params.cssWidthAndHeight || params.cssWidthAndHeight === "height")) {
                wrapper.style.width = wrapperWidth + "px";
            }
            if (parseFloat(wrapperHeight) > 0 && (!params.cssWidthAndHeight || params.cssWidthAndHeight === "width")) {
                wrapper.style.height = wrapperHeight + "px";
            }
            slideLeft = 0;
            _this.snapGrid = [];
            _this.slidesGrid = [];
            for (i = 0; i < _this.slides.length; i++) {
                _this.snapGrid.push(slideLeft);
                _this.slidesGrid.push(slideLeft);
                slideLeft += slideSize;
                if (parseFloat(slideWidth) > 0 && (!params.cssWidthAndHeight || params.cssWidthAndHeight === "height")) {
                    _this.slides[i].style.width = slideWidth + "px";
                }
                if (parseFloat(slideHeight) > 0 && (!params.cssWidthAndHeight || params.cssWidthAndHeight === "width")) {
                    _this.slides[i].style.height = slideHeight + "px";
                }
            }
        }
        if (!_this.initialized) {
            _this.callPlugins("onFirstInit");
            if (params.onFirstInit) _this.fireCallback(params.onFirstInit, _this);
        } else {
            _this.callPlugins("onInit");
            if (params.onInit) _this.fireCallback(params.onInit, _this);
        }
        _this.initialized = true;
    };
    _this.reInit = function(forceCalcSlides) {
        _this.init(true, forceCalcSlides);
    };
    _this.resizeFix = function(reInit) {
        _this.callPlugins("beforeResizeFix");
        _this.init(params.resizeReInit || reInit);
        // swipe to active slide in fixed mode
        if (!params.freeMode) {
            _this.swipeTo(params.loop ? _this.activeLoopIndex : _this.activeIndex, 0, false);
            // Fix autoplay
            if (params.autoplay) {
                if (_this.support.transitions && typeof autoplayTimeoutId !== "undefined") {
                    if (typeof autoplayTimeoutId !== "undefined") {
                        clearTimeout(autoplayTimeoutId);
                        autoplayTimeoutId = undefined;
                        _this.startAutoplay();
                    }
                } else {
                    if (typeof autoplayIntervalId !== "undefined") {
                        clearInterval(autoplayIntervalId);
                        autoplayIntervalId = undefined;
                        _this.startAutoplay();
                    }
                }
            }
        } else if (_this.getWrapperTranslate() < -maxWrapperPosition()) {
            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(-maxWrapperPosition());
        }
        _this.callPlugins("afterResizeFix");
    };
    /*==========================================
        Max and Min Positions
    ============================================*/
    function maxWrapperPosition() {
        var a = wrapperSize - containerSize;
        if (params.freeMode) {
            a = wrapperSize - containerSize;
        }
        // if (params.loop) a -= containerSize;
        if (params.slidesPerView > _this.slides.length && !params.centeredSlides) {
            a = 0;
        }
        if (a < 0) a = 0;
        return a;
    }
    /*==========================================
        Event Listeners
    ============================================*/
    function initEvents() {
        var bind = _this.h.addEventListener;
        var eventTarget = params.eventTarget === "wrapper" ? _this.wrapper : _this.container;
        //Touch Events
        if (!(_this.browser.ie10 || _this.browser.ie11)) {
            if (_this.support.touch) {
                bind(eventTarget, "touchstart", onTouchStart);
                bind(eventTarget, "touchmove", onTouchMove);
                bind(eventTarget, "touchend", onTouchEnd);
            }
            if (params.simulateTouch) {
                bind(eventTarget, "mousedown", onTouchStart);
                bind(document, "mousemove", onTouchMove);
                bind(document, "mouseup", onTouchEnd);
            }
        } else {
            bind(eventTarget, _this.touchEvents.touchStart, onTouchStart);
            bind(document, _this.touchEvents.touchMove, onTouchMove);
            bind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }
        //Resize Event
        if (params.autoResize) {
            bind(window, "resize", _this.resizeFix);
        }
        //Slide Events
        addSlideEvents();
        //Mousewheel
        _this._wheelEvent = false;
        if (params.mousewheelControl) {
            if (document.onmousewheel !== undefined) {
                _this._wheelEvent = "mousewheel";
            }
            if (!_this._wheelEvent) {
                try {
                    new WheelEvent("wheel");
                    _this._wheelEvent = "wheel";
                } catch (e) {}
            }
            if (!_this._wheelEvent) {
                _this._wheelEvent = "DOMMouseScroll";
            }
            if (_this._wheelEvent) {
                bind(_this.container, _this._wheelEvent, handleMousewheel);
            }
        }
        //Keyboard
        function _loadImage(img) {
            var image, src;
            var onReady = function() {
                if (typeof _this === "undefined" || _this === null) return;
                if (_this.imagesLoaded !== undefined) _this.imagesLoaded++;
                if (_this.imagesLoaded === _this.imagesToLoad.length) {
                    _this.reInit();
                    if (params.onImagesReady) _this.fireCallback(params.onImagesReady, _this);
                }
            };
            if (!img.complete) {
                src = img.currentSrc || img.getAttribute("src");
                if (src) {
                    image = new Image();
                    image.onload = onReady;
                    image.onerror = onReady;
                    image.src = src;
                } else {
                    onReady();
                }
            } else {
                //image already loaded...
                onReady();
            }
        }
        if (params.keyboardControl) {
            bind(document, "keydown", handleKeyboardKeys);
        }
        if (params.updateOnImagesReady) {
            _this.imagesToLoad = $$("img", _this.container);
            for (var i = 0; i < _this.imagesToLoad.length; i++) {
                _loadImage(_this.imagesToLoad[i]);
            }
        }
    }
    //Remove Event Listeners
    _this.destroy = function(removeStyles) {
        var unbind = _this.h.removeEventListener;
        var eventTarget = params.eventTarget === "wrapper" ? _this.wrapper : _this.container;
        //Touch Events
        if (!(_this.browser.ie10 || _this.browser.ie11)) {
            if (_this.support.touch) {
                unbind(eventTarget, "touchstart", onTouchStart);
                unbind(eventTarget, "touchmove", onTouchMove);
                unbind(eventTarget, "touchend", onTouchEnd);
            }
            if (params.simulateTouch) {
                unbind(eventTarget, "mousedown", onTouchStart);
                unbind(document, "mousemove", onTouchMove);
                unbind(document, "mouseup", onTouchEnd);
            }
        } else {
            unbind(eventTarget, _this.touchEvents.touchStart, onTouchStart);
            unbind(document, _this.touchEvents.touchMove, onTouchMove);
            unbind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }
        //Resize Event
        if (params.autoResize) {
            unbind(window, "resize", _this.resizeFix);
        }
        //Init Slide Events
        removeSlideEvents();
        //Pagination
        if (params.paginationClickable) {
            removePaginationEvents();
        }
        //Mousewheel
        if (params.mousewheelControl && _this._wheelEvent) {
            unbind(_this.container, _this._wheelEvent, handleMousewheel);
        }
        //Keyboard
        if (params.keyboardControl) {
            unbind(document, "keydown", handleKeyboardKeys);
        }
        //Stop autoplay
        if (params.autoplay) {
            _this.stopAutoplay();
        }
        // Remove styles
        if (removeStyles) {
            _this.wrapper.removeAttribute("style");
            for (var i = 0; i < _this.slides.length; i++) {
                _this.slides[i].removeAttribute("style");
            }
        }
        // Plugins
        _this.callPlugins("onDestroy");
        // Check jQuery/Zepto data
        if (window.jQuery && window.jQuery(_this.container).data("swiper")) {
            window.jQuery(_this.container).removeData("swiper");
        }
        if (window.Zepto && window.Zepto(_this.container).data("swiper")) {
            window.Zepto(_this.container).removeData("swiper");
        }
        //Destroy variable
        _this = null;
    };
    function addSlideEvents() {
        var bind = _this.h.addEventListener, i;
        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$("a", _this.container);
            for (i = 0; i < links.length; i++) {
                bind(links[i], "click", preventClick);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$("input, textarea, select", _this.container);
            for (i = 0; i < formElements.length; i++) {
                bind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
                if (_this.support.touch && params.simulateTouch) {
                    bind(formElements[i], "mousedown", releaseForms, true);
                }
            }
        }
        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i = 0; i < _this.slides.length; i++) {
                bind(_this.slides[i], "click", slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i = 0; i < _this.slides.length; i++) {
                bind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
    }
    function removeSlideEvents() {
        var unbind = _this.h.removeEventListener, i;
        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i = 0; i < _this.slides.length; i++) {
                unbind(_this.slides[i], "click", slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i = 0; i < _this.slides.length; i++) {
                unbind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$("input, textarea, select", _this.container);
            for (i = 0; i < formElements.length; i++) {
                unbind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
                if (_this.support.touch && params.simulateTouch) {
                    unbind(formElements[i], "mousedown", releaseForms, true);
                }
            }
        }
        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$("a", _this.container);
            for (i = 0; i < links.length; i++) {
                unbind(links[i], "click", preventClick);
            }
        }
    }
    /*==========================================
        Keyboard Control
    ============================================*/
    function handleKeyboardKeys(e) {
        var kc = e.keyCode || e.charCode;
        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
        if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
            var inView = false;
            //Check that swiper should be inside of visible area of window
            var swiperOffset = _this.h.getOffset(_this.container);
            var scrollLeft = _this.h.windowScroll().left;
            var scrollTop = _this.h.windowScroll().top;
            var windowWidth = _this.h.windowWidth();
            var windowHeight = _this.h.windowHeight();
            var swiperCoord = [ [ swiperOffset.left, swiperOffset.top ], [ swiperOffset.left + _this.width, swiperOffset.top ], [ swiperOffset.left, swiperOffset.top + _this.height ], [ swiperOffset.left + _this.width, swiperOffset.top + _this.height ] ];
            for (var i = 0; i < swiperCoord.length; i++) {
                var point = swiperCoord[i];
                if (point[0] >= scrollLeft && point[0] <= scrollLeft + windowWidth && point[1] >= scrollTop && point[1] <= scrollTop + windowHeight) {
                    inView = true;
                }
            }
            if (!inView) return;
        }
        if (isH) {
            if (kc === 37 || kc === 39) {
                if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
            }
            if (kc === 39) _this.swipeNext();
            if (kc === 37) _this.swipePrev();
        } else {
            if (kc === 38 || kc === 40) {
                if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
            }
            if (kc === 40) _this.swipeNext();
            if (kc === 38) _this.swipePrev();
        }
    }
    _this.disableKeyboardControl = function() {
        params.keyboardControl = false;
        _this.h.removeEventListener(document, "keydown", handleKeyboardKeys);
    };
    _this.enableKeyboardControl = function() {
        params.keyboardControl = true;
        _this.h.addEventListener(document, "keydown", handleKeyboardKeys);
    };
    /*==========================================
        Mousewheel Control
    ============================================*/
    var lastScrollTime = new Date().getTime();
    function handleMousewheel(e) {
        var we = _this._wheelEvent;
        var delta = 0;
        //Opera & IE
        if (e.detail) delta = -e.detail; else if (we === "mousewheel") {
            if (params.mousewheelControlForceToAxis) {
                if (isH) {
                    if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) delta = e.wheelDeltaX; else return;
                } else {
                    if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)) delta = e.wheelDeltaY; else return;
                }
            } else {
                delta = e.wheelDelta;
            }
        } else if (we === "DOMMouseScroll") delta = -e.detail; else if (we === "wheel") {
            if (params.mousewheelControlForceToAxis) {
                if (isH) {
                    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) delta = -e.deltaX; else return;
                } else {
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) delta = -e.deltaY; else return;
                }
            } else {
                delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX : -e.deltaY;
            }
        }
        if (!params.freeMode) {
            if (new Date().getTime() - lastScrollTime > 60) {
                if (delta < 0) _this.swipeNext(); else _this.swipePrev();
            }
            lastScrollTime = new Date().getTime();
        } else {
            //Freemode or scrollContainer:
            var position = _this.getWrapperTranslate() + delta;
            if (position > 0) position = 0;
            if (position < -maxWrapperPosition()) position = -maxWrapperPosition();
            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(position);
            _this.updateActiveSlide(position);
            // Return page scroll on edge positions
            if (position === 0 || position === -maxWrapperPosition()) return;
        }
        if (params.autoplay) _this.stopAutoplay(true);
        if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
        return false;
    }
    _this.disableMousewheelControl = function() {
        if (!_this._wheelEvent) return false;
        params.mousewheelControl = false;
        _this.h.removeEventListener(_this.container, _this._wheelEvent, handleMousewheel);
        return true;
    };
    _this.enableMousewheelControl = function() {
        if (!_this._wheelEvent) return false;
        params.mousewheelControl = true;
        _this.h.addEventListener(_this.container, _this._wheelEvent, handleMousewheel);
        return true;
    };
    /*=========================
      Grab Cursor
      ===========================*/
    if (params.grabCursor) {
        var containerStyle = _this.container.style;
        containerStyle.cursor = "move";
        containerStyle.cursor = "grab";
        containerStyle.cursor = "-moz-grab";
        containerStyle.cursor = "-webkit-grab";
    }
    /*=========================
      Slides Events Handlers
      ===========================*/
    _this.allowSlideClick = true;
    function slideClick(event) {
        if (_this.allowSlideClick) {
            setClickedSlide(event);
            _this.fireCallback(params.onSlideClick, _this, event);
        }
    }
    function slideTouch(event) {
        setClickedSlide(event);
        _this.fireCallback(params.onSlideTouch, _this, event);
    }
    function setClickedSlide(event) {
        // IE 6-8 support
        if (!event.currentTarget) {
            var element = event.srcElement;
            do {
                if (element.className.indexOf(params.slideClass) > -1) {
                    break;
                }
                element = element.parentNode;
            } while (element);
            _this.clickedSlide = element;
        } else {
            _this.clickedSlide = event.currentTarget;
        }
        _this.clickedSlideIndex = _this.slides.indexOf(_this.clickedSlide);
        _this.clickedSlideLoopIndex = _this.clickedSlideIndex - (_this.loopedSlides || 0);
    }
    _this.allowLinks = true;
    function preventClick(e) {
        if (!_this.allowLinks) {
            if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
            if (params.preventLinksPropagation && "stopPropagation" in e) {
                e.stopPropagation();
            }
            return false;
        }
    }
    function releaseForms(e) {
        if (e.stopPropagation) e.stopPropagation(); else e.returnValue = false;
        return false;
    }
    /*==================================================
        Event Handlers
    ====================================================*/
    var isTouchEvent = false;
    var allowThresholdMove;
    var allowMomentumBounce = true;
    function onTouchStart(event) {
        if (params.preventLinks) _this.allowLinks = true;
        //Exit if slider is already was touched
        if (_this.isTouched || params.onlyExternal) {
            return false;
        }
        // Blur active elements
        var eventTarget = event.target || event.srcElement;
        if (document.activeElement && document.activeElement !== document.body) {
            if (document.activeElement !== eventTarget) document.activeElement.blur();
        }
        // Form tag names
        var formTagNames = "input select textarea".split(" ");
        // Check for no swiping
        if (params.noSwiping && eventTarget && noSwipingSlide(eventTarget)) return false;
        allowMomentumBounce = false;
        //Check For Nested Swipers
        _this.isTouched = true;
        isTouchEvent = event.type === "touchstart";
        // prevent user enter with right and the swiper move (needs isTouchEvent)
        if (!isTouchEvent && "which" in event && event.which === 3) {
            _this.isTouched = false;
            return false;
        }
        if (!isTouchEvent || event.targetTouches.length === 1) {
            _this.callPlugins("onTouchStartBegin");
            if (!isTouchEvent && !_this.isAndroid && formTagNames.indexOf(eventTarget.tagName.toLowerCase()) < 0) {
                if (event.preventDefault) event.preventDefault(); else event.returnValue = false;
            }
            var pageX = isTouchEvent ? event.targetTouches[0].pageX : event.pageX || event.clientX;
            var pageY = isTouchEvent ? event.targetTouches[0].pageY : event.pageY || event.clientY;
            //Start Touches to check the scrolling
            _this.touches.startX = _this.touches.currentX = pageX;
            _this.touches.startY = _this.touches.currentY = pageY;
            _this.touches.start = _this.touches.current = isH ? pageX : pageY;
            //Set Transition Time to 0
            _this.setWrapperTransition(0);
            //Get Start Translate Position
            _this.positions.start = _this.positions.current = _this.getWrapperTranslate();
            //Set Transform
            _this.setWrapperTranslate(_this.positions.start);
            //TouchStartTime
            _this.times.start = new Date().getTime();
            //Unset Scrolling
            isScrolling = undefined;
            //Set Treshold
            if (params.moveStartThreshold > 0) {
                allowThresholdMove = false;
            }
            //CallBack
            if (params.onTouchStart) _this.fireCallback(params.onTouchStart, _this, event);
            _this.callPlugins("onTouchStartEnd");
        }
    }
    var velocityPrevPosition, velocityPrevTime;
    function onTouchMove(event) {
        // If slider is not touched - exit
        if (!_this.isTouched || params.onlyExternal) return;
        if (isTouchEvent && event.type === "mousemove") return;
        var pageX = isTouchEvent ? event.targetTouches[0].pageX : event.pageX || event.clientX;
        var pageY = isTouchEvent ? event.targetTouches[0].pageY : event.pageY || event.clientY;
        //check for scrolling
        if (typeof isScrolling === "undefined" && isH) {
            isScrolling = !!(isScrolling || Math.abs(pageY - _this.touches.startY) > Math.abs(pageX - _this.touches.startX));
        }
        if (typeof isScrolling === "undefined" && !isH) {
            isScrolling = !!(isScrolling || Math.abs(pageY - _this.touches.startY) < Math.abs(pageX - _this.touches.startX));
        }
        if (isScrolling) {
            _this.isTouched = false;
            return;
        }
        // One way swipes
        if (isH) {
            if (!params.swipeToNext && pageX < _this.touches.startX || !params.swipeToPrev && pageX > _this.touches.startX) {
                return;
            }
        } else {
            if (!params.swipeToNext && pageY < _this.touches.startY || !params.swipeToPrev && pageY > _this.touches.startY) {
                return;
            }
        }
        //Check For Nested Swipers
        if (event.assignedToSwiper) {
            _this.isTouched = false;
            return;
        }
        event.assignedToSwiper = true;
        //Block inner links
        if (params.preventLinks) {
            _this.allowLinks = false;
        }
        if (params.onSlideClick) {
            _this.allowSlideClick = false;
        }
        //Stop AutoPlay if exist
        if (params.autoplay) {
            _this.stopAutoplay(true);
        }
        if (!isTouchEvent || event.touches.length === 1) {
            //Moved Flag
            if (!_this.isMoved) {
                _this.callPlugins("onTouchMoveStart");
                if (params.loop) {
                    _this.fixLoop();
                    _this.positions.start = _this.getWrapperTranslate();
                }
                if (params.onTouchMoveStart) _this.fireCallback(params.onTouchMoveStart, _this);
            }
            _this.isMoved = true;
            // cancel event
            if (event.preventDefault) event.preventDefault(); else event.returnValue = false;
            _this.touches.current = isH ? pageX : pageY;
            _this.positions.current = (_this.touches.current - _this.touches.start) * params.touchRatio + _this.positions.start;
            //Resistance Callbacks
            if (_this.positions.current > 0 && params.onResistanceBefore) {
                _this.fireCallback(params.onResistanceBefore, _this, _this.positions.current);
            }
            if (_this.positions.current < -maxWrapperPosition() && params.onResistanceAfter) {
                _this.fireCallback(params.onResistanceAfter, _this, Math.abs(_this.positions.current + maxWrapperPosition()));
            }
            //Resistance
            if (params.resistance && params.resistance !== "100%") {
                var resistance;
                //Resistance for Negative-Back sliding
                if (_this.positions.current > 0) {
                    resistance = 1 - _this.positions.current / containerSize / 2;
                    if (resistance < .5) _this.positions.current = containerSize / 2; else _this.positions.current = _this.positions.current * resistance;
                }
                //Resistance for After-End Sliding
                if (_this.positions.current < -maxWrapperPosition()) {
                    var diff = (_this.touches.current - _this.touches.start) * params.touchRatio + (maxWrapperPosition() + _this.positions.start);
                    resistance = (containerSize + diff) / containerSize;
                    var newPos = _this.positions.current - diff * (1 - resistance) / 2;
                    var stopPos = -maxWrapperPosition() - containerSize / 2;
                    if (newPos < stopPos || resistance <= 0) _this.positions.current = stopPos; else _this.positions.current = newPos;
                }
            }
            if (params.resistance && params.resistance === "100%") {
                //Resistance for Negative-Back sliding
                if (_this.positions.current > 0 && !(params.freeMode && !params.freeModeFluid)) {
                    _this.positions.current = 0;
                }
                //Resistance for After-End Sliding
                if (_this.positions.current < -maxWrapperPosition() && !(params.freeMode && !params.freeModeFluid)) {
                    _this.positions.current = -maxWrapperPosition();
                }
            }
            //Move Slides
            if (!params.followFinger) return;
            if (!params.moveStartThreshold) {
                _this.setWrapperTranslate(_this.positions.current);
            } else {
                if (Math.abs(_this.touches.current - _this.touches.start) > params.moveStartThreshold || allowThresholdMove) {
                    if (!allowThresholdMove) {
                        allowThresholdMove = true;
                        _this.touches.start = _this.touches.current;
                        return;
                    }
                    _this.setWrapperTranslate(_this.positions.current);
                } else {
                    _this.positions.current = _this.positions.start;
                }
            }
            if (params.freeMode || params.watchActiveIndex) {
                _this.updateActiveSlide(_this.positions.current);
            }
            //Grab Cursor
            if (params.grabCursor) {
                _this.container.style.cursor = "move";
                _this.container.style.cursor = "grabbing";
                _this.container.style.cursor = "-moz-grabbin";
                _this.container.style.cursor = "-webkit-grabbing";
            }
            //Velocity
            if (!velocityPrevPosition) velocityPrevPosition = _this.touches.current;
            if (!velocityPrevTime) velocityPrevTime = new Date().getTime();
            _this.velocity = (_this.touches.current - velocityPrevPosition) / (new Date().getTime() - velocityPrevTime) / 2;
            if (Math.abs(_this.touches.current - velocityPrevPosition) < 2) _this.velocity = 0;
            velocityPrevPosition = _this.touches.current;
            velocityPrevTime = new Date().getTime();
            //Callbacks
            _this.callPlugins("onTouchMoveEnd");
            if (params.onTouchMove) _this.fireCallback(params.onTouchMove, _this, event);
            return false;
        }
    }
    function onTouchEnd(event) {
        //Check For scrolling
        if (isScrolling) {
            _this.swipeReset();
        }
        // If slider is not touched exit
        if (params.onlyExternal || !_this.isTouched) return;
        _this.isTouched = false;
        //Return Grab Cursor
        if (params.grabCursor) {
            _this.container.style.cursor = "move";
            _this.container.style.cursor = "grab";
            _this.container.style.cursor = "-moz-grab";
            _this.container.style.cursor = "-webkit-grab";
        }
        //Check for Current Position
        if (!_this.positions.current && _this.positions.current !== 0) {
            _this.positions.current = _this.positions.start;
        }
        //For case if slider touched but not moved
        if (params.followFinger) {
            _this.setWrapperTranslate(_this.positions.current);
        }
        // TouchEndTime
        _this.times.end = new Date().getTime();
        //Difference
        _this.touches.diff = _this.touches.current - _this.touches.start;
        _this.touches.abs = Math.abs(_this.touches.diff);
        _this.positions.diff = _this.positions.current - _this.positions.start;
        _this.positions.abs = Math.abs(_this.positions.diff);
        var diff = _this.positions.diff;
        var diffAbs = _this.positions.abs;
        var timeDiff = _this.times.end - _this.times.start;
        if (diffAbs < 5 && timeDiff < 300 && _this.allowLinks === false) {
            if (!params.freeMode && diffAbs !== 0) _this.swipeReset();
            //Release inner links
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }
        setTimeout(function() {
            //Release inner links
            if (typeof _this === "undefined" || _this === null) return;
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }, 100);
        var maxPosition = maxWrapperPosition();
        //Not moved or Prevent Negative Back Sliding/After-End Sliding
        if (!_this.isMoved && params.freeMode) {
            _this.isMoved = false;
            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
            _this.callPlugins("onTouchEnd");
            return;
        }
        if (!_this.isMoved || _this.positions.current > 0 || _this.positions.current < -maxPosition) {
            _this.swipeReset();
            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
            _this.callPlugins("onTouchEnd");
            return;
        }
        _this.isMoved = false;
        //Free Mode
        if (params.freeMode) {
            if (params.freeModeFluid) {
                var momentumDuration = 1e3 * params.momentumRatio;
                var momentumDistance = _this.velocity * momentumDuration;
                var newPosition = _this.positions.current + momentumDistance;
                var doBounce = false;
                var afterBouncePosition;
                var bounceAmount = Math.abs(_this.velocity) * 20 * params.momentumBounceRatio;
                if (newPosition < -maxPosition) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition + maxPosition < -bounceAmount) newPosition = -maxPosition - bounceAmount;
                        afterBouncePosition = -maxPosition;
                        doBounce = true;
                        allowMomentumBounce = true;
                    } else newPosition = -maxPosition;
                }
                if (newPosition > 0) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition > bounceAmount) newPosition = bounceAmount;
                        afterBouncePosition = 0;
                        doBounce = true;
                        allowMomentumBounce = true;
                    } else newPosition = 0;
                }
                //Fix duration
                if (_this.velocity !== 0) momentumDuration = Math.abs((newPosition - _this.positions.current) / _this.velocity);
                _this.setWrapperTranslate(newPosition);
                _this.setWrapperTransition(momentumDuration);
                if (params.momentumBounce && doBounce) {
                    _this.wrapperTransitionEnd(function() {
                        if (!allowMomentumBounce) return;
                        if (params.onMomentumBounce) _this.fireCallback(params.onMomentumBounce, _this);
                        _this.callPlugins("onMomentumBounce");
                        _this.setWrapperTranslate(afterBouncePosition);
                        _this.setWrapperTransition(300);
                    });
                }
                _this.updateActiveSlide(newPosition);
            }
            if (!params.freeModeFluid || timeDiff >= 300) _this.updateActiveSlide(_this.positions.current);
            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
            _this.callPlugins("onTouchEnd");
            return;
        }
        //Direction
        direction = diff < 0 ? "toNext" : "toPrev";
        //Short Touches
        if (direction === "toNext" && timeDiff <= 300) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset(); else _this.swipeNext(true, true);
        }
        if (direction === "toPrev" && timeDiff <= 300) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset(); else _this.swipePrev(true, true);
        }
        //Long Touches
        var targetSlideSize = 0;
        if (params.slidesPerView === "auto") {
            //Define current slide's width
            var currentPosition = Math.abs(_this.getWrapperTranslate());
            var slidesOffset = 0;
            var _slideSize;
            for (var i = 0; i < _this.slides.length; i++) {
                _slideSize = isH ? _this.slides[i].getWidth(true, params.roundLengths) : _this.slides[i].getHeight(true, params.roundLengths);
                slidesOffset += _slideSize;
                if (slidesOffset > currentPosition) {
                    targetSlideSize = _slideSize;
                    break;
                }
            }
            if (targetSlideSize > containerSize) targetSlideSize = containerSize;
        } else {
            targetSlideSize = slideSize * params.slidesPerView;
        }
        if (direction === "toNext" && timeDiff > 300) {
            if (diffAbs >= targetSlideSize * params.longSwipesRatio) {
                _this.swipeNext(true, true);
            } else {
                _this.swipeReset();
            }
        }
        if (direction === "toPrev" && timeDiff > 300) {
            if (diffAbs >= targetSlideSize * params.longSwipesRatio) {
                _this.swipePrev(true, true);
            } else {
                _this.swipeReset();
            }
        }
        if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this, event);
        _this.callPlugins("onTouchEnd");
    }
    /*==================================================
        noSwiping Bubble Check by Isaac Strack
    ====================================================*/
    function hasClass(el, classname) {
        return el && el.getAttribute("class") && el.getAttribute("class").indexOf(classname) > -1;
    }
    function noSwipingSlide(el) {
        /*This function is specifically designed to check the parent elements for the noSwiping class, up to the wrapper.
        We need to check parents because while onTouchStart bubbles, _this.isTouched is checked in onTouchStart, which stops the bubbling.
        So, if a text box, for example, is the initial target, and the parent slide container has the noSwiping class, the _this.isTouched
        check will never find it, and what was supposed to be noSwiping is able to be swiped.
        This function will iterate up and check for the noSwiping class in parents, up through the wrapperClass.*/
        // First we create a truthy variable, which is that swiping is allowd (noSwiping = false)
        var noSwiping = false;
        // Now we iterate up (parentElements) until we reach the node with the wrapperClass.
        do {
            // Each time, we check to see if there's a 'swiper-no-swiping' class (noSwipingClass).
            if (hasClass(el, params.noSwipingClass)) {
                noSwiping = true;
            }
            el = el.parentElement;
        } while (!noSwiping && el.parentElement && !hasClass(el, params.wrapperClass));
        // also include el.parentElement truthy, just in case.
        // because we didn't check the wrapper itself, we do so now, if noSwiping is false:
        if (!noSwiping && hasClass(el, params.wrapperClass) && hasClass(el, params.noSwipingClass)) noSwiping = true;
        // if the wrapper has the noSwipingClass, we set noSwiping = true;
        return noSwiping;
    }
    function addClassToHtmlString(klass, outerHtml) {
        var par = document.createElement("div");
        var child;
        par.innerHTML = outerHtml;
        child = par.firstChild;
        child.className += " " + klass;
        return child.outerHTML;
    }
    /*==================================================
        Swipe Functions
    ====================================================*/
    _this.swipeNext = function(runCallbacks, internal) {
        if (typeof runCallbacks === "undefined") runCallbacks = true;
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins("onSwipeNext");
        var currentPosition = _this.getWrapperTranslate().toFixed(2);
        var newPosition = currentPosition;
        if (params.slidesPerView === "auto") {
            for (var i = 0; i < _this.snapGrid.length; i++) {
                if (-currentPosition >= _this.snapGrid[i].toFixed(2) && -currentPosition < _this.snapGrid[i + 1].toFixed(2)) {
                    newPosition = -_this.snapGrid[i + 1];
                    break;
                }
            }
        } else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.floor(Math.abs(currentPosition) / Math.floor(groupSize)) * groupSize + groupSize);
        }
        if (newPosition < -maxWrapperPosition()) {
            newPosition = -maxWrapperPosition();
        }
        if (newPosition === currentPosition) return false;
        swipeToPosition(newPosition, "next", {
            runCallbacks: runCallbacks
        });
        return true;
    };
    _this.swipePrev = function(runCallbacks, internal) {
        if (typeof runCallbacks === "undefined") runCallbacks = true;
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins("onSwipePrev");
        var currentPosition = Math.ceil(_this.getWrapperTranslate());
        var newPosition;
        if (params.slidesPerView === "auto") {
            newPosition = 0;
            for (var i = 1; i < _this.snapGrid.length; i++) {
                if (-currentPosition === _this.snapGrid[i]) {
                    newPosition = -_this.snapGrid[i - 1];
                    break;
                }
                if (-currentPosition > _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
                    newPosition = -_this.snapGrid[i];
                    break;
                }
            }
        } else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.ceil(-currentPosition / groupSize) - 1) * groupSize;
        }
        if (newPosition > 0) newPosition = 0;
        if (newPosition === currentPosition) return false;
        swipeToPosition(newPosition, "prev", {
            runCallbacks: runCallbacks
        });
        return true;
    };
    _this.swipeReset = function(runCallbacks) {
        if (typeof runCallbacks === "undefined") runCallbacks = true;
        _this.callPlugins("onSwipeReset");
        var currentPosition = _this.getWrapperTranslate();
        var groupSize = slideSize * params.slidesPerGroup;
        var newPosition;
        var maxPosition = -maxWrapperPosition();
        if (params.slidesPerView === "auto") {
            newPosition = 0;
            for (var i = 0; i < _this.snapGrid.length; i++) {
                if (-currentPosition === _this.snapGrid[i]) return;
                if (-currentPosition >= _this.snapGrid[i] && -currentPosition < _this.snapGrid[i + 1]) {
                    if (_this.positions.diff > 0) newPosition = -_this.snapGrid[i + 1]; else newPosition = -_this.snapGrid[i];
                    break;
                }
            }
            if (-currentPosition >= _this.snapGrid[_this.snapGrid.length - 1]) newPosition = -_this.snapGrid[_this.snapGrid.length - 1];
            if (currentPosition <= -maxWrapperPosition()) newPosition = -maxWrapperPosition();
        } else {
            newPosition = currentPosition < 0 ? Math.round(currentPosition / groupSize) * groupSize : 0;
            if (currentPosition <= -maxWrapperPosition()) newPosition = -maxWrapperPosition();
        }
        if (params.scrollContainer) {
            newPosition = currentPosition < 0 ? currentPosition : 0;
        }
        if (newPosition < -maxWrapperPosition()) {
            newPosition = -maxWrapperPosition();
        }
        if (params.scrollContainer && containerSize > slideSize) {
            newPosition = 0;
        }
        if (newPosition === currentPosition) return false;
        swipeToPosition(newPosition, "reset", {
            runCallbacks: runCallbacks
        });
        return true;
    };
    _this.swipeTo = function(index, speed, runCallbacks) {
        index = parseInt(index, 10);
        _this.callPlugins("onSwipeTo", {
            index: index,
            speed: speed
        });
        if (params.loop) index = index + _this.loopedSlides;
        var currentPosition = _this.getWrapperTranslate();
        if (!isFinite(index) || index > _this.slides.length - 1 || index < 0) return;
        var newPosition;
        if (params.slidesPerView === "auto") {
            newPosition = -_this.slidesGrid[index];
        } else {
            newPosition = -index * slideSize;
        }
        if (newPosition < -maxWrapperPosition()) {
            newPosition = -maxWrapperPosition();
        }
        if (newPosition === currentPosition) return false;
        if (typeof runCallbacks === "undefined") runCallbacks = true;
        swipeToPosition(newPosition, "to", {
            index: index,
            speed: speed,
            runCallbacks: runCallbacks
        });
        return true;
    };
    function swipeToPosition(newPosition, action, toOptions) {
        var speed = action === "to" && toOptions.speed >= 0 ? toOptions.speed : params.speed;
        var timeOld = +new Date();
        function anim() {
            var timeNew = +new Date();
            var time = timeNew - timeOld;
            currentPosition += animationStep * time / (1e3 / 60);
            condition = direction === "toNext" ? currentPosition > newPosition : currentPosition < newPosition;
            if (condition) {
                _this.setWrapperTranslate(Math.ceil(currentPosition));
                _this._DOMAnimating = true;
                window.setTimeout(function() {
                    anim();
                }, 1e3 / 60);
            } else {
                if (params.onSlideChangeEnd) {
                    if (action === "to") {
                        if (toOptions.runCallbacks === true) _this.fireCallback(params.onSlideChangeEnd, _this, direction);
                    } else {
                        _this.fireCallback(params.onSlideChangeEnd, _this, direction);
                    }
                }
                _this.setWrapperTranslate(newPosition);
                _this._DOMAnimating = false;
            }
        }
        if (_this.support.transitions || !params.DOMAnimation) {
            _this.setWrapperTranslate(newPosition);
            _this.setWrapperTransition(speed);
        } else {
            //Try the DOM animation
            var currentPosition = _this.getWrapperTranslate();
            var animationStep = Math.ceil((newPosition - currentPosition) / speed * (1e3 / 60));
            var direction = currentPosition > newPosition ? "toNext" : "toPrev";
            var condition = direction === "toNext" ? currentPosition > newPosition : currentPosition < newPosition;
            if (_this._DOMAnimating) return;
            anim();
        }
        //Update Active Slide Index
        _this.updateActiveSlide(newPosition);
        //Callbacks
        if (params.onSlideNext && action === "next" && toOptions.runCallbacks === true) {
            _this.fireCallback(params.onSlideNext, _this, newPosition);
        }
        if (params.onSlidePrev && action === "prev" && toOptions.runCallbacks === true) {
            _this.fireCallback(params.onSlidePrev, _this, newPosition);
        }
        //'Reset' Callback
        if (params.onSlideReset && action === "reset" && toOptions.runCallbacks === true) {
            _this.fireCallback(params.onSlideReset, _this, newPosition);
        }
        //'Next', 'Prev' and 'To' Callbacks
        if ((action === "next" || action === "prev" || action === "to") && toOptions.runCallbacks === true) slideChangeCallbacks(action);
    }
    /*==================================================
        Transition Callbacks
    ====================================================*/
    //Prevent Multiple Callbacks
    _this._queueStartCallbacks = false;
    _this._queueEndCallbacks = false;
    function slideChangeCallbacks(direction) {
        //Transition Start Callback
        _this.callPlugins("onSlideChangeStart");
        if (params.onSlideChangeStart) {
            if (params.queueStartCallbacks && _this.support.transitions) {
                if (_this._queueStartCallbacks) return;
                _this._queueStartCallbacks = true;
                _this.fireCallback(params.onSlideChangeStart, _this, direction);
                _this.wrapperTransitionEnd(function() {
                    _this._queueStartCallbacks = false;
                });
            } else _this.fireCallback(params.onSlideChangeStart, _this, direction);
        }
        //Transition End Callback
        if (params.onSlideChangeEnd) {
            if (_this.support.transitions) {
                if (params.queueEndCallbacks) {
                    if (_this._queueEndCallbacks) return;
                    _this._queueEndCallbacks = true;
                    _this.wrapperTransitionEnd(function(swiper) {
                        _this.fireCallback(params.onSlideChangeEnd, swiper, direction);
                    });
                } else {
                    _this.wrapperTransitionEnd(function(swiper) {
                        _this.fireCallback(params.onSlideChangeEnd, swiper, direction);
                    });
                }
            } else {
                if (!params.DOMAnimation) {
                    setTimeout(function() {
                        _this.fireCallback(params.onSlideChangeEnd, _this, direction);
                    }, 10);
                }
            }
        }
    }
    /*==================================================
        Update Active Slide Index
    ====================================================*/
    _this.updateActiveSlide = function(position) {
        if (!_this.initialized) return;
        if (_this.slides.length === 0) return;
        _this.previousIndex = _this.activeIndex;
        if (typeof position === "undefined") position = _this.getWrapperTranslate();
        if (position > 0) position = 0;
        var i;
        if (params.slidesPerView === "auto") {
            var slidesOffset = 0;
            _this.activeIndex = _this.slidesGrid.indexOf(-position);
            if (_this.activeIndex < 0) {
                for (i = 0; i < _this.slidesGrid.length - 1; i++) {
                    if (-position > _this.slidesGrid[i] && -position < _this.slidesGrid[i + 1]) {
                        break;
                    }
                }
                var leftDistance = Math.abs(_this.slidesGrid[i] + position);
                var rightDistance = Math.abs(_this.slidesGrid[i + 1] + position);
                if (leftDistance <= rightDistance) _this.activeIndex = i; else _this.activeIndex = i + 1;
            }
        } else {
            _this.activeIndex = Math[params.visibilityFullFit ? "ceil" : "round"](-position / slideSize);
        }
        if (_this.activeIndex === _this.slides.length) _this.activeIndex = _this.slides.length - 1;
        if (_this.activeIndex < 0) _this.activeIndex = 0;
        // Check for slide
        if (!_this.slides[_this.activeIndex]) return;
        // Calc Visible slides
        _this.calcVisibleSlides(position);
        // Mark visible and active slides with additonal classes
        if (_this.support.classList) {
            var slide;
            for (i = 0; i < _this.slides.length; i++) {
                slide = _this.slides[i];
                slide.classList.remove(params.slideActiveClass);
                if (_this.visibleSlides.indexOf(slide) >= 0) {
                    slide.classList.add(params.slideVisibleClass);
                } else {
                    slide.classList.remove(params.slideVisibleClass);
                }
            }
            _this.slides[_this.activeIndex].classList.add(params.slideActiveClass);
        } else {
            var activeClassRegexp = new RegExp("\\s*" + params.slideActiveClass);
            var inViewClassRegexp = new RegExp("\\s*" + params.slideVisibleClass);
            for (i = 0; i < _this.slides.length; i++) {
                _this.slides[i].className = _this.slides[i].className.replace(activeClassRegexp, "").replace(inViewClassRegexp, "");
                if (_this.visibleSlides.indexOf(_this.slides[i]) >= 0) {
                    _this.slides[i].className += " " + params.slideVisibleClass;
                }
            }
            _this.slides[_this.activeIndex].className += " " + params.slideActiveClass;
        }
        //Update loop index
        if (params.loop) {
            var ls = _this.loopedSlides;
            _this.activeLoopIndex = _this.activeIndex - ls;
            if (_this.activeLoopIndex >= _this.slides.length - ls * 2) {
                _this.activeLoopIndex = _this.slides.length - ls * 2 - _this.activeLoopIndex;
            }
            if (_this.activeLoopIndex < 0) {
                _this.activeLoopIndex = _this.slides.length - ls * 2 + _this.activeLoopIndex;
            }
            if (_this.activeLoopIndex < 0) _this.activeLoopIndex = 0;
        } else {
            _this.activeLoopIndex = _this.activeIndex;
        }
        //Update Pagination
        if (params.pagination) {
            _this.updatePagination(position);
        }
    };
    /*==================================================
        Pagination
    ====================================================*/
    _this.createPagination = function(firstInit) {
        if (params.paginationClickable && _this.paginationButtons) {
            removePaginationEvents();
        }
        _this.paginationContainer = params.pagination.nodeType ? params.pagination : $$(params.pagination)[0];
        if (params.createPagination) {
            var paginationHTML = "";
            var numOfSlides = _this.slides.length;
            var numOfButtons = numOfSlides;
            if (params.loop) numOfButtons -= _this.loopedSlides * 2;
            for (var i = 0; i < numOfButtons; i++) {
                paginationHTML += "<" + params.paginationElement + ' class="' + params.paginationElementClass + '"></' + params.paginationElement + ">";
            }
            _this.paginationContainer.innerHTML = paginationHTML;
        }
        _this.paginationButtons = $$("." + params.paginationElementClass, _this.paginationContainer);
        if (!firstInit) _this.updatePagination();
        _this.callPlugins("onCreatePagination");
        if (params.paginationClickable) {
            addPaginationEvents();
        }
    };
    function removePaginationEvents() {
        var pagers = _this.paginationButtons;
        if (pagers) {
            for (var i = 0; i < pagers.length; i++) {
                _this.h.removeEventListener(pagers[i], "click", paginationClick);
            }
        }
    }
    function addPaginationEvents() {
        var pagers = _this.paginationButtons;
        if (pagers) {
            for (var i = 0; i < pagers.length; i++) {
                _this.h.addEventListener(pagers[i], "click", paginationClick);
            }
        }
    }
    function paginationClick(e) {
        var index;
        var target = e.target || e.srcElement;
        var pagers = _this.paginationButtons;
        for (var i = 0; i < pagers.length; i++) {
            if (target === pagers[i]) index = i;
        }
        if (params.autoplay) _this.stopAutoplay(true);
        _this.swipeTo(index);
    }
    _this.updatePagination = function(position) {
        if (!params.pagination) return;
        if (_this.slides.length < 1) return;
        var activePagers = $$("." + params.paginationActiveClass, _this.paginationContainer);
        if (!activePagers) return;
        //Reset all Buttons' class to not active
        var pagers = _this.paginationButtons;
        if (pagers.length === 0) return;
        for (var i = 0; i < pagers.length; i++) {
            pagers[i].className = params.paginationElementClass;
        }
        var indexOffset = params.loop ? _this.loopedSlides : 0;
        if (params.paginationAsRange) {
            if (!_this.visibleSlides) _this.calcVisibleSlides(position);
            //Get Visible Indexes
            var visibleIndexes = [];
            var j;
            // lopp index - avoid JSHint W004 / W038
            for (j = 0; j < _this.visibleSlides.length; j++) {
                var visIndex = _this.slides.indexOf(_this.visibleSlides[j]) - indexOffset;
                if (params.loop && visIndex < 0) {
                    visIndex = _this.slides.length - _this.loopedSlides * 2 + visIndex;
                }
                if (params.loop && visIndex >= _this.slides.length - _this.loopedSlides * 2) {
                    visIndex = _this.slides.length - _this.loopedSlides * 2 - visIndex;
                    visIndex = Math.abs(visIndex);
                }
                visibleIndexes.push(visIndex);
            }
            for (j = 0; j < visibleIndexes.length; j++) {
                if (pagers[visibleIndexes[j]]) pagers[visibleIndexes[j]].className += " " + params.paginationVisibleClass;
            }
            if (params.loop) {
                if (pagers[_this.activeLoopIndex] !== undefined) {
                    pagers[_this.activeLoopIndex].className += " " + params.paginationActiveClass;
                }
            } else {
                if (pagers[_this.activeIndex]) pagers[_this.activeIndex].className += " " + params.paginationActiveClass;
            }
        } else {
            if (params.loop) {
                if (pagers[_this.activeLoopIndex]) pagers[_this.activeLoopIndex].className += " " + params.paginationActiveClass + " " + params.paginationVisibleClass;
            } else {
                if (pagers[_this.activeIndex]) pagers[_this.activeIndex].className += " " + params.paginationActiveClass + " " + params.paginationVisibleClass;
            }
        }
    };
    _this.calcVisibleSlides = function(position) {
        var visibleSlides = [];
        var _slideLeft = 0, _slideSize = 0, _slideRight = 0;
        if (isH && _this.wrapperLeft > 0) position = position + _this.wrapperLeft;
        if (!isH && _this.wrapperTop > 0) position = position + _this.wrapperTop;
        for (var i = 0; i < _this.slides.length; i++) {
            _slideLeft += _slideSize;
            if (params.slidesPerView === "auto") _slideSize = isH ? _this.h.getWidth(_this.slides[i], true, params.roundLengths) : _this.h.getHeight(_this.slides[i], true, params.roundLengths); else _slideSize = slideSize;
            _slideRight = _slideLeft + _slideSize;
            var isVisibile = false;
            if (params.visibilityFullFit) {
                if (_slideLeft >= -position && _slideRight <= -position + containerSize) isVisibile = true;
                if (_slideLeft <= -position && _slideRight >= -position + containerSize) isVisibile = true;
            } else {
                if (_slideRight > -position && _slideRight <= -position + containerSize) isVisibile = true;
                if (_slideLeft >= -position && _slideLeft < -position + containerSize) isVisibile = true;
                if (_slideLeft < -position && _slideRight > -position + containerSize) isVisibile = true;
            }
            if (isVisibile) visibleSlides.push(_this.slides[i]);
        }
        if (visibleSlides.length === 0) visibleSlides = [ _this.slides[_this.activeIndex] ];
        _this.visibleSlides = visibleSlides;
    };
    /*==========================================
        Autoplay
    ============================================*/
    var autoplayTimeoutId, autoplayIntervalId;
    _this.startAutoplay = function() {
        if (_this.support.transitions) {
            if (typeof autoplayTimeoutId !== "undefined") return false;
            if (!params.autoplay) return;
            _this.callPlugins("onAutoplayStart");
            if (params.onAutoplayStart) _this.fireCallback(params.onAutoplayStart, _this);
            autoplay();
        } else {
            if (typeof autoplayIntervalId !== "undefined") return false;
            if (!params.autoplay) return;
            _this.callPlugins("onAutoplayStart");
            if (params.onAutoplayStart) _this.fireCallback(params.onAutoplayStart, _this);
            autoplayIntervalId = setInterval(function() {
                if (params.loop) {
                    _this.fixLoop();
                    _this.swipeNext(true, true);
                } else if (!_this.swipeNext(true, true)) {
                    if (!params.autoplayStopOnLast) _this.swipeTo(0); else {
                        clearInterval(autoplayIntervalId);
                        autoplayIntervalId = undefined;
                    }
                }
            }, params.autoplay);
        }
    };
    _this.stopAutoplay = function(internal) {
        if (_this.support.transitions) {
            if (!autoplayTimeoutId) return;
            if (autoplayTimeoutId) clearTimeout(autoplayTimeoutId);
            autoplayTimeoutId = undefined;
            if (internal && !params.autoplayDisableOnInteraction) {
                _this.wrapperTransitionEnd(function() {
                    autoplay();
                });
            }
            _this.callPlugins("onAutoplayStop");
            if (params.onAutoplayStop) _this.fireCallback(params.onAutoplayStop, _this);
        } else {
            if (autoplayIntervalId) clearInterval(autoplayIntervalId);
            autoplayIntervalId = undefined;
            _this.callPlugins("onAutoplayStop");
            if (params.onAutoplayStop) _this.fireCallback(params.onAutoplayStop, _this);
        }
    };
    function autoplay() {
        autoplayTimeoutId = setTimeout(function() {
            if (params.loop) {
                _this.fixLoop();
                _this.swipeNext(true, true);
            } else if (!_this.swipeNext(true, true)) {
                if (!params.autoplayStopOnLast) _this.swipeTo(0); else {
                    clearTimeout(autoplayTimeoutId);
                    autoplayTimeoutId = undefined;
                }
            }
            _this.wrapperTransitionEnd(function() {
                if (typeof autoplayTimeoutId !== "undefined") autoplay();
            });
        }, params.autoplay);
    }
    /*==================================================
        Loop
    ====================================================*/
    _this.loopCreated = false;
    _this.removeLoopedSlides = function() {
        if (_this.loopCreated) {
            for (var i = 0; i < _this.slides.length; i++) {
                if (_this.slides[i].getData("looped") === true) _this.wrapper.removeChild(_this.slides[i]);
            }
        }
    };
    _this.createLoop = function() {
        if (_this.slides.length === 0) return;
        if (params.slidesPerView === "auto") {
            _this.loopedSlides = params.loopedSlides || 1;
        } else {
            _this.loopedSlides = Math.floor(params.slidesPerView) + params.loopAdditionalSlides;
        }
        if (_this.loopedSlides > _this.slides.length) {
            _this.loopedSlides = _this.slides.length;
        }
        var slideFirstHTML = "", slideLastHTML = "", i;
        var slidesSetFullHTML = "";
        /**
                loopedSlides is too large if loopAdditionalSlides are set.
                Need to divide the slides by maximum number of slides existing.

                @author        Tomaz Lovrec <tomaz.lovrec@blanc-noir.at>
        */
        var numSlides = _this.slides.length;
        var fullSlideSets = Math.floor(_this.loopedSlides / numSlides);
        var remainderSlides = _this.loopedSlides % numSlides;
        // assemble full sets of slides
        for (i = 0; i < fullSlideSets * numSlides; i++) {
            var j = i;
            if (i >= numSlides) {
                var over = Math.floor(i / numSlides);
                j = i - numSlides * over;
            }
            slidesSetFullHTML += _this.slides[j].outerHTML;
        }
        // assemble remainder slides
        // assemble remainder appended to existing slides
        for (i = 0; i < remainderSlides; i++) {
            slideLastHTML += addClassToHtmlString(params.slideDuplicateClass, _this.slides[i].outerHTML);
        }
        // assemble slides that get preppended to existing slides
        for (i = numSlides - remainderSlides; i < numSlides; i++) {
            slideFirstHTML += addClassToHtmlString(params.slideDuplicateClass, _this.slides[i].outerHTML);
        }
        // assemble all slides
        var slides = slideFirstHTML + slidesSetFullHTML + wrapper.innerHTML + slidesSetFullHTML + slideLastHTML;
        // set the slides
        wrapper.innerHTML = slides;
        _this.loopCreated = true;
        _this.calcSlides();
        //Update Looped Slides with special class
        for (i = 0; i < _this.slides.length; i++) {
            if (i < _this.loopedSlides || i >= _this.slides.length - _this.loopedSlides) _this.slides[i].setData("looped", true);
        }
        _this.callPlugins("onCreateLoop");
    };
    _this.fixLoop = function() {
        var newIndex;
        //Fix For Negative Oversliding
        if (_this.activeIndex < _this.loopedSlides) {
            newIndex = _this.slides.length - _this.loopedSlides * 3 + _this.activeIndex;
            _this.swipeTo(newIndex, 0, false);
        } else if (params.slidesPerView === "auto" && _this.activeIndex >= _this.loopedSlides * 2 || _this.activeIndex > _this.slides.length - params.slidesPerView * 2) {
            newIndex = -_this.slides.length + _this.activeIndex + _this.loopedSlides;
            _this.swipeTo(newIndex, 0, false);
        }
    };
    /*==================================================
        Slides Loader
    ====================================================*/
    _this.loadSlides = function() {
        var slidesHTML = "";
        _this.activeLoaderIndex = 0;
        var slides = params.loader.slides;
        var slidesToLoad = params.loader.loadAllSlides ? slides.length : params.slidesPerView * (1 + params.loader.surroundGroups);
        for (var i = 0; i < slidesToLoad; i++) {
            if (params.loader.slidesHTMLType === "outer") slidesHTML += slides[i]; else {
                slidesHTML += "<" + params.slideElement + ' class="' + params.slideClass + '" data-swiperindex="' + i + '">' + slides[i] + "</" + params.slideElement + ">";
            }
        }
        _this.wrapper.innerHTML = slidesHTML;
        _this.calcSlides(true);
        //Add permanent transitionEnd callback
        if (!params.loader.loadAllSlides) {
            _this.wrapperTransitionEnd(_this.reloadSlides, true);
        }
    };
    _this.reloadSlides = function() {
        var slides = params.loader.slides;
        var newActiveIndex = parseInt(_this.activeSlide().data("swiperindex"), 10);
        if (newActiveIndex < 0 || newActiveIndex > slides.length - 1) return;
        //<-- Exit
        _this.activeLoaderIndex = newActiveIndex;
        var firstIndex = Math.max(0, newActiveIndex - params.slidesPerView * params.loader.surroundGroups);
        var lastIndex = Math.min(newActiveIndex + params.slidesPerView * (1 + params.loader.surroundGroups) - 1, slides.length - 1);
        //Update Transforms
        if (newActiveIndex > 0) {
            var newTransform = -slideSize * (newActiveIndex - firstIndex);
            _this.setWrapperTranslate(newTransform);
            _this.setWrapperTransition(0);
        }
        var i;
        // loop index
        //New Slides
        if (params.loader.logic === "reload") {
            _this.wrapper.innerHTML = "";
            var slidesHTML = "";
            for (i = firstIndex; i <= lastIndex; i++) {
                slidesHTML += params.loader.slidesHTMLType === "outer" ? slides[i] : "<" + params.slideElement + ' class="' + params.slideClass + '" data-swiperindex="' + i + '">' + slides[i] + "</" + params.slideElement + ">";
            }
            _this.wrapper.innerHTML = slidesHTML;
        } else {
            var minExistIndex = 1e3;
            var maxExistIndex = 0;
            for (i = 0; i < _this.slides.length; i++) {
                var index = _this.slides[i].data("swiperindex");
                if (index < firstIndex || index > lastIndex) {
                    _this.wrapper.removeChild(_this.slides[i]);
                } else {
                    minExistIndex = Math.min(index, minExistIndex);
                    maxExistIndex = Math.max(index, maxExistIndex);
                }
            }
            for (i = firstIndex; i <= lastIndex; i++) {
                var newSlide;
                if (i < minExistIndex) {
                    newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute("data-swiperindex", i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.insertBefore(newSlide, _this.wrapper.firstChild);
                }
                if (i > maxExistIndex) {
                    newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute("data-swiperindex", i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.appendChild(newSlide);
                }
            }
        }
        //reInit
        _this.reInit(true);
    };
    /*==================================================
        Make Swiper
    ====================================================*/
    function makeSwiper() {
        _this.calcSlides();
        if (params.loader.slides.length > 0 && _this.slides.length === 0) {
            _this.loadSlides();
        }
        if (params.loop) {
            _this.createLoop();
        }
        _this.init();
        initEvents();
        if (params.pagination) {
            _this.createPagination(true);
        }
        if (params.loop || params.initialSlide > 0) {
            _this.swipeTo(params.initialSlide, 0, false);
        } else {
            _this.updateActiveSlide(0);
        }
        if (params.autoplay) {
            _this.startAutoplay();
        }
        /**
         * Set center slide index.
         *
         * @author        Tomaz Lovrec <tomaz.lovrec@gmail.com>
         */
        _this.centerIndex = _this.activeIndex;
        // Callbacks
        if (params.onSwiperCreated) _this.fireCallback(params.onSwiperCreated, _this);
        _this.callPlugins("onSwiperCreated");
    }
    makeSwiper();
};

Swiper.prototype = {
    plugins: {},
    /*==================================================
        Wrapper Operations
    ====================================================*/
    wrapperTransitionEnd: function(callback, permanent) {
        "use strict";
        var a = this, el = a.wrapper, events = [ "webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd" ], i;
        function fireCallBack(e) {
            if (e.target !== el) return;
            callback(a);
            if (a.params.queueEndCallbacks) a._queueEndCallbacks = false;
            if (!permanent) {
                for (i = 0; i < events.length; i++) {
                    a.h.removeEventListener(el, events[i], fireCallBack);
                }
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                a.h.addEventListener(el, events[i], fireCallBack);
            }
        }
    },
    getWrapperTranslate: function(axis) {
        "use strict";
        var el = this.wrapper, matrix, curTransform, curStyle, transformMatrix;
        // automatic axis detection
        if (typeof axis === "undefined") {
            axis = this.params.mode === "horizontal" ? "x" : "y";
        }
        if (this.support.transforms && this.params.useCSS3Transforms) {
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === "none" ? "" : curStyle.webkitTransform);
            } else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
                matrix = transformMatrix.toString().split(",");
            }
            if (axis === "x") {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
            }
            if (axis === "y") {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
            }
        } else {
            if (axis === "x") curTransform = parseFloat(el.style.left, 10) || 0;
            if (axis === "y") curTransform = parseFloat(el.style.top, 10) || 0;
        }
        return curTransform || 0;
    },
    setWrapperTranslate: function(x, y, z) {
        "use strict";
        var es = this.wrapper.style, coords = {
            x: 0,
            y: 0,
            z: 0
        }, translate;
        // passed all coordinates
        if (arguments.length === 3) {
            coords.x = x;
            coords.y = y;
            coords.z = z;
        } else {
            if (typeof y === "undefined") {
                y = this.params.mode === "horizontal" ? "x" : "y";
            }
            coords[y] = x;
        }
        if (this.support.transforms && this.params.useCSS3Transforms) {
            translate = this.support.transforms3d ? "translate3d(" + coords.x + "px, " + coords.y + "px, " + coords.z + "px)" : "translate(" + coords.x + "px, " + coords.y + "px)";
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translate;
        } else {
            es.left = coords.x + "px";
            es.top = coords.y + "px";
        }
        this.callPlugins("onSetWrapperTransform", coords);
        if (this.params.onSetWrapperTransform) this.fireCallback(this.params.onSetWrapperTransform, this, coords);
    },
    setWrapperTransition: function(duration) {
        "use strict";
        var es = this.wrapper.style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = duration / 1e3 + "s";
        this.callPlugins("onSetWrapperTransition", {
            duration: duration
        });
        if (this.params.onSetWrapperTransition) this.fireCallback(this.params.onSetWrapperTransition, this, duration);
    },
    /*==================================================
        Helpers
    ====================================================*/
    h: {
        getWidth: function(el, outer, round) {
            "use strict";
            var width = window.getComputedStyle(el, null).getPropertyValue("width");
            var returnWidth = parseFloat(width);
            //IE Fixes
            if (isNaN(returnWidth) || width.indexOf("%") > 0 || returnWidth < 0) {
                returnWidth = el.offsetWidth - parseFloat(window.getComputedStyle(el, null).getPropertyValue("padding-left")) - parseFloat(window.getComputedStyle(el, null).getPropertyValue("padding-right"));
            }
            if (outer) returnWidth += parseFloat(window.getComputedStyle(el, null).getPropertyValue("padding-left")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue("padding-right"));
            if (round) return Math.ceil(returnWidth); else return returnWidth;
        },
        getHeight: function(el, outer, round) {
            "use strict";
            if (outer) return el.offsetHeight;
            var height = window.getComputedStyle(el, null).getPropertyValue("height");
            var returnHeight = parseFloat(height);
            //IE Fixes
            if (isNaN(returnHeight) || height.indexOf("%") > 0 || returnHeight < 0) {
                returnHeight = el.offsetHeight - parseFloat(window.getComputedStyle(el, null).getPropertyValue("padding-top")) - parseFloat(window.getComputedStyle(el, null).getPropertyValue("padding-bottom"));
            }
            if (outer) returnHeight += parseFloat(window.getComputedStyle(el, null).getPropertyValue("padding-top")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue("padding-bottom"));
            if (round) return Math.ceil(returnHeight); else return returnHeight;
        },
        getOffset: function(el) {
            "use strict";
            var box = el.getBoundingClientRect();
            var body = document.body;
            var clientTop = el.clientTop || body.clientTop || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var scrollTop = window.pageYOffset || el.scrollTop;
            var scrollLeft = window.pageXOffset || el.scrollLeft;
            if (document.documentElement && !window.pageYOffset) {
                //IE7-8
                scrollTop = document.documentElement.scrollTop;
                scrollLeft = document.documentElement.scrollLeft;
            }
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        },
        windowWidth: function() {
            "use strict";
            if (window.innerWidth) return window.innerWidth; else if (document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
        },
        windowHeight: function() {
            "use strict";
            if (window.innerHeight) return window.innerHeight; else if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
        },
        windowScroll: function() {
            "use strict";
            if (typeof pageYOffset !== "undefined") {
                return {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                };
            } else if (document.documentElement) {
                return {
                    left: document.documentElement.scrollLeft,
                    top: document.documentElement.scrollTop
                };
            }
        },
        addEventListener: function(el, event, listener, useCapture) {
            "use strict";
            if (typeof useCapture === "undefined") {
                useCapture = false;
            }
            if (el.addEventListener) {
                el.addEventListener(event, listener, useCapture);
            } else if (el.attachEvent) {
                el.attachEvent("on" + event, listener);
            }
        },
        removeEventListener: function(el, event, listener, useCapture) {
            "use strict";
            if (typeof useCapture === "undefined") {
                useCapture = false;
            }
            if (el.removeEventListener) {
                el.removeEventListener(event, listener, useCapture);
            } else if (el.detachEvent) {
                el.detachEvent("on" + event, listener);
            }
        }
    },
    setTransform: function(el, transform) {
        "use strict";
        var es = el.style;
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transform;
    },
    setTranslate: function(el, translate) {
        "use strict";
        var es = el.style;
        var pos = {
            x: translate.x || 0,
            y: translate.y || 0,
            z: translate.z || 0
        };
        var transformString = this.support.transforms3d ? "translate3d(" + pos.x + "px," + pos.y + "px," + pos.z + "px)" : "translate(" + pos.x + "px," + pos.y + "px)";
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
        if (!this.support.transforms) {
            es.left = pos.x + "px";
            es.top = pos.y + "px";
        }
    },
    setTransition: function(el, duration) {
        "use strict";
        var es = el.style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = duration + "ms";
    },
    /*==================================================
        Feature Detection
    ====================================================*/
    support: {
        touch: window.Modernizr && Modernizr.touch === true || function() {
            "use strict";
            return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
        }(),
        transforms3d: window.Modernizr && Modernizr.csstransforms3d === true || function() {
            "use strict";
            var div = document.createElement("div").style;
            return "webkitPerspective" in div || "MozPerspective" in div || "OPerspective" in div || "MsPerspective" in div || "perspective" in div;
        }(),
        transforms: window.Modernizr && Modernizr.csstransforms === true || function() {
            "use strict";
            var div = document.createElement("div").style;
            return "transform" in div || "WebkitTransform" in div || "MozTransform" in div || "msTransform" in div || "MsTransform" in div || "OTransform" in div;
        }(),
        transitions: window.Modernizr && Modernizr.csstransitions === true || function() {
            "use strict";
            var div = document.createElement("div").style;
            return "transition" in div || "WebkitTransition" in div || "MozTransition" in div || "msTransition" in div || "MsTransition" in div || "OTransition" in div;
        }(),
        classList: function() {
            "use strict";
            var div = document.createElement("div");
            return "classList" in div;
        }()
    },
    browser: {
        ie8: function() {
            "use strict";
            var rv = -1;
            // Return value assumes failure.
            if (navigator.appName === "Microsoft Internet Explorer") {
                var ua = navigator.userAgent;
                var re = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
                if (re.exec(ua) !== null) rv = parseFloat(RegExp.$1);
            }
            return rv !== -1 && rv < 9;
        }(),
        ie10: window.navigator.msPointerEnabled,
        ie11: window.navigator.pointerEnabled
    }
};

/*=========================
  jQuery & Zepto Plugins
  ===========================*/
if (window.jQuery || window.Zepto) {
    (function($) {
        "use strict";
        $.fn.swiper = function(params) {
            var firstInstance;
            this.each(function(i) {
                var that = $(this);
                var s = new Swiper(that[0], params);
                if (!i) firstInstance = s;
                that.data("swiper", s);
            });
            return firstInstance;
        };
    })(window.jQuery || window.Zepto);
}

// CommonJS support
if (typeof module !== "undefined") {
    module.exports = Swiper;
} else if (typeof define === "function" && define.amd) {
    define([], function() {
        "use strict";
        return Swiper;
    });
}

(function() {
    "use strict";
    /**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */
    /*jslint browser:true, node:true*/
    /*global define, Event, Node*/
    /**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
    function FastClick(layer, options) {
        var oldOnClick;
        options = options || {};
        /**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
        this.trackingClick = false;
        /**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
        this.trackingClickStart = 0;
        /**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
        this.targetElement = null;
        /**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
        this.touchStartX = 0;
        /**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
        this.touchStartY = 0;
        /**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
        this.lastTouchIdentifier = 0;
        /**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
        this.touchBoundary = options.touchBoundary || 10;
        /**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
        this.layer = layer;
        /**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
        this.tapDelay = options.tapDelay || 200;
        /**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
        this.tapTimeout = options.tapTimeout || 700;
        if (FastClick.notNeeded(layer)) {
            return;
        }
        // Some old versions of Android don't have Function.prototype.bind
        function bind(method, context) {
            return function() {
                return method.apply(context, arguments);
            };
        }
        var methods = [ "onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel" ];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }
        // Set up event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener("mouseover", this.onMouse, true);
            layer.addEventListener("mousedown", this.onMouse, true);
            layer.addEventListener("mouseup", this.onMouse, true);
        }
        layer.addEventListener("click", this.onClick, true);
        layer.addEventListener("touchstart", this.onTouchStart, false);
        layer.addEventListener("touchmove", this.onTouchMove, false);
        layer.addEventListener("touchend", this.onTouchEnd, false);
        layer.addEventListener("touchcancel", this.onTouchCancel, false);
        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function(type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === "click") {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };
            layer.addEventListener = function(type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === "click") {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                        if (!event.propagationStopped) {
                            callback(event);
                        }
                    }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }
        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === "function") {
            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener("click", function(event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }
    /**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
    /**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
    var deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0 && !deviceIsWindowsPhone;
    /**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
    /**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
    var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);
    /**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
    var deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);
    /**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf("BB10") > 0;
    /**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
    FastClick.prototype.needsClick = function(target) {
        switch (target.nodeName.toLowerCase()) {
          // Don't send a synthetic click to disabled inputs (issue #62)
            case "button":
          case "select":
          case "textarea":
            if (target.disabled) {
                return true;
            }
            break;

          case "input":
            // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
            if (deviceIsIOS && target.type === "file" || target.disabled) {
                return true;
            }
            break;

          case "label":
          case "iframe":
          // iOS8 homescreen apps can prevent events bubbling into frames
            case "video":
            return true;
        }
        return /\bneedsclick\b/.test(target.className);
    };
    /**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
    FastClick.prototype.needsFocus = function(target) {
        switch (target.nodeName.toLowerCase()) {
          case "textarea":
            return true;

          case "select":
            return !deviceIsAndroid;

          case "input":
            switch (target.type) {
              case "button":
              case "checkbox":
              case "file":
              case "image":
              case "radio":
              case "submit":
                return false;
            }
            // No point in attempting to focus disabled inputs
            return !target.disabled && !target.readOnly;

          default:
            return /\bneedsfocus\b/.test(target.className);
        }
    };
    /**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
    FastClick.prototype.sendClick = function(targetElement, event) {
        var clickEvent, touch;
        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }
        touch = event.changedTouches[0];
        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent("MouseEvents");
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };
    FastClick.prototype.determineEventType = function(targetElement) {
        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === "select") {
            return "mousedown";
        }
        return "click";
    };
    /**
	 * @param {EventTarget|Element} targetElement
	 */
    FastClick.prototype.focus = function(targetElement) {
        var length;
        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf("date") !== 0 && targetElement.type !== "time" && targetElement.type !== "month") {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };
    /**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
    FastClick.prototype.updateScrollParent = function(targetElement) {
        var scrollParent, parentElement;
        scrollParent = targetElement.fastClickScrollParent;
        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }
                parentElement = parentElement.parentElement;
            } while (parentElement);
        }
        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };
    /**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
    FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }
        return eventTarget;
    };
    /**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
    FastClick.prototype.onTouchStart = function(event) {
        var targetElement, touch, selection;
        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }
        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];
        if (deviceIsIOS) {
            // Only trusted events will deselect text on iOS (issue #49)
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }
            if (!deviceIsIOS4) {
                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }
                this.lastTouchIdentifier = touch.identifier;
                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
            }
        }
        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;
        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;
        // Prevent phantom clicks on fast double-tap (issue #36)
        if (event.timeStamp - this.lastClickTime < this.tapDelay) {
            event.preventDefault();
        }
        return true;
    };
    /**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
    FastClick.prototype.touchHasMoved = function(event) {
        var touch = event.changedTouches[0], boundary = this.touchBoundary;
        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }
        return false;
    };
    /**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
    FastClick.prototype.onTouchMove = function(event) {
        if (!this.trackingClick) {
            return true;
        }
        // If the touch has moved, cancel the click tracking
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }
        return true;
    };
    /**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
    FastClick.prototype.findControl = function(labelElement) {
        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }
        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }
        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea");
    };
    /**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
    FastClick.prototype.onTouchEnd = function(event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
        if (!this.trackingClick) {
            return true;
        }
        // Prevent phantom clicks on fast double-tap (issue #36)
        if (event.timeStamp - this.lastClickTime < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }
        if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
            return true;
        }
        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;
        this.lastClickTime = event.timeStamp;
        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;
        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];
            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }
        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === "label") {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }
                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {
            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === "input") {
                this.targetElement = null;
                return false;
            }
            this.focus(targetElement);
            this.sendClick(targetElement, event);
            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (!deviceIsIOS || targetTagName !== "select") {
                this.targetElement = null;
                event.preventDefault();
            }
            return false;
        }
        if (deviceIsIOS && !deviceIsIOS4) {
            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }
        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }
        return false;
    };
    /**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
    FastClick.prototype.onTouchCancel = function() {
        this.trackingClick = false;
        this.targetElement = null;
    };
    /**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
    FastClick.prototype.onMouse = function(event) {
        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }
        if (event.forwardedTouchEvent) {
            return true;
        }
        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }
        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {
                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }
            // Cancel the event
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };
    /**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
    FastClick.prototype.onClick = function(event) {
        var permitted;
        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }
        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === "submit" && event.detail === 0) {
            return true;
        }
        permitted = this.onMouse(event);
        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }
        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };
    /**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
    FastClick.prototype.destroy = function() {
        var layer = this.layer;
        if (deviceIsAndroid) {
            layer.removeEventListener("mouseover", this.onMouse, true);
            layer.removeEventListener("mousedown", this.onMouse, true);
            layer.removeEventListener("mouseup", this.onMouse, true);
        }
        layer.removeEventListener("click", this.onClick, true);
        layer.removeEventListener("touchstart", this.onTouchStart, false);
        layer.removeEventListener("touchmove", this.onTouchMove, false);
        layer.removeEventListener("touchend", this.onTouchEnd, false);
        layer.removeEventListener("touchcancel", this.onTouchCancel, false);
    };
    /**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
    FastClick.notNeeded = function(layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;
        // Devices that don't support touch don't need FastClick
        if (typeof window.ontouchstart === "undefined") {
            return true;
        }
        // Chrome version - zero for other browsers
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [ , 0 ])[1];
        if (chromeVersion) {
            if (deviceIsAndroid) {
                metaViewport = document.querySelector("meta[name=viewport]");
                if (metaViewport) {
                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                    if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                        return true;
                    }
                    // Chrome 32 and above with width=device-width or less don't need FastClick
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            } else {
                return true;
            }
        }
        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
            // BlackBerry 10.3+ does not require Fastclick library.
            // https://github.com/ftlabs/fastclick/issues/251
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector("meta[name=viewport]");
                if (metaViewport) {
                    // user-scalable=no eliminates click delay.
                    if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                        return true;
                    }
                    // width=device-width (or less than device-width) eliminates click delay.
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }
        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
        if (layer.style.msTouchAction === "none" || layer.style.touchAction === "manipulation") {
            return true;
        }
        // Firefox version - zero for other browsers
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [ , 0 ])[1];
        if (firefoxVersion >= 27) {
            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896
            metaViewport = document.querySelector("meta[name=viewport]");
            if (metaViewport && (metaViewport.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }
        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
        if (layer.style.touchAction === "none" || layer.style.touchAction === "manipulation") {
            return true;
        }
        return false;
    };
    /**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
    FastClick.attach = function(layer, options) {
        return new FastClick(layer, options);
    };
    if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
        // AMD. Register as an anonymous module.
        define(function() {
            return FastClick;
        });
    } else if (typeof module !== "undefined" && module.exports) {
        module.exports = FastClick.attach;
        module.exports.FastClick = FastClick;
    } else {
        window.FastClick = FastClick;
    }
})();

var tocSwiper = new Swiper(".swiper-container", {
    slideElement: "article",
    slidesPerView: 2,
    resistance: "100%",
    roundLengths: true
});