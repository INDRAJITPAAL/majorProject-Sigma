
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    zoom: 5,
    center: data.geometry.coordinates,
});

const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(data.geometry.coordinates)//listing coordinate will be here
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${data.location}</h4> <p>After booking address will be provided</p>`))
    .addTo(map);

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});


