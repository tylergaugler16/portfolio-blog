$(document).ready(function(){
    $('.projectContainer').hover( function(){
      $(this).find('.overlay')[0].style.display = "block";
    }, function(){
      $(this).find('.overlay')[0].style.display = "none";
    });

    $(".animsition-overlay").animsition({

      inClass: 'overlay-slide-in-right',
      outClass: 'overlay-slide-out-right',
      inDuration: 1000,
      outDuration: 1000,
      linkElement: '.animsition-link',
      // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
      loading: true,
      loadingParentElement: 'body', //animsition wrapper element
      loadingClass: 'animsition-loading',
      loadingInner: '', // e.g '<img src="loading.svg" />'
      timeout: false,
      timeoutCountdown: 5000,
      onLoadEvent: true,
      browser: [ 'animation-duration', '-webkit-animation-duration'],
      // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
      // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
      overlay : true,
      overlayClass : 'animsition-overlay-slide',
      overlayParentElement : 'body',
      transition: function(url){ window.location.href = url; }
  }, function(){
    console.log("trying to do this");
  });

});
