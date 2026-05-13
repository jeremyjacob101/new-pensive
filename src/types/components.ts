import type { FormType, UserOptions } from "./workspace";
import type { SyntheticEvent } from "react";

export type AddEntryPanelProps = {
  formType: FormType;
  setFormType: (value: FormType) => void;
  onAddExpense: (e: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  onAddIncoming: (e: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  onAddRecurring: (e: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  saving: boolean;
  userOptions: UserOptions | undefined;
};

export type EditableRowActionsProps = {
  isEditing: boolean;
  saving: boolean;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
};