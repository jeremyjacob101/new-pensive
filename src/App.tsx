import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Doc } from "../convex/_generated/dataModel";

const headers = [
  "Expense",
  "Type",
  "Account",
  "Category",
  "Amount",
  "Date",
  "PaidTo",
  "Notes",
  "Comments",
  "ExpenseID",
] as const;

const incomingHeaders = [
  "Incoming",
  "PaidBy",
  "IncomeType",
  "Account",
  "Amount",
  "Date",
  "MonthYear",
  "Notes",
  "Comments",
  "IncomingID",
] as const;

function App() {
  const [activeTab, setActiveTab] = useState<"expenses" | "incomings">(
    "expenses",
  );
  const expenses = useQuery(api.expenses.list) as
    | Array<Doc<"expenses">>
    | undefined;
  const incomings = useQuery(api.incomings.list) as
    | Array<Doc<"incomings">>
    | undefined;

  if (expenses === undefined || incomings === undefined) {
    return <main className="page">Loading...</main>;
  }

  return (
    <main className="page">
      <div className="tabs">
        <button
          type="button"
          className={activeTab === "expenses" ? "tab active" : "tab"}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses
        </button>
        <button
          type="button"
          className={activeTab === "incomings" ? "tab active" : "tab"}
          onClick={() => setActiveTab("incomings")}
        >
          Incomings
        </button>
      </div>

      {activeTab === "expenses" ? (
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={headers.length}>No expenses yet.</td>
              </tr>
            ) : (
              expenses.map((row) => (
                <tr key={row._id}>
                  <td>{row.expense}</td>
                  <td>{row.type}</td>
                  <td>{row.account}</td>
                  <td>{row.category}</td>
                  <td>{row.amount}</td>
                  <td>{row.date}</td>
                  <td>{row.paidTo}</td>
                  <td>{row.notes ?? ""}</td>
                  <td>{row.comments ?? ""}</td>
                  <td>{row.expenseId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              {incomingHeaders.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incomings.length === 0 ? (
              <tr>
                <td colSpan={incomingHeaders.length}>No incomings yet.</td>
              </tr>
            ) : (
              incomings.map((row) => (
                <tr key={row._id}>
                  <td>{row.incoming}</td>
                  <td>{row.paidBy}</td>
                  <td>{row.incomeType}</td>
                  <td>{row.account}</td>
                  <td>{row.amount}</td>
                  <td>{row.date}</td>
                  <td>{row.monthYear}</td>
                  <td>{row.notes ?? ""}</td>
                  <td>{row.comments ?? ""}</td>
                  <td>{row.incomingId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default App;
