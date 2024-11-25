let map, userMarker;
let currentLat, currentLng;

// Simulated list of available cars (drivers' locations)
const availableCars = [
    { id: 1, name: "Car 1", lat: 20.5937, lng: 78.9629, distance: 0 },
    { id: 2, name: "Car 2", lat: 20.5947, lng: 78.9639, distance: 0 },
    { id: 3, name: "Car 3", lat: 20.5957, lng: 78.9649, distance: 0 }
];

// Initialize Leaflet Map
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;

            // Initialize the map centered on user's location
            map = L.map('map').setView([currentLat, currentLng], 15);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add a marker at the user's location
            userMarker = L.marker([currentLat, currentLng]).addTo(map)
                .bindPopup("You are here")
                .openPopup();

            // Add markers for the available cars
            availableCars.forEach(car => {
                car.marker = L.marker([car.lat, car.lng]).addTo(map)
                    .bindPopup(`${car.name}`);
            });

            // Calculate distance from user to each car and update the list
            updateAvailableCars();
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Haversine formula to calculate distance between two lat/lng points
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Update the list of available cars and their distances
function updateAvailableCars() {
    let carList = document.getElementById('carList');
    carList.innerHTML = ''; // Clear 

