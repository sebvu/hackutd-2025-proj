import React from "react";

const carsData = [
  { model: "Corolla", year: 2021, min_price: "$20,000", max_price: "$25,000", rating: 4.5 },
  { model: "Camry", year: 2022, min_price: "$24,000", max_price: "$30,000", rating: 4.7 },
  { model: "RAV4", year: 2020, min_price: "$26,000", max_price: "$32,000", rating: 4.6 },
  { model: "Highlander", year: 2021, min_price: "$35,000", max_price: "$42,000", rating: 4.8 },
];

export default function Filter() {
  return (
    <div className="filter-page">
      <div className="search-bar">
        <input type="text" placeholder="Search by model/year..." />
        <span># searches found: 50</span>
      </div>

      <div className="main-content">
        <div className="filters">
          <h3>Filters</h3>
          <div>
            <label>Year:</label>
            <select>
              <option value="">Any</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
          <div>
            <label>Price Range:</label>
            <select>
              <option value="">Any</option>
              <option value="20000-25000">$20k-$25k</option>
              <option value="25000-30000">$25k-$30k</option>
              <option value="30000-40000">$30k-$40k</option>
            </select>
          </div>
        </div>

        <div className="cars-container">
          {carsData.map((car, index) => (
            <div key={index} className="car-card">
              <h2>{car.model} {car.year}</h2>
              <p>{car.min_price} - {car.max_price}</p>
              <p>Rating: {car.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
