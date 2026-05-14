import { handleDeleteIncoming, handleStartEditIncoming, handleUpdateIncoming } from "./actions";
import { useMutation, usePaginatedQuery } from "convex/react";
import { EditableRowActions } from "./ui/EditableRowActions";
import type { EditValues } from "../types/workspace";
import { incomingHeaders } from "../types/schema";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function Incomings() {
  const [editingIncomingId, setEditingIncomingId] = useState<string | null>(
    null,
  );
  const [editValues, setEditValues] = useState<EditValues>({});
  const [saving, setSaving] = useState(false);

  const updateIncoming = useMutation(api.incomings.update);
  const deleteIncoming = useMutation(api.incomings.remove);

  const {
    results: incomings,
    status: incomingsStatus,
    loadMore: loadMoreIncomings,
  } = usePaginatedQuery(api.incomings.list, {}, { initialNumItems: 25 });

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
                      onSave={() =>
                        handleUpdateIncoming(row, {
                          updateIncoming,
                          editValues,
                          setSaving,
                          setEditingIncomingId,
                        })
                      }
                      onCancel={() => setEditingIncomingId(null)}
                      onEdit={() =>
                        handleStartEditIncoming(
                          row,
                          setEditingIncomingId,
                          setEditValues,
                        )
                      }
                      onDelete={() =>
                        handleDeleteIncoming(row, deleteIncoming, setSaving)
                      }
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