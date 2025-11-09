"use client";

import { useState } from "react";
import HighLander from "../2021_Highlander.avif";
import HeartFill from "../heart-fill.svg";
import "../../styles/favorites.css"

type Car = {
    model: string;
    year: number;
    min_price: string;
    max_price: string;
    rating: number;
    body_type: string;
    fuel_type: string;
    horsepower: number;
    torque: number;
    mileage_city: number;
    mileage_highway: number;
    tank_size: number;
    acceleration: number;
    seats: number;
    image?: string;
};

type StarRatingProps = {
    rating: number;
};

const carsData: Car[] = [
    {
        model: "Corolla",
        year: 2021,
        min_price: "$20,000",
        max_price: "$25,000",
        rating: 4.5,
        body_type: "Sedan",
        fuel_type: "Gasoline",
        horsepower: 139,
        torque: 126,
        mileage_city: 30,
        mileage_highway: 38,
        tank_size: 13.2,
        acceleration: 8.2,
        seats: 5
    },
    {
        model: "Camry",
        year: 2022,
        min_price: "$24,000",
        max_price: "$30,000",
        rating: 4.7,
        body_type: "Sedan",
        fuel_type: "Hybrid",
        horsepower: 208,
        torque: 184,
        mileage_city: 28,
        mileage_highway: 39,
        tank_size: 14.5,
        acceleration: 7.6,
        seats: 5
    },
    {
        model: "RAV4",
        year: 2020,
        min_price: "$26,000",
        max_price: "$32,000",
        rating: 4.6,
        body_type: "SUV",
        fuel_type: "Gasoline",
        horsepower: 203,
        torque: 184,
        mileage_city: 27,
        mileage_highway: 35,
        tank_size: 14.5,
        acceleration: 8.0,
        seats: 5
    },
    {
        model: "Highlander",
        year: 2021,
        min_price: "$35,000",
        max_price: "$42,000",
        rating: 4.8,
        body_type: "SUV",
        fuel_type: "Hybrid",
        horsepower: 306,
        torque: 267,
        // transmission_type: "Automatic",
        mileage_city: 20,
        mileage_highway: 27,
        tank_size: 17.1,
        acceleration: 6.8,
        seats: 7
    }
];

const carModels = [
    "Camry","Corolla","Crown","bZ","C-HR","CorollaCross","RAV4",
    "GrandHighlander","Highlander","LandCruiser","Sequoia","4Runner",
    "Tacoma","Tundra","GR86","GRSupra","Prius"
];

export default function Favorites() {
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([20000, 50000]);
    const [ratingSort, setRatingSort] = useState<"asc" | "desc" | null>("desc");
    const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>();
    const [modalOpen, setModalOpen] = useState(false);
    const [unfavoriteModalOpen, setUnfavoriteModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    function openModal(car: Car) {
        setSelectedCar(car);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setSelectedCar(null);
    }

    function openUnfavoriteModal(car: Car) {
        setSelectedCar(car)
        setUnfavoriteModalOpen(true);
    }

    function closeUnfavoriteModal() {
        setUnfavoriteModalOpen(false);
        setSelectedCar(null);
    }

    function toggleModel(model: string) {
        setSelectedModels(prev =>
            prev.includes(model)
                ? prev.filter(m => m !== model)
                : [...prev, model]
        );
    }

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

    // Filter by selected models
    let filteredCars = selectedModels.length
        ? carsData.filter(car => selectedModels.includes(car.model))
        : carsData;

    // Filter by search term (model or year)
    if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        filteredCars = filteredCars.filter(car =>
            car.model.toLowerCase().includes(term) ||
            car.year.toString().includes(term)
        );
    }

    // Filter by price range
    filteredCars = filteredCars.filter(car => {
        const carMin = parsePrice(car.min_price)
        const carMax = parsePrice(car.max_price)
        const [selectedMin, selectedMax] = priceRange
        return carMax >= selectedMin && carMin <= selectedMax
    });

    // Then sort by price or rating
    filteredCars = [...filteredCars].sort((a, b) => {
        if (priceSort) {
            const priceDiff = parsePrice(a.min_price) - parsePrice(b.min_price)
            if (priceDiff !== 0) return priceSort === "asc" ? priceDiff : -priceDiff
        }
        if (ratingSort) {
            const ratingDiff = a.rating - b.rating
            if (ratingDiff !== 0) return ratingSort === "asc" ? ratingDiff : -ratingDiff
        }
        return 0
    })

    return (
        <div className="favorites-page">
            <div className="main-content">
                <div className="cars-container">
                    {filteredCars.map((car, index) => (
                        <div key={index} className="car-card">
                            <div className="car-details" onClick={() => openModal(car)}>
                                <div className="car-info">
                                    <h2>{car.model} {car.year}</h2>
                                    <p>{car.min_price} - {car.max_price}</p>
                                </div>
                                <div className="rating">
                                    <StarRating rating={car.rating} /> {car.rating}
                                </div>.
                                <img src={HighLander.src} alt="car" className="car-image"></img>
                            </div>
                            <img src={HeartFill.src} alt="heart" className="unfavorite" onClick={() => openUnfavoriteModal(car)}/>
                        </div>
                    ))}
                </div>
                {modalOpen && selectedCar && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="modal-close" onClick={closeModal}>×</button>
                            <div className="modal-header">
                                <h2>{selectedCar.model} {selectedCar.year}</h2>
                                <p>{selectedCar.min_price} - {selectedCar.max_price}</p>
                            </div>
                            <div className="modal-body-container">
                                <div className="modal-body-text">
                                    <ul className="car-details-list">
                                        <li><strong>Body Type:</strong> {selectedCar.body_type || "Sedan"}</li>
                                        <li><strong>Fuel Type:</strong> {selectedCar.fuel_type || "Gasoline"}</li>
                                        <li><strong>Horsepower:</strong> {selectedCar.horsepower || 200} hp</li>
                                        <li><strong>Torque:</strong> {selectedCar.torque || 250} Nm</li>
                                        <li><strong>City Mileage:</strong> {selectedCar.mileage_city || 25} mpg</li>
                                        <li><strong>Highway Mileage:</strong> {selectedCar.mileage_highway || 35} mpg</li>
                                        <li><strong>Tank Size:</strong> {selectedCar.tank_size || 50} L</li>
                                        <li><strong>0-60 mph:</strong> {selectedCar.acceleration || 7} sec</li>
                                        <li><strong>Seats:</strong> {selectedCar.seats || 5}</li>
                                    </ul>
                                </div>
                                <div className="modal-body-image">
                                    <img src={HighLander.src} alt="car" className="car-image" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {unfavoriteModalOpen && selectedCar && (
                    <div className="modal-overlay" onClick={closeUnfavoriteModal}>
                    <div className="unfavorite-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeUnfavoriteModal}>×</button>
                        {/* <div className="modal-header">
                            <h2>{selectedCar.model} {selectedCar.year}</h2>
                            <p>{selectedCar.min_price} - {selectedCar.max_price}</p>
                        </div>
                        <div className="modal-body-container">
                            <div className="modal-body-text">
                                <ul className="car-details-list">
                                </ul>
                            </div>
                            <div className="modal-body-image">
                                <img src={HighLander.src} alt="car" className="car-image" />
                            </div>
                        </div> */}
                        <p className="unfavorite-modal-message">Remove car from favorites?</p>
                        <div className="unfavorite-modal-btns">
                            <button className="unfavorite-cancel" onClick={closeUnfavoriteModal}>Cancel</button>
                            <button className="unfavorite-confirm" onClick={closeUnfavoriteModal}>Remove</button>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}