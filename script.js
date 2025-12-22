// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyCaj0_uCRgLQyQ8GlP_lFarSEDUwmnnbMY",
    authDomain: "esp32-live-hagi.firebaseapp.com",
    databaseURL: "https://esp32-live-hagi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "esp32-live-hagi",
    storageBucket: "esp32-live-hagi.firebasestorage.app",
    messagingSenderId: "487666216910",
    appId: "1:487666216910:web:5e602ce54c1682c7bd059f"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// FIX: Path harus sesuai gambar Firebase Anda (device_01/live)
const trackingRef = database.ref('device_01/live');

// Marker motor (sesuaikan icon)
const motorIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/716/716429.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

let marker = L.marker([-6.1888, 106.2119], {icon: motorIcon}).addTo(mymap);

// REALTIME UPDATE TANPA REFRESH
// Ganti bagian pembacaan data di script.js Anda
trackingRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Gunakan data.lon (huruf kecil semua) sesuai screenshot Firebase Anda
        const newPos = new L.LatLng(data.lat, data.lon); 
        marker.setLatLng(newPos);
        mymap.panTo(newPos);
        
        document.getElementById('lat').innerText = data.lat;
        document.getElementById('lng').innerText = data.lon; // Pastikan ini data.lon
        document.getElementById('speed').innerText = data.speed;
        document.getElementById('timestamp').innerText = data.time;
    }
});
