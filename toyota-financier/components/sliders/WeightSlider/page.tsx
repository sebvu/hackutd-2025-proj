"use client";

import { Range, getTrackBackground } from "react-range";

const STEP = 100;
const MIN = 2000;
const MAX = 10000;

type WeightSliderProps = {
    values: [number, number];
    setValues: (values: [number, number]) => void;
};

export default function WeightSlider({ values, setValues }: WeightSliderProps) {
    return (
        <div className="price-slider"> {/* ✅ reuse same base styles */}
        <label>Weight Range (kg):</label>
        <Range
            values={values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(vals) => setValues(vals as [number, number])}
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
            renderThumb={({ props }) => {
            const { key, ...restProps } = props;
            return <div key={key} {...restProps} className="slider-thumb" />;
            }}
        />
        <div className="slider-values">
            <span>{values[0].toLocaleString()} kg</span>
            <span>{values[1].toLocaleString()} kg</span>
        </div>
        </div>
    );
}
