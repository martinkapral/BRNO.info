import React from "react";

const SportTable = ({ data }) => {
  return (
    <div className="sport-table-container">
      <h2>Tabulka dat:</h2>
      <table>
        <thead>
          <tr>
            <th className="sport-table-smaller">Název</th>
            <th className="sport-table-smaller">Druh</th>
            <th className="sport-table-smaller">Adresa</th>
            <th className="sport-table-smaller">Popis</th>
            <th className="sport-table-smaller">Website</th>
          </tr>
        </thead>
        <tbody>
          {data.features.map((feature, index) => (
            <tr key={index}>
              <td className="sport-table-smaller">
                {feature.properties.nazev}
              </td>
              <td className="sport-table-smaller">
                {feature.properties.typ_sportoviste_nazev}
              </td>
              <td className="sport-table-smaller">
                {feature.properties.adresa}
              </td>
              <td className="sport-table-smaller">
                {feature.properties.popis}
              </td>
              <td className="sport-table-smaller">
                <a
                  href={feature.properties.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SportTable;
