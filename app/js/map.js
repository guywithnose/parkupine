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
      var content = $('<ul>');
      content.append($('<li>').append('Title: ' + garage.title));
      content.append($('<li>').append('Address: ' + garage.address));
      content.append($('<li>').append('Available spaces: ' + Math.floor(garage.totalSpaces * .34)));
      content.append($('<li>').append('Price/hr: ' + new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(garage.pricePerHr)));
      var infowindow = new google.maps.InfoWindow({
        content: $('<div>').append(content).html()
      });
      var marker = new google.maps.Marker(garage);
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
