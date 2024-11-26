mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2ZHV0dDAzIiwiYSI6ImNtM3k0YmUxdDFmb3cybHNjMGh5dGFoMXIifQ.ilgwEjlw8e8FhQMWgD9ndw';

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite map style
    center: [77.2295, 28.6129], // Default center (India Gate)
    zoom: 14, // Default zoom
});

// Randomize nearby car locations
function randomizeCarLocations(lat, lng) {
    const randomOffset = () => (Math.random() - 0.5) * 0.01; // Random offset within ~1km
    return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Car ${i + 1}`,
        lat: lat + randomOffset(),
        lng: lng + randomOffset(),
    }));
}

// Add car markers to the map
function addCarMarkers(cars) {
    cars.forEach(car => {
        const marker = new mapboxgl.Marker({ color: 'red' }) // Red marker for cars
            .setLngLat([car.lng, car.lat])
            .addTo(map);
    });
}

// Populate the car list with distances
function populateCarList(cars, userLocation) {
    const carList = document.getElementById('car-list');
    carList.innerHTML = ''; // Clear the list

    cars.forEach(car => {
        const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            car.lat, car.lng
        ).toFixed(2); // Calculate distance and round to 2 decimals

        const listItem = document.createElement('li');
        listItem.innerText = `${car.name} - ${distance} km away`;
        carList.appendChild(listItem);
    });
}

// Calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Get the user's location
navigator.geolocation.getCurrentPosition(
    (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Set map center to user's location
        map.setCenter([userLng, userLat]);

        // Add user location marker (blue)
        new mapboxgl.Marker({ color: 'blue' })
            .setLngLat([userLng, userLat])
            .addTo(map);

        // Randomize car locations near the user's location
        const nearbyCars = randomizeCarLocations(userLat, userLng);

        // Populate the car list
        populateCarList(nearbyCars, { lat: userLat, lng: userLng });

        // Add car markers to the map
        addCarMarkers(nearbyCars);
    },
    (error) => {
        console.error("Error getting location", error);
        alert("Unable to retrieve your location. Ensure location services are enabled.");
    }
);
