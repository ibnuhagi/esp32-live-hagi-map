// =========== FIREBASE IMPORT ===========
import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue
} from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";


// =========== FIREBASE CONFIG ===========
const firebaseConfig = {
  apiKey: "AIzaSyCaj0_uCRgLQyQ8GlP_lFarSEDUwmnnbMY",
  authDomain: "esp32-live-hagi.firebaseapp.com",
  databaseURL: "https://esp32-live-hagi-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "esp32-live-hagi",
  storageBucket: "esp32-live-hagi.firebasestorage.app",
  messagingSenderId: "487666216910",
  appId: "1:487666216910:web:5e602ce54c1682c7bd059f"
};

// ============ INIT FIREBASE ============
const app  = initializeApp(firebaseConfig);
const db   = getDatabase(app);


// ============ LEAFLET MAP SETUP ============
var map = L.map('map').setView([0,0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:19,
}).addTo(map);

let marker = L.marker([0,0]).addTo(map);


// ============ READ DATA REALTIME ============
const dataPath = ref(db, "device_01/live");

onValue(dataPath, (snapshot) => {

  const data = snapshot.val();

  if (!data) return;

  let lat   = data.lat;
  let lon   = data.lon;
  let speed = data.speed;
  let time  = data.time;

  marker.setLatLng([lat, lon]);

  map.setView([lat, lon]);

  marker.bindPopup(
      "Speed: " + speed + " km/h" +
      "<br>" +
      "Time: " + time
  );

});

