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
const trackingRef = database.ref('device_01/live');

// SETUP MAP
var mymap = L.map('map').setView([-6.1888, 106.2119], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

// PERBAIKAN LOGO: MENGGUNAKAN ICON MOTOR
var motorIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/716/716429.png', // Icon Motor
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -40]
});

var marker = L.marker([-6.1888, 106.2119], {icon: motorIcon}).addTo(mymap);

// REALTIME UPDATE
trackingRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Sinkronisasi variabel: pastikan menggunakan data.lon (huruf kecil)
        const newPos = new L.LatLng(data.lat, data.lon);
        marker.setLatLng(newPos);
        mymap.panTo(newPos);
        
        // Update Panel Info
        document.getElementById('lat').innerText = data.lat;
        document.getElementById('lng').innerText = data.lon;
        document.getElementById('speed').innerText = data.speed + " km/jam";
        document.getElementById('timestamp').innerText = data.time;
        
        marker.bindPopup("<b>Motor Hagi</b><br>Kec: " + data.speed + " km/jam").openPopup();
    }
});
