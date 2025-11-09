"use client";

import { useState } from "react";
import PriceSlider from "../(slider)/page";

type Car = {
    model: string;
    year: number;
    min_price: string;
    max_price: string;
    rating: number;
    image?: string;
};

type StarRatingProps = {
    rating: number;
};

const carsData: Car[] = [
    { model: "Corolla", year: 2021, min_price: "$20,000", max_price: "$25,000", rating: 4.5 },
    { model: "Camry", year: 2022, min_price: "$24,000", max_price: "$30,000", rating: 4.7 },
    { model: "RAV4", year: 2020, min_price: "$26,000", max_price: "$32,000", rating: 4.6 },
    { model: "Highlander", year: 2021, min_price: "$35,000", max_price: "$42,000", rating: 4.8 },
    { model: "Highlander", year: 2021, min_price: "$35,000", max_price: "$42,000", rating: 3.2 },
];

const carModels = [
    "Camry","Corolla","Crown","bZ","C-HR","CorollaCross","RAV4",
    "GrandHighlander","Highlander","LandCruiser","Sequoia","4Runner",
    "Tacoma","Tundra","GR86","GRSupra","Prius"
];

export default function Filter() {
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    function toggleDropdown() {
        setDropdownOpen(!dropdownOpen);
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

    const filteredCars = selectedModels.length
        ? carsData.filter(car => selectedModels.includes(car.model))
        : carsData;

    return (
        <div className="filter-page">
            <div className="search-bar">
                <input type="text" placeholder="Search by model/year..." />
                <span>Searches found: 50</span>
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
                                {selectedModels.length > 0 ? selectedModels.join(", ") : "Select models"}
                                <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
                            </div>

                            {dropdownOpen && (
                                <div
                                    className="dropdown-menu"
                                    onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                                >
                                    {carModels.map(model => (
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
                        </div>
                    </div>

                    <PriceSlider />
                </div>

                <div className="cars-container">
                    {filteredCars.map((car, index) => (
                        <div key={index} className="car-card">
                            <div className="car-details">
                                <div className="car-info">
                                    <h2>{car.model} {car.year}</h2>
                                    <p>{car.min_price} - {car.max_price}</p>
                                </div>
                                <div className="rating">
                                    <StarRating rating={car.rating} /> {car.rating}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
