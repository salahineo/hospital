(function ($) {
  "use strict";
  var $event = $.event,
    $special, resizeTimeout;
  $special = $event.special.debouncedresize = {
    setup: function () {
      $(this).on("resize", $special.handler);
    },
    teardown: function () {
      $(this).off("resize", $special.handler);
    },
    handler: function (event, execAsap) {
      // Save the context
      var context = this,
        args = arguments,
        dispatch = function () {
          // set correct event type
          event.type = "debouncedresize";
          $event.dispatch.apply(context, args);
        };
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      execAsap ? dispatch() : resizeTimeout = setTimeout(dispatch, $special.threshold);
    },
    threshold: 150
  };

  //------- OWL carousle init  ---------------
  jQuery(document).ready(function () {
    function init_carousel_owl() {
      $(".init-carousel-owl").each(function () {
        var items = $(this).data("items") ? $(this).data("items") : 5;
        var items_lg = $(this).data("items_lg") ? $(this).data("items_lg") : 4;
        var items_md = $(this).data("items_md") ? $(this).data("items_md") : 3;
        var items_sm = $(this).data("items_sm") ? $(this).data("items_sm") : 2;
        var items_xs = $(this).data("items_xs") ? $(this).data("items_xs") : 1;
        var loop = $(this).data("loop") ? $(this).data("loop") : true;
        var speed = $(this).data("speed") ? $(this).data("speed") : 200;
        var auto_play = $(this).data("auto_play") ? $(this).data("auto_play") : false;
        var auto_play_speed = $(this).data("auto_play_speed") ? $(this).data("auto_play_speed") : false;
        var auto_play_timeout = $(this).data("auto_play_timeout") ? $(this).data("auto_play_timeout") : 1000;
        var auto_play_hover = $(this).data("auto_play_hover") ? $(this).data("auto_play_hover") : true;
        var navigation = $(this).data("navigation") ? $(this).data("navigation") : false;
        var rewind_nav = $(this).data("rewind_nav") ? $(this).data("rewind_nav") : true;
        var pagination = $(this).data("pagination") ? $(this).data("pagination") : false;
        var mouse_drag = $(this).data("mouse_drag") ? $(this).data("mouse_drag") : true;
        var touch_drag = $(this).data("touch_drag") ? $(this).data("touch_drag") : true;

        $(this).owlCarousel({
          nav: navigation,
          autoplay: auto_play,
          autoplayTimeout: auto_play_timeout,
          autoplaySpeed: auto_play_speed,
          autoplayHoverPause: auto_play_hover,
          navText: ["<i class=\"gv-icon-158\"></i>", "<i class=\"gv-icon-159\"></i>"],
          autoHeight: false,
          loop: loop,
          dots: pagination,
          rewind: rewind_nav,
          smartSpeed: speed,
          mouseDrag: mouse_drag,
          touchDrag: touch_drag,
          responsive: {
            0: {
              items: 1,
              nav: false
            },
            640: {
              items: items_xs,
              nav: false
            },
            768: {
              items: items_sm,
              nav: false
            },
            992: {
              items: items_md
            },
            1200: {
              items: items_lg
            },
            1400: {
              items: items
            }
          }
        });
        $(this).on("translated.owl.carousel", function (event) {
          toggleArrows($(this));
        });
      });
    }

    function toggleArrows(elm) {
      elm.find(".owl-item").removeClass("active-effect");
      elm.find(".owl-item.active").addClass("active-effect");
    }

    init_carousel_owl();

    $(document).scroll(function () {
      var scroll = $(this).scrollTop();
      $(".init-carousel-owl").each(function () {
        var top = $(this).offset().top;
        if (scroll >= top - 450) {
          $(this).find(".owl-item.active").addClass("active-effect");
        }
      });
    });

    //===== Gallery ============
    $("a[data-rel^='prettyPhoto[g_gal]']").prettyPhoto({
      animation_speed: "normal",
      social_tools: false
    });

    //===== Popup video ============
    $(".popup-video").magnificPopup({
      type: "iframe",
      fixedContentPos: false
    });
    //===== WOW ============
    new WOW().init();

    $(".gsc-tabs-views-ajax ul[data-load=\"ajax\"] a").on("click", function () {
      var $href = $(this).data("panel");
      var self = $(this);
      var main = $($href);
      var main_elements = $($href);
      self.parents(".nav-tabs").find("li").removeClass("active");
      self.parent("li").addClass("active");
      if (main.length > 0) {
        if (main_elements.data("loaded") == false) {
          self.parents(".gsc-tabs-views-ajax").addClass("ajaxloadding");
          $.ajax({
            url: drupalSettings.gavias_load_ajax_view,
            type: "POST",
            dataType: "html",
            data: "view=" + main.data("view")
          }).done(function (reponse) {
            main_elements.html(reponse);
            main.data("loaded", "true");
            self.parents(".gsc-tabs-views-ajax").find(".tab-pane").removeClass("active");
            $($href).addClass("active");
            init_carousel_owl();
            Drupal.attachBehaviors(document);
            self.parents(".gsc-tabs-views-ajax").removeClass("ajaxloadding");
          });
          return true;
        } else {
          self.parents(".gsc-tabs-views-ajax").find(".tab-pane").removeClass("active");
          $($href).addClass("active");
        }
      }
    });
  });

  //====== OWL Carousel width thumbnail ==============
  $(document).ready(function () {


    //smooth scrolling

    // Add smooth scrolling to all links
    $("a").on("click", function (event) {

      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
        // Prevent default anchor click behavior
        //  event.preventDefault();

        // Store hash
        var hash = this.hash;
        var tt = $(hash).offset().top - 100;


        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $("html, body").animate({
          scrollTop: tt
        }, 800, function () {

          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        });


        $("#menu-bar").trigger("click");

      } // End if


    });


    if ($(window).width() > 780) {
      if ($.fn.jpreLoader) {
        var $preloader = $(".js-preloader");
        $preloader.jpreLoader({
          autoClose: true
        }, function () {
          $preloader.addClass("preloader-done");
          $("body").trigger("preloader-done");
          $(window).trigger("resize");
        });
      }
    } else {
      $("body").removeClass("js-preloader");
    }
    $(".simpleslider").unslider();


  });

  jQuery(document).ready(function () {
    var $container = $(".post-masonry-style");
    $container.imagesLoaded(function () {
      $container.masonry({
        itemSelector: ".item-masory",
        gutterWidth: 0,
        columnWidth: 1
      });
    });


    $(".accorion-button").on("click", function (e) {


      $(".accorion-button").parent().parent().parent().removeClass("opend-panel");


      $(this).parent().parent().parent().addClass("opend-panel");


    });


    $(".gva-search-region .icon , .search-btn-mobile").on("click", function (e) {

      if ($(".search-content").hasClass("show")) {
        $(".search-content").removeClass("show");
      } else {
        $(".search-content").addClass("show");
      }
      e.stopPropagation();
    });


    $(".search-content-close i").on("click", function (e) {

      $(".search-content").removeClass("show");

      e.stopPropagation();
    });


    // ==================================================================================
    // Offcavas
    // ==================================================================================
    $("#menu-bar").on("click", function (e) {
      if ($(".gva-offcanvas-mobile").hasClass("show-view")) {
        $(this).removeClass("show-view");
        $(".gva-offcanvas-mobile").removeClass("show-view");
      } else {
        $(this).addClass("show-view");
        $(".gva-offcanvas-mobile").addClass("show-view");
      }
      e.stopPropagation();
    });
    $(".close-offcanvas").on("click", function (e) {
      $(".gva-offcanvas-mobile").removeClass("show-view");
      $("#menu-bar").removeClass("show-view");
    });

    /*========== Click Show Sub Menu ==========*/
    $(".gva-navigation a").on("click", ".nav-plus", function () {
      if ($(this).hasClass("nav-minus") == false) {
        $(this).parent("a").parent("li").find("> ul").slideDown();
        $(this).addClass("nav-minus");
      } else {
        $(this).parent("a").parent("li").find("> ul").slideUp();
        $(this).removeClass("nav-minus");
      }
      return false;
    });

    /* ============ Isotope ==============*/
    if ($.fn.isotope) {
      if ($(".isotope-items").length) {
        $(".isotope-items").each(function () {
          var _pid = $(this).data("pid");
          var $el = $(this),
            $filter = $(".portfolio-filter a." + _pid),
            $loop = $(this);

          $loop.isotope();

          $loop.imagesLoaded(function () {
            $loop.isotope("layout");
          });
          var i = 0;

          function reloay() {
            var e = $(document).scrollTop();
            //console.log($(window).height());
            $loop.each(function () {
              var o = $loop.parents(".gva-portfolio-items");
              if (o.offset().top <= (e + $(window).height()) && o.offset().top + $(window).height() > e) {
                $loop.isotope("layout");
              }
            });
          }

          $(window).load(function () {
            setTimeout(function () {
              reloay();
            }, 1000);
          });

          $(document).scroll(function () {
            reloay();
          });

          if ($filter.length > 0) {
            $filter.on("click", function (e) {
              e.preventDefault();
              var $a = $(this);
              $filter.removeClass("active");
              $a.addClass("active");
              $loop.isotope({filter: $a.data("filter")});
            });
          }
        });
      }
    }
    //==== Customize =====
    $(".gavias-skins-panel .control-panel").click(function () {
      if ($(this).parents(".gavias-skins-panel").hasClass("active")) {
        $(this).parents(".gavias-skins-panel").removeClass("active");
      } else $(this).parents(".gavias-skins-panel").addClass("active");
    });

    $(".gavias-skins-panel .layout").click(function () {
      $("body").removeClass("wide-layout").removeClass("boxed");
      $("body").addClass($(this).data("layout"));
      $(".gavias-skins-panel .layout").removeClass("active");
      $(this).addClass("active");
      var $container = $(".post-masonry-style");
      $container.imagesLoaded(function () {
        $container.masonry({
          itemSelector: ".item-masory",
          gutterWidth: 0,
          columnWidth: 1
        });
      });
    });

    /*-------------Milestone Counter----------*/
    jQuery(".milestone-block").each(function () {
      jQuery(this).appear(function () {
        var $endNum = parseInt(jQuery(this).find(".milestone-number").text());
        jQuery(this).find(".milestone-number").countTo({
          from: 0,
          to: $endNum,
          speed: 4000,
          refreshInterval: 60,
          formatter: function (value, options) {
            value = value.toFixed(options.decimals);
            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return value;
          }
        });
      }, {accX: 0, accY: 0});
    });
    /*----------- Animation Progress Bars --------------------*/

    $("[data-progress-animation]").each(function () {
      var $this = $(this);
      $this.appear(function () {
        var delay = ($this.attr("data-appear-animation-delay") ? $this.attr("data-appear-animation-delay") : 1);
        if (delay > 1) $this.css("animation-delay", delay + "ms");
        setTimeout(function () {
          $this.animate({width: $this.attr("data-progress-animation")}, 800);
        }, delay);
      }, {accX: 0, accY: -50});
    });

    /*----------------------------------------------------*/
    /*  Pie Charts
    /*----------------------------------------------------*/
    var pieChartClass = "pieChart",
      pieChartLoadedClass = "pie-chart-loaded";

    function initPieCharts() {
      var chart = $("." + pieChartClass);
      chart.each(function () {
        $(this).appear(function () {
          var $this = $(this),
            chartBarColor = ($this.data("bar-color")) ? $this.data("bar-color") : "#F54F36",
            chartBarWidth = ($this.data("bar-width")) ? ($this.data("bar-width")) : 150;
          if (!$this.hasClass(pieChartLoadedClass)) {
            $this.easyPieChart({
              animate: 2000,
              size: chartBarWidth,
              lineWidth: 8,
              scaleColor: false,
              trackColor: "#eee",
              barColor: chartBarColor
            }).addClass(pieChartLoadedClass);
          }
        });
      });
    }

    initPieCharts();

    // ============================================================================
    // mb_YTPlayer video background
    // ============================================================================
    if (!jQuery.browser.mobile) {
      $(".youtube-bg").mb_YTPlayer();
    }

    // ============================================================================
    // Fixed top Menu Bar
    // ============================================================================
    if ($(".gv-sticky-menu").length > 0) {
      var sticky = new Waypoint.Sticky({
        element: $(".gv-sticky-menu")[0]
      });
    }

    // ============================================================================
    // Text Typer
    // ============================================================================
    $("[data-typer-targets]", ".rotate-text").typer();
  });

  function load_lazy() {
    if (drupalSettings.layzy_load == "on") {
      $(window).off("scroll.unveil resize.unveil lookup.unveil");
      setTimeout(function () {
        $("img.unveil-image").unveil(100, function () {
          $(this).addClass("image-loaded");
        });
      }, 200);
    }
    return false;
  }

  var footerFixed = function () {
    var footer_height = $("#footer").height();
    $("body.footer-fixed .gva-body-page").css("margin-bottom", footer_height);
  };

  var animationDimensions = function () {
    var gavias_height = $(window).height();
    $(".bb-container.full-screen").each(function () {
      $(this).css("height", gavias_height);
    });
  };

  $(document).ready(function () {
    load_lazy();
    footerFixed();
    if ($(".full-screen").length > 0) {
      animationDimensions();
    }
    $(".lightGallery").lightGallery({
      selector: ".image-item .zoomGallery"
    });
  });

  $(window).load(function () {
    if ($(".full-screen").length > 0) {
      animationDimensions();
    }
  });

  $(window).on("debouncedresize", function (event) {
    footerFixed();
    if ($(".full-screen").length > 0) {
      setTimeout(function () {
        animationDimensions();
      }, 50);
    }
  });

  // $(window).load(function(){
  //   if($('.block-gavias-sliderlayer, .before-help-region').length > 0){
  //     var html_help = $('.gav-help-region').html();
  //     $('.gav-help-region').remove();
  //     html_help = '<div class="help gav-help-region">' + html_help + '</div>';
  //     $('.block-gavias-sliderlayer, .before-help-region').first().after(html_help);
  //     $('.gav-help-region').show();
  //   }else{
  //     var html_help = $('.gav-help-region').html();
  //     $('.gav-help-region').remove();
  //     html_help = '<div class="help gav-help-region">' + html_help + '</div>';
  //     $('#page-main-content').first().before(html_help);
  //     $('.gav-help-region').show();
  //   }
  // });

})(jQuery);
