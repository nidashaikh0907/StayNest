const map = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
    center: coordinates,
    zoom: 10,
});

// Create Popup
const popup = new maplibregl.Popup({
    offset: 25,
    closeButton: false,
}).setHTML(`
    <strong>${listingTitle}</strong><br>
    Exact location provided after booking.
`);

const marker = new maplibregl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

// Open popup by default
marker.togglePopup();