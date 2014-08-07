/**
 * Created by jamesf on 8/7/14.
 */
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var app            = express();

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT

app.get('/', function(req, res){
    res.send('Welcome to HCBS Webapp');
});

app.listen(8081);
console.log('Magic happens on port 8081');