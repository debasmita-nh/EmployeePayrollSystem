# Employee Payroll System — Project 04

A clean, modern payroll management app built with **HTML, CSS and JavaScript** — no frameworks, no build step. Designed with a white & blue palette.

## ✨ Features (as per spec)

| Feature | How it works |
|---|---|
| ➕ **Add employees** | Modal form with validation and auto-generated employee IDs (EMP001, EMP002, …). Also supports editing existing records. |
| 🧮 **Calculate salary** | Live calculation while you type — Gross (Basic + HRA + Allowances), Deductions (PF, TDS, Other) and Net salary. Dashboard cards show total employees, monthly payroll, total allowances and total deductions. |
| 🧾 **Generate payslips** | One click on any employee opens a professional payslip with earnings/deductions breakdown, net pay and amount in words (Indian numbering). **Print / Save as PDF** button included. |
| 🔍 **Search employees** | Instant live search by name, ID, email, department or position, plus a department filter dropdown. |
| 💾 **Save payroll data** | Every change is auto-saved to the browser's localStorage (last-saved time shown in the footer). Export the whole payroll to **CSV** anytime. |

Extras: sample data loader for a quick demo, delete with inline confirm, toasts, fully responsive layout.

## 🛠 Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, responsive grid, print stylesheets (no frameworks)
- **JavaScript** — vanilla ES6, localStorage persistence (no libraries)

## 🚀 Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## 🌐 Live

**https://debasmita-nh.github.io/EmployeePayrollSystem/**

Deployed on GitHub Pages (branch: `main`, root directory).

## 📁 Structure

```
├── index.html      # page structure (table, modals, stats)
├── css/style.css   # white & blue theme, responsive + print styles
├── js/app.js       # all logic: CRUD, salary math, payslips, search, storage
└── README.md
```

## 📌 Note

Payroll data is stored in your browser (localStorage), so it is private to each device/browser. Use **Export CSV** to back up or move data.
