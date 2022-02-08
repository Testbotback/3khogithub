// This file provide function for the animations on the homescreen.

// Main code to control animations.
$(document).ready(function() {
    var animation = false,
     animDur = 1000,
     $row = $('.box__row'),
     $cell = $('.box__row-cell'),
     $content = $('.box__content'),
     $closeBtn = $('.box__close');
  
    var active = function() {
      if (!animation) {
        animation = true;
        var cellData = $(this).data('cell');
        var $content = $('.box__content[data-content=' + cellData + ']');
  
        $(this).addClass('active');
        $content.addClass('show-content');
        $closeBtn.addClass('box-close-active');
      }
  
      setTimeout(function() {
        animation = false;
      }, animDur);
    }
  
    var close = function() {
      animation = true;
      $cell.removeClass('active');
      $content.removeClass('show-content');
      $(this).removeClass('box-close-active');
  
      setTimeout(function() {
        animation = false;
      }, animDur);
    }
  
    $row.on('click', '.box__row-cell', active);
    $closeBtn.on('click', close);
    $cell.on({
      mouseenter: function() {
        $cell.addClass('hover-cell');
        $(this).removeClass('hover-cell');
      },
      mouseleave: function() {
        $cell.removeClass('hover-cell');
      }
    });
  });

/* ---- particles.js config ---- */
particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 150,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#00ff00"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 4,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 5
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });