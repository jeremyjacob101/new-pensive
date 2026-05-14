export type MenuItemKey = "expenses" | "incomings" | "recurrings" | "options";

export type MenuItem = {
  key: MenuItemKey;
  label: string;
};
