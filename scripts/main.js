var markersById = {};
var map = L.map('map').setView([57.705, 11.97], 15);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'examples.map-9ijuk24y',
  detectRetina: true
}).addTo(map);

function renderItem(item) {

  var lat = item.y / 1000000;
  var lng = item.x / 1000000;
  var hasPoly = item.poly && item.poly[0] && item.poly[1];

  if (hasPoly) {
    var dy = item.poly[1].y - item.poly[0].y;
    var dx = item.poly[1].x - item.poly[0].x;
    var r = Math.sqrt(dy * dy + dx * dx);
    var deg = 90 - 180 / Math.PI * Math.atan2(dy, dx);
  }

  var vehicle = '<div class="vehicle" style="background-color: ' + item.lcolor + '; color: ' + item.bcolor + '; ">' + item.lineno +  '</div>';
  var arrow = ['<div class="arrow-wrapper">',
    '<div class="arrow-outer"></div>',
    '<div class="arrow-inner" style="border-bottom-color: ' + item.lcolor + ';"></div>',
  '</div>'].join('');

  var myIcon = L.divIcon({
    className: 'vehicle-icon',
    iconSize: [32, 32],
    html: vehicle + arrow
  });

  var marker = markersById[item.trainid];
  if (!marker) {
    marker = markersById[item.trainid] = L.marker([lat, lng], { icon: myIcon }).addTo(map);
    marker._arrowWrapper = marker._icon.querySelector('.arrow-wrapper');
  } else {
    marker.setLatLng([lat, lng]);
  }

  if (deg) {
    var style = marker._arrowWrapper.style;
    style.webkitTransform = style.mozTransform = style.oTransform = 'rotate(' + deg + 'deg)';
  }
  marker._arrowWrapper.style.opacity = r ? 1 : 0;

}

//var URL = 'http://reseplanerare.vasttrafik.se/bin/query.exe/dny?&look_minx=10044745&look_maxx=12040389&look_miny=57025027&look_maxy=58406811&tpl=trains2json&look_productclass=1023&look_json=yes&performLocating=1&look_nv=zugposmode|2|get_ageofreport|yes|get_rtmsgstatus|yes|get_linenumber|yes|interval|10000|intervalstep|10000|&unique=1399449664000&'
var CORS_URL = 'http://dev2.krawaller.se/vararbussarna2';

function refresh() {
  $.getJSON(CORS_URL, function(data) {
    setTimeout(refresh, 4000);
    data.look.trains.forEach(renderItem);
  });
}

refresh();
