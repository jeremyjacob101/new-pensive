import { handleAddExpense, handleAddIncoming, handleAddRecurring, saveOption } from "./actions";
import { useNavigate, useOutletContext } from "react-router-dom";
import { LeftMenuPanel } from "../components/LeftMenuPanel";
import { AddEntryPanel } from "../components/AddEntryPanel";
import type { AppLayoutContext } from "../types/layout";
import { ThemeToggle } from "../components/ThemeToggle";
import { useMutation, useQuery } from "convex/react";
import type { FormType } from "../types/workspace";
import { api } from "../../convex/_generated/api";
import { optionKinds } from "../types/schema";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

export function Options() {
  const { isDark, onToggleTheme } = useOutletContext<AppLayoutContext>();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [formType, setFormType] = useState<FormType>(null);
  const [saving, setSaving] = useState(false);

  const createExpense = useMutation(api.expenses.create);
  const createIncoming = useMutation(api.incomings.create);
  const createRecurring = useMutation(api.recurrings.create);
  const addUserOption = useMutation(api.userOptions.add);
  const removeUserOption = useMutation(api.userOptions.remove);

  const userOptions = useQuery(api.userOptions.list);

  return (
    <main className="page">
      <div className="app-shell">
        <LeftMenuPanel
          items={[
            { key: "expenses", label: "Expenses" },
            { key: "incomings", label: "Incomings" },
            { key: "recurrings", label: "Recurrings" },
            { key: "options", label: "Options" },
          ]}
          activeItem="options"
          onSelect={(tab) => navigate(`/${tab}`)}
          onUserClick={() => {
            void signOut().then(() => navigate("/login", { replace: true }));
          }}
        />

        <section className="app-content">
          <div className="toolbar">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
          <AddEntryPanel
            formType={formType}
            setFormType={setFormType}
            onAddExpense={(e) =>
              handleAddExpense(e, {
                createExpense,
                addUserOption,
                setSaving,
                setFormType,
                onSelectTab: (tab) => navigate(`/${tab}`),
              })
            }
            onAddIncoming={(e) =>
              handleAddIncoming(e, {
                createIncoming,
                addUserOption,
                setSaving,
                setFormType,
                onSelectTab: (tab) => navigate(`/${tab}`),
              })
            }
            onAddRecurring={(e) =>
              handleAddRecurring(e, {
                createRecurring,
                setSaving,
                setFormType,
                onSelectTab: (tab) => navigate(`/${tab}`),
              })
            }
            saving={saving}
            userOptions={userOptions}
          />
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
                        onClick={() =>
                          void removeUserOption({ kind: key, value })
                        }
                      >
                        {value} ×
                      </button>
                    ))}
                  </div>
                </form>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}