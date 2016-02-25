var http = require('http');
var fs = require('fs');
var chat = require('./chat');
var clients = [];
http.createServer(function(req, res) {
    
    switch(req.url) {
        case '/':
            sendFile('./index.html', res);
            break;
        case '/subscribe':
            chat.subscribe(req, res);
            break;
        case '/publish':
	    console.log(req);
            var body = '';
            req.on('readable', function() {
                body += req.read();
            }).on('end', function(){
                try {
                    console.log('try body', JSON.stringify(body));
                    body = JSON.parse(body);
                }
                catch(error) {
                    res.statusCode = 400;
                    res.end('Bad request');
                    return;
                }
//		console.log(clients);
		if(body.message=="1488"){
			clients.push(req.connection.remotePort);
			console.log('allowing: '+req.connection.remotePort);
		}
		//if(clients.indexOf(req.connection.remotePort)!=-1){
                	chat.publish(req.connection.remotePort+": "+body.message, clients);
		//}		
                res.end('ok');
            });
            break;
        default:
            res.statusCode = 404;
            res.end('Not Found');
    }
}).listen(1010);
//
var sendFile = function(fileName, res) {
    fs.readFile(fileName, 'utf-8' , function (err, data) {
        if(err) {
            throw  err;
        }
        else {
            res.end(data);
        }
    });
};
//sendFile('index.html');
