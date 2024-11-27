// Initialize map and set default view
const map = L.map('map').setView([20, 0], 2);

// Add satellite-streets map layer
L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGV2ZHV0dDAzIiwiYSI6ImNtM3k0YmUxdDFmb3cybHNjMGh5dGFoMXIifQ.ilgwEjlw8e8FhQMWgD9ndw',
    {
        attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 512,
        zoomOffset: -1,
    }
).addTo(map);

let userMarker, driverMarker;

// Custom red marker for the driver
const redIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Replace with any red marker image URL
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Function to find user's location
function findUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                // Remove old user marker
                if (userMarker) map.removeLayer(userMarker);

                // Add user marker
                userMarker = L.marker([userLat, userLng]).addTo(map)
                    .bindPopup("You are here").openPopup();

                // Center the map to user's location
                map.setView([userLat, userLng], 14);
            },
            error => {
                alert("Unable to access your location. Please enable location services.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Function to display driver location and calculate distance
function driverLocation() {
    if (!userMarker) {
        alert("Please find your location first.");
        return;
    }

    const userLocation = userMarker.getLatLng();
    const driverLat = userLocation.lat + (Math.random() * 0.02 - 0.01);
    const driverLng = userLocation.lng + (Math.random() * 0.02 - 0.01);

    // Remove old driver marker
    if (driverMarker) map.removeLayer(driverMarker);

    // Add driver marker
    driverMarker = L.marker([driverLat, driverLng], { icon: redIcon }).addTo(map)
        .bindPopup("Driver is nearby").openPopup();

    // Calculate distance between user and driver
    const distance = map.distance(userLocation, [driverLat, driverLng]).toFixed(2);
    alert(`Driver is ${distance} meters away.`);
}



//new line

// Import Firebase and Firebase Messaging
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, onMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

// Your Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgnLPj3mZ9Oo6gcN66RwIzX4AkzEJGO-A",
  authDomain: "lastattempt-c591e.firebaseapp.com",
  databaseURL: "https://lastattempt-c591e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lastattempt-c591e",
  storageBucket: "lastattempt-c591e.appspot.com",
  messagingSenderId: "6355846024",
  appId: "1:6355846024:web:b0de795b5da3793470f03d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission to send notifications
function requestNotificationPermission() {
  Notification.requestPermission()
    .then(permission => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        getFCMToken();
      } else {
        console.error("Notification permission denied.");
      }
    });
}
import { getToken } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

function getFCMToken() {
  getToken(messaging, { vapidKey: "<YOUR_PUBLIC_VAPID_KEY>" }) // Replace with your VAPID key
    .then(currentToken => {
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        // Send this token to your server for backend integration
      } else {
        console.warn("No registration token available. Request permission to generate one.");
      }
    })
    .catch(err => {
      console.error("An error occurred while retrieving token. ", err);
    });
}

onMessage(messaging, payload => {
  console.log("Message received. ", payload);
  // Display notification content
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  new Notification(notificationTitle, notificationOptions);
});
const alcoholLevelRef = db.ref('alcoholLevel');

alcoholLevelRef.on('value', snapshot => {
  const alcoholLevel = snapshot.val();

  if (alcoholLevel > 500) {
    sendNotification("High Alcohol Level Detected!");
    // Optionally trigger server-side push notification here
  }
});


