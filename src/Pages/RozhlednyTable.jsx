import React from "react";

const RozhlednyTable = ({ data }) => {
  return (
    <div className="table-container">
      <h2>Tabulka dat:</h2>
      <table>
        <thead>
          <tr>
            <th>Název</th>
            <th>Obec</th>
            <th>Výška</th>
            <th>m n. m.</th>
            <th>Konstrukce</th>
          </tr>
        </thead>
        <tbody>
          {data.features.map((feature, index) => (
            <tr key={index}>
              <td>{feature.properties.nazev}</td>
              <td>{feature.properties.obec}</td>
              <td>{feature.properties.vyska + " m"}</td>
              <td>{feature.properties.nadm_vyska + " m"}</td>
              <td>{feature.properties.konstrukce}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RozhlednyTable;
