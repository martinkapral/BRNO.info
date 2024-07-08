import React from "react";

const CultureTable = ({ data }) => {
  return (
    <div className="table-container">
      <h2>Tabulka dat:</h2>
      <table>
        <thead>
          <tr>
            <th>Název</th>
            <th>Druh</th>
            <th>Adresa</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {data.features.map((feature, index) => (
            <tr key={index}>
              <td>{feature.properties.nazev}</td>
              <td>{feature.properties.druh}</td>
              <td>
                {feature.properties.ulice} {feature.properties.cp_co}, Brno
              </td>
              <td>
                <a
                  href={feature.properties.web}
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

export default CultureTable;
