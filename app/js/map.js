var infoWindows = [];
var garages;
function initialize() {
  var mapOptions = {
    center: { lat: 36.850311, lng: -76.288529},
    zoom: 14
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  var garagePromise = $.getJSON('data/garages.json').then(function(result) {
    var garages = result;
    for (var index in garages) {
      var garage = garages[index];
      garage.percentFull = 100 - Math.floor(garage.availableSpaces * 100 / garage.totalSpaces);
    }

    return garages;
  });

  var address = get('address');
  var distancesPromise = garagePromise;
  if (address != null) {
    var locationPromise = codeAddress(address);
    $('.body-content').hide();
    $('.body-content').addClass('hidden-xs');
    $('.footer').hide();
    $('#map-canvas').removeClass('hidden-xs');
    $('#map-canvas').fadeIn();

    distancesPromise = $.when(locationPromise, garagePromise).then(function(location, garages) {
      var deferred = $.Deferred();
      if (!location) {
        return;
      }

      var positions = [];
      for (var i in garages) {
        positions.push(garages[i].position);
      }

      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [location],
        destinations: positions,
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
      },
      function(response, status) {
        var distances = response.rows[0].elements;
        $.each(distances, function(index, value) {
          garages[index].distance = distances[index];
        });
        garages = _.sortBy(garages, function(garage) {
          var availableOffset = 150 * Math.pow(1.9 - (garage.percentFull / 100), -5);
          return garage.distance.duration.value + availableOffset;
        });
        deferred.resolve(garages);

        map.setCenter(garages[0].position);
        map.setZoom(19);
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            title: 'You are here!'
        });
      });
      return deferred.promise();
    });
  }

  var mobileAddress = new google.maps.places.Autocomplete($('#destination_address')[0]);
  var toolbarAddress = new google.maps.places.Autocomplete($('input[name="address"]')[0]);
  google.maps.event.addListener(mobileAddress, 'place_changed', function() {
    convertToAddress(mobileAddress, $('#destination_address'));
  });
  google.maps.event.addListener(toolbarAddress, 'place_changed', function() {
    convertToAddress(toolbarAddress, $('input[name="address"]'));
  });

  garages = $.when(distancesPromise).done(function(garages) {
    for (var index in garages) {
      var garage = garages[index];
      garage.map = map;
      var content = $('<div>');

      if (garage.percentFull > 75) {
        content.append('<span style="color:#e62e2f;font-size:1.2em;font-weight:"><i class="fa fa-building"></i> ' + garage.title + '</span>');
        garage.icon='images/map-point-red.png';
      } else if (garage.percentFull > 50) {
        content.append('<span style="color:#f7941d;font-size:1.2em;font-weight:"><i class="fa fa-building"></i>' + garage.title + '</span>');
        garage.icon='images/map-point-yellow.png';
      } else {
        content.append('<span style="color:#B2D233;font-size:1.2em;font-weight:"><i class="fa fa-building"></i>' + garage.title + '</span>');
        garage.icon='images/map-point-green.png';
      }

      // content.append($('<li>').append('Title: ' + garage.title));
      content.append('<br><i class="fa fa-map-marker"></i> ' + garage.address);
      content.append('<br><i class="fa fa-car"></i> ' + garage.availableSpaces);
      content.append(' open spots out of ' + garage.totalSpaces);
      if (garage.distance) {
        content.append('<br><i class="fa fa-clock-o"></i> ' + garage.distance.duration.text + ' walking');
      }

      content.append('<br/><i class="fa fa-pie-chart"></i> ' + garage.percentFull + '% full');
      content.append('<br><i class="fa fa-money"></i> ' + garage.pricePerHr.toFixed(2));
      var infowindow = new google.maps.InfoWindow({
        content: $('<div>').append(content).html()
      });
      var marker = new google.maps.Marker(garage);
      var infowindow = new google.maps.InfoWindow({content: $('<div>').append(content).html()});
      infoWindows.push(infowindow);
      google.maps.event.addListener(marker, 'click', _.partial(showInfoWindow, map, marker, infowindow));
    }

    return garages;
  });
}

function get(varname) {
  var value = window.location.search.match(varname + '=(.*?)(&|$)');
  if (value) {
    return value[1];
  }
}


google.maps.event.addDomListener(window, 'load', initialize);

function showInfoWindow(map, marker, infowindow) {
  $.each(infoWindows, function(index, value) {
    this.close();
  });
  infowindow.open(map, marker);
}

function codeAddress(address) {
    var deferred = $.Deferred();
    address = decodeURIComponent(address);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        deferred.resolve(results[0].geometry.location);
      } else {
        deferred.fail(null);
      }
    });

    return deferred.promise();
}

function convertToAddress(autocompleteObject, textBox) {
  var place = autocompleteObject.getPlace();
  if (place.formatted_address) {
    textBox.val(place.formatted_address);
  }
}
