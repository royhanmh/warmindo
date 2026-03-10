# Warmindo Ops

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.34-0055FF?style=flat-square&logo=framer&logoColor=white)

Warmindo Ops is a frontend POS and operations dashboard built for a noodle shop workflow, covering ordering, inventory tracking, transaction history, and daily reporting in a single responsive app.

The product name is **Warmindo Ops**. The current package/repo setup still uses the name `warmindo-2` internally.

## What It Is

This project is a React-based point-of-sale experience tailored to a warmindo-style food business. It combines four main surfaces:

- `POS` for taking orders and building carts
- `Inventory` for stock visibility and restocking
- `Transaction History` for receipts and closing pending bills
- `Dashboard` for daily summaries and low-stock visibility

The app is frontend-only for now and persists its working data in the browser with `localStorage`.

## Highlights

- Role-based access for `admin` and `cashier`
- POS flow with menu browsing, cart management, toppings, and item customization
- Inventory tracking with restock actions and low-stock alerts
- Transaction history with pending/completed bill handling and receipt view
- Daily dashboard cards for revenue, orders, and stock status
- Responsive layout with desktop sidebar/cart and mobile navigation
- Local persistence for auth state, transactions, inventory, categories, and menu data

## Demo Access

The current authentication flow is mock-based and stored locally in the browser.

| Role      | Access     |
| --------- | ---------- |
| `Cashier` | PIN `1234` |
| `Admin`   | PIN `9999` |

Notes:

- The login screen includes a username field.
- In the current implementation, login success is determined by the PIN and role state rather than matching the entered username.
- Cashier inventory and dashboard access are restricted; those pages are admin-only.

## Demo

- Live demo: `https://warmindo-six.vercel.app/`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Radix UI primitives
- `date-fns`
- Lucide React icons
- Local browser storage via `localStorage`

## Getting Started

### Prerequisites

- Node.js
- npm

### Install and Run

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Project Notes

- This is currently a frontend-only application with no backend or database.
- Authentication, transactions, inventory, menu items, and categories are persisted in browser `localStorage`.
- The app includes a Netlify-ready SPA redirect configuration in `netlify.toml`.
- PWA-related assets are present through `public/manifest.json` and `public/sw.js`.
- Offline behavior is not yet documented or positioned as production-ready.

## Project Structure

```text
src/
  pages/        Main app surfaces such as POS, Inventory, Dashboard, and Transactions
  contexts/     Auth, cart, and transaction state management
  components/   Reusable UI, layout, admin, and POS building blocks
```

## Known Limitations

- No backend, API, or database integration yet
- Authentication is mock-based and intended for demo/showcase use
- All persisted data can be cleared by resetting browser storage
- Payment handling is simulated; there is no real payment gateway integration
- The production build currently emits a large main chunk warning during Vite build

## Roadmap

- Add backend persistence for auth, inventory, menu, and transaction data
- Improve reporting with richer analytics and real best-seller calculations
- Tighten the relationship between sales activity and stock deduction
- Add real deployment assets such as screenshots, demo link, and release notes
- Expand PWA behavior and document offline support properly
