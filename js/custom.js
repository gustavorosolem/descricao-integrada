$(document).ready(function(){
    if($('body.login').length) {
        if($.cookie('chave_api') && $.cookie('chave_aplicacao')) {
            location.href = "painel.html";
        } else {
            $(document).mousemove(function(e){
                TweenLite.to($('body'), .5, 
                { css: 
                    {
                        'background-position':parseInt(event.pageX/8) + "px "+parseInt(event.pageY/12)+"px, "+parseInt(event.pageX/15)+"px "+parseInt(event.pageY/15)+"px, "+parseInt(event.pageX/30)+"px "+parseInt(event.pageY/30)+"px"
                    }
                });
            });
            $("#login").submit(function(event) {
                if($('.api').val() === "" || $('.app').val() === "") {
                    alert('Todos os campos devem ser preenchidos corretamente');
                } else {
                    var expire_time;
                    if($('.remember').prop('checked')) {
                        expire_time = 1000;
                    } else {
                        expire_time = 1;
                    }
                    $.cookie('chave_api', $('.api').val(), { expires: expire_time, path: '/' });
                    $.cookie('chave_aplicacao', $('.app').val(), { expires: expire_time, path: '/' });
                    location.href = "painel.html";
                }
                event.preventDefault();
            });
        }
    }
});

$("#logout").click(function() {
    $.removeCookie('chave_api', { path: '/' });
    $.removeCookie('chave_aplicacao', { path: '/' });
    location.href = "index.html";
});