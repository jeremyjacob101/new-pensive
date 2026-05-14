import { useEffect, useRef, useState } from "react";

const MONTH_ANCHOR_Y = 136;

export function useScrollMonthIndicator(
  listRef: React.RefObject<HTMLElement | null>,
  fallbackDate: string,
) {
  const [activeDate, setActiveDate] = useState(fallbackDate);
  const activeDateRef = useRef(fallbackDate);

  useEffect(() => {
    const updateActiveDate = () => {
      const list = listRef.current;
      if (!list) return;

      const rows = Array.from(
        list.querySelectorAll<HTMLElement>(".entry-card[data-row-date]"),
      );
      if (rows.length === 0) return;

      let selected = rows[0];
      for (const row of rows) {
        if (row.getBoundingClientRect().top <= MONTH_ANCHOR_Y) {
          selected = row;
          continue;
        }
        break;
      }

      const nextDate = selected.dataset.rowDate ?? "";
      if (!nextDate || nextDate === activeDateRef.current) return;
      activeDateRef.current = nextDate;
      setActiveDate(nextDate);
    };

    updateActiveDate();
    window.addEventListener("scroll", updateActiveDate, { passive: true });
    window.addEventListener("resize", updateActiveDate);

    return () => {
      window.removeEventListener("scroll", updateActiveDate);
      window.removeEventListener("resize", updateActiveDate);
    };
  }, [listRef]);

  return activeDate;
}
