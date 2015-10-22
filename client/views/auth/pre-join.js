Template.preJoin.rendered = function(){
    $('body').addClass('auth-page');
}

Template.preJoin.destroyed = function(){
    $('body').removeClass('auth-page');
}
