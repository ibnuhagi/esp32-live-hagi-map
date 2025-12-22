// 1. Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCaj0_uCRgLQyQ8GlP_lFarSEDUwmnnbMY",
    authDomain: "esp32-live-hagi.firebaseapp.com",
    databaseURL: "https://esp32-live-hagi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "esp32-live-hagi",
    storageBucket: "esp32-live-hagi.firebasestorage.app",
    messagingSenderId: "487666216910",
    appId: "1:487666216910:web:5e602ce54c1682c7bd059f"
};

// 2. Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// SESUAI GAMBAR: Path berada di device_01/live
const trackingRef = database.ref('device_01/live'); 

// 3. Inisialisasi Peta Leaflet
const mymap = L.map('mapid').setView([-6.188898, 106.211917], 15); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

// 4. Membuat Ikon Motor Custom
const motorIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/716/716429.png', // Ikon motor
    iconSize: [40, 40], // Ukuran ikon
    iconAnchor: [20, 40], // Titik tumpu ikon (tengah bawah)
    popupAnchor: [0, -40]
});

// Tambahkan marker ke peta dengan ikon motor
let marker = L.marker([-6.188898, 106.211917], {icon: motorIcon}).addTo(mymap);

// 5. Mendapatkan Data Realtime dari Firebase
trackingRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // SESUAI GAMBAR: Menggunakan 'lon' bukan 'lng' dan 'time' bukan 'ts'
        const lat = data.lat;
        const lng = data.lon; 
        const speed = data.speed;
        const timestamp = data.time;

        const newLatLng = new L.LatLng(lat, lng);
        
        // Update posisi marker dan peta
        marker.setLatLng(newLatLng);
        mymap.panTo(newLatLng);

        // Update teks informasi di UI HTML
        document.getElementById('lat').innerText = lat;
        document.getElementById('lng').innerText = lng;
        document.getElementById('speed').innerText = speed;
        document.getElementById('timestamp').innerText = timestamp;
        
        // Tambahkan popup agar lebih informatif saat marker diklik
        marker.bindPopup("<b>Posisi Motor</b><br>Kec: " + speed + " km/jam").openPopup();
    }
}, (error) => {
    console.error("Gagal mengambil data Firebase: ", error);
});
