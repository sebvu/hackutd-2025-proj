"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

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

  if (loading) return <p>Loading your favorite cars...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ProtectedRoute>
      <div style={{ padding: "2rem" }}>
        <h1>Your Favorite Cars</h1>
        {favorites.length === 0 && <p>No favorites found.</p>}

        <div className="cars-container">
          {favorites.map((fav) => {
            const car = vehicles[fav.car_id];
            if (!car) return null; 

            // const imgSrc = car.image
            //   ? `data:image/jpeg;base64,${car.image}`
            //   : "/placeholder.avif";

            return (
              <div key={fav.favorite_id} className="car-card">
                {/* <img
                  src={imgSrc}
                  alt={car.model}
                  style={{ width: "200px", height: "auto" }}
                /> */}
                <h2>{car.model || "Unknown Model"}</h2>
                <p>
                  {car.body_type || "Unknown Body"} - {car.fuel_type || "N/A"}
                </p>
                <p>
                  {car.horsepower ? `${car.horsepower} HP` : ""}{" "}
                  {car.torque ? `/ ${car.torque} lb-ft` : ""}
                </p>
                <p>
                  Price:{" "}
                  {car.price_min ? `$${car.price_min}` : "N/A"} -{" "}
                  {car.price_max ? `$${car.price_max}` : "N/A"}
                </p>

                {fav.notes && <p><strong>Notes:</strong> {fav.notes}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
