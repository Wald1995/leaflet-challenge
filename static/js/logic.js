function createMap(earthquakes) {
    // Create the tile layer that will be the background of our map.
    const streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create a baseMaps object to hold the streetmap layer.
    const baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer.
    const overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options.
    const map = L.map("map", {
      center: [32.71, -111.55],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  
    // Create a legend and add it to the map.
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <h4>Depth Legend</h4>
        <div><i style="background: #1a9850"></i>Shallow (&lt;10 km)</div>
        <div><i style="background: #91cf60"></i>Intermediate (10-30 km)</div>
        <div><i style="background: #d9ef8b"></i>Mod. Deep (30-50 km)</div>
        <div><i style="background: #fee08b"></i>Deep (50-70 km)</div>
        <div><i style="background: #fc8d59"></i>Very Deep (70-90 km)</div>
        <div><i style="background: #d73027"></i>Extremely Deep (&gt;90 km)</div>
      `;
      return div;
    };
    legend.addTo(map);
  }
  
  function createMarker(feature, latlng) {
    const depth = feature.geometry.coordinates[2];
    const magnitude = feature.properties.mag;
  
    return L.circleMarker(latlng, {
      radius: Math.sqrt(magnitude) * 5,
      fillColor: markerColor(depth),
      color: "#000",
      weight: 0.5,
      opacity: 0.5,
      fillOpacity: 1
    }).bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3>Magnitude:</h3> ${magnitude}<h3>Depth:</h3> ${depth} km`);
  }
  
  function createFeatures(earthquakeData) {
    const earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: createMarker
    });
  
    createMap(earthquakes);
  }
  
  function markerColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#fc8d59' :
           depth > 50 ? '#fee08b' :
           depth > 30 ? '#d9ef8b' :
           depth > 10 ? '#91cf60' :
                        '#1a9850';
  }
  
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3>Magnitude:</h3> ${feature.properties.mag}<h3>Depth:</h3> ${feature.geometry.coordinates[2]} km`);
  }
  
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(earthquakeData) {
    createFeatures(earthquakeData.features);
  });
  