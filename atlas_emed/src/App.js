import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

// eslint-disable-next-line 
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

import city from "./data/city.geojson"
import country_region from "./data/country_region.geojson"
import naturalfeatures from "./data/naturalfeatures.geojson"
import continent from "./data/continent.geojson"
import DramaCard from './dramaCard';




function App() {



  const mapRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedDrama, setSelectedDama] = useState(null);

  const [visibleLayers, setVisibleLayers] = useState({
    city: true,
    country_region: true,
    naturalfeatures: true,
    continent: true
  });



  const [mapboxMap, setMapboxMap] = useState(null);

  const baseURL = "https://dracor.org/eng/"



  useEffect(() => {

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/andreaswagner/clhafhr30011701qu5t4e72iw",
      center: [13.404954, 52.520008], // Berlin
      zoom: 1,

    });


    setMapboxMap(map);

    // prevent the map from crossing the antimeridian
    // map.setMaxBounds([
    //   [-180, -90], // Southwest coordinates
    //   [180, 90] // Northeast coordinates
    // ]);

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    }), 'bottom-right');



    map.on('load', () => {

      map.addSource('country_region', {
        type: 'geojson',
        data: country_region
      });
      map.addSource('naturalfeatures', {
        type: 'geojson',
        data: naturalfeatures
      });
      map.addSource('continent', {
        type: 'geojson',
        data: continent
      });
      map.addSource('city', {
        type: 'geojson',
        data: city
      });

      map.addLayer({
        id: 'city-layer',
        type: 'circle',
        source: 'city',
        paint: {
          'circle-radius': 6,
          'circle-color': '#007cbf',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
          // 'circle-opacity': 0.8,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'count'],
            0, 4,
            10, 12,
            50, 18
          ],
        },

      });

      map.addLayer({
        id: 'country_region-layer',
        type: 'circle',
        source: 'country_region',
        paint: {
          'circle-radius': 6,
          'circle-color': '#955e00',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
          // 'circle-opacity': 0.8,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'count'],
            0, 4,
            10, 12,
            50, 18
          ],
        }
      });

      map.addLayer({
        id: 'naturalfeatures-layer',
        type: 'circle',
        source: 'naturalfeatures',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'count'],
            0, 4,
            10, 12,
            50, 18
          ],
          'circle-color': '#30bf00',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
          // 'circle-opacity': 0.8,
          "opacity": 0.5
        }
      });

      map.addLayer({
        id: 'continent-layer',
        type: 'circle',
        source: 'continent',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'count'],
            0, 4,
            10, 12,
            50, 18
          ],
          'circle-color': '#8945ae',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
          // 'circle-opacity': 0.8,
        },

      });

      map.on('click', 'city-layer', (e) => selectClickedPoint(e, map));
      map.on('click', 'country_region-layer', (e) => selectClickedPoint(e, map));
      map.on('click', 'naturalfeatures-layer', (e) => selectClickedPoint(e, map));
      map.on('click', 'continent-layer', (e) => selectClickedPoint(e, map));
      map.on('mouseenter', 'city-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'city-layer', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'country_region-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'country_region-layer', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'naturalfeatures-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'naturalfeatures-layer', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'continent-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'continent-layer', () => {
        map.getCanvas().style.cursor = '';
      });

      // on the left of the map add a panel for switching each layer on and off

    });

  }, []);




  const selectClickedPoint = (e, map) => {
    const feature = e.features[0];
    setSelectedPoint(feature);
    const coordinates = feature.geometry.coordinates.slice();
    map.flyTo({
      center: coordinates,
      zoom: map.getZoom(),
      speed: 0.5
    });

  }

  const handleLayerToggle = (layer) => {
    const isVisible = visibleLayers[layer];
    setVisibleLayers({
      ...visibleLayers,
      [layer]: !isVisible
    });

    if (mapboxMap) {
      mapboxMap.setLayoutProperty(
        `${layer}-layer`,
        'visibility',
        isVisible ? 'none' : 'visible'
      );
    }
  }

  useEffect(() => {
    if (!mapboxMap) return;
    if (selectedPoint) {
      setSelectedPoint(null);
    }
    if (selectedDrama) {
      const dramaFilter = ["in", selectedDrama, ["get", "titles"]];
      mapboxMap.setFilter('city-layer', dramaFilter);
      mapboxMap.setFilter('country_region-layer', dramaFilter);
      mapboxMap.setFilter('naturalfeatures-layer', dramaFilter);
      mapboxMap.setFilter('continent-layer', dramaFilter);


    } else {
      mapboxMap.setFilter('city-layer', null);
      mapboxMap.setFilter('country_region-layer', null);
      mapboxMap.setFilter('naturalfeatures-layer', null);
      mapboxMap.setFilter('continent-layer', null);
    }

  }, [selectedDrama]);





  return (
    <div className="App">
      
      <header className="App-header" style={{ height: "10vh", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>A Little Atlas of Early Modern English Drama</h1>


      </header>
      <Container fluid>
        <Row md={12} lg={12} >
          <Col xs={12} md={7} lg={7} >
            <div id='map-container' ref={mapRef} style={{ width: "100%" }} />
          </Col>
          <Col xs={12} md={5} lg={5} >
            <Row md={12} lg={12} >
              <h2>Legend</h2>
              <Col xs={12} md={12} lg={12} >
                <div className="legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: "#007cbf" }}></span>
                    <span className="legend-label">City</span>
                    <input type="checkbox" checked={visibleLayers.city} onChange={() => handleLayerToggle('city')} />
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: "#955e00" }}></span>
                    <span className="legend-label">Country/Region</span>
                    <input type="checkbox" checked={visibleLayers.country_region} onChange={() => handleLayerToggle('country_region')} />
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: "#30bf00" }}></span>
                    <span className="legend-label">Natural Feature</span>
                    <input type="checkbox" checked={visibleLayers.naturalfeatures} onChange={() => handleLayerToggle('naturalfeatures')} />
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: "#8945ae" }}></span>
                    <span className="legend-label">Continent</span>
                    <input type="checkbox" checked={visibleLayers.continent} onChange={() => handleLayerToggle('continent')} />
                  </div>
                </div>
              </Col>

              <hr></hr>
            </Row>
            <Row md={12} lg={12} >
              {selectedPoint ? (
                <>
                  <h3>{selectedPoint.properties.name + " (" + selectedPoint.properties.original_label + ")"}</h3>
                  <p>Type: {selectedPoint.properties.type}</p>
                  {selectedPoint.properties.titles && (
                    <>
                      <Row>
                        <h4>Dramas</h4>

                      </Row>
                      <div className="titles">
                        {JSON.parse(selectedPoint.properties.titles).map((title, index) => (
                          <DramaCard
                            key={index}
                            title={title}
                            setSelectedDama={setSelectedDama}
                            selectedDrama={selectedDrama}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {selectedDrama ? (
                    <>
                      <Row>
                        <Col>
                          <h4>Dramas:</h4>
                        </Col>
                        <Col>
                          <Button className="btn btn-light" onClick={() => setSelectedDama(null)}>
                            Clear
                          </Button>
                        </Col>
                      </Row>
                      <div className="titles">

                        <DramaCard
                          title={selectedDrama}
                          setSelectedDama={setSelectedDama}
                          selectedDrama={selectedDrama}
                        />
                      </div>

                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "1.2rem", margin: 0, marginBottom: "10%", textAlign: "justify" }}>
                        This map charts most geographical items mentioned in about 400 early modern English plays. Move around, zoom, and click on any location to see the related plays and access them in the <a href="https://dracor.org/eng">English Drama Corpus (EngDraCor)</a>. Several types of toponyms <span style={{ "color": "blue" }}>cities</span>, <span style={{ "color": "brown" }}>countries and regions</span>, <span style={{ "color": "purple" }}>continents</span>, and <span style={{ "color": "green" }}>natural features</span> have been extracted through NLP methods and geocoded with <a href="https://nominatim.org"><i>Nominatim</i></a>, with extensive rounds of manual and LLM-assisted post-correction.<br />To be presented at AIUCD Verona 2025.
                      </p>
                      {/* <h3>Select a point on the map</h3> */}
                      <p style={{ fontSize: "1.2rem", margin: 0, marginBottom: "10%", textAlign: "justify" }}>
                        Click on a point on the map to see the related plays.
                      </p>

                    </>

                  )}
                </>


              )}
            </Row>


          </Col>
        </Row>

      </Container>

    </div>
  );
}

export default App;
