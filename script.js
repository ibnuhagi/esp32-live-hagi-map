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

// PASTIKAN ID 'mapid' SAMA DENGAN DI INDEX.HTML
var mymap = L.map('mapid').setView([-6.1888, 106.2119], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

var motorIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/716/716429.png',
    iconSize: [45, 45],
    iconAnchor: [22, 45]
});

var marker = L.marker([-6.1888, 106.2119], { icon: motorIcon }).addTo(mymap);

trackingRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.lat && data.lon) {
        const newPos = new L.LatLng(data.lat, data.lon);
        marker.setLatLng(newPos);
        mymap.panTo(newPos);
        
        document.getElementById('lat').innerText = data.lat;
        document.getElementById('lng').innerText = data.lon;
        document.getElementById('speed').innerText = parseFloat(data.speed).toFixed(1);
        document.getElementById('timestamp').innerText = data.time;
    }
});
