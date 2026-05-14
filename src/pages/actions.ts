import type { Dispatch, SetStateAction, SyntheticEvent } from "react";
import type { WorkspaceMutations } from "../types/workspaceActions";
import type { EditValues, FormType } from "../types/workspace";
import type { Doc } from "../../convex/_generated/dataModel";
import { randomId16, toAmount } from "../helpers/formatters";
import type { OptionKind } from "../types/schema";

export async function saveOption(
  addUserOption: WorkspaceMutations["addUserOption"],
  kind: OptionKind,
  value: string,
) {
  const trimmed = value.trim();
  if (!trimmed) return;
  await addUserOption({ kind, value: trimmed });
}

export async function handleAddExpense(
  e: SyntheticEvent<HTMLFormElement>,
  deps: {
    createExpense: WorkspaceMutations["createExpense"];
    addUserOption: WorkspaceMutations["addUserOption"];
    setSaving: Dispatch<SetStateAction<boolean>>;
    setFormType: Dispatch<SetStateAction<FormType>>;
    onSelectTab: (
      tab: "expenses" | "incomings" | "recurrings" | "options",
    ) => void;
  },
) {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  deps.setSaving(true);
  try {
    await deps.createExpense({
      expense: String(form.get("expense") ?? ""),
      type: String(form.get("type") ?? ""),
      account: String(form.get("account") ?? ""),
      category: String(form.get("category") ?? ""),
      amount: toAmount(String(form.get("amount") ?? "")),
      date: String(form.get("date") ?? ""),
      paidTo: String(form.get("paidTo") ?? ""),
      notes: String(form.get("notes") ?? "") || undefined,
      comments: String(form.get("comments") ?? "") || undefined,
      expenseId: randomId16(),
    });
    await Promise.all([
      saveOption(
        deps.addUserOption,
        "expenseType",
        String(form.get("type") ?? ""),
      ),
      saveOption(
        deps.addUserOption,
        "account",
        String(form.get("account") ?? ""),
      ),
      saveOption(
        deps.addUserOption,
        "category",
        String(form.get("category") ?? ""),
      ),
    ]);
    e.currentTarget.reset();
    deps.setFormType(null);
    deps.onSelectTab("expenses");
  } finally {
    deps.setSaving(false);
  }
}

export async function handleAddIncoming(
  e: SyntheticEvent<HTMLFormElement>,
  deps: {
    createIncoming: WorkspaceMutations["createIncoming"];
    addUserOption: WorkspaceMutations["addUserOption"];
    setSaving: Dispatch<SetStateAction<boolean>>;
    setFormType: Dispatch<SetStateAction<FormType>>;
    onSelectTab: (
      tab: "expenses" | "incomings" | "recurrings" | "options",
    ) => void;
  },
) {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  deps.setSaving(true);
  try {
    await deps.createIncoming({
      incoming: String(form.get("incoming") ?? ""),
      paidBy: String(form.get("paidBy") ?? ""),
      incomeType: String(form.get("incomeType") ?? ""),
      account: String(form.get("account") ?? ""),
      amount: toAmount(String(form.get("amount") ?? "")),
      date: String(form.get("date") ?? ""),
      monthYear: String(form.get("monthYear") ?? ""),
      notes: String(form.get("notes") ?? "") || undefined,
      comments: String(form.get("comments") ?? "") || undefined,
      incomingId: randomId16(),
    });
    await Promise.all([
      saveOption(
        deps.addUserOption,
        "incomeType",
        String(form.get("incomeType") ?? ""),
      ),
      saveOption(
        deps.addUserOption,
        "account",
        String(form.get("account") ?? ""),
      ),
    ]);
    e.currentTarget.reset();
    deps.setFormType(null);
    deps.onSelectTab("incomings");
  } finally {
    deps.setSaving(false);
  }
}

export async function handleAddRecurring(
  e: SyntheticEvent<HTMLFormElement>,
  deps: {
    createRecurring: WorkspaceMutations["createRecurring"];
    setSaving: Dispatch<SetStateAction<boolean>>;
    setFormType: Dispatch<SetStateAction<FormType>>;
    onSelectTab: (
      tab: "expenses" | "incomings" | "recurrings" | "options",
    ) => void;
  },
) {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  deps.setSaving(true);
  try {
    await deps.createRecurring({
      status: String(form.get("status") ?? ""),
      name: String(form.get("name") ?? ""),
      type: String(form.get("type") ?? ""),
      price: toAmount(String(form.get("price") ?? "")),
      frequency: String(form.get("frequency") ?? ""),
      dayOfMonth: Number(String(form.get("dayOfMonth") ?? "0")) || 0,
      paidBy: String(form.get("paidBy") ?? ""),
      category: String(form.get("category") ?? ""),
      paidTo: String(form.get("paidTo") ?? ""),
      notes: String(form.get("notes") ?? "") || undefined,
    });
    e.currentTarget.reset();
    deps.setFormType(null);
    deps.onSelectTab("recurrings");
  } finally {
    deps.setSaving(false);
  }
}

export function handleStartEditExpense(
  row: Doc<"expenses">,
  setEditingExpenseId: Dispatch<SetStateAction<string | null>>,
  setEditValues: Dispatch<SetStateAction<EditValues>>,
) {
  setEditingExpenseId(row._id);
  setEditValues({
    expense: row.expense,
    type: row.type,
    account: row.account,
    category: row.category,
    amount: String(row.amount),
    date: row.date,
    paidTo: row.paidTo,
    notes: row.notes ?? "",
    comments: row.comments ?? "",
    expenseId: row.expenseId,
  });
}

