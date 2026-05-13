import type { EditableRowActionsProps } from "../../types/components";

export function EditableRowActions({
  isEditing,
  saving,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: EditableRowActionsProps) {
  if (isEditing) {
    return (
      <>
        <button type="button" onClick={() => void onSave()} disabled={saving}>
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </>
    );
  }

  return (
    <>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
      <button type="button" onClick={() => void onDelete()} disabled={saving}>
        Delete
      </button>
    </>
  );
}