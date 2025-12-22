// 1. KONFIGURASI FIREBASE
// Pastikan data ini sesuai dengan Firebase Console Anda
const firebaseConfig = {
    apiKey: "AIzaSyCaj0_uCRgLQyQ8GlP_lFarSEDUwmnnbMY",
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
const trackingRef = database.ref('device_01/live');

// 2. INISIALISASI PETA (Leaflet.js)
// Set pandangan awal ke koordinat Indonesia secara umum
var mymap = L.map('map').setView([-6.1888, 106.2119], 15);

// Menggunakan layer peta dari OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

// 3. KONFIGURASI IKON MOTOR
var motorIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/716/716429.png', // Link ikon motor
    iconSize: [45, 45], // Ukuran ikon
    iconAnchor: [22, 45], // Titik tumpu ikon (tengah bawah)
    popupAnchor: [0, -40]
});

// Tambahkan Marker Awal
var marker = L.marker([-6.1888, 106.2119], { icon: motorIcon }).addTo(mymap);

// 4. LOGIKA PEMBACAAN DATA REAL-TIME
trackingRef.on('value', (snapshot) => {
    const data = snapshot.val();
    
    if (data) {
        // MENGAMBIL DATA DARI FIREBASE (lat, lon, speed, time)
        // lon menggunakan huruf kecil sesuai revisi kodingan ESP32
        const latitude = data.lat;
        const longitude = data.lon;
        const speed = data.speed;
        const timestamp = data.time;

        // Validasi koordinat agar tidak error jika GPS belum lock
        if (latitude !== 0 && longitude !== 0) {
            const newPos = new L.LatLng(latitude, longitude);

            // Update Posisi Marker & Pergerakan Kamera Peta
            marker.setLatLng(newPos);
            mymap.panTo(newPos);

            // Update Konten Popup
            marker.bindPopup(`<b>Status Motor</b><br>Kec: ${speed} km/h<br>Waktu: ${timestamp}`).openPopup();

            // UPDATE PANEL INFORMASI PADA HTML
            // Pastikan ID ini ada di file index.html Anda
            if(document.getElementById('lat')) document.getElementById('lat').innerText = latitude;
            if(document.getElementById('lng')) document.getElementById('lng').innerText = longitude;
            if(document.getElementById('speed')) document.getElementById('speed').innerText = speed + " km/h";
            if(document.getElementById('timestamp')) document.getElementById('timestamp').innerText = timestamp;
        }
    } else {
        console.log("Menunggu data dari Firebase...");
    }
}, (error) => {
    console.error("Gagal membaca database: ", error);
});
