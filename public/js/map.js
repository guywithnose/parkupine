function initialize() {
  var mapOptions = {
    center: { lat: 36.8575964, lng: -76.2795736},
    zoom: 15
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  $.getJSON('/data/garages.json', function(garages) {
    for (var index in garages) {
      var garage = garages[index];
      garage.map = map;
      garage.icon='/images/map-point.png';
      new google.maps.Marker(garage);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
