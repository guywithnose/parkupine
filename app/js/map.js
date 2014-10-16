var infoWindows = [];
function initialize() {
  var mapOptions = {
    center: { lat: 36.850311, lng: -76.288529},
    zoom: 14
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  var address = get('address');
  if (address != null) {
    codeAddress(address, map);
      $('.direction-form').hide();
      $('.footer').hide();
      $('#map-canvas').fadeIn();
  }

  $.getJSON('data/garages.json', function(garages) {
    for (var index in garages) {
      var garage = garages[index];
      garage.map = map;
      garage.availableSpaces = Math.floor(garage.totalSpaces * (.10 + (.9 * Math.random())));
      var content = $('<div>');

      if (percentFull > 75) {
        content.append('<span style="color:#e62e2f;font-size:1.2em;font-weight:"><i class="fa fa-building"></i> ' + garage.title + '</span>');
        garage.icon='images/map-point-red.png';
      } else if (percentFull > 50) {
        content.append('<span style="color:#f7941d;font-size:1.2em;font-weight:">' + garage.title + '</span>');
        garage.icon='images/map-point-yellow.png';
      } else {
        content.append('<span style="color:#B2D233;font-size:1.2em;font-weight:">' + garage.title + '</span>');
        garage.icon='images/map-point-green.png';
      }


      // content.append($('<li>').append('Title: ' + garage.title));
      content.append('<br><i class="fa fa-map-marker"></i> ' + garage.address);
      content.append('<br><i class="fa fa-car"></i> ' + garage.availableSpaces);
      content.append(' open spots out of ' + garage.totalSpaces);
      
      var percentFull = Math.floor(garage.availableSpaces * 100 / garage.totalSpaces);
      content.append('<br/><i class="fa fa-pie-chart"></i> ' + percentFull + '% full');
      content.append('<br><i class="fa fa-money"></i> ' + garage.pricePerHr.toFixed(2));
      var infowindow = new google.maps.InfoWindow({
        content: $('<div>').append(content).html()
      });
      var marker = new google.maps.Marker(garage);
      var infowindow = new google.maps.InfoWindow({content: $('<div>').append(content).html()});
      infoWindows.push(infowindow);
      google.maps.event.addListener(marker, 'click', _.partial(showInfoWindow, map, marker, infowindow));
    }
  });

  function get(varname) {
      var value = window.location.search.match(varname + '=(.*?)(&|$)');
      if (value) {
        return value[1];
      }
  }
}

google.maps.event.addDomListener(window, 'load', initialize);

function showInfoWindow(map, marker, infowindow) {
  $.each(infoWindows, function(index, value) {
    this.close();
  });
  infowindow.open(map, marker);
}

function codeAddress(address, map) {
    address = decodeURIComponent(address);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(17);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}
