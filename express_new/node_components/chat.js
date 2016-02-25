
var clients = [];
exports.subscribe = function(req, res, clients_ar) {
    //console.log('sub', clients_ar, clients_ar.indexOf(req.sessionID), req.sessionID);
    if(clients_ar.indexOf(req.sessionID) !== -1) {
        clients.push(res);
    }
    res.on('close', function() {
        clients.splice(clients.indexOf(res), 1);
    });
};
exports.publish = function(message) {
    console.log('pb');
    clients.forEach(function (res){
        res.end(message);
    });
    //clients = [];
};

