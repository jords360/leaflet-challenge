// Initialize the map
let map = L.map('map').setView([0, 0], 2);

// Add a base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Load earthquake data from the GeoJSON URL
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(data => {
    // Loop through the earthquake data and create markers
    data.features.forEach(feature => {
      let coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]; // [latitude, longitude]
      let magnitude = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];
  
      // Define marker options based on magnitude and depth
      let markerOptions = {
        radius: magnitude * 5,
        color: getColor(depth),
        fillOpacity: 0.7
      };
  
      // Create a marker with a popup
      let marker = L.circleMarker(coordinates, markerOptions)
        .bindPopup(`
          <strong>Magnitude:</strong> ${magnitude}<br>
          <strong>Depth:</strong> ${depth} km<br>
          <strong>Location:</strong> ${feature.properties.place}
        `)
        .addTo(map);
    });

    // Define a function to set marker color based on depth
    function getColor(depth) {
        return depth > 90 ? '#800026' :
               depth > 70 ? '#BD0026' :
               depth > 50 ? '#E31A1C' :
               depth > 30 ? '#FC4E2A' :
               depth > 10 ? '#FD8D3C' :
               depth > 0  ? '#FEB24C' :
                            '#FFEDA0';
      }
        
  
  // Create a legend
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
  let div = L.DomUtil.create('div', 'info legend');
  let depthLabels = ['-10', '0', '10', '30', '50', '70', '90+'];
  div.innerHTML = '<strong>Depth</strong><br>';
  for (let i = 0; i < depthLabels.length; i++) {
    let color = getColor(+depthLabels[i] + 1);
    div.innerHTML += `
      <i style="background-color:${color}"></i>
      ${depthLabels[i] + (depthLabels[i + 1] ? '&ndash;' + depthLabels[i + 1] : '+')} km<br>`;
  }
  return div;
};
legend.addTo(map);

  });



