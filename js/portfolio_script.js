$(document).ready(function(){
    $('.projectContainer').hover( function(){
      $(this).find('.overlay')[0].style.display = "block";
    }, function(){
      $(this).find('.overlay')[0].style.display = "none";
    });

});
