import { handleAddExpense, handleAddIncoming, handleAddRecurring, handleDeleteRecurring, handleStartEditRecurring, handleUpdateRecurring } from "./actions";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import type { RecurringsTableProps } from "../types/workspaceActions";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { EditValues, FormType } from "../types/workspace";
import { EditableRowActions } from "./ui/EditableRowActions";
import { LeftMenuPanel } from "../components/LeftMenuPanel";
import { AddEntryPanel } from "../components/AddEntryPanel";
import { ThemeToggle } from "../components/ThemeToggle";
import type { AppLayoutContext } from "../types/layout";
import { recurringHeaders } from "../types/schema";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

export function Recurrings() {
  const { isDark, onToggleTheme } = useOutletContext<AppLayoutContext>();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [formType, setFormType] = useState<FormType>(null);
  const [editingRecurringId, setEditingRecurringId] = useState<string | null>(
    null,
  );
  const [editValues, setEditValues] = useState<EditValues>({});
  const [saving, setSaving] = useState(false);

  const createExpense = useMutation(api.expenses.create);
  const createIncoming = useMutation(api.incomings.create);
  const createRecurring = useMutation(api.recurrings.create);
  const addUserOption = useMutation(api.userOptions.add);
  const updateRecurring = useMutation(api.recurrings.update);
  const deleteRecurring = useMutation(api.recurrings.remove);

  const {
    results: recurrings,
    status: recurringsStatus,
    loadMore: loadMoreRecurrings,
  } = usePaginatedQuery(api.recurrings.list, {}, { initialNumItems: 25 });
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
          activeItem="recurrings"
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
          <RecurringsTable
            recurrings={recurrings}
            recurringsStatus={recurringsStatus}
            editingRecurringId={editingRecurringId}
            editValues={editValues}
            setEditValues={setEditValues}
            saving={saving}
            loadMoreRecurrings={loadMoreRecurrings}
            startEditRecurring={(row) =>
              handleStartEditRecurring(
                row,
                setEditingRecurringId,
                setEditValues,
              )
            }
            setEditingRecurringId={setEditingRecurringId}
            updateRecurringRow={(row) =>
              handleUpdateRecurring(row, {
                updateRecurring,
                editValues,
                setSaving,
                setEditingRecurringId,
              })
            }
            deleteRecurringRow={(row) =>
              handleDeleteRecurring(row, deleteRecurring, setSaving)
            }
          />
        </section>
      </div>
    </main>
  );
}
function RecurringsTable({
  recurrings,
  recurringsStatus,
  editingRecurringId,
  editValues,
  setEditValues,
  saving,
  loadMoreRecurrings,
  startEditRecurring,
  setEditingRecurringId,
  updateRecurringRow,
  deleteRecurringRow,
}: RecurringsTableProps) {
  return (
    <>
      <table>
        <thead>
          <tr>
            {recurringHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recurrings.length === 0 ? (
            <tr>
              <td colSpan={recurringHeaders.length}>No recurrings yet.</td>
            </tr>
          ) : (
            recurrings.map((row) => {
              const isEditing = editingRecurringId === row._id;
              return (
                <tr key={row._id}>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.status ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            status: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.status
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.name ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, name: e.target.value }))
                        }
                      />
                    ) : (
                      row.name
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.type ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, type: e.target.value }))
                        }
                      />
                    ) : (
                      row.type
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.price ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            price: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.price
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.frequency ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            frequency: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.frequency
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.dayOfMonth ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            dayOfMonth: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.dayOfMonth
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.paidBy ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            paidBy: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.paidBy
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.category ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            category: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.category
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.paidTo ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            paidTo: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.paidTo
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.notes ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            notes: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      (row.notes ?? "")
                    )}
                  </td>
                  <td className="actions">
                    <EditableRowActions
                      isEditing={isEditing}
                      saving={saving}
                      onSave={() => updateRecurringRow(row)}
                      onCancel={() => setEditingRecurringId(null)}
                      onEdit={() => startEditRecurring(row)}
                      onDelete={() => deleteRecurringRow(row)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {recurringsStatus === "CanLoadMore" ? (
        <button type="button" onClick={() => loadMoreRecurrings(25)}>
          Load More Recurrings
        </button>
      ) : null}
    </>
  );
}