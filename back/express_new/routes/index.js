var express = require('express');
var router = express.Router();
var chat = require('../node_components/chat.js');
var fs = require('fs');
var bodyParser = require('body-parser')
//db
var db;
var sessions;
var sub_res;
/* GET home page. */
router.get('/', function(req, res, next) {
  db = req.db;
  sessions  = db.get('session');
  var sessId = req.sessionID;
  //db insert session
  sessions.find({"sessId": sessId}, {}, function(err, data) {
    if(!data.length) {
      sessions.insert({
        "sessId": sessId,
        "allowed": false
      });
    }
  });
  res.render('index', { title: 'test phpstorm from linux', img_src: '/img/ass.jpg' });

});

router.get('/test', function(req, res, next) {
  db = req.db;
  sessions  = db.get('session');
  var session = sessions.find( {'sessId': req.sessionID}, {}, function(e, docs) {
   //console.log(docs);
  });
  res.render('test', { test: 'huu'});
});


router.post('/typing', function(req, res, next) {
  var body = '';
  req.on('readable', function() {
      body += req.read();
    }).on('end', function() {
      body = JSON.parse(body);
      console.log(body);
    });
 // console.log(req.body);
});
router.post('/auth', function(req, res, next) {
  db = req.db;
  sessions  = db.get('session');
  console.log(req.body);
  var body = '';
  var session = sessions.find( {'sessId': req.sessionID}, {}, function(e, docs) {
    req.on('readable', function() {
      body += req.read();
    }).on('end', function() {
      try {
        body = JSON.parse(body);
      }
      catch(error) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }
      console.log('updating session with id '+req.sessionID+' to name '+body.name);
      sessions.update(
          { 'sessId': req.sessionID},
          {
            $set: {
              'nickname': body.name
            }
          }
      );
      console.log(body);
      res.end('ok');
    });
  });
  res.render('test', { test: 'huu'});
});




router.get('/subscribe', function(req, res, next) {
  var clients_ar = [];
  db = req.db;
  sessions  = db.get('session');
  sub_res = res;
  sessions.find( {'allowed': true, 'sessId': req.sessionID}, {}, function(e, data) {
    if(data.length) {
      chat.subscribe(req, res);
    }
  });
});

router.post('/publish', function(req, res, next) {
  console.log('GOT PUBLISH IN INDEX.JS');
  var body = '';
  db = req.db;
  sessions  = db.get('session');
  req.on('readable', function() {
    body += req.read();
  }).on('end', function() {
    try {
      body = JSON.parse(body);
    }
    catch(error) {
      res.statusCode = 400;
      res.end('Bad request');
      return;
    }
    console.log('GOT OUR AWESOME BODY: '+JSON.stringify(body));
    //TODO: wrap in checking
    if(body.message == '10') {
      console.log('detected', 10);
      sessions.update(
          { sessId: req.sessionID},
          {
            $set: {
              'allowed': true
            }
          }
      );
      chat.auth('loged in', 'Admin', sub_res);
      //sub_res.end(JSON.stringify({'type': 'publish','nickname': 'ADMINISTRATOR','message': "WELCOME TO OUR CHATIK"}))
    }
    else {
      sessions.find( {'allowed': true, 'sessId': req.sessionID}, {}, function(e, data) {
        if(data.length) {
          console.log(data);
          console.log('sending:'+ data.nickname );
          chat.publish(body.message,data[0].nickname);
        }
      });
    }
    res.end('ok');
  });
});

module.exports = router;

