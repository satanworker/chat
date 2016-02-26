
var clients = [];
var client_ses = [];
exports.subscribe = function(req, res) {
    if(client_ses.indexOf(req.sessionID) == -1) {
        client_ses.push(req.sessionID);
        console.log('sub :' + client_ses);
        //debug above ^
        clients.push(res);
    }
    res.on('close', function() {
        clients.splice(clients.indexOf(res), 1);
    });
};
exports.publish = function(message, nickname) {
    clients.forEach(function (res){
        var obj = {'message': message, 'nickname':nickname, 'type': 'publish'};
        res.end(JSON.stringify(obj));
    });
    console.log('pub :' + client_ses);
    clients = [];
    client_ses = [];
};

exports.auth = function (message, nickname, sub_res) {
    clients.push(sub_res);
    console.log('auth :' + client_ses);
    var obj = {'message': message, 'nickname':nickname, 'type': 'publish'};
}