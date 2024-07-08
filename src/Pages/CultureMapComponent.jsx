import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CultureTable from "./CultureTable";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibWFydGlua2FwcmFsIiwiYSI6ImNseThuNnhuOTA5bXIybnF3d2xpd3BmNGoifQ.jX0VpQBFPQnGPjBt84nU2A";

const CultureMapComponent = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [filter, setFilter] = useState("all");
  const [druhOptions, setDruhOptions] = useState([]);

  const [isSatellite, setIsSatellite] = useState(false);

  const toggleTheme = () => {
    setIsSatellite(!isSatellite);
  };

  // FETCHING DATA
  useEffect(() => {
    const apiUrl =
      "https://gis.brno.cz/ags1/rest/services/OMI/omi_ok_kulturni_instituce/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

    const fetchGeoJsonData = async () => {
      try {
        const response = await fetch(apiUrl);
        const cultureData = await response.json();
        setGeoJsonData(cultureData);
        const druhValues = [
          ...new Set(cultureData.features.map((f) => f.properties.druh)),
        ];
        setDruhOptions(druhValues);
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
        <p class="druh">${feature.properties.druh}</p>
        <strong>${feature.properties.nazev}</strong>
        <br>${feature.properties.ulice} ${feature.properties.cp_co}, Brno
        <br>
        <br>
        <a href="${feature.properties.web}" target="_blank">Website</a>
        `
      );
    }
  };

  // FILTER FUNCTION
  const filterFeatures = (feature) => {
    if (filter === "all") return true;
    return feature.properties.druh === filter;
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
          Kulturní místa{" "}
          <span> - Bodová vrstva s lokalizací kulturních institucí v Brně</span>
        </h2>

        <p>
          Brno je pulzujícím kulturním centrem s bohatou historií a dynamickou
          uměleckou scénou. Kulturní mapa města zobrazuje rozmanitou škálu míst,
          včetně historických památek, muzeí, galerií, divadel a tak dále. Tyto
          lokality odrážejí dědictví Brna a jeho současného kreativního ducha.
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
          {druhOptions.map((druh, index) => (
            <option key={index} value={druh}>
              {druh}
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
        zoom={15}
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

      {filteredGeoJsonData && <CultureTable data={filteredGeoJsonData} />}
    </div>
  );
};

export default CultureMapComponent;
