import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RozhlednyTable from "./RozhlednyTable";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibWFydGlua2FwcmFsIiwiYSI6ImNseThuNnhuOTA5bXIybnF3d2xpd3BmNGoifQ.jX0VpQBFPQnGPjBt84nU2A";

const RozhlednyMapComponent = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [isSatellite, setIsSatellite] = useState(false);

  const toggleTheme = () => {
    setIsSatellite(!isSatellite);
  };

  // FETCHING DATA
  useEffect(() => {
    const apiUrl =
      "https://gis.brno.cz/ags1/rest/services/ODAE/ODAE_rozhledny/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

    const fetchGeoJsonData = async () => {
      try {
        const response = await fetch(apiUrl);
        const rozhlednyData = await response.json();
        setGeoJsonData(rozhlednyData);
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
        
        <strong>${feature.properties.nazev}</strong>
        <br>
        <br>Obec: <strong>${feature.properties.obec}</strong> 
        <br>Výška: ${feature.properties.vyska} m
        <br>Nadmořská výška: ${feature.properties.nadm_vyska} m
        <p class="druh">Konstrukce: ${feature.properties.konstrukce}</p>
        
        `
      );
    }
  };

  return (
    <div>
      <div className="popis">
        <h2>
          Rozhledny <span> - Lokalizace rozhleden v Jihomoravském kraji</span>
        </h2>

        <p>
          Jihomoravský kraj nabízí rozhledny, které poskytují dechberoucí
          výhledy a jsou ideálními cíli výletů. Tyto věže jsou rozesety po celém
          regionu a každá nabízí jedinečnou vyhlídku k obdivování přírodních
          krás a kulturního dědictví jižní Moravy.
        </p>
      </div>
      <button className="map-switch" onClick={toggleTheme}>
        {isSatellite ? "Původní zobrazení mapy" : "Satelitní zobrazení mapy"}
      </button>
      <MapContainer
        className="map-container"
        center={[49.194, 16.606]}
        zoom={10}
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

        {geoJsonData && (
          <GeoJSON
            key={JSON.stringify(geoJsonData)}
            data={geoJsonData}
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

      {geoJsonData && <RozhlednyTable data={geoJsonData} />}
    </div>
  );
};

export default RozhlednyMapComponent;
