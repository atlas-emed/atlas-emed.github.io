var map = L.map('map').setView([0, 20], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

fetch('database.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(location => {
            let lat = location.coordinates[0];
            let lng = location.coordinates[1];
            let titles = location.titles.map(title => `<a href="https://dracor.org/eng/${encodeURIComponent(title)}#text" target="_blank">${title}</a>`).join(', ');
            let locationName = location.locations.join(', ');
            let radius = Math.min(15, location.titles.length * 1.1);

            let color;
            const continents = ["Africa", "America", "Asia", "Europe"];
            const countries = ['France/Gallia', 'England', 'Italia', 'Greece', 'Spain', 'Deutschland', 'Eire / Ireland',
    'Persia', 'Alba/Scotland', 'Netherlands', 'Peru', 'Normandy', 'Tartary','Suffolk', 'Libya', 'Lazio', 'Macedonia', 'Sardinia', 
    'West Indies', 'Brabant', 'Flanders', 'Bavaria', 'Castile', 'Galicia', 'Catalonia', "Iberia", "Cymru/Wales",
    'Champagne', 'Transylvania', 'Frisia', 'Gelderland', 'Saxony', 'Morocco', 'Corsica',"Turkiye/Anatolia","Barbary, approx. Algiers","Arabia","Scythia","Normandie","Lorraine","Bourgogne","Campania","Sicilia","Malta","Austria","Hungary","Cornwall","United Kingdom","Sachsen",
    "Egypt","Ethiopia","Magyarország","Polska","Sverige","Norway","Eire/Ireland","Portugal","Lapland","Virginia, United States","Russia","Tartaria"]

            const locationString = location.locations[0];

            if (continents.some(continent => locationString.includes(continent))) {
                color = 'green';
            } else if (countries.some(country => locationString.startsWith(country))) {
                color = 'blue';
            } else {
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
        console.error('Error fetching locations:', error);
    });