export function handleStartEditIncoming(
  row: Doc<"incomings">,
  setEditingIncomingId: Dispatch<SetStateAction<string | null>>,
  setEditValues: Dispatch<SetStateAction<EditValues>>,
) {
  setEditingIncomingId(row._id);
  setEditValues({
    incoming: row.incoming,
    paidBy: row.paidBy,
    incomeType: row.incomeType,
    account: row.account,
    amount: String(row.amount),
    date: row.date,
    monthYear: row.monthYear,
    notes: row.notes ?? "",
    comments: row.comments ?? "",
    incomingId: row.incomingId,
  });
}

export function handleStartEditRecurring(
  row: Doc<"recurrings">,
  setEditingRecurringId: Dispatch<SetStateAction<string | null>>,
  setEditValues: Dispatch<SetStateAction<EditValues>>,
) {
  setEditingRecurringId(row._id);
  setEditValues({
    status: row.status,
    name: row.name,
    type: row.type ?? "",
    price: String(row.price),
    frequency: row.frequency,
    dayOfMonth: String(row.dayOfMonth),
    paidBy: row.paidBy,
    category: row.category,
    paidTo: row.paidTo,
    notes: row.notes ?? "",
  });
}

export async function handleUpdateExpense(
  row: Doc<"expenses">,
  deps: {
    updateExpense: WorkspaceMutations["updateExpense"];
    editValues: EditValues;
    setSaving: Dispatch<SetStateAction<boolean>>;
    setEditingExpenseId: Dispatch<SetStateAction<string | null>>;
  },
) {
  deps.setSaving(true);
  try {
    await deps.updateExpense({
      id: row._id,
      expense: deps.editValues.expense ?? "",
      type: deps.editValues.type ?? "",
      account: deps.editValues.account ?? "",
      category: deps.editValues.category ?? "",
      amount: toAmount(deps.editValues.amount ?? ""),
      date: deps.editValues.date ?? "",
      paidTo: deps.editValues.paidTo ?? "",
      notes: deps.editValues.notes || undefined,
      comments: deps.editValues.comments || undefined,
      expenseId: deps.editValues.expenseId ?? "",
    });
    deps.setEditingExpenseId(null);
  } finally {
    deps.setSaving(false);
  }
}

export async function handleDeleteExpense(
  row: Doc<"expenses">,
  deleteExpense: WorkspaceMutations["deleteExpense"],
  setSaving: Dispatch<SetStateAction<boolean>>,
) {
  setSaving(true);
  try {
    await deleteExpense({ id: row._id });
  } finally {
    setSaving(false);
  }
}

export async function handleUpdateIncoming(
  row: Doc<"incomings">,
  deps: {
    updateIncoming: WorkspaceMutations["updateIncoming"];
    editValues: EditValues;
    setSaving: Dispatch<SetStateAction<boolean>>;
    setEditingIncomingId: Dispatch<SetStateAction<string | null>>;
  },
) {
  deps.setSaving(true);
  try {
    await deps.updateIncoming({
      id: row._id,
      incoming: deps.editValues.incoming ?? "",
      paidBy: deps.editValues.paidBy ?? "",
      incomeType: deps.editValues.incomeType ?? "",
      account: deps.editValues.account ?? "",
      amount: toAmount(deps.editValues.amount ?? ""),
      date: deps.editValues.date ?? "",
      monthYear: deps.editValues.monthYear ?? "",
      notes: deps.editValues.notes || undefined,
      comments: deps.editValues.comments || undefined,
      incomingId: deps.editValues.incomingId ?? "",
    });
    deps.setEditingIncomingId(null);
  } finally {
    deps.setSaving(false);
  }
}

export async function handleDeleteIncoming(
  row: Doc<"incomings">,
  deleteIncoming: WorkspaceMutations["deleteIncoming"],
  setSaving: Dispatch<SetStateAction<boolean>>,
) {
  setSaving(true);
  try {
    await deleteIncoming({ id: row._id });
  } finally {
    setSaving(false);
  }
}

export async function handleUpdateRecurring(
  row: Doc<"recurrings">,
  deps: {
    updateRecurring: WorkspaceMutations["updateRecurring"];
    editValues: EditValues;
    setSaving: Dispatch<SetStateAction<boolean>>;
    setEditingRecurringId: Dispatch<SetStateAction<string | null>>;
  },
) {
  deps.setSaving(true);
  try {
    await deps.updateRecurring({
      id: row._id,
      status: deps.editValues.status ?? "",
      name: deps.editValues.name ?? "",
      type: deps.editValues.type ?? "",
      price: toAmount(deps.editValues.price ?? ""),
      frequency: deps.editValues.frequency ?? "",
      dayOfMonth: Number(deps.editValues.dayOfMonth ?? "0") || 0,
      paidBy: deps.editValues.paidBy ?? "",
      category: deps.editValues.category ?? "",
      paidTo: deps.editValues.paidTo ?? "",
      notes: deps.editValues.notes || undefined,
    });
    deps.setEditingRecurringId(null);
  } finally {
    deps.setSaving(false);
  }
}

export async function handleDeleteRecurring(
  row: Doc<"recurrings">,
  deleteRecurring: WorkspaceMutations["deleteRecurring"],
  setSaving: Dispatch<SetStateAction<boolean>>,
) {
  setSaving(true);
  try {
    await deleteRecurring({ id: row._id });
  } finally {
    setSaving(false);
  }
}