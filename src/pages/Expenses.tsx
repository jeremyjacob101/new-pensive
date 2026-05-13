import { handleAddExpense, handleAddIncoming, handleAddRecurring, handleDeleteExpense, handleStartEditExpense, handleUpdateExpense } from "./actions";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import type { ExpensesTableProps } from "../types/workspaceActions";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { EditValues, FormType } from "../types/workspace";
import { EditableRowActions } from "./ui/EditableRowActions";
import { LeftMenuPanel } from "../components/LeftMenuPanel";
import { AddEntryPanel } from "../components/AddEntryPanel";
import { ThemeToggle } from "../components/ThemeToggle";
import type { AppLayoutContext } from "../types/layout";
import { api } from "../../convex/_generated/api";
import { expenseHeaders } from "../types/schema";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

export function Expenses() {
  const { isDark, onToggleTheme } = useOutletContext<AppLayoutContext>();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [formType, setFormType] = useState<FormType>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({});
  const [saving, setSaving] = useState(false);

  const createExpense = useMutation(api.expenses.create);
  const createIncoming = useMutation(api.incomings.create);
  const createRecurring = useMutation(api.recurrings.create);
  const addUserOption = useMutation(api.userOptions.add);
  const updateExpense = useMutation(api.expenses.update);
  const deleteExpense = useMutation(api.expenses.remove);

  const {
    results: expenses,
    status: expensesStatus,
    loadMore: loadMoreExpenses,
  } = usePaginatedQuery(api.expenses.list, {}, { initialNumItems: 25 });
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
          activeItem="expenses"
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
          <ExpensesTable
            expenses={expenses}
            expensesStatus={expensesStatus}
            editingExpenseId={editingExpenseId}
            editValues={editValues}
            setEditValues={setEditValues}
            saving={saving}
            loadMoreExpenses={loadMoreExpenses}
            startEditExpense={(row) =>
              handleStartEditExpense(row, setEditingExpenseId, setEditValues)
            }
            setEditingExpenseId={setEditingExpenseId}
            updateExpenseRow={(row) =>
              handleUpdateExpense(row, {
                updateExpense,
                editValues,
                setSaving,
                setEditingExpenseId,
              })
            }
            deleteExpenseRow={(row) =>
              handleDeleteExpense(row, deleteExpense, setSaving)
            }
          />
        </section>
      </div>
    </main>
  );
}
function ExpensesTable({
  expenses,
  expensesStatus,
  editingExpenseId,
  editValues,
  setEditValues,
  saving,
  loadMoreExpenses,
  startEditExpense,
  setEditingExpenseId,
  updateExpenseRow,
  deleteExpenseRow,
}: ExpensesTableProps) {
  return (
    <>
      <table>
        <thead>
          <tr>
            {expenseHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan={expenseHeaders.length}>No expenses yet.</td>
            </tr>
          ) : (
            expenses.map((row) => {
              const isEditing = editingExpenseId === row._id;
              return (
                <tr key={row._id}>
                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.expense ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            expense: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.expense
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
                        value={editValues.expenseId ?? ""}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            expenseId: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      row.expenseId
                    )}
                  </td>
                  <td className="actions">
                    <EditableRowActions
                      isEditing={isEditing}
                      saving={saving}
                      onSave={() => updateExpenseRow(row)}
                      onCancel={() => setEditingExpenseId(null)}
                      onEdit={() => startEditExpense(row)}
                      onDelete={() => deleteExpenseRow(row)}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {expensesStatus === "CanLoadMore" ? (
        <button type="button" onClick={() => loadMoreExpenses(25)}>
          Load More Expenses
        </button>
      ) : null}
    </>
  );
}