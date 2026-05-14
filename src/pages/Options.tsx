import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { optionKinds } from "../types/schema";
import { saveOption } from "./actions";

export function Options() {
  const addUserOption = useMutation(api.userOptions.add);
  const removeUserOption = useMutation(api.userOptions.remove);
  const userOptions = useQuery(api.userOptions.list);

  return (
    <div className="entry-form">
      {optionKinds.map(({ key, label }) => {
        const values = userOptions?.[key] ?? [];
        return (
          <form
            key={key}
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              void saveOption(
                addUserOption,
                key,
                String(form.get("value") ?? ""),
              );
              e.currentTarget.reset();
            }}
          >
            <label>{label}</label>
            <input name="value" placeholder={`Add ${label}`} />
            <button type="submit">Add</button>
            <div>
              {values.map((value) => (
                <button
                  key={`${key}-${value}`}
                  type="button"
                  onClick={() => void removeUserOption({ kind: key, value })}
                >
                  {value} ×
                </button>
              ))}
            </div>
          </form>
        );
      })}
    </div>
  );
}