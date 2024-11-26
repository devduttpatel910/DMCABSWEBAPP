// Set Mapbox Access Token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2ZHV0dDAzIiwiYSI6ImNtM2JsbTBkODFnN3EyanNjODl6NjIwZG4ifQ.oHgNKjHMdHf4WW_Kkwsmrg';

// Initialize Variables
let map, userMarker;
let currentLat, currentLng;

// Simulated Available Cars
const availableCars = [
    { id: 1, name: "Car 1", lat: 20.5947, lng: 78.9632 },
    { id: 2, name: "Car 2", lat: 20.5957, lng: 78.9642 },
    { id: 3, name: "Car 3", lat: 20.5967, lng: 78.9652 }
];

// Initialize Map
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;

            // Initialize Map Centered on User Location
            map = new mapboxgl.Map({
                container: 'map', // HTML container ID
                style: 'mapbox://styles/mapbox/streets-v11', // Map style
                center: [currentLng, currentLat], // Initial center [lng, lat]
                zoom: 15 // Zoom level
            });

            // Add User's Location Marker
            userMarker = new mapboxgl.Marker({ color: 'blue' })
                .setLngLat([currentLng, currentLat])
                .setPopup(new mapboxgl.Popup().setHTML('<strong>You are here!</strong>'))
                .addTo(map);

            // Add Markers for Available Cars
            availableCars.forEach(car => {
                new mapboxgl.Marker({ color: 'red' })
                    .setLngLat([car.lng, car.lat])
                    .setPopup(new mapboxgl.Popup().setHTML(`<strong>${car.name}</strong>`))
                    .addTo(map);
            });

            // Update the List of Available Cars
            updateAvailableCars();
        }, error => {
            console.error("Error getting location: ", error);
            alert("Unable to access your location. Please enable location services.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Calculate Distance (Haversine Formula)
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Update Available Cars List
function updateAvailableCars() {
    const carList = document.getElementById('carList');
    carList.innerHTML = ''; // Clear existing list

    availableCars.forEach(car => {
        // Calculate Distance
        const distance = haversine(currentLat, currentLng, car.lat, car.lng).toFixed(2);

        // Add Car to List
        const listItem = document.createElement('li');
        listItem.textContent = `${car.name} - ${distance} km away`;
        carList.appendChild(listItem);
    });
}

// Request a Ride
function requestRide() {
    alert("Ride requested! A driver will be notified.");
}

// Initialize Map on Window Load
window.onload = initMap;
