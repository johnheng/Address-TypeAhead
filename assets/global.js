(function ($) {

    // Use this variable to set up the common and page specific functions. If you
    // rename this variable, you will also need to rename the namespace below.
    var Sage = {
        // All pages
        'common': {
            init: function () {

                var circle = $('.material-btn');
                var ham = $('.material-hamburger');

                $('li.dropdown').hover(function () {
                    if (!circle.hasClass("active")) {
                        $(this).find('.dropdown-menu, .arrow-up').stop(true, true).delay(100).fadeIn(300);
                    }
                }, function () {
                    if (!circle.hasClass("active")) {
                        $(this).removeClass("open");
                        $(this).find('.dropdown-menu, .arrow-up').stop(true, true).delay(100).fadeOut(300);
                    }
                });

                function openMenu() {
                    if (circle.hasClass("active")) {
                        $(".material-btn").animate({ "left": "-=70%" }, "slow");
                    }
                    else {
                        $(".material-btn").animate({ "left": "+=70%" }, "slow");
                    }
                    circle.toggleClass('active');
                    ham.toggleClass('material-close');
                    $("#background").fadeToggle();
                    return false;
                }

                function closeMenu() {
                    if (circle.hasClass("active")) {
                        $(".material-btn").animate({ "left": "-=70%" }, "slow");
                    }
                    $("#background").fadeOut();
                    ham.removeClass('material-close');
                    circle.removeClass('active');
                }


                //nav dropdown
                $('button.navbar-toggle').click(function (event) {
                    openMenu();
                    $('#collapse-container').toggle("slide", { direction: "left" }, "slow");
                    event.stopPropagation();
                });

                //nav sub dropdown
                $('#nav-menu li, #nav-menu a.nav-title-link').click(function (event) {
                    $('div.nav-sub, + .nav-sub', this).slideToggle();
                    if ($('span > i', this).hasClass('fa-angle-down')) {
                        $('span > i', this).removeClass('fa-angle-down').addClass('fa-angle-up');
                    }
                    else {
                        $('span > i', this).removeClass('fa-angle-up').addClass('fa-angle-down');
                    }
                    event.stopPropagation();
                });

                //if nav is open and click outside, close nav
                $(document).bind('click', function(e) {
                    if(!$(e.target).is('header, #page_header, #nav-menu li, #nav-menu a, #nav-more li, #nav-more a, #nav-mobile li, #nav-mobile a, #nav-mobile li, #nav-mobile a, button.navbar-toggle, button.navbar-toggle > span, #collapse-container, #navbar-collapse')) {

                        if (circle.hasClass("active")) {
                            $('#collapse-container:visible').toggle("slide", { direction: "left" }, "slow");
                            closeMenu();
                        }
                        $(".background").fadeOut();
                    }
                });

                $(window).resize(function () {
                    if (window.matchMedia('(min-width: 768px)').matches) {
                        if (circle.hasClass("active")) {
                            closeMenu();
                        }
                        $('#collapse-container').removeAttr("style");
                    }
                });

                $('.nav-sub li a').click(function (e) {
                    e.preventDefault();
                    var url = $(this).attr("href");
                    window.location = url;
                });

                // Animate form fields on focus or blur
                $('.effect-field').each(function () {
                    var $parent = $(this).parents('.effect-parent');

                    // some fallback if there is a value pre populated from the server
                    if ($(this).val() == "") {
                        $parent.removeClass('effect-active');
                    } else {
                        $parent.addClass('effect-active');
                    }

                    $(this).focus(function () {
                        $parent.addClass('effect-active');
                    });
                    $(this).blur(function () {
                        //$('body').removeClass('search-active');

                        if ($(this).val() == "") {
                            $parent.removeClass('effect-active');
                        } else {
                            $parent.addClass('effect-active');
                        }
                    });


                });
            },
            finalize: function () {
                // JavaScript to be fired on all pages, after page specific JS is fired
                $("*").click(function () {
                    $(".tooltip:visible").hide();
                });

                $(function () {
                    $('input[type=password]').attr('autocomplete', 'off');
                });

                $("#nav-menu a[href^=#ratealerts]").click(function (e) {
                    jQuery.scrollTo.window().queue([]).stop();
                    $("#btnRateConfirmation").click();
                    e.preventDefault();
                    return false;
                })

                $("#quick_search_input").keyup(debounce(function(e) {
                    var charTyped = String.fromCharCode(e.which);
                    console.log(charTyped);
                    if (/[a-z\d]/i.test(charTyped) || e.which == 8) {
                        loadListings($("#quick_search_input").val());
                    }
                },200));

                $(document).mouseup(function (e) {
                    var container = $("#cityzipform-typeahead, #quick_search_input");

                    if (!container.is(e.target)
                        && container.has(e.target).length === 0) {
                        clearListings();
                    }
                });

                function debounce(func, wait, immediate) {
                    console.log(wait);
                    var timeout;
                    return function () {
                        var context = this, args = arguments;
                        var later = function () {
                            timeout = null;
                            if (!immediate) func.apply(context, args);
                        };
                        var callNow = immediate && !timeout;
                        clearTimeout(timeout);
                        timeout = setTimeout(later, wait);
                        if (callNow) func.apply(context, args);
                    };
                };
            }
        }
    };

    // The routing fires all common scripts, followed by the page specific scripts.
    // Add additional events for more control over timing e.g. a finalize event
    var UTIL = {
        fire: function (func, funcname, args) {
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
        loadEvents: function () {
            // Fire common init JS
            UTIL.fire('common');

            // Fire page-specific init JS, and then finalize JS
            $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function (i, classnm) {
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

function formatCurrencyVal(num) { //different
    num = num.toString().replace(/\$|\,|%/g, '');

    if (isNaN(num)) {
        return;
    }
    sign = (num == (num = Math.abs(num)));
    num = Math.abs(num);
    num = Math.round(num);
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();

    if (cents < 10)
        cents = "0" + cents;

    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return '$' + (((sign) ? num.valueOf() : "-" + num.valueOf()));

}