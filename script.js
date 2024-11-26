// Initialize map and set default view
const map = L.map('map').setView([20, 0], 2); // World view

// Add satellite map layer with the updated Mapbox key
L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGV2ZHV0dDAzIiwiYSI6ImNtM3k0YmUxdDFmb3cybHNjMGh5dGFoMXIifQ.ilgwEjlw8e8FhQMWgD9ndw', 
    {
        attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 512,
        zoomOffset: -1,
    }
).addTo(map);

let userMarker, driverMarker;

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

// Function to simulate driver location
function simulateDriverLocation() {
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
    driverMarker = L.marker([driverLat, driverLng]).addTo(map)
        .bindPopup("Driver is nearby").openPopup();
}

// Firebase Database Integration
const db = firebase.database();
const alcoholLevelRef = db.ref('alcoholLevel');

// Alcohol level threshold
const threshold = 500;

// Listen for alcohol level changes in Firebase
alcoholLevelRef.on('value', snapshot => {
    const alcoholLevel = snapshot.val();
    console.log("Alcohol Level: ", alcoholLevel);

    alert(`Alcohol Level: ${alcoholLevel}`);

    if (alcoholLevel > threshold) {
        sendNotification("High Alcohol Level Detected!");
    }
});

// Send browser notification
function sendNotification(message) {
    if (Notification.permission === "granted") {
        new Notification("DMCabs Alert", { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("DMCabs Alert", { body: message });
            }
        });
    }
}

// Request notification permissions on page load
document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});
