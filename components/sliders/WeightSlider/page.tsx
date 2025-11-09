"use client";

import React from "react";
import { Range } from "react-range";

interface WeightSliderProps {
  label?: string;
  values: [number, number];
  setValues: (values: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  color?: string;
}

export default function WeightSlider({
  label = "Weight",
  values,
  setValues,
  min = 0,
  max = 10000,
  step = 1,
  unit = "lbs",
  color = "#ff4d4f", // 🔴 bright red default
}: WeightSliderProps) {
  // clamp to avoid React Range errors
  const safeValues: [number, number] = [
    Math.max(min, Math.min(max, values[0])),
    Math.max(min, Math.min(max, values[1])),
  ];

  return (
    <div className="price-slider">
      {label && <label>{label}</label>}
      <Range
        values={safeValues}
        step={step}
        min={min}
        max={max}
        onChange={(vals) => setValues([vals[0], vals[1]])}
        renderTrack={({ props, children }) => (
          <div
            ref={props.ref}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              height: "6px",
              width: "100%",
              background: `linear-gradient(to right, #ccc ${((safeValues[0] - min) / (max - min)) * 100}%, ${color} ${((safeValues[0] - min) / (max - min)) * 100}%, ${color} ${((safeValues[1] - min) / (max - min)) * 100}%, #ccc ${((safeValues[1] - min) / (max - min)) * 100}%)`,
              borderRadius: "4px",
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => {
          const { key, ...restProps } = props;
          return (
            <div
              key={key ?? index}
              {...restProps}
              className="slider-thumb"
              style={{
                ...restProps.style,
                height: "18px",
                width: "18px",
                backgroundColor: color,
                borderRadius: "50%",
                border: "2px solid #fff",
                boxShadow: "0 0 4px rgba(0,0,0,0.3)",
              }}
            />
          );
        }}
      />
      <div className="slider-values">
        <span>
          {safeValues[0]} {unit}
        </span>
        <span>
          {safeValues[1]} {unit}
        </span>
      </div>
    </div>
  );
}
