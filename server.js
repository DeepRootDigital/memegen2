#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var meme = require('./routes/meme');
var admin = require('./routes/admin');
var errors = require('./routes/error');
// REMOVED: Background Code
//var bg = require('./routes/bg');
var images = require('./routes/images');
var profiles = require('./routes/profiles');
var http = require('http');
var path = require('path');
var fs = require('fs');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://bmswombat:fvps123@ds055689.mongolab.com:55689/meme", {native_parser:true});

var app = express();

// all environments
app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || 8080);
app.set('ip', process.env.IP || '127.0.0.1');
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({keepExtensions:true,uploadDir:__dirname+'/public/icons/tmp'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


/* Define all the pages */

// Pre login
app.get('/', function(req, res) { res.render('frontpage.html'); });
app.get('/signup', function(req, res) { res.render('signup.html'); });
app.get('/login', function(req, res) { res.render('login.html'); });
app.get('/changepw', function(req, res) { res.render('changepw.html'); });

// Post login
app.get('/home', function(req, res) { res.render('home.html'); });
app.get('/create', function(req, res) { res.render('creatememe.html'); });
app.get('/createtemplate', function(req, res) { res.render('templatememe.html'); });
app.get('/choose', function(req, res) { res.render('choose.html'); });
app.get('/manage', function(req, res) { res.render('user/managememe.html'); });
app.get('/templatecenter', function(req, res) { res.render('user/templatecenter.html'); });
app.get('/learn', function(req, res) { res.render('user/learn.html'); });
app.get('/support', function(req, res) { res.render('user/support.html'); });
app.get('/profiles', function(req, res) {res.render('user/profiles.html')});

// Misc Assets
// REMOVED: Background Code
//app.get('/bg-upload', function(req, res) { res.render('bg-upload.html'); });
app.get('/icon-upload', function(req, res) { res.render('icon-upload.html'); });

// Admin Pages

app.get('/admin', function(req, res) { res.render('admin.html'); });

/* End Page Definitions */

/* Define RESTful actions */

// GET
app.get('/userlist', user.list(db));
app.get('/memelist', meme.memelist(db));
// REMOVED: Background Code
//app.get('/bglist', bg.bglist(db));
app.get('/imagelist', images.imageList(db));
app.get('/iconlist', images.iconList(db));
app.get('/profilelist', profiles.profileList(db));

// POST
app.post('/addmeme', meme.addmeme(db));
// REMOVED: Background Code
//app.post('/bglist', bg.addbg(db));
//app.post('/deletebg', bg.deletebg(db));
app.post('/uploadimg', images.uploadFile(db));
app.post('/uploadicon', images.uploadIcon(db));
app.post('/dropzoneupload', images.dzUpload(db));
app.post('/register', user.register(db));
app.post('/deletememe', meme.deletememe(db));
app.post('/deleteimage', images.deleteimage(db));
app.post('/changepw', user.changepw(db));
app.post('/addprofile', profiles.addProfile(db));
app.post('/deleteprofile', profiles.deleteProfile(db));
app.post('/setactiveprofile', profiles.setActiveProfile(db));


app.post('/error', errors.submiterror(db));

// Update
app.post('/updatememe', meme.updateMeme(db));

// Admin Actions

app.post('/updateuserlevel', admin.changeuser(db));
app.post('/adminlog', admin.adminlog(db));


/* End RESTful actions */
http.createServer(app).listen(process.env.PORT || 8080, app.get('ip'), function(){
  console.log('Express server listening on port ' + (process.env.PORT || "8080");
});