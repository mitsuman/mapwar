var fs = require('fs');
//var prefs = require('./47pref.js');
var prefs = JSON.parse(fs.readFileSync('47pref.js', 'utf8'));

//console.log(prefs);

var names = [];
var polygon = [];

var scale = 32;

for (var i = 0; i < prefs.length; i++) {
  var p = prefs[i];
  var a = p.pref | 0;
  names[a] = p.name;
  var latlng = p.latlng.split(/[, ]/);
  polygon[a] = polygon[a] || [];

  var f = [999, 999], g = [0, 0];
  for (var j = 0; j < latlng.length; j+=2) {
    var x = ((latlng[j + 0] - 135) * Math.cos(latlng[j + 1] * Math.PI / 180) + 10) * scale;
    var y = (latlng[j + 1] - 30) * scale;
    latlng[j + 0] = x;
    latlng[j + 1] = 512 - y;

    for (var k = 0; k < 2; k++) {
      latlng[j + k] *= 1.0;
      f[k] = Math.min(f[k], latlng[j + k]);
      g[k] = Math.max(g[k], latlng[j + k]);
    }
  }

  if (polygon[a].length == 0 || (g[0] - f[0]) > 4 && (g[1] - f[1]) > 4) {
    console.log((g[0] - f[0]) + ',' + (g[1] - f[1]));
    polygon[a].push(latlng);
  }
}

fs.writeFile('pref_name.js', 'var pref_name=' + JSON.stringify(names));
fs.writeFile('pref_poly.js', 'var pref_poly=' + JSON.stringify(polygon));

