import { handleDeleteRecurring, handleStartEditRecurring, handleUpdateRecurring } from "./actions";
import { useMutation, usePaginatedQuery } from "convex/react";
import { EditableRowActions } from "./ui/EditableRowActions";
import type { EditValues } from "../types/workspace";
import { recurringHeaders } from "../types/schema";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function Recurrings() {
  const [editingRecurringId, setEditingRecurringId] = useState<string | null>(
    null,
  );
  const [editValues, setEditValues] = useState<EditValues>({});
  const [saving, setSaving] = useState(false);

  const updateRecurring = useMutation(api.recurrings.update);
  const deleteRecurring = useMutation(api.recurrings.remove);

  const {
    results: recurrings,
    status: recurringsStatus,
    loadMore: loadMoreRecurrings,
  } = usePaginatedQuery(api.recurrings.list, {}, { initialNumItems: 25 });

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
                      onSave={() =>
                        handleUpdateRecurring(row, {
                          updateRecurring,
                          editValues,
                          setSaving,
                          setEditingRecurringId,
                        })
                      }
                      onCancel={() => setEditingRecurringId(null)}
                      onEdit={() =>
                        handleStartEditRecurring(
                          row,
                          setEditingRecurringId,
                          setEditValues,
                        )
                      }
                      onDelete={() =>
                        handleDeleteRecurring(row, deleteRecurring, setSaving)
                      }
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