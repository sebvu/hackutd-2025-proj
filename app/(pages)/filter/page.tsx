"use client";

import { useState, useEffect } from "react";
import PriceSlider from "@/components/sliders/PriceSlider/page";
import WeightSlider from "@/components/sliders/WeightSlider/page";
import HorsePowerSlider from "@/components/sliders/HorsePowerSlider/page";
import HighLander from "../2021_Highlander.avif";
import "@/app/styles/chatbot.css";
import ChatbotBubble from "@/components/ChatbotBubble";

export type Car = {
  car_id: number;
  apr: number;
  model?: string;
  description?: string;
  body_type?: string;
  fuel_type?: string;
  horsepower?: number;
  torque?: number;
  mileage_city?: number;
  mileage_highway?: number;
  weight?: number;
  transmission_type?: string;
  tank_size?: number;
  acceleration?: number;
  seats?: number;
  all_wheel_drive?: boolean;
  price_min?: number;
  price_max?: number;
  image?: string; 
};

type StarRatingProps = {
  rating: number;
};

export default function Filter() {
  const [carsData, setCarsData] = useState<Car[]>([]);
  const carModels: string[] = Array.from(
    new Set(carsData.map(car => car.model).filter((m): m is string => !!m))
  );

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([20000, 100000]);
  const [weightRange, setWeightRange] = useState<[number, number]>([2000, 10000]);
  const [horsePowerRange, setHorsePowerRange] = useState<[number, number]>([100, 600]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [ratingSort, setRatingSort] = useState<"asc" | "desc" | null>("desc");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      try {
        const response = await fetch('/api/getAllVehicles');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cars: Car[] = await response.json(); 
        setCarsData(cars);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  function openModal(car: Car) {
    setSelectedCar(car);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCar(null);
  }

  function toggleModel(model: string) {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  }

  const toggleFuelType = (fuel: string) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
  };

  function StarRating({ rating }: StarRatingProps) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <div className="rating-stars">
        {"★".repeat(fullStars)}
        {halfStar ? "⯨" : ""}
        {"☆".repeat(emptyStars)}
      </div>
    );
  }

  function parsePrice(price: string) {
    return Number(price.replace(/[^0-9.-]+/g, ""));
  }

  if (loading) return <p>Loading vehicles...</p>;

  let filteredCars = selectedModels.length
  ? carsData.filter((car) => car.model && selectedModels.includes(car.model))
  : carsData;


  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    filteredCars = filteredCars.filter(
      (car) =>
        car.model?.toLowerCase().includes(term)
    );
  }

  filteredCars = filteredCars.filter((car) => {
    const carMin = car.price_min ?? 0;      
    const carMax = car.price_max ?? Infinity; 
    const [selectedMin, selectedMax] = priceRange;
    return carMax >= selectedMin && carMin <= selectedMax;
  });


  filteredCars = [...filteredCars].sort((a, b) => {
    if (priceSort) {
      const aMin = a.price_min ?? 0;       // fallback to 0 if undefined
      const bMin = b.price_min ?? 0;       // fallback to 0 if undefined
      const priceDiff = aMin - bMin;
      if (priceDiff !== 0) return priceSort === "asc" ? priceDiff : -priceDiff;
    }

    // if (ratingSort) {
    //   const aRating = a.rating ?? 0;       // fallback to 0 if undefined
    //   const bRating = b.rating ?? 0;
    //   const ratingDiff = aRating - bRating;
    //   if (ratingDiff !== 0) return ratingSort === "asc" ? ratingDiff : -ratingDiff;
    // }

    return 0;
  });


  return (
    <div className="filter-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by model/year..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="main-content">
        <div className="filters">
          <h3>Filters</h3>

          <div className="dropdown-container">
            <label>Model:</label>
            <div className="dropdown">
              <div
                className="dropdown-selected"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                {selectedModels.length > 0
                  ? selectedModels.join(", ")
                  : "Select models"}
                <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  {carModels.map((model) => (
                    <label key={model} className="dropdown-option">
                      <input
                        type="checkbox"
                        checked={selectedModels.includes(model)}
                        onChange={() => toggleModel(model)}
                      />
                      {model}
                    </label>
                  ))}
                </div>
              )}

              <PriceSlider values={priceRange} setValues={setPriceRange} />

              <div className="sort-container">
                <label>Sort by Rating:</label>
                <div className="sort-buttons">
                  <button
                    className={ratingSort === "asc" ? "active" : ""}
                    onClick={() =>
                      setRatingSort(ratingSort === "asc" ? null : "asc")
                    }
                  >
                    ↑ Asc
                  </button>
                  <button
                    className={ratingSort === "desc" ? "active" : ""}
                    onClick={() =>
                      setRatingSort(ratingSort === "desc" ? null : "desc")
                    }
                  >
                    ↓ Desc
                  </button>
                </div>

                <label>Sort by Price:</label>
                <div className="sort-buttons">
                  <button
                    className={priceSort === "asc" ? "active" : ""}
                    onClick={() => setPriceSort(priceSort === "asc" ? null : "asc")}
                  >
                    ↑ Asc
                  </button>
                  <button
                    className={priceSort === "desc" ? "active" : ""}
                    onClick={() =>
                      setPriceSort(priceSort === "desc" ? null : "desc")
                    }
                  >
                    ↓ Desc
                  </button>
                </div>
              </div>
            </div>

            <div className="advanced-filters-container">
              <div
                className="advanced-filters-header"
                onClick={(e) => {
                  e.stopPropagation();
                  setAdvancedOpen(!advancedOpen);
                }}
              >
                <span>Advanced Filters</span>
                <span className="arrow">{advancedOpen ? "▲" : "▼"}</span>
              </div>

              {advancedOpen && (
                <div
                  className="advanced-filters-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="filter-group">
                    <WeightSlider values={weightRange} setValues={setWeightRange} />
                  </div>

                  <div className="filter-group">
                    <HorsePowerSlider
                      values={horsePowerRange}
                      setValues={setHorsePowerRange}
                    />
                  </div>

                  <div className="filter-group">
                    <label>Fuel Type:</label>
                    <div className="fuel-options">
                      {["Gasoline", "Electric", "Hybrid"].map((fuel) => (
                        <label key={fuel} className="fuel-option">
                          <input
                            type="checkbox"
                            checked={selectedFuelTypes.includes(fuel)}
                            onChange={() => toggleFuelType(fuel)}
                          />
                          {fuel}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="clear-button">
              <button
                onClick={() => {
                  setSelectedModels([]);
                  setPriceRange([20000, 50000]);
                  setRatingSort(null);
                  setPriceSort(null);
                  setSearchTerm("");
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="cars-container">
          <span className="searches-found">Searches found: {filteredCars.length}</span>

          {filteredCars.map((car, index) => (
            <div key={index} className="car-card" onClick={() => openModal(car)}>
              <div className="car-details">
                <div className="car-info">
                  <h2>{car.model} 2026</h2>
                  <p>{car.price_min} - {car.price_max}</p>
                </div>
                {/* <div className="rating">
                  <StarRating rating={car.rating} /> {car.rating}
                </div> */}
                <img src={HighLander.src} alt="car" className="car-image" />
              </div>
            </div>
          ))}
        </div>

        {modalOpen && selectedCar && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              <div className="modal-header">
                <h2>{selectedCar.model} 2026</h2>
                <p>{selectedCar.price_min} - {selectedCar.price_max}</p>
              </div>
              <div className="modal-body-container">
                <div className="modal-body-text">
                  <ul className="car-details-list">
                    <li><strong>Body Type:</strong> {selectedCar.body_type}</li>
                    <li><strong>Fuel Type:</strong> {selectedCar.fuel_type}</li>
                    <li><strong>Horsepower:</strong> {selectedCar.horsepower} hp</li>
                    <li><strong>Torque:</strong> {selectedCar.torque} Nm</li>
                    <li><strong>City Mileage:</strong> {selectedCar.mileage_city} mpg</li>
                    <li><strong>Highway Mileage:</strong> {selectedCar.mileage_highway} mpg</li>
                    <li><strong>Tank Size:</strong> {selectedCar.tank_size} L</li>
                    <li><strong>0-60 mph:</strong> {selectedCar.acceleration} sec</li>
                    <li><strong>Seats:</strong> {selectedCar.seats}</li>
                  </ul>
                </div>
                <div className="modal-body-image">
                  <img src={HighLander.src} alt="car" className="car-image" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ChatbotBubble />
    </div>
  );
}
