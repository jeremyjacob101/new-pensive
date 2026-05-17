import { formatMonthValue, normalizeMonthYears } from "../helpers/dates";
import { useMemo, useState } from "react";

export function MonthYearMultiSelect({ value, onChange, label = "Months", required = false }: {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  required?: boolean;
}) {
  const [pickerValue, setPickerValue] = useState("");

  const normalized = useMemo(() => normalizeMonthYears(value), [value]);

  const addMonth = () => {
    const trimmed = pickerValue.trim();
    if (!trimmed) return;
    onChange(normalizeMonthYears([...normalized, trimmed]));
    setPickerValue("");
  };

  return (
    <div className="month-multi-select">
      <label>{label}</label>
      <div className="month-multi-select-controls">
        <input
          type="month"
          value={pickerValue}
          onChange={(event) => setPickerValue(event.target.value)}
        />
        <button
          type="button"
          className="split-entry-launcher"
          onClick={addMonth}
        >
          Add Month
        </button>
      </div>
      <div className="month-multi-select-list">
        {normalized.map((month) => (
          <button
            key={month}
            type="button"
            className="month-chip"
            onClick={() =>
              onChange(normalized.filter((value) => value !== month))
            }
          >
            {formatMonthValue(month)} ✕
          </button>
        ))}
      </div>
      {required && normalized.length === 0 ? (
        <div className="month-multi-select-error">Add at least one month.</div>
      ) : null}
    </div>
  );
}