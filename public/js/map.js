function initialize() {
  var mapOptions = {
    center: { lat: 36.8575964, lng: -76.2795736},
    zoom: 15
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(36.851449, -76.290639),
    map: map,
    title: 'Hello World!',
    icon: '/images/map-point.png'
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
