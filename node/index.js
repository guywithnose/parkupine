var express = require('express');
var _ = require('underscore');

var gm = require('googlemaps');
var garages = require('./garages');

var app = express();
app.use('/', function(req, res){
  gm.geocode(req.query.Body, function(err, response){
    var origins = response.results[0].geometry.location;
    var destinations = _.map(_.pluck(garages, 'position'), formatLocation).join('|');
    gm.distance(formatLocation(origins), destinations, function(err, response) {
      for (var index in garages) {
        garages[index].distance = response.rows[0].elements[index];
      }

      garages = _.sortBy(garages, function(garage){
        return garage.distance.duration.value
      });

      res.send(getResponse(formatGarage(garages[0])));
    }, 'false', null, null, null, 'imperial');
  });
});

port = process.env.PORT ? process.env.PORT : 9000;
app.listen(port);
console.log('Listening on ' + port);

function getResponse(message) {
  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response>\n<Message>" + message + "</Message>\n</Response>";
}

function formatLocation (location){
  return location.lat + ',' + location.lng;
}

function formatGarage (garage) {
  return garage.title + '\n' + garage.address + '\n' + garage.availableSpaces + ' open spots out of ' + garage.totalSpaces + '\n' + garage.distance.duration.value + ' mins walking' + '\nPrice: $' + garage.pricePerHr.toFixed(2);
}
