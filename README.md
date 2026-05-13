# Codebase-Pensive

A personal finance tracking application built with React, TypeScript, Vite, and Convex. This app helps you manage your expenses, track income, and monitor recurring payments/bills.

## 🚀 Features

- **Expense Management** - Track all your outgoing money with categories, accounts, dates, and notes
- **Income Tracking** - Record incoming funds like salary or investments
- **Recurring Payments** - Monitor and manage subscriptions, bills, and scheduled payments
- **Data Import** - Bulk import CSV data for expenses and incomings
- **CRUD Operations** - Full create, read, update, delete functionality for all records

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| **React 19** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool and dev server |
| **Convex** | Backend, database, and real-time sync |
| **CSV-Parser** | Data import functionality |

## 📦 Installation

1. Clone or navigate to the project directory:
   ```bash
   cd "Codebase - Pensive"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create `.env.local`):
   ```env
   VITE_CONVEX_URL=your_convex_url_here
   ```

## 🎯 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Start development server |
| `npm run build` | `tsc -b && vite build` | Build for production |
| `npm run preview` | `vite preview` | Preview production build |
| `npm run lint` | `eslint .` | Run ESLint |

## 📑 Application Structure

### Main Features Tab
- **Add Expense** - Create new expense records
- **Add Incoming** - Track income/sources
- **Add Recurring** - Set up recurring payments

### Records View Tabs
- **Expenses** - Manage outgoing money with full details
- **Incomings** - Track incoming funds and sources
- **Recurrings** - Monitor scheduled/recurring payments

Each record view includes:
- Full data display in tabular format
- Inline editing capability
- Edit/Delete actions for each row
- Notes and comments sections

## 🔧 Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # Entry point
├── index.css        # Global styles
└── assets/          # Static assets

convex/
└── _generated/      # Auto-generated Convex code

public/
├── favicon.svg
└── icons.svg
```

## 📝 Data Schemas

### Expenses
- Expense name/description
- Type
- Account
- Category
- Amount
- Date
- Paid to (vendor/payee)
- Notes
- Comments
- Internal ID

### Incomings
- Income source
- Paid by (payer)
- Income type
- Account
- Amount
- Date
- Month/Year
- Notes
- Comments
- Internal ID

### Recurrings
- Status (active/inactive)
- Name
- Type
- Price/Amount
- Frequency
- Day of month
- Paid by
- Category
- Paid to
- Notes

## 🔐 Environment Variables

Create `.env.local` file:

```env
VITE_CONVEX_URL=your_convex_production_url
```

Get your Convex URL from the Convex dashboard after initializing your project.

## 📄 License

This is a personal finance tracking application developed for local use with LM Studio/Qwen integration testing.
