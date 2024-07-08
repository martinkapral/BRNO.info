import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SportTable from "./SportTable";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibWFydGlua2FwcmFsIiwiYSI6ImNseThuNnhuOTA5bXIybnF3d2xpd3BmNGoifQ.jX0VpQBFPQnGPjBt84nU2A";

const SportMapComponent = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [filter, setFilter] = useState("all");
  const [typOptions, setTypOptions] = useState([]);

  const [isSatellite, setIsSatellite] = useState(false);

  const toggleTheme = () => {
    setIsSatellite(!isSatellite);
  };

  // FETCHING DATA
  useEffect(() => {
    const apiUrl =
      "https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/sportoviste/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

    const fetchGeoJsonData = async () => {
      try {
        const response = await fetch(apiUrl);
        const sportData = await response.json();
        setGeoJsonData(sportData);
        const typValues = [
          ...new Set(
            sportData.features.map((f) => f.properties.typ_sportoviste_nazev)
          ),
        ];
        setTypOptions(typValues);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    fetchGeoJsonData();
  }, []);

  // CURRENT LOCATION OF USER
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  const userIcon = new L.Icon({
    iconUrl: require("../img/you.png"),
    iconSize: [40, 40],
  });

  // FUNCTION TO CREATE CUSTOM MARKER
  const pointToLayer = (feature, latlng) => {
    // CUSTOM MARKER ICON
    const customIcon = new L.Icon({
      iconUrl: require("../img/map_icon.png"),
      iconSize: [20, 20],
    });

    return L.marker(latlng, { icon: customIcon });
  };

  // FUNCTION TO BIND POPUPS TO FEATURES
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.nazev) {
      layer.bindPopup(
        `
        <p class="druh">${feature.properties.typ_sportoviste_nazev}</p>
        <strong>${feature.properties.nazev}</strong>
        <br>${feature.properties.adresa}
        <br>
        
        <br>${feature.properties.popis}
        <br>
        <br>
        <a href="http://${feature.properties.url}" target="_blank">Website</a>
        `
      );
    }
  };

  // FILTER FUNCTION
  const filterFeatures = (feature) => {
    if (filter === "all") return true;
    return feature.properties.typ_sportoviste_nazev === filter;
  };

  // Memoized filtered GeoJSON data
  const filteredGeoJsonData = useMemo(() => {
    if (!geoJsonData) return null;
    return {
      ...geoJsonData,
      features: geoJsonData.features.filter(filterFeatures),
    };
  }, [geoJsonData, filter]);

  return (
    <div>
      <div className="popis">
        <h2>
          Sportoviště a sportovní kluby{" "}
          <span> - Umístění sportovišť a sídel sportovních klubů v Brně</span>
        </h2>

        <p>
          Brno se může pochlubit působivou řadou sportovišť a klubů, které
          uspokojují širokou škálu sportovních zájmů. Tato dynamická sportovní
          infrastruktura odráží závazek města podporovat fyzickou zdatnost,
          rekreaci a soutěžní sporty.
        </p>
      </div>
      <div className="filter-container">
        <label htmlFor="filter">Filtr:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Všechno</option>
          {typOptions.map((typ, index) => (
            <option key={index} value={typ}>
              {typ}
            </option>
          ))}
        </select>
      </div>
      <button className="map-switch" onClick={toggleTheme}>
        {isSatellite ? "Původní zobrazení mapy" : "Satelitní zobrazení mapy"}
      </button>
      <MapContainer
        className="map-container"
        center={[49.194, 16.606]}
        zoom={14}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url={
            isSatellite
              ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`
              : `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`
          }
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
        />

        {filteredGeoJsonData && (
          <GeoJSON
            key={JSON.stringify(filteredGeoJsonData)}
            data={filteredGeoJsonData}
            pointToLayer={pointToLayer}
            onEachFeature={onEachFeature}
          />
        )}

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Tady stojíte</Popup>
          </Marker>
        )}
      </MapContainer>

      {filteredGeoJsonData && <SportTable data={filteredGeoJsonData} />}
    </div>
  );
};

export default SportMapComponent;
