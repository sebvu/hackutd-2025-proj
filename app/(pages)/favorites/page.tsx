"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import HeartFill from "../assets/heart-fill.svg"

type Vehicle = {
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
  rating?: number; // optional rating from DB
  image?: string; // base64
};

type Favorite = {
  favorite_id: number;
  car_id: number;
  notes?: string;
  added_at?: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [vehicles, setVehicles] = useState<Record<number, Vehicle>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingSort, setRatingSort] = useState<"asc" | "desc" | null>("desc");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>();
  const [modalOpen, setModalOpen] = useState(false);
  const [unfavoriteModalOpen, setUnfavoriteModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);

  // Fetch favorites & vehicle info
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favRes = await fetch("/api/getFavorites");
        if (!favRes.ok) throw new Error("Failed to fetch favorites");
        const favoriteEntries: Favorite[] = await favRes.json();
        setFavorites(favoriteEntries);

        const vehiclePromises = favoriteEntries.map((fav) =>
          fetch(`/api/getVehicle?car_id=${fav.car_id}`).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch vehicle ${fav.car_id}`);
            return res.json();
          })
        );

        const vehicleDataArray = await Promise.all(vehiclePromises);
        const vehiclesMap: Record<number, Vehicle> = {};
        vehicleDataArray.forEach((v: Vehicle) => {
          vehiclesMap[v.car_id] = v;
        });
        setVehicles(vehiclesMap);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Helper functions
  function openModal(car: Vehicle) {
    setSelectedCar(car);
    setModalOpen(true);
  }

  function closeModal() {
    setSelectedCar(null);
    setModalOpen(false);
  }

  function openUnfavoriteModal(car: Vehicle) {
    setSelectedCar(car);
    setUnfavoriteModalOpen(true);
  }

  function closeUnfavoriteModal() {
    setSelectedCar(null);
    setUnfavoriteModalOpen(false);
  }

  function StarRating({ rating }: { rating?: number }) {
    const r = rating ?? 4; // default if DB missing
    const fullStars = Math.floor(r);
    const halfStar = r % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <div className="rating-stars">
        {"★".repeat(fullStars)}
        {halfStar ? "⯨" : ""}
        {"☆".repeat(emptyStars)}
      </div>
    );
  }

  if (loading) return <p>Loading your favorite cars...</p>;
  if (error) return <p>Error: {error}</p>;

  // Merge favorites with vehicle data
  const favoriteVehicles = favorites
    .map((fav) => vehicles[fav.car_id])
    .filter(Boolean);

  // Apply search filter
  let filteredCars = favoriteVehicles.filter((car) => {
    const term = searchTerm.toLowerCase();
    return (
      car.model?.toLowerCase().includes(term) ||
      (car.description?.toLowerCase().includes(term) ?? false)
    );
  });

  // Apply sorting
  filteredCars = [...filteredCars].sort((a, b) => {
    if (priceSort) {
      const aPrice = a.price_min ?? 0;
      const bPrice = b.price_min ?? 0;
      if (aPrice !== bPrice) return priceSort === "asc" ? aPrice - bPrice : bPrice - aPrice;
    }
    if (ratingSort) {
      const aRating = a.rating ?? 0;
      const bRating = b.rating ?? 0;
      if (aRating !== bRating) return ratingSort === "asc" ? aRating - bRating : bRating - aRating;
    }
    return 0;
  });

  return (
    <ProtectedRoute>
      <div className="favorites-page">
        <div className="main-content">
          <div className="fav-sidebar">
            <div className="sort-container">
              <label>Sort by Rating:</label>
              <div className="sort-buttons">
                <button
                  className={ratingSort === "asc" ? "active" : ""}
                  onClick={() => setRatingSort(ratingSort === "asc" ? null : "asc")}
                >
                  ↑ Asc
                </button>
                <button
                  className={ratingSort === "desc" ? "active" : ""}
                  onClick={() => setRatingSort(ratingSort === "desc" ? null : "desc")}
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
                  onClick={() => setPriceSort(priceSort === "desc" ? null : "desc")}
                >
                  ↓ Desc
                </button>
              </div>
            </div>

            <div className="sidebar-separator"></div>

            <input
              type="text"
              placeholder="Search by model or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="cars-container">
            {filteredCars.map((car) => (
              <div key={car.car_id} className="car-card">
                <div className="car-details" onClick={() => openModal(car)}>
                  <div className="car-info">
                    <h2>{car.model}</h2>
                    <p>
                      {car.price_min ? `$${car.price_min}` : "N/A"} -{" "}
                      {car.price_max ? `$${car.price_max}` : "N/A"}
                    </p>
                  </div>
                  <div className="rating">
                    <StarRating rating={car.rating} /> {car.rating ?? "-"}
                  </div>
                  {car.image && (
                    <img
                      src={`data:image/jpeg;base64,${car.image}`}
                      alt={car.model}
                      className="car-image"
                    />
                  )}
                </div>
                <img
                  src={HeartFill.src}
                  alt="heart"
                  className="unfavorite"
                  onClick={() => openUnfavoriteModal(car)}
                />
              </div>
            ))}
          </div>

          {modalOpen && selectedCar && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>
                  ×
                </button>
                <div className="modal-header">
                  <h2>{selectedCar.model}</h2>
                  <p>
                    {selectedCar.price_min ? `$${selectedCar.price_min}` : "N/A"} -{" "}
                    {selectedCar.price_max ? `$${selectedCar.price_max}` : "N/A"}
                  </p>
                </div>
                <div className="modal-body-container">
                  <div className="modal-body-text">
                    <ul className="car-details-list">
                      <li>
                        <strong>Body Type:</strong> {selectedCar.body_type ?? "N/A"}
                      </li>
                      <li>
                        <strong>Fuel Type:</strong> {selectedCar.fuel_type ?? "N/A"}
                      </li>
                      <li>
                        <strong>Horsepower:</strong> {selectedCar.horsepower ?? "-"} hp
                      </li>
                      <li>
                        <strong>Torque:</strong> {selectedCar.torque ?? "-"} lb-ft
                      </li>
                      <li>
                        <strong>City Mileage:</strong> {selectedCar.mileage_city ?? "-"} mpg
                      </li>
                      <li>
                        <strong>Highway Mileage:</strong> {selectedCar.mileage_highway ?? "-"} mpg
                      </li>
                      <li>
                        <strong>Tank Size:</strong> {selectedCar.tank_size ?? "-"} L
                      </li>
                      <li>
                        <strong>0-60 mph:</strong> {selectedCar.acceleration ?? "-"} sec
                      </li>
                      <li>
                        <strong>Seats:</strong> {selectedCar.seats ?? "-"}
                      </li>
                    </ul>
                  </div>
                  <div className="modal-body-image">
                    {selectedCar.image && (
                      <img
                        src={`data:image/jpeg;base64,${selectedCar.image}`}
                        alt={selectedCar.model}
                        className="car-image"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {unfavoriteModalOpen && selectedCar && (
            <div className="modal-overlay" onClick={closeUnfavoriteModal}>
              <div className="unfavorite-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeUnfavoriteModal}>
                  ×
                </button>
                <p className="unfavorite-modal-message">
                  Remove {selectedCar.model} from favorites?
                </p>
                <div className="unfavorite-modal-btns">
                  <button className="unfavorite-cancel" onClick={closeUnfavoriteModal}>
                    Cancel
                  </button>
                  <button
                    className="unfavorite-confirm"
                    onClick={() => {
                      setFavorites((prev) =>
                        prev.filter((fav) => fav.car_id !== selectedCar.car_id)
                      );
                      closeUnfavoriteModal();
                      // TODO: call API to remove from DB
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
