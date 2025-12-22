// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyCaj0_uCRgLQyQ8GlP_lFarSEDUwmnnbMY", // API Key Anda
    authDomain: "esp32-live-hagi.firebaseapp.com",
    databaseURL: "https://esp32-live-hagi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "esp32-live-hagi",
    storageBucket: "esp32-live-hagi.firebasestorage.app",
    messagingSenderId: "487666216910",
    appId: "1:487666216910:web:5e602ce54c1682c7bd059f"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const trackingRef = database.ref('tracking'); // Path data lokasi di Firebase

// Inisialisasi Peta Leaflet
const mymap = L.map('mapid').setView([-6.2088, 106.8456], 13); // Koordinat Jakarta sebagai default

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

let marker = L.marker([0, 0]).addTo(mymap); // Marker awal

// Mendapatkan update data dari Firebase
trackingRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        const lat = data.lat;
        const lng = data.lng;
        const speed = data.speed;
        const timestamp = data.ts;

        // Update marker di peta
        const newLatLng = new L.LatLng(lat, lng);
        marker.setLatLng(newLatLng);
        mymap.panTo(newLatLng); // Geser peta ke lokasi baru

        // Update informasi di panel
        document.getElementById('lat').innerText = lat.toFixed(6);
        document.getElementById('lng').innerText = lng.toFixed(6);
        document.getElementById('speed').innerText = speed.toFixed(1);
        document.getElementById('timestamp').innerText = timestamp;
    }
}, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
});

// Anda bisa menambahkan ikon custom untuk marker jika diinginkan
// const carIcon = L.icon({
//     iconUrl: 'path/to/your/car-icon.png',
//     iconSize: [38, 38], // size of the icon
//     iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
//     popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
// });
// marker.setIcon(carIcon);
