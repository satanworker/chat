var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/chat_patch');
var users = db.get('users');
//db
//>>?>

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/reg', function(req, res, next) {
  var login = req.body.login;
  var password = req.body.password;
  if(password.length < 4) {
    res.end(JSON.stringify({'error': 'pass is as short as your dick'}))
  }
  else {
    users.find({"login": login}, {}, function(err, data) {
      if(err) throw err;
      console.log('req', data, data.length);
      if(data.length) {
        res.end(JSON.stringify({'error': 'stop copying people 0/'}))
      }
      else {
        users.insert({
          login: login,
          password: password,
          sessId: req.sessionID
        });
        res.end(JSON.stringify({}));
      }
    });
  }
});
router.post('/auth', function(req, res){
    var body = req.body;
    console.log('auth', body, body.length);
    if(Object.keys(body).length !== 0) {
      if(body.logout == 'Y') {
        users.update({sessId: req.sessionID}, {$set: {sessId: ''}});
        res.end()
      }
      else {
        users.find({login: body.login, password: body.password }, {}, function(err, data) {
          if(err) throw err;
          if(data.length) {
            users.update({login: body.login}, {$set: {sessId: req.sessionID}});
            res.end(JSON.stringify(data));
          }
          else {
            res.end(JSON.stringify({'error': 'FUCK Offf'}));
          }
        })
      }
    }
    else {
      users.find({sessId: req.sessionID}, {}, function(err, data) {
        if(err) throw err;
        res.end(JSON.stringify(data));
      })
    }
});
module.exports = router;

/*
 sessions.find({"sessId": sessId}, {}, function(err, data) {
 if(!data.length) {
 sessions.insert({
 "sessId": sessId,
 "allowed": false
 });
 }
 });



 sessions.update(
 { 'sessId': req.sessionID},
 {
 $set: {
 'nickname': body.name
 }
 }
 );
 */