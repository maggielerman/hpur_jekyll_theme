var portfolio = {};
portfolio.minecraft = {};
portfolio.ml = {};

$(function() {
  portfolio.loadAndFadeInCaseImages();
  portfolio.minecraft.init();
  portfolio.ml.init();

  $(".case-item-minecraft").mouseenter(function(){
    if (portfolio.minecraft.isInMotion == true) return;
    portfolio.playMinecraftAnimationReverse(portfolio.minecraft.reverse);
  }).mouseleave(function() {
    if (portfolio.minecraft.isInMotion == true) return;
    portfolio.playMinecraftAnimationReverse(portfolio.minecraft.reverse);
  });

  $(window).on("scroll resize", portfolio.ml.onlyPlayIfVisible);
});

portfolio.ml.init = function() {
  // Wrap every letter in a span
  $('.case-item-ml-text-wrapper').each(function(){
    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='case-item-header-ml-letter'>$&</span>"));
  });

  portfolio.ml.animation = anime.timeline({loop: true})
    .add({
      targets: '.case-item-header-ml-letter',
      translateY: ["1.1em", 0],
      translateZ: 0,
      duration: 750,
      delay: function(el, i) {
        return 50 * i;
      }
    }).add({
      targets: '.case-item-header-ml-letter',
      opacity: 0,
      translateZ: 0,
      easing: "easeOutExpo",
      duration: 750,
      delay: function(el, i) {
        return 200 + 50 * i;
      }
    });
}

portfolio.ml.onlyPlayIfVisible = function() {
  portfolio.ml.shouldPlay() ? portfolio.ml.animation.play() : portfolio.ml.animation.pause();
}

portfolio.ml.shouldPlay = function() {
  var winHeight = window.innerHeight;
  var bounds = $(".case-item-header-ml")[0].getBoundingClientRect();
  var offset = 20; // Greater offset -> will stop playing earlier

  // Check if bottom of comp is above view or if top of comp is below view
  if (bounds.bottom < 0+offset || bounds.top > winHeight-offset) return false;
  // Default to true
  return true;
}

portfolio.loadAndFadeInCaseImages = function() {
  // Load background images
  $("[data-image]").each(function(i, elem) {
    var $elem = $(elem),
    url = "/images/portfolio/" + $elem.attr('data-image');
    if (url == null || url.length <= 0 ) { return; }

    $elem.addClass('image-loading');
    $('<img/>').attr('src', url).load(function() {
      $(this).remove();
      $bg = $('<div class="case-item-bg"/>');
      $bg.css( 'background-image', 'url(' + url + ')');

      $elem.prepend($bg);
      $elem
        .removeClass('image-loading')
        .addClass('image-ready');
    });
  });
}

portfolio.minecraft.init = function() {
  portfolio.minecraft.interval = 40;
  portfolio.minecraft.reverse = false;
  portfolio.minecraft.isInMotion = false;
  portfolio.minecraft.block = $(".case-item-minecraft-block");
  portfolio.minecraft.frames = $(portfolio.minecraft.block).attr('data-frames');
  portfolio.minecraft.frameWidth = parseInt($(portfolio.minecraft.block).css("width"));
  portfolio.minecraft.frameHeight = parseInt($(portfolio.minecraft.block).css("height"));
  portfolio.minecraft.currentFrame = 20;
}

portfolio.playMinecraftAnimationReverse = function(reverse) {
  portfolio.minecraft.reverse = !portfolio.minecraft.reverse;
  portfolio.stopAnimation();
  // Flip direction
  portfolio.minecraft.currentFrame = portfolio.minecraft.frames - portfolio.minecraft.currentFrame;

  portfolio.minecraft.loop = setInterval ( () => {
    if (portfolio.minecraft.currentFrame + 1 >= portfolio.minecraft.frames) {
      portfolio.stopAnimation();
      return;
    }
    // Stop animation from reversing if it's more than 2/5 through completion (then just complete it)
    if (portfolio.minecraft.currentFrame > portfolio.minecraft.frames/5*2) portfolio.minecraft.isInMotion = true;

    portfolio.minecraft.currentFrame++;
    portfolio.setMinecraftFrameToInt(portfolio.minecraft.currentFrame, reverse);
  }, portfolio.minecraft.interval );
}

portfolio.setMinecraftFrameToInt = function(frame, reverse) {
  $(portfolio.minecraft.block)
    .css("background-position", 
      -frame*portfolio.minecraft.frameWidth + "px " + reverse*portfolio.minecraft.frameHeight + "px"
    );
}

portfolio.stopAnimation = function() {
  clearInterval(portfolio.minecraft.loop);
  portfolio.minecraft.isInMotion = false;
}