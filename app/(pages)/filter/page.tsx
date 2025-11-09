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

export default function Filter() {
  const [carsData, setCarsData] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Existing filters
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    20000, 100000,
  ]);
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 10000]);
  const [horsePowerRange, setHorsePowerRange] = useState<[number, number]>([
    100, 600,
  ]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [ratingSort, setRatingSort] = useState<"asc" | "desc" | null>("desc");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  // 🔹 NEW: Advanced filter states
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [torqueRange, setTorqueRange] = useState<[number, number]>([100, 600]);
  const [mileageCityRange, setMileageCityRange] = useState<[number, number]>([
    5, 150,
  ]);
  const [mileageHighwayRange, setMileageHighwayRange] = useState<
    [number, number]
  >([5, 150]);
  const [tankSizeRange, setTankSizeRange] = useState<[number, number]>([0, 35]);
  const [accelerationRange, setAccelerationRange] = useState<[number, number]>([
    1, 15,
  ]);
  const [seatRange, setSeatRange] = useState<[number, number]>([0, 15]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>(
    [],
  );
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [awdrFilter, setAwdrFilter] = useState<boolean | null>(null);

  // Modal for viewing cars
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      try {
        const response = await fetch("/api/getAllVehicles");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
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

  const carModels = Array.from(
    new Set(carsData.map((car) => car.model).filter(Boolean)),
  ) as string[];
  const fuelTypes = Array.from(
    new Set(carsData.map((car) => car.fuel_type).filter(Boolean)),
  ) as string[];
  const transmissions = Array.from(
    new Set(carsData.map((car) => car.transmission_type).filter(Boolean)),
  ) as string[];
  const bodyTypes = Array.from(
    new Set(carsData.map((car) => car.body_type).filter(Boolean)),
  ) as string[];
  const seatOptions = Array.from(
    new Set(carsData.map((car) => car.seats).filter(Boolean)),
  ) as number[];

  // UI helpers
  function toggleModel(model: string) {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model],
    );
  }
  function toggleFuelType(fuel: string) {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel],
    );
  }
  function toggleTransmission(t: string) {
    setSelectedTransmission((prev) =>
      prev.includes(t) ? prev.filter((f) => f !== t) : [...prev, t],
    );
  }
  function toggleBodyType(b: string) {
    setSelectedBodyTypes((prev) =>
      prev.includes(b) ? prev.filter((f) => f !== b) : [...prev, b],
    );
  }
  function toggleSeats(s: number) {
    setSelectedSeats((prev) =>
      prev.includes(s) ? prev.filter((f) => f !== s) : [...prev, s],
    );
  }

  function openModal(car: Car) {
    setSelectedCar(car);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setSelectedCar(null);
  }

  if (loading) return <p>Loading vehicles...</p>;

  // 🔹 Filtering Logic
  let filteredCars = carsData.filter((car) => {
    const matchesSearch = searchTerm
      ? car.model?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesModel =
      selectedModels.length === 0 || selectedModels.includes(car.model ?? "");

    const matchesFuel =
      selectedFuelTypes.length === 0 ||
      selectedFuelTypes.includes(car.fuel_type ?? "");

    const matchesBody =
      selectedBodyTypes.length === 0 ||
      selectedBodyTypes.includes(car.body_type ?? "");

    const matchesTransmission =
      selectedTransmission.length === 0 ||
      selectedTransmission.includes(car.transmission_type ?? "");

    const seatsOK =
      (car.seats ?? 0) >= seatRange[0] && (car.seats ?? 0) <= seatRange[1];

    const matchesAWD =
      awdrFilter === null || car.all_wheel_drive === awdrFilter;

    const priceOK =
      (car.price_min ?? 0) <= priceRange[1] &&
      (car.price_max ?? Infinity) >= priceRange[0];

    const weightOK =
      (car.weight ?? 0) >= weightRange[0] &&
      (car.weight ?? 0) <= weightRange[1];

    const hpOK =
      (car.horsepower ?? 0) >= horsePowerRange[0] &&
      (car.horsepower ?? 0) <= horsePowerRange[1];

    const torqueOK =
      (car.torque ?? 0) >= torqueRange[0] &&
      (car.torque ?? 0) <= torqueRange[1];

    const mileageCityOK =
      (car.mileage_city ?? 0) >= mileageCityRange[0] &&
      (car.mileage_city ?? 0) <= mileageCityRange[1];

    const mileageHwyOK =
      (car.mileage_highway ?? 0) >= mileageHighwayRange[0] &&
      (car.mileage_highway ?? 0) <= mileageHighwayRange[1];

    const tankOK =
      (car.tank_size ?? 0) >= tankSizeRange[0] &&
      (car.tank_size ?? 0) <= tankSizeRange[1];

    const accelOK =
      (car.acceleration ?? 0) >= accelerationRange[0] &&
      (car.acceleration ?? 0) <= accelerationRange[1];

    return (
      matchesSearch &&
      matchesModel &&
      matchesFuel &&
      matchesBody &&
      matchesTransmission &&
      seatsOK &&
      matchesAWD &&
      priceOK &&
      weightOK &&
      hpOK &&
      torqueOK &&
      mileageCityOK &&
      mileageHwyOK &&
      tankOK &&
      accelOK
    );
  });

  // Optional sorting
  filteredCars = [...filteredCars].sort((a, b) => {
    if (priceSort) {
      const diff = (a.price_min ?? 0) - (b.price_min ?? 0);
      return priceSort === "asc" ? diff : -diff;
    }
    return 0;
  });

  // 🔹 UI Rendering
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

          {/* Base Filters */}
          <div className="dropdown-container">
            <label>Model:</label>
            <div
              className="dropdown-selected"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedModels.length > 0
                ? selectedModels.join(", ")
                : "Select models"}
              <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
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
            <WeightSlider values={weightRange} setValues={setWeightRange} />
            <HorsePowerSlider
              values={horsePowerRange}
              setValues={setHorsePowerRange}
            />

            {/* Sort Controls */}
            <div className="sort-container">
              <label>Sort by Price:</label>
              <div className="sort-buttons">
                <button
                  className={priceSort === "asc" ? "active" : ""}
                  onClick={() =>
                    setPriceSort(priceSort === "asc" ? null : "asc")
                  }
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

          {/* Advanced Filters */}
          <div className="advanced-filters-container">
            <div
              className={`advanced-filters-header ${advancedOpen ? "open" : ""}`}
              onClick={() => setAdvancedOpen(!advancedOpen)}
            >
              <span>Advanced Filters</span>
              <span className="arrow">{advancedOpen ? "▲" : "▼"}</span>
            </div>

            <div
              className={`advanced-filters-container ${advancedOpen ? "open" : ""}`}
            >
              {advancedOpen && (
                <div className="advanced-filters-menu">
                  {/* Torque */}
                  <WeightSlider
                    label="Torque (Nm)"
                    values={torqueRange}
                    setValues={setTorqueRange}
                    min={100}
                    max={600}
                    step={10}
                    unit="Nm"
                    color="#ff4d4f"
                  />

                  {/* City Mileage */}
                  <WeightSlider
                    label="City Mileage (MPG)"
                    values={mileageCityRange}
                    setValues={setMileageCityRange}
                    min={5}
                    max={150}
                    step={1}
                    unit="MPG"
                    color="#ff4d4f"
                  />

                  {/* Highway Mileage */}
                  <WeightSlider
                    label="Highway Mileage (MPG)"
                    values={mileageHighwayRange}
                    setValues={setMileageHighwayRange}
                    min={5}
                    max={150}
                    step={1}
                    unit="MPG"
                    color="#ff4d4f"
                  />

                  {/* Tank Size */}
                  <WeightSlider
                    label="Tank Size (L)"
                    values={tankSizeRange}
                    setValues={setTankSizeRange}
                    min={0}
                    max={35}
                    step={1}
                    unit="L"
                    color="#ff4d4f"
                  />

                  {/* Acceleration */}
                  <WeightSlider
                    label="Acceleration (0–60 mph in seconds)"
                    values={accelerationRange}
                    setValues={setAccelerationRange}
                    min={1}
                    max={15}
                    step={0.1}
                    unit="s"
                    color="#ff4d4f"
                  />

                  {/* Seats Slider */}
                  <WeightSlider
                    label="Seats"
                    values={seatRange}
                    setValues={setSeatRange}
                    min={0}
                    max={15}
                    step={1}
                    unit=""
                    color="#ff4d4f"
                  />

                  {/* AWD */}
                  <div className="awd-toggle">
                    <label>
                      <input
                        type="checkbox"
                        checked={awdrFilter === true}
                        onChange={() =>
                          setAwdrFilter(awdrFilter === true ? null : true)
                        }
                      />
                      All-Wheel Drive (AWD)
                    </label>
                  </div>

                  {/* Transmission */}
                  <label>Transmission:</label>
                  {transmissions.map((t) => (
                    <label key={t}>
                      <input
                        type="checkbox"
                        checked={selectedTransmission.includes(t)}
                        onChange={() => toggleTransmission(t)}
                      />
                      {t}
                    </label>
                  ))}

                  {/* Body Type */}
                  <label>Body Type:</label>
                  {bodyTypes.map((b) => (
                    <label key={b}>
                      <input
                        type="checkbox"
                        checked={selectedBodyTypes.includes(b)}
                        onChange={() => toggleBodyType(b)}
                      />
                      {b}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            className="clear-button"
            onClick={() => {
              setSelectedModels([]);
              setPriceRange([20000, 100000]);
              setWeightRange([2000, 10000]);
              setHorsePowerRange([100, 600]);
              setSelectedFuelTypes([]);
              setSelectedTransmission([]);
              setSelectedSeats([]);
              setSelectedBodyTypes([]);
              setAwdrFilter(null);
              setSearchTerm("");
            }}
          >
            Clear All
          </button>
        </div>

        {/* Car results */}
        <div className="cars-container">
          <span className="searches-found">
            Cars found: {filteredCars.length}
          </span>

          {filteredCars.map((car) => (
            <div
              key={car.car_id}
              className="car-card"
              onClick={() => openModal(car)}
            >
              <div className="car-details">
                <div className="car-info">
                  <h2>{car.model} 2026</h2>
                  <p>
                    ${car.price_min?.toLocaleString()} - $
                    {car.price_max?.toLocaleString()}
                  </p>
                  <p>{car.body_type}</p>
                </div>
                <img src={HighLander.src} alt="car" className="car-image" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && selectedCar && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
              <div className="modal-header">
                <h2>{selectedCar.model} 2026</h2>
                <p>
                  ${selectedCar.price_min} - ${selectedCar.price_max}
                </p>
              </div>
              <div className="modal-body-container">
                <div className="modal-body-text">
                  <ul className="car-details-list">
                    <li>
                      <strong>Body Type:</strong> {selectedCar.body_type}
                    </li>
                    <li>
                      <strong>Fuel Type:</strong> {selectedCar.fuel_type}
                    </li>
                    <li>
                      <strong>Horsepower:</strong> {selectedCar.horsepower} hp
                    </li>
                    <li>
                      <strong>Torque:</strong> {selectedCar.torque} Nm
                    </li>
                    <li>
                      <strong>City Mileage:</strong> {selectedCar.mileage_city}{" "}
                      mpg
                    </li>
                    <li>
                      <strong>Highway Mileage:</strong>{" "}
                      {selectedCar.mileage_highway} mpg
                    </li>
                    <li>
                      <strong>Tank Size:</strong> {selectedCar.tank_size} L
                    </li>
                    <li>
                      <strong>0-60 mph:</strong> {selectedCar.acceleration} s
                    </li>
                    <li>
                      <strong>Seats:</strong> {selectedCar.seats}
                    </li>
                    <li>
                      <strong>Transmission:</strong>{" "}
                      {selectedCar.transmission_type}
                    </li>
                    <li>
                      <strong>AWD:</strong>{" "}
                      {selectedCar.all_wheel_drive ? "Yes" : "No"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chatbot bubble */}
      <ChatbotBubble />
    </div>
  );
}
