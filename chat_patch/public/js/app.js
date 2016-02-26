/**
 * Created by mini on 26.02.16.
 */
function auth(data) {
    $.post( "/auth", data).done(function( data ) {
        data =  JSON.parse(data);
        if(data.length) {
            logIn();
            $('.name').text(data[0].login);
        }
    });
}
function logIn () {
    $('.forms_log').hide();
    $('.logout').show();
    $('.messages').show();
}
function logOut () {
    $.post('/auth', {"logout": 'Y'}).done(function() {
        $('.forms_log').show();
        $('.logout').hide();
        $('.messages').hide();
    });
}
$(document).ready(function() {
    $('#reg').submit(function(event) {
        event.preventDefault();
        var reg_data = $(this).serialize();
        $.post( "/reg", reg_data)
            .done(function( data ) {
                data = JSON.parse(data);
                if(data.error) {
                    alert(data.error);
                }
                else {
                   auth({});
                }
                console.log(data);
            });
    });
    $('.logout').click(function(event) {
        event.preventDefault();
        logOut();
    });
    $('#auth').submit(function(event) {
        event.preventDefault();
        var auth_data = $(this).serialize();
        $.post( "/auth", auth_data)
            .done(function( data ) {
                data = JSON.parse(data);
                if(data.error) {
                    alert(data.error)
                }
                else {
                    logIn();
                    $('.name').text(data[0].login);
                }
            });
    });
    auth();
});