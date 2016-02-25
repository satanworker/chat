document.addEventListener("DOMContentLoaded", function() {

    var publish = document.getElementById('publish');
    var messages = document.getElementById('messages');

    publish.onsubmit = function() {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/publish', true);

        xhr.send(JSON.stringify({message: this.elements.message.value}));

        this.elements.message.value = '';

        //subscribe();

        return false;
    };

    subscribe();

    function subscribe() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/subscribe', true);

        xhr.setRequestHeader("Content-type","text/plain");

        xhr.onload = function() {
            var li = document.createElement('li');
            li.textContent = this.responseText;

            messages.appendChild(li);

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