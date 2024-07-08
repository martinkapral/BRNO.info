import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="popis">
        <h2>
          BRNO.info <span> - Mapy a tabulky s informativními údaji</span>
        </h2>

        <p>
          Tento web slouží jako komplexní zdroj pro poznávání města Brna. Nabízí
          širokou škálu map a tabulek s podrobnými informacemi o různých bodech
          zájmu.
        </p>
        <p>
          Ať už hledáte kulturní místa, sportoviště nebo vyhlídkové rozhledny,
          tato stránka vám poskytne všechna důležitá data, která vám zpříjemní
          pobyt v Brně. Ideální pro obyvatele i návštěvníky, tato stránka bude
          vaším průvodcem objevováním toho nejlepšího, co město může nabídnout.
        </p>
      </div>

      <div className="home-cards-wrapper">
        <h2>Kategorie:</h2>
        <div className="home-cards">
          <NavLink to="/kulturnimista" className="home-card">
            <div>
              <h2>Kulturní místa</h2>
              <p>Bodová vrstva s lokalizací kulturních institucí v Brně</p>
            </div>
          </NavLink>
          <NavLink to="/sport" className="home-card">
            <div>
              <h2>Sport</h2>
              <p>Umístění sportovišť a sídel sportovních klubů v Brně</p>
            </div>
          </NavLink>
          <NavLink to="/rozhledny" className="home-card">
            <div>
              <h2>Rozhledny</h2>
              <p>Lokalizace rozhleden v Jihomoravském kraji</p>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Home;
