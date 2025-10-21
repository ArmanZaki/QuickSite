/* QuickSite map.js
- Initializes a simple map placeholder for owner signup
- Options:
  A) Google Maps JS API — set GOOGLE_MAPS_API_KEY and call loadGoogleMaps().
  B) Leaflet — call loadLeafletFromCDN() to add CSS/JS, then initLeaflet().
- Without keys, falls back to a basic clickable div that simulates picking coords.
*/

const mapContainerId = 'map';
const GOOGLE_MAPS_API_KEY = ''; // Set your Google Maps API key here

function $(sel, root = document) { return root.querySelector(sel); }

function setLatLng(lat, lng) {
  const latEl = $('#latitude');
  const lngEl = $('#longitude');
  if (latEl) latEl.value = Number(lat).toFixed(6);
  if (lngEl) lngEl.value = Number(lng).toFixed(6);
}

// Fallback: simple clickable box that assigns mock coordinates
function initFallbackMap() {
  const el = document.getElementById(mapContainerId);
  if (!el) return;
  el.addEventListener('click', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const lat = 12.9 + (y - 0.5) * 0.1; // mock around a city
    const lng = 77.6 + (x - 0.5) * 0.1;
    setLatLng(lat, lng);
  });
}

// Google Maps loader and initializer
function loadGoogleMaps() {
  if (!GOOGLE_MAPS_API_KEY) return Promise.reject(new Error('No Google Maps API key'));
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function initGoogleMap() {
  const el = document.getElementById(mapContainerId);
  if (!el || !window.google || !window.google.maps) return;
  const center = { lat: 12.9716, lng: 77.5946 };
  const map = new google.maps.Map(el, { center, zoom: 12 });
  let marker = new google.maps.Marker({ position: center, map });
  setLatLng(center.lat, center.lng);
  map.addListener('click', (event) => {
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({ position: event.latLng, map });
    setLatLng(event.latLng.lat(), event.latLng.lng());
  });
}

// Leaflet loader and initializer
function loadLeafletFromCDN() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function initLeaflet() {
  if (!window.L) return;
  const el = document.getElementById(mapContainerId);
  const map = L.map(el).setView([12.9716, 77.5946], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  let marker = L.marker([12.9716, 77.5946]).addTo(map);
  setLatLng(12.9716, 77.5946);
  map.on('click', function (e) {
    if (marker) marker.remove();
    marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    setLatLng(e.latlng.lat, e.latlng.lng);
  });
}

(async function init() {
  const el = document.getElementById(mapContainerId);
  if (!el) return;
  try {
    if (GOOGLE_MAPS_API_KEY) {
      await loadGoogleMaps();
      initGoogleMap();
      return;
    }
    await loadLeafletFromCDN();
    initLeaflet();
  } catch (e) {
    console.warn('Map libraries failed to load, using fallback', e);
    initFallbackMap();
  }
})();
