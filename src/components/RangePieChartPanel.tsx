import type { RangePieChartPanelProps } from "../types/pieChart";
import { CategoryPieChart } from "./CategoryPieChart";
import { getOptionColor } from "../helpers/options";
import { useMemo, useState } from "react";

export function RangePieChartPanel({
  rows,
  userOptions,
  mode,
  startDate,
  endDate,
  targetMonths,
  kind,
  onRangeChange,
  onReset,
}: RangePieChartPanelProps) {
  const [isCustomEditorOpen, setIsCustomEditorOpen] = useState(
    mode === "custom",
  );
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showSubcategories, setShowSubcategories] = useState(false);
  const editorMode =
    isCustomEditorOpen || mode === "custom" ? "custom" : "month";

  const categoryOptionKind = kind === "expense" ? "category" : "incomeType";
  const subcategoryOptionKind =
    kind === "expense" ? "subcategory" : "incomeSubtype";

  const pieData = useMemo(() => {
    if (targetMonths.length === 0) return [];
    const targetSet = new Set(targetMonths);
    const map = new Map<string, number>();
    for (const row of rows) {
      const matchingMonths = row.monthYears.filter((m) => targetSet.has(m));
      if (matchingMonths.length === 0) continue;
      const monthCount = Math.max(1, row.monthYears.length);
      const perMonthContribution = row.effectiveAmount / monthCount;
      const contribution = perMonthContribution * matchingMonths.length;
      const key =
        showSubcategories && row.subcategory ? row.subcategory : row.category;
      map.set(key, (map.get(key) ?? 0) + contribution);
    }
    const result: { label: string; value: number; color: string }[] = [];
    for (const [label, value] of map.entries()) {
      if (value === 0) continue;
      const color =
        showSubcategories && rows.find((r) => r.subcategory === label)
          ? getOptionColor(userOptions, subcategoryOptionKind, label)
          : getOptionColor(userOptions, categoryOptionKind, label);
      result.push({ label, value, color });
    }
    result.sort((a, b) => b.value - a.value);
    return result;
  }, [
    rows,
    targetMonths,
    showSubcategories,
    userOptions,
    categoryOptionKind,
    subcategoryOptionKind,
  ]);

  const handleApply = () => {
    if (customStart && customEnd) {
      setIsCustomEditorOpen(true);
      onRangeChange(customStart, customEnd);
    }
  };

  const handleReset = () => {
    setIsCustomEditorOpen(false);
    setCustomStart("");
    setCustomEnd("");
    setShowSubcategories(false);
    onReset();
  };

  return (
    <div className="pie-chart-panel">
      <div className="pie-chart-panel-modes">
        <button
          type="button"
          className={`pie-mode-btn${editorMode === "month" ? " active" : ""}`}
          onClick={handleReset}
        >
          This Month
        </button>
        <button
          type="button"
          className={`pie-mode-btn${editorMode === "custom" ? " active" : ""}`}
          onClick={() => {
            setIsCustomEditorOpen(true);
            setCustomStart(startDate);
            setCustomEnd(endDate);
          }}
        >
          Custom Range
        </button>
      </div>

      {editorMode === "custom" && (
        <div className="pie-chart-panel-dates">
          <label className="pie-date-field">
            From
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
          </label>
          <label className="pie-date-field">
            To
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </label>
          <div className="pie-date-actions">
            <button
              type="button"
              className="pie-apply-btn"
              onClick={handleApply}
              disabled={!customStart || !customEnd}
            >
              Apply
            </button>
            <button
              type="button"
              className="pie-reset-btn"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <label className="pie-subcategory-toggle">
        <input
          type="checkbox"
          checked={showSubcategories}
          onChange={(e) => setShowSubcategories(e.target.checked)}
        />
        Show subcategories
      </label>

      <CategoryPieChart data={pieData} />
    </div>
  );
}