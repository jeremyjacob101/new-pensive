import type { OptionKind } from "./schema";

export type EditValues = Record<string, string>;
export type FormType = "expense" | "incoming" | "recurring" | null;
export type UserOptions = Partial<Record<OptionKind, string[]>>;