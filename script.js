var map = L.map('map').setView([0, 20], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Fetch location types from the loc-types.txt file
let locationTypes = {};
fetch('location-types.txt')
    .then(response => response.text())
    .then(data => {
        // Parse the Python-style dictionary into JavaScript object
        locationTypes = eval('(' + data + ')');
    })
    .catch(error => console.error('Error loading location types:', error));

// Fetch locations and plot them on the map
fetch('database.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(location => {
            let lat = location.coordinates[0];
            let lng = location.coordinates[1];
            let titles = location.titles.map(title => 
                `<a href="https://dracor.org/eng/${encodeURIComponent(title)}#text" target="_blank">${title}</a>`
            ).join(', ');
            let locationName = location.location;
            let radius = Math.min(15, location.titles.length * 1.1);

            // Determine the color based on the location's type
            let category = locationTypes[locationName] || 'unknown';
            let color;
            switch (category) {
                case 'continent':
                    color = 'green';
                    break;
                case 'country/region':
                    color = 'blue';
                    break;
                case 'city':
                    color = 'purple';
                    break;
                case 'natural features':
                    color = 'brown';
                    break;
                default:
                    color = 'red';
            }

            var circleMarker = L.circleMarker([lat, lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.2,
                radius: radius
            }).addTo(map);

            circleMarker.bindPopup(function (layer) {
                let popupContent = `
                    <div class="popup-content">
                        <div class="popup-title"><b>${locationName}</b> is mentioned in:</div>
                        <div class="popup-sidebar">
                            ${titles}
                        </div>
                    </div>`;
                return popupContent;
            });

            circleMarker.on('click', function (e) {
                this.openPopup();
            });
        });
    })
    .catch(error => {
        console.error('Error fetching location:', error);
    });
