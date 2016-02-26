document.addEventListener("DOMContentLoaded", function() {

    var publish = document.getElementById('publish');
    var messages = document.getElementById('messages');
    var authorize = document.getElementById('authorize');

    //var huemoe;
    //var isTyping = false;
    //publish.addEventListener('keydown', function(event){
    //    var xhr1;
    //    //sending the fact that he's typing
    //    if(event.keyCode !== 13 && !isTyping) {
    //        console.log('keydown');
    //        xhr1 = new XMLHttpRequest();
    //        xhr1.open('POST', '/typing', true);
    //        xhr1.send(JSON.stringify({'typing': true}));
    //        isTyping = true;
    //    }
    //    clearTimeout(huemoe);
    //    huemoe = setTimeout(function(){
    //        console.log('stoptyping');
    //        xhr1 = new XMLHttpRequest();
    //        xhr1.open('POST', '/typing', true);
    //        xhr1.send(JSON.stringify({'typing':false}));
    //        isTyping = false;
    //    }, 1000);
    //});

    //getTyping();
    //
    //function getTyping(){
    //    var xhr = new XMLHttpRequest();
    //    xhr.open('GET', '/typing', true);
    //
    //    xhr.setRequestHeader("Content-type","text/plain");
    //
    //    xhr.onload = function() {
    //        var response = JSON.parse(this.responseText);
    //        console.log('goit typing', response);
    //        getTyping();
    //    }
    //}


    publish.onsubmit = function() {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/publish', true);
        console.log('SENDING SHIT FROM PUBLIC: '+JSON.stringify({message: this.elements.message.value}));
        xhr.send(JSON.stringify({message: this.elements.message.value}));

        this.elements.message.value = '';
        xhr.onload = function() {
         console.log(this.responseText)
        };
        //subscribe();

        return false;
    };


    authorize.onsubmit = function() {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/auth', true);

        xhr.send(JSON.stringify({name: this.elements.name.value}));
        console.log(JSON.stringify({name: this.elements.name.value}));
        return false;
    };

    subscribe();

    function subscribe() {
        console.log('rsub');
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/subscribe', true);


        xhr.setRequestHeader("Content-type","text/plain");
        // add longpolling onload from typing send
        xhr.onload = function() {

            console.log('response text:', this.responseText);

            var response = JSON.parse(this.responseText);
            console.log(response);
            if(response.type == 'publish')
            {
                var li = document.createElement('li');

                li.innerHTML = '<b>'+response.nickname+'</b>: '+response.message;
                // console.log('response text:'this.responseText);

                messages.appendChild(li);
            }
            else if(response.type == 'typing')
            {
                console.log(response);
            }


            subscribe();

        };
        xhr.onerror = xhr.onabort = function() {
            setTimeout(subscribe, 500);
        };
        xhr.send('');
    }
    document.body.addEventListener('keydown', function(event) {
        if(event.keyCode == 27) {
            if(messages.style.display  !== 'none') {
                messages.style.display  = 'none'
            }
            else {
                messages.style.display  = ''
            }
        }
    });

});