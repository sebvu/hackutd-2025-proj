"use client"

import { Range, getTrackBackground } from "react-range";

const STEP = 500;
const MIN = 20000;
const MAX = 100000;

type PriceSliderProps = {
    values: [number, number];
    setValues: (values: [number, number]) => void;
};

export default function PriceSlider({ values, setValues }: PriceSliderProps) {
    return (
        <div className="price-slider">
        <label>Price Range:</label>
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
                <span>${values[0].toLocaleString()}</span>
                <span>${values[1].toLocaleString()}</span>
            </div>
        </div>
    );
}
