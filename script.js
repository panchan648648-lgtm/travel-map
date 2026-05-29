const map = L.map('map').setView([35.681236, 139.767125], 13);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap contributors'
    }
).addTo(map);

map.on('click', function(e) {

    const marker = L.marker([e.latlng.lat, e.latlng.lng])
        .addTo(map);

    marker.bindPopup(`
        <label>
            <input type="checkbox">
            訪問済み
        </label>
    `);

});