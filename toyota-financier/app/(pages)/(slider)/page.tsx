"use client"

import { useState } from "react";
import { Range, getTrackBackground } from "react-range";

const STEP = 500;
const MIN = 20000;
const MAX = 50000;

export default function PriceSlider() {
  const [values, setValues] = useState([MIN, MAX]);

  return (
    <div className="price-slider">
        <label>Price Range:</label>
            <Range
            values={values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={setValues}
            renderTrack={({ props, children }) => (
            <div
                {...props}
                className="slider-track"
                style={{
                background: getTrackBackground({
                    values,
                    colors: ["#ccc", "#EB0A1E", "#ccc"],
                    min: MIN,
                    max: MAX,
                }),
            }}
            >
                {children}
            </div>
            )}
            renderThumb={({ props, index }) => {
            const { key, ...rest } = props;
            return <div key={index} {...rest} className="slider-thumb" />;
            }}

        />
        <div className="slider-values">
            <span>${values[0].toLocaleString()}</span>
            <span>${values[1].toLocaleString()}</span>
        </div>
    </div>
    );
}
