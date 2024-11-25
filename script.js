let map, userMarker;
let currentLat, currentLng;

// Initialize Google Map
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;

            // Initialize the map centered on user's location
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: currentLat, lng: currentLng },
                zoom: 15
            });

            // Add a marker at the user's location
            userMarker = new google.maps.Marker({
                position: { lat: currentLat, lng: currentLng },
                map: map,
                title: "You are here"
            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to request a ride
function requestRide() {
    alert("Ride requested! We will notify a driver.");
}
