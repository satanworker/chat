
var clients = [];
var client_ses = [];
exports.subscribe = function(req, res) {
    clients.push(res);
    client_ses.push(req.sessionID);
    console.log('sub :' + client_ses);
    res.on('close', function() {
        clients.splice(clients.indexOf(res), 1);
    });
};
exports.publish = function(message) {
    clients.forEach(function (res){
        res.end(message);
    });
    console.log('pub :' + client_ses);
    clients = [];
    client_ses = [];
};
