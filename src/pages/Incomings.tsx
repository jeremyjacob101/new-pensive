import { handleAddExpense, handleAddIncoming, handleAddRecurring, handleDeleteIncoming, handleStartEditIncoming, handleUpdateIncoming } from "./actions";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import type { IncomingsTableProps } from "../types/workspaceActions";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { EditValues, FormType } from "../types/workspace";
import { EditableRowActions } from "./ui/EditableRowActions";
import { LeftMenuPanel } from "../components/LeftMenuPanel";
import { AddEntryPanel } from "../components/AddEntryPanel";
import { ThemeToggle } from "../components/ThemeToggle";
import type { AppLayoutContext } from "../types/layout";
import { incomingHeaders } from "../types/schema";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

export function Incomings() {
  const { isDark, onToggleTheme } = useOutletContext<AppLayoutContext>();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [formType, setFormType] = useState<FormType>(null);
  const [editingIncomingId, setEditingIncomingId] = useState<string | null>(
    null,
  );
  const [editValues, setEditValues] = useState<EditValues>({});
  const [saving, setSaving] = useState(false);

  const createExpense = useMutation(api.expenses.create);
  const createIncoming = useMutation(api.incomings.create);
  const createRecurring = useMutation(api.recurrings.create);
  const addUserOption = useMutation(api.userOptions.add);
  const updateIncoming = useMutation(api.incomings.update);
  const deleteIncoming = useMutation(api.incomings.remove);

  const {
    results: incomings,
    status: incomingsStatus,
    loadMore: loadMoreIncomings,
  } = usePaginatedQuery(api.incomings.list, {}, { initialNumItems: 25 });
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
          activeItem="incomings"
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
          <IncomingsTable
            incomings={incomings}
            incomingsStatus={incomingsStatus}
            editingIncomingId={editingIncomingId}
            editValues={editValues}
            setEditValues={setEditValues}
            saving={saving}
            loadMoreIncomings={loadMoreIncomings}
            startEditIncoming={(row) =>
              handleStartEditIncoming(row, setEditingIncomingId, setEditValues)
            }
            setEditingIncomingId={setEditingIncomingId}
            updateIncomingRow={(row) =>
              handleUpdateIncoming(row, {
                updateIncoming,
                editValues,
                setSaving,
                setEditingIncomingId,
              })
            }
            deleteIncomingRow={(row) =>
              handleDeleteIncoming(row, deleteIncoming, setSaving)
            }
          />
        </section>
      </div>
    </main>
  );
}
function IncomingsTable({
  incomings,
  incomingsStatus,
  editingIncomingId,
  editValues,
  setEditValues,
  saving,
  loadMoreIncomings,
  startEditIncoming,
  setEditingIncomingId,
  updateIncomingRow,
  deleteIncomingRow,
}: IncomingsTableProps) {
  return (
    <>
      <table>
        <thead>
          <tr>
            {incomingHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomings.length === 0 ? (
            <tr>
              <td colSpan={incomingHeaders.length}>No incomings yet.</td>
            </tr>
          ) : (
            incomings.map((row) => {
              const isEditing = editingIncomingId === row._id;
              return (
                <tr key={row._id}>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.incoming ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            incoming: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.incoming
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
                        value={editValues.incomeType ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            incomeType: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.incomeType
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.account ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            account: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.account
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.amount ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            amount: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.amount
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editValues.date ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, date: e.target.value }))
                        }
                      />
                    ) : (
                      row.date
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.monthYear ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            monthYear: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.monthYear
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
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.comments ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            comments: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      (row.comments ?? "")
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.incomingId ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            incomingId: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.incomingId
                    )}
                  </td>
                  <td className="actions">
                    <EditableRowActions
                      isEditing={isEditing}
                      saving={saving}
                      onSave={() => updateIncomingRow(row)}
                      onCancel={() => setEditingIncomingId(null)}
                      onEdit={() => startEditIncoming(row)}
                      onDelete={() => deleteIncomingRow(row)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {incomingsStatus === "CanLoadMore" ? (
        <button type="button" onClick={() => loadMoreIncomings(25)}>
          Load More Incomings
        </button>
      ) : null}
    </>
  );
}