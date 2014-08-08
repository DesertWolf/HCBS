/**
 * Created by jamesf on 8/7/14.
 */
var express        = require('express');
var hbs            = require('hbs');
var bodyParser     = require('body-parser');
var geocoder       = require('geocoder');
var Parse          = require('parse').Parse;
var morgan         = require('morgan');
var methodOverride = require('method-override');
var app            = express();
var appKey = "LZ2tB5MBWI5vlyfSVGGWdBJUq8NJznafCU3jJwrV";
var jsKey = "OolOrXs9MnHSZf86X4yQ0ZLEXfflpczQCRnANbIS";
Parse.initialize(appKey,jsKey);

app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

hbs.registerPartials('views/partials');

app.get('/', function(req, res){
    res.render('index', {title:'Welcome to HCBS Webapp'});
});

app.get('/clientSearch', function(req, res){

    res.render('clientSearch', {title:'Search for Clients'});
});

app.post('/clientMap', function(req, res){
    var lat;
    var lng;
    var address = req.body.address;
    var distance = req.body.miles;
    var ClientGeolocation = Parse.Object.extend("ClientGeolocation");
    var clientGeolocation = new ClientGeolocation;
    var point = new Parse.GeoPoint();
    var clientsLoc;


    geocoder.geocode(address, function(err, data) {
        getClientsNear(data,showClients);


    });

    function getClientsNear(data, callback){
        if (data.status == 'OK') {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;

            var userGeoPoint = new Parse.GeoPoint({latitude: lat, longitude: lng});
            var query = new Parse.Query(ClientGeolocation);
            miles = distance;
            query.withinMiles('location', userGeoPoint, miles);
            query.find({
                success: function (placeObjects) {
                    console.log("Found " + placeObjects.length + " Clients " );
                    clientsLoc = JSON.stringify(placeObjects);
                    callback(clientsLoc);
                }, error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        }

    }

    function showClients() {


        // console.log("here: " + clientsLoc);
        res.render('clientMap', {title: "Client Map Data",lat: lat, lng:lng, clients: clientsLoc});
    }

});



app.listen(8081);
console.log('Magic happens on port 8081');