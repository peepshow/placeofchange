/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages
        //$('.loading-overlay').addClass('hiding');
        dustyDust();
        smoothStateInit();
      },

      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired

        // loaderEffects();
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // About us page, note the change from about-us to about_us.
    'dev_malaria_base': {
      init: function() {
        // JavaScript to be fired on the about us page

      },
      finalize: function() {
        // JavaScript to be fired on the this page, after the init JS
        console.log("hello I'm here");
//        $().prettyEmbed({ useFitVids: false });
        youtubePlayer();

        // You can use any YouTube player parameters
        // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters
        // To use YouTube controls, you must use ytControls instead
        // To use the loop or autoplay, use the video.js settings
        // The language is set to the same as video.js by default
        // videojs.setGlobalOptions({
        //   youtube: {
        //     ytControls: 2,
        //     rel: 1,
        //     autohide: 0
        //   }
        // });
      }
    }
  };

  /**
   * main.js
   * http://www.codrops.com
   *
   * Licensed under the MIT license.
   * http://www.opensource.org/licenses/mit-license.php
   *
   * Copyright 2015, Codrops
   * http://www.codrops.com
   */
  function pageSlides() {
    'use strict';
    var bodyEl = document.body,
      docElem = window.document.documentElement,
      support = {
        transitions: Modernizr.csstransitions
      },
      // transition end event name
      transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
      },
      transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
      onEndTransition = function(el, callback) {
        var onEndCallbackFn = function(ev) {
          if (support.transitions) {
            if (ev.target !== this) {
              return;
            }
            this.removeEventListener(transEndEventName, onEndCallbackFn);
          }
          if (callback && typeof callback === 'function') {
            callback.call(this);
          }
        };
        if (support.transitions) {
          el.addEventListener(transEndEventName, onEndCallbackFn);
        } else {
          onEndCallbackFn();
        }
      },
      // window sizes
      win = {
        width: window.innerWidth,
        height: window.innerHeight
      },
      // some helper vars to disallow scrolling
      lockScroll = false,
      xscroll, yscroll,
      scrollContainer = document.querySelector('.slider-container'),
      // the main slider and its items
      sliderEl = document.querySelector('.slider'),
      items = [].slice.call(sliderEl.querySelectorAll('.slide')),
      // total number of items
      itemsTotal = items.length,
      // navigation controls/arrows
      navRightCtrl = sliderEl.querySelector('.button--nav-next'),
      navLeftCtrl = sliderEl.querySelector('.button--nav-prev'),
      zoomCtrl = sliderEl.querySelector('.button--zoom'),
      // the main content element
      contentEl = document.querySelector('.load-content'),
      // close content control
      closeContentCtrl = contentEl.querySelector('button.button--close'),
      // index of current item
      current = 0,
      // check if an item is "open"
      isOpen = false,
      isFirefox = typeof InstallTrigger !== 'undefined',
      // scale body when zooming into the items, if not Firefox (the performance in Firefox is not very good)
      bodyScale = isFirefox ? false : 3;

    // some helper functions:
    function scrollX() {
      return window.pageXOffset || docElem.scrollLeft;
    }

    function scrollY() {
      return window.pageYOffset || docElem.scrollTop;
    }
    // from http://www.sberry.me/articles/javascript-event-throttling-debouncing
    function throttle(fn, delay) {
      var allowSample = true;

      return function(e) {
        if (allowSample) {
          allowSample = false;
          setTimeout(function() {
            allowSample = true;
          }, delay);
          fn(e);
        }
      };
    }

    function init() {
      initEvents();
    }

    // event binding
    function initEvents() {
      // open items
      zoomCtrl.addEventListener('click', function() {
        openItem(items[current]);
      });

      // close content
      closeContentCtrl.addEventListener('click', closeContent);

      // navigation
      navRightCtrl.addEventListener('click', function() {
        navigate('right');
      });
      navLeftCtrl.addEventListener('click', function() {
        navigate('left');
      });

      // window resize
      window.addEventListener('resize', throttle(function(ev) {
        // reset window sizes
        win = {
          width: window.innerWidth,
          height: window.innerHeight
        };

        // reset transforms for the items (slider items)
        items.forEach(function(item, pos) {
          if (pos === current) {
            return;
          }
          var el = item.querySelector('.slide__mover');
          dynamics.css(el, {
            translateX: el.offsetWidth
          });
        });
      }, 10));

      // keyboard navigation events
      document.addEventListener('keydown', function(ev) {
        if (isOpen) {
          return;
        }
        var keyCode = ev.keyCode || ev.which;
        switch (keyCode) {
          case 37:
            navigate('left');
            break;
          case 39:
            navigate('right');
            break;
        }
      });
    }

    // opens one item
    function openItem(item) {
      if (isOpen) {
        return;
      }
      isOpen = true;

      // the element that will be transformed
      var zoomer = item.querySelector('.zoomer');
      // slide screen preview
      classie.add(zoomer, 'zoomer--active');
      // disallow scroll
      scrollContainer.addEventListener('scroll', noscroll);
      // apply transforms
      applyTransforms(zoomer);
      // also scale the body so it looks the camera moves to the item.
      if (bodyScale) {
        dynamics.animate(bodyEl, {
          scale: bodyScale
        }, {
          type: dynamics.easeInOut,
          duration: 500
        });
      }
      // after the transition is finished:
      onEndTransition(zoomer, function() {
        // reset body transform
        if (bodyScale) {
          dynamics.stop(bodyEl);
          dynamics.css(bodyEl, {
            scale: 1
          });

          // fix for safari (allowing fixed children to keep position)
          bodyEl.style.WebkitTransform = 'none';
          bodyEl.style.transform = 'none';
        }
        // no scrolling
        classie.add(bodyEl, 'noscroll');
        classie.add(contentEl, 'content--open');
        var contentItem = document.getElementById(item.getAttribute('data-content'));
        classie.add(contentItem, 'content__item--current');
        classie.add(contentItem, 'content__item--reset');


        // reset zoomer transform - back to its original position/transform without a transition
        classie.add(zoomer, 'zoomer--notrans');
        zoomer.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
        zoomer.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';
      });
    }

    // closes the item/content
    function closeContent() {
      var contentItem = contentEl.querySelector('.content__item--current'),
        zoomer = items[current].querySelector('.zoomer');

      classie.remove(contentEl, 'content--open');
      classie.remove(contentItem, 'content__item--current');
      classie.remove(bodyEl, 'noscroll');

      if (bodyScale) {
        // reset fix for safari (allowing fixed children to keep position)
        bodyEl.style.WebkitTransform = '';
        bodyEl.style.transform = '';
      }

      /* fix for safari flickering */
      var nobodyscale = true;
      applyTransforms(zoomer, nobodyscale);
      /* fix for safari flickering */

      // wait for the inner content to finish the transition
      onEndTransition(contentItem, function(ev) {
        classie.remove(this, 'content__item--reset');

        // reset scrolling permission
        lockScroll = false;
        scrollContainer.removeEventListener('scroll', noscroll);

        /* fix for safari flickering */
        zoomer.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
        zoomer.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';
        /* fix for safari flickering */

        // scale up - behind the scenes - the item again (without transition)
        applyTransforms(zoomer);

        // animate/scale down the item
        setTimeout(function() {
          classie.remove(zoomer, 'zoomer--notrans');
          classie.remove(zoomer, 'zoomer--active');
          zoomer.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
          zoomer.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';
        }, 25);

        if (bodyScale) {
          dynamics.css(bodyEl, {
            scale: bodyScale
          });
          dynamics.animate(bodyEl, {
            scale: 1
          }, {
            type: dynamics.easeInOut,
            duration: 500
          });
        }

        isOpen = false;
      });
    }

    // applies the necessary transform value to scale the item up
    function applyTransforms(el, nobodyscale) {
      // zoomer area and scale value
      var zoomerArea = el.querySelector('.zoomer__area'),
        zoomerAreaSize = {
          width: zoomerArea.offsetWidth,
          height: zoomerArea.offsetHeight
        },
        zoomerOffset = zoomerArea.getBoundingClientRect(),
        scaleVal = zoomerAreaSize.width / zoomerAreaSize.height < win.width / win.height ? win.width / zoomerAreaSize.width : win.height / zoomerAreaSize.height;

      if (bodyScale && !nobodyscale) {
        scaleVal /= bodyScale;
      }

      // apply transform
      el.style.WebkitTransform = 'translate3d(' + Number(win.width / 2 - (zoomerOffset.left + zoomerAreaSize.width / 2)) + 'px,' +
        Number(win.height / 2 - (zoomerOffset.top + zoomerAreaSize.height / 2)) + 'px,0) scale3d(' + scaleVal + ',' + scaleVal + ',1)';
      el.style.transform = 'translate3d(' + Number(win.width / 2 - (zoomerOffset.left + zoomerAreaSize.width / 2)) + 'px,' +
        Number(win.height / 2 - (zoomerOffset.top + zoomerAreaSize.height / 2)) + 'px,0) scale3d(' + scaleVal + ',' + scaleVal + ',1)';
    }

    // navigate the slider
    function navigate(dir) {
      var itemCurrent = items[current],
        currentEl = itemCurrent.querySelector('.slide__mover'),
        currentTitleEl = itemCurrent.querySelector('.slide__title');

      // update new current value
      if (dir === 'right') {
        current = current < itemsTotal - 1 ? current + 1 : 0;
      } else {
        current = current > 0 ? current - 1 : itemsTotal - 1;
      }

      var itemNext = items[current],
        nextEl = itemNext.querySelector('.slide__mover'),
        nextTitleEl = itemNext.querySelector('.slide__title');

      // animate the current element out
      dynamics.animate(currentEl, {
        opacity: 0,
        translateX: dir === 'right' ? -1 * currentEl.offsetWidth / 2 : currentEl.offsetWidth / 2,
        rotateZ: dir === 'right' ? -10 : 10
      }, {
        type: dynamics.spring,
        duration: 2000,
        friction: 600,
        complete: function() {
          dynamics.css(itemCurrent, {
            opacity: 0,
            visibility: 'hidden'
          });
        }
      });

      // animate the current title out
      dynamics.animate(currentTitleEl, {
        translateX: dir === 'right' ? -250 : 250,
        opacity: 0
      }, {
        type: dynamics.bezier,
        points: [{
          'x': 0,
          'y': 0,
          'cp': [{
            'x': 0.2,
            'y': 1
          }]
        }, {
          'x': 1,
          'y': 1,
          'cp': [{
            'x': 0.3,
            'y': 1
          }]
        }],
        duration: 450
      });

      // set the right properties for the next element to come in
      dynamics.css(itemNext, {
        opacity: 1,
        visibility: 'visible'
      });
      dynamics.css(nextEl, {
        opacity: 0,
        translateX: dir === 'right' ? nextEl.offsetWidth / 2 : -1 * nextEl.offsetWidth / 2,
        rotateZ: dir === 'right' ? 10 : -10
      });

      // animate the next element in
      dynamics.animate(nextEl, {
        opacity: 1,
        translateX: 0
      }, {
        type: dynamics.spring,
        duration: 2000,
        friction: 600,
        complete: function() {
          items.forEach(function(item) {
            classie.remove(item, 'slide--current');
          });
          classie.add(itemNext, 'slide--current');
        }
      });

      // set the right properties for the next title to come in
      dynamics.css(nextTitleEl, {
        translateX: dir === 'right' ? 250 : -250,
        opacity: 0
      });
      // animate the next title in
      dynamics.animate(nextTitleEl, {
        translateX: 0,
        opacity: 1
      }, {
        type: dynamics.bezier,
        points: [{
          'x': 0,
          'y': 0,
          'cp': [{
            'x': 0.2,
            'y': 1
          }]
        }, {
          'x': 1,
          'y': 1,
          'cp': [{
            'x': 0.3,
            'y': 1
          }]
        }],
        duration: 650
      });
    }

    // disallow scrolling (on the scrollContainer)
    function noscroll() {
      if (!lockScroll) {
        lockScroll = true;
        xscroll = scrollContainer.scrollLeft;
        yscroll = scrollContainer.scrollTop;
      }
      scrollContainer.scrollTop = yscroll;
      scrollContainer.scrollLeft = xscroll;
    }

    init();

  }

  function smoothStateInit() {
    var $body = $('body');
    var $preloader = $('#preloader');
    var $page = $('#main'),
      options = {
        loadingClass: 'is-loading',
        debug: true,
        prefetch: false,
        cacheLength: 2,
        scroll: true,
        onBefore: function($currentTarget, $container) {
          // $preloader.removeClass('loading-fool');
        },
        onStart: {
          duration: 2500, // Duration of our animation
          render: function($container) {
            $container.addClass('is-exiting');
            // smoothState.restartCSSAnimations();
          }
        },
        onProgress: {
          render: function($container) {
            // $preloader.addClass('loading-fool');
          }
        },
        onReady: {
          duration: 300,
          render: function($container, $newContent) {
            $container.html($newContent);
            $container.removeClass('is-exiting');
          }
        },
        onAfter: function($container, $newContent) {
          pageSlides();
        }
      },
      smoothState = $page.smoothState(options).data('smoothState');

  }


  function dustyDust() {
    /* ---- particles.js config ---- */

    particlesJS('dust', {
      'particles': {
        'number': {
          'value': 300,
          'density': {
            'enable': true,
            'value_area': 1000
          }
        },
        'color': {
          'value': '#ffffff'
        },
        'shape': {
          'type': 'circle',
          'stroke': {
            'width': 0,
            'color': '#000000'
          },
          'image': {
            'src': 'img/github.svg',
            'width': 100,
            'height': 100
          }
        },
        'opacity': {
          'value': 0.4,
          'random': true,
          'anim': {
            'enable': true,
            'speed': 1,
            'opacity_min': 0.1,
            'sync': false
          }
        },
        'size': {
          'value': 2.3,
          'random': true,
          'anim': {
            'enable': true,
            'speed': 2,
            'size_min': 0.1,
            'sync': false
          }
        },
        'line_linked': {
          'enable': false
        },
        'move': {
          'enable': true,
          'speed': 1,
          'direction': 'none',
          'random': false,
          'straight': false,
          'out_mode': 'out',
          'bounce': false,
          'attract': {
            'enable': false,
            'rotateX': 600,
            'rotateY': 1200
          }
        }
      },
      'interactivity': {
        'detect_on': 'canvas',
        'events': {
          'onhover': {
            'enable': false,
          },
          'onclick': {
            'enable': false
          },
          'resize': false
        }
      },
      'retina_detect': true
    });
  }

  function loaderEffects() {
  }

  function youtubePlayer() {
    videojs('vid1').ready( function() {
      var myPlayer = this;
    });
  }


  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.



// var options = {
//     prefetch: true,
//     pageCacheSize: 4,
//     cacheLength: 4,
//     onStart: {
//       duration: 2500, // Duration of our animation
//       render: function($container) {
//         // Add your CSS animation reversing class
//         $container.addClass('is-exiting');
//         // loading overlay starts fading in after 250ms
//         $('.loading-overlay').fadeIn();
//         // Scroll user to the top, this is very important, transition may not work without this
//         $('body').animate({
//           scrollTop: 0
//         });
//         // Restart your animation
//         smoothState.restartCSSAnimations();
//       }
//     },
//     onReady: {
//       duration: 0,
//       render: function($container, $newContent) {
//         $('.loading-overlay').fadeOut();
//         // Remove your CSS animation reversing class
//         $container.removeClass('is-exiting');
//
//         // Inject the new content
//         $container.html($newContent);
//
//       }
//     }
//   },
//   smoothState = $('#main').smoothState(options).data('smoothState');
//
//
