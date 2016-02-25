var express = require('express');
var router = express.Router();
var chat = require('../node_components/chat.js');
var fs = require('fs');
//db
var db;
var sessions;

/* GET home page. */
router.get('/', function(req, res, next) {
  db = req.db;
  sessions  = db.get('session');
  var sessId = req.sessionID;
  sessions.insert({
    "sessId": sessId,
    "allowed": false
  });
  sessions.find({}, {}, function(err, data) {
    console.log(data);
  });
  res.render('index', { title: 'Express' });
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
  sessions  = db.get('session');
  sessions.find( {'allowed': true}, {}, function(e, docs) {
      for(var d = 0; d < docs.length; d++) {
        clients_ar.push(docs[d].sessId);
      }
    chat.subscribe(req, res, clients_ar);
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

    }
    chat.publish(body.message);

    res.end('ok')
  });
});

module.exports = router;

