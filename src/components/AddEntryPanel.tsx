import type { AddEntryPanelProps } from "../types/components";

export function AddEntryPanel({
  formType,
  setFormType,
  onAddExpense,
  onAddIncoming,
  onAddRecurring,
  saving,
  userOptions,
}: AddEntryPanelProps) {
  return (
    <>
      <div className="tabs">
        <button
          type="button"
          className="tab"
          onClick={() => setFormType("expense")}
        >
          Add Expense
        </button>
        <button
          type="button"
          className="tab"
          onClick={() => setFormType("incoming")}
        >
          Add Incoming
        </button>
        <button
          type="button"
          className="tab"
          onClick={() => setFormType("recurring")}
        >
          Add Recurring
        </button>
      </div>

      {formType === "expense" && (
        <form className="entry-form" onSubmit={(e) => void onAddExpense(e)}>
          <input name="expense" placeholder="Expense" required />
          <input
            name="type"
            placeholder="Type"
            list="expenseType-options"
            required
          />
          <input
            name="account"
            placeholder="Account"
            list="account-options"
            required
          />
          <input
            name="category"
            placeholder="Category"
            list="category-options"
            required
          />
          <input name="amount" placeholder="Amount" required />
          <input name="date" type="date" required />
          <input name="paidTo" placeholder="PaidTo" required />
          <input name="notes" placeholder="Notes" />
          <input name="comments" placeholder="Comments" />
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Expense"}
          </button>
          <button type="button" onClick={() => setFormType(null)}>
            Cancel
          </button>
        </form>
      )}

      {formType === "incoming" && (
        <form className="entry-form" onSubmit={(e) => void onAddIncoming(e)}>
          <input name="incoming" placeholder="Incoming" required />
          <input name="paidBy" placeholder="PaidBy" required />
          <input
            name="incomeType"
            placeholder="IncomeType"
            list="incomeType-options"
            required
          />
          <input
            name="account"
            placeholder="Account"
            list="account-options"
            required
          />
          <input name="amount" placeholder="Amount" required />
          <input name="date" type="date" required />
          <input name="monthYear" placeholder="MonthYear" required />
          <input name="notes" placeholder="Notes" />
          <input name="comments" placeholder="Comments" />
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Incoming"}
          </button>
          <button type="button" onClick={() => setFormType(null)}>
            Cancel
          </button>
        </form>
      )}

      <datalist id="expenseType-options">
        {(userOptions?.expenseType ?? []).map((value) => (
          <option key={value} value={value} />
        ))}
      </datalist>
      <datalist id="account-options">
        {(userOptions?.account ?? []).map((value) => (
          <option key={value} value={value} />
        ))}
      </datalist>
      <datalist id="category-options">
        {(userOptions?.category ?? []).map((value) => (
          <option key={value} value={value} />
        ))}
      </datalist>
      <datalist id="incomeType-options">
        {(userOptions?.incomeType ?? []).map((value) => (
          <option key={value} value={value} />
        ))}
      </datalist>

      {formType === "recurring" && (
        <form className="entry-form" onSubmit={(e) => void onAddRecurring(e)}>
          <input name="status" placeholder="Status" required />
          <input name="name" placeholder="Name" required />
          <input name="type" placeholder="Type" required />
          <input name="price" placeholder="Price" required />
          <input name="frequency" placeholder="Frequency" required />
          <input name="dayOfMonth" placeholder="Day of Month" required />
          <input name="paidBy" placeholder="Paid By" required />
          <input name="category" placeholder="Category" required />
          <input name="paidTo" placeholder="Paid To" required />
          <input name="notes" placeholder="Notes" />
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Recurring"}
          </button>
          <button type="button" onClick={() => setFormType(null)}>
            Cancel
          </button>
        </form>
      )}
    </>
  );
}