import L from 'leaflet';

const apiKey = 'e4SQes1vdPMEc1tUVmDD';

export const initStoryMap = (elementId, onLocationSelect) => {
  try {
    const mapElement = document.getElementById(elementId);
    if (!mapElement) throw new Error(`Element dengan ID '${elementId}' tidak ditemukan`);

    const map = L.map(elementId).setView([-6.2088, 106.8456], 10);

    // Primary layer - OpenStreetMap (always works)
    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Alternative layers
    const layers = {
      "OpenStreetMap": openStreetMap,
      "OpenStreetMap Hot": L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team'
      }),
      "CartoDB Positron": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }),
      "CartoDB Dark": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      })
    };


    try {
      const maptilerLayer = L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${apiKey}`, {
        attribution: '&copy; MapTiler &copy; OpenStreetMap contributors'
      });
      layers["MapTiler Streets"] = maptilerLayer;
    } catch (error) {
      console.warn('MapTiler layer could not be added:', error);
    }


    L.control.layers(layers).addTo(map);

    let marker = null;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (marker) map.removeLayer(marker);
      
      marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`Lokasi terpilih:<br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)
        .openPopup();
      
      if (onLocationSelect) onLocationSelect(lat, lng);
    });

    return map;
  } catch (error) {
    console.error('Error inisialisasi peta:', error);
    throw error;
  }
};