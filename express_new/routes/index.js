var express = require('express');
var router = express.Router();
var chat = require('../node_components/chat.js');
var fs = require('fs');
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
  res.render('index', { title: 'Чат заебись на ноде четко!!', img_src: '/img/ass.jpg' });
});

router.get('/test', function(req, res, next) {
  db = req.db;
  sessions  = db.get('session');
  var session = sessions.find( {'sessId': req.sessionID}, {}, function(e, docs) {
   console.log(docs);
  });
  res.render('test', { test: 'huu'});
});

router.get('/subscribe', function(req, res, next) {
  var clients_ar = [];
  db = req.db;
  sub_res = res;
  sessions  = db.get('session');
  sessions.find( {'allowed': true, 'sessId': req.sessionID}, {}, function(e, data) {
    if(data.length) {
      chat.subscribe(req, res);
    }
  });
});

router.post('/publish', function(req, res, next) {
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

      sub_res.end('10')
    }
    sessions.find( {'allowed': true, 'sessId': req.sessionID}, {}, function(e, data) {
      if(data.length) {
        chat.publish(body.message);
      }
    });
    res.end('ok');
  });
});

module.exports = router;

