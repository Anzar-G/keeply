# Project Blueprint: Keeply Contact Manager

This document provides a comprehensive overview of the Keeply application to help any AI assistant understand the system architecture, business logic, and technical implementation details.

## 1. Project Personality & Goal

Keeply is a **Premium Contact Management System** designed for professional networking. It emphasizes a "Data Registry" aesthetic—clean, high-fidelity, and authoritative. It features a dark-themed "Secure Access" portal and a sophisticated "Registry" dashboard.

## 2. Tech Stack

- **Frontend**: React (Functional Components, Hooks), Tailwind CSS, Lucide React (Icons).
- **Backend**: Node.js, Express.
- **Database**: SQLite3 (Local file-based database).
- **Security**: JWT (JSON Web Tokens) for sessions, BCrypt for password hashing.
- **Notifications**: `react-hot-toast` + Custom Notification Context.

## 3. Core Features & Logic

### A. Contact Management (CRUD +)

- **Registry System**: Contacts are managed as "Registry Entries".
- **Bulk Actions**: Users can select multiple contacts for archiving (deleting) or exporting to CSV.
- **Privacy Mode**: Emails are masked (`••••@•••.••`) for non-admin users in the UI and during CSV exports. Only users with the `admin` role can see the raw contact emails.

### B. Activity Log (Audit Trail)

- Every creation, modification, or deletion of a contact is recorded in the `activity_logs` table.
- Each log entries includes the `action`, `actor` (user_id), `details` (JSON object of changes), and `timestamp`.
- **Admin Only**: Only administrators can access the `Activities.js` page to view the audit trail.

### C. Authentication & Authorization

- **Roles**: `admin` and `viewer`.
- **Protected Routes**: Handled by `RoleRoute` in `App.js`.
- **Context API**: `AuthContext.js` manages global user state and provides `isAdmin` / `logout` helpers.

### D. Dashboard & Analytics

- **Real-time Stats**: Registry Growth, Monthly Velocity, and Company Depth are calculated dynamically based on historical contact data.
- **Growth Logic**: Compares total contacts to the count from exactly 30 days ago to determine the growth percentage.

## 4. Technical Nuances (Important for AI)

### Focus Management in Forms

- The `InputField` component in `ContactForm.js` is defined **outside** the main render function to prevent focus loss during state updates (keystroke focus bug). **NEVER move it back inside the main component.**

### UI Design Tokens (`index.css`)

- **Typography**: Uses `Inter` for body text and `Outfit` for headings.
- **Colors**:
  - Primary Deep: `#0f172a` (Slate 900)
  - Primary Indigo: `#4338ca` (Indigo 700)
  - Accent Cyan: `#06b6d4` (Cyan 500)
- **Classes**:
  - `.premium-card`: Rounded 2xl cards with subtle transitions.
  - `.glass-effect`: Backdrop blur with subtle white opacity.

## 5. Directory Structure

- `/contact-manager/src/pages`: Main view components (`Contacts`, `Dashboard`, `Activities`, `Login`).
- `/contact-manager/src/context`: Global state management.
- `/contact-manager/src/components`: Reusable UI elements (`Sidebar`, `Navbar`, `Layout`).
- `/backend/server.js`: The monolith Express server handling database initialization, auth middleware, and CRUD logic.

## 6. Known Initialization Logic

Upon server start, if no `admin@example.com` exists, the server automatically creates a default admin account with password `admin123`.

---
*Created by Antigravity (Advanced AI Coding Assistant)*
