interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  ...other
}: SliderProps): JSX.Element {
  return (
    <div>
      <label>
        {label}
        <input
          max={max}
          min={min}
          onChange={(event) => {
            onChange(parseFloat(event.target.value));
          }}
          step={step}
          type="range"
          value={value}
          {...other}
        />
      </label>
      <output>{value}</output>
    </div>
  );
}
