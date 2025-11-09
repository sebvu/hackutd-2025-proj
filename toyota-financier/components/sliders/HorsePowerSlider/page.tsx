"use client";

import { Range, getTrackBackground } from "react-range";

const STEP = 20;
const MIN = 100;
const MAX = 600;

type HorsePowerSliderProps = {
    values: [number, number];
    setValues: (values: [number, number]) => void;
};

export default function HorsePowerSlider({ values, setValues }: HorsePowerSliderProps) {
    return (
        <div className="price-slider"> 
            <label>Horse Power (HP):</label> 
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
                <span>{values[0].toLocaleString()} HP</span> 
                <span>{values[1].toLocaleString()} HP</span>
            </div>
        </div>
    );
}
