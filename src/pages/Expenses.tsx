import { handleDeleteExpense, handleStartEditExpense, handleUpdateExpense } from "./actions";
import { useMutation, usePaginatedQuery } from "convex/react";
import { EditableRowActions } from "./ui/EditableRowActions";
import type { EditValues } from "../types/workspace";
import { api } from "../../convex/_generated/api";
import { expenseHeaders } from "../types/schema";
import { useState } from "react";

export function Expenses() {
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({});
  const [saving, setSaving] = useState(false);

  const updateExpense = useMutation(api.expenses.update);
  const deleteExpense = useMutation(api.expenses.remove);

  const {
    results: expenses,
    status: expensesStatus,
    loadMore: loadMoreExpenses,
  } = usePaginatedQuery(api.expenses.list, {}, { initialNumItems: 25 });

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
                      onSave={() =>
                        handleUpdateExpense(row, {
                          updateExpense,
                          editValues,
                          setSaving,
                          setEditingExpenseId,
                        })
                      }
                      onCancel={() => setEditingExpenseId(null)}
                      onEdit={() =>
                        handleStartEditExpense(
                          row,
                          setEditingExpenseId,
                          setEditValues,
                        )
                      }
                      onDelete={() =>
                        handleDeleteExpense(row, deleteExpense, setSaving)
                      }
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