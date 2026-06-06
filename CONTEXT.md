# VendorBridge — Implementation Context & Change Log

> **Purpose**: This file tracks what has been implemented, what's in progress, and what's pending.
> Every team member should update this file when they complete a deliverable.
> This serves as the single source of truth for the team's progress.

---

## 📊 Overall Progress

| Phase | Member | Status | Branch |
|-------|--------|--------|--------|
| Phase 1 — Backend Core + DevOps | @Ahmed3abbas | 🔴 Not Started | `feat/m1/backend-core` |
| Phase 2 — Backend Features | @Tirthmantri20 | 🔴 Not Started | `feat/m2/backend-features` |
| Phase 3 — Frontend | @anujpatel002 | 🔴 Not Started | `feat/m3/frontend` |

**Legend**: 🔴 Not Started · 🟡 In Progress · 🟢 Complete

---

## Phase 1 — Backend Core + DevOps (@Ahmed3abbas)

### Infrastructure
- [ ] `docker-compose.yml` — PostgreSQL 15 + pgAdmin services
- [ ] `server/package.json` — all backend dependencies installed
- [ ] `server/.env.example` — env template with all required vars
- [ ] `server/Dockerfile` — production container
- [ ] `server/.eslintrc.cjs` + `server/.prettierrc` — code quality
- [ ] `server/nodemon.json` — dev server config

### Prisma + Database
- [ ] `server/prisma/schema.prisma` — complete 12-table schema (users, vendors, rfqs, rfq_items, rfq_vendors, quotations, quotation_items, approvals, purchase_orders, invoices, activity_logs, attachments)
- [ ] All enums defined (Role, RFQStatus, QuotationStatus, ApprovalStatus, POStatus, InvoiceStatus)
- [ ] First migration applied successfully
- [ ] `server/prisma/seed.js` — demo data (5 users, 2 vendors, 1 RFQ, 2 quotations, 1 PO, 1 invoice)

### Server Core
- [ ] `server/src/config/env.js` — dotenv loader + validation
- [ ] `server/src/config/db.js` — Prisma client singleton
- [ ] `server/src/config/logger.js` — Winston structured logging
- [ ] `server/src/config/mailer.js` — Nodemailer SMTP transport
- [ ] `server/src/config/socket.js` — Socket.io init + room management
- [ ] `server/src/app.js` — Express setup, CORS, middleware chain, route mounting
- [ ] `server/src/server.js` — HTTP server + Socket.io bootstrap

### Middlewares
- [ ] `auth.middleware.js` — JWT verification
- [ ] `role.middleware.js` — RBAC guard factory
- [ ] `validate.middleware.js` — Zod req.body validation
- [ ] `upload.middleware.js` — Multer multipart config
- [ ] `errorHandler.js` — global 500 handler with standard envelope

### Auth Module
- [ ] `POST /api/auth/register` — create account
- [ ] `POST /api/auth/login` — returns access_token + refresh_token
- [ ] `POST /api/auth/refresh` — rotate access token
- [ ] `POST /api/auth/logout` — blacklist refresh token
- [ ] `POST /api/auth/forgot-password` — send reset OTP
- [ ] `POST /api/auth/reset-password` — set new password

### Vendor Module
- [ ] `GET /api/vendors` — list with search, category, status filter, pagination
- [ ] `POST /api/vendors` — register new vendor (Admin only)
- [ ] `GET /api/vendors/:id` — detail with linked RFQs, POs, rating
- [ ] `PUT /api/vendors/:id` — update profile/status
- [ ] `GET /api/vendors/:id/performance` — avg delivery, win rate, total spend

### RFQ Module
- [ ] `GET /api/rfq` — list RFQs (vendors see only invitations)
- [ ] `POST /api/rfq` — create with items, deadline, vendorIds
- [ ] `GET /api/rfq/:id` — detail with items, vendors, attachments, quotations
- [ ] `PUT /api/rfq/:id` — update (forbidden if CLOSED)
- [ ] `POST /api/rfq/:id/close` — close to new quotations

### Quotation Module
- [ ] `POST /api/rfq/:rfqId/quotations` — submit (one per vendor per RFQ)
- [ ] `GET /api/rfq/:rfqId/quotations` — all quotations for comparison
- [ ] `PUT /api/quotations/:id` — edit (only while OPEN + before deadline)
- [ ] `POST /api/quotations/:id/select` — select winner → creates Approval

### Shared Schemas
- [ ] `shared/schemas/auth.schema.js`
- [ ] `shared/schemas/vendor.schema.js`
- [ ] `shared/schemas/rfq.schema.js`
- [ ] `shared/schemas/quotation.schema.js`
- [ ] `shared/schemas/index.js`

### Socket.io Events
- [ ] Emit on RFQ created
- [ ] Emit on quotation submitted
- [ ] Emit on approval needed

---

## Phase 2 — Backend Features (@Tirthmantri20)

### Utility Functions
- [ ] `apiResponse.js` — sendSuccess / sendError helpers
- [ ] `asyncHandler.js` — async error wrapper
- [ ] `AppError.js` — custom error class
- [ ] `calculateTax.js` — GST 18% calculation
- [ ] `generatePONumber.js` — PO-YYYY-NNNN auto-increment
- [ ] `generateInvoiceNumber.js` — INV-YYYY-NNNN auto-increment
- [ ] `generatePDF.js` — Puppeteer HTML→PDF renderer
- [ ] `sendEmail.js` — Nodemailer wrapper with templates

### Activity Log
- [ ] `activityLogger.middleware.js` — auto-insert on mutations
- [ ] `GET /api/activity-logs` — paginated timeline with filters

### Approval Module
- [ ] `GET /api/approvals` — list pending (Manager)
- [ ] `GET /api/approvals/:id` — full detail
- [ ] `POST /api/approvals/:id/approve` — approve + auto-generate PO + socket emit
- [ ] `POST /api/approvals/:id/reject` — reject with reason

### Purchase Order Module
- [ ] `GET /api/purchase-orders` — list with status filter
- [ ] `GET /api/purchase-orders/:id` — detail with vendor, items, tax
- [ ] `GET /api/purchase-orders/:id/pdf` — Puppeteer PDF stream
- [ ] `PUT /api/purchase-orders/:id/status` — ACKNOWLEDGED/COMPLETED/CANCELLED

### Invoice Module
- [ ] `POST /api/invoices` — generate from PO
- [ ] `GET /api/invoices` — list with status filter
- [ ] `GET /api/invoices/:id` — detail with line items + tax
- [ ] `GET /api/invoices/:id/pdf` — PDF download
- [ ] `POST /api/invoices/:id/send-email` — email to vendor, status → SENT
- [ ] `PUT /api/invoices/:id/status` — PAID/OVERDUE

### Reports Module
- [ ] `GET /api/reports/dashboard` — aggregated counts
- [ ] `GET /api/reports/spend-trend` — monthly totals (12 months)
- [ ] `GET /api/reports/vendor-performance` — per-vendor metrics

### HTML Templates
- [ ] `templates/invoice.html` — GST-compliant invoice
- [ ] `templates/po.html` — purchase order layout
- [ ] `templates/email-rfq-invite.html` — vendor invitation
- [ ] `templates/email-approval-notification.html` — approval status

### Shared Schemas
- [ ] `shared/schemas/approval.schema.js`
- [ ] `shared/schemas/po.schema.js`
- [ ] `shared/schemas/invoice.schema.js`

---

## Phase 3 — Frontend (@anujpatel002)

### Project Setup
- [ ] `package.json` — all frontend dependencies
- [ ] `vite.config.js` — proxy to backend :5000
- [ ] `tailwind.config.js` + `postcss.config.js`
- [ ] `index.html` — meta tags, Google Fonts
- [ ] shadcn/ui initialized + base components added

### Design System
- [ ] `index.css` — Tailwind directives + CSS custom properties
- [ ] All 15 shadcn UI components in `components/ui/`
- [ ] `utils/cn.js` — clsx + tailwind-merge

### Layout Shell
- [ ] `AppLayout.jsx` — sidebar + topbar wrapper
- [ ] `Sidebar.jsx` — role-based navigation links
- [ ] `Topbar.jsx` — user info, search, notification bell
- [ ] `NotificationBell.jsx` — socket.io connected
- [ ] `ProtectedRoute.jsx` — RBAC route guard

### Routing + State
- [ ] `router.jsx` — all routes with lazy loading
- [ ] `authStore.js` — JWT, user, login/logout
- [ ] `notificationStore.js` — notifications, unread count
- [ ] `constants.js`, `formatCurrency.js`, `formatDate.js`

### API Layer
- [ ] `axios.config.js` — baseURL, interceptors, token refresh
- [ ] All 9 API files (auth, vendors, rfq, quotations, approvals, po, invoices, reports)
- [ ] All 8 React Query hooks

### Auth Pages
- [ ] `Login.jsx` — form + validation + role redirect
- [ ] `Register.jsx` — form + role selector
- [ ] `ForgotPassword.jsx` — OTP flow

### Dashboard
- [ ] `Dashboard.jsx` — metric cards + recent tables + quick actions

### Vendor Pages
- [ ] `VendorList.jsx` — searchable table, status tabs
- [ ] `VendorDetail.jsx` — profile + linked data
- [ ] `VendorCreate.jsx` — create/edit form

### RFQ Pages
- [ ] `RFQList.jsx` — table with status badges
- [ ] `RFQCreate.jsx` — multi-step form
- [ ] `RFQDetail.jsx` — full detail view

### Quotation Pages
- [ ] `QuoteSubmit.jsx` — vendor quotation form
- [ ] `QuoteCompare.jsx` — side-by-side comparison

### Workflow Pages
- [ ] `Approvals.jsx` — list + approve/reject
- [ ] `PurchaseOrders.jsx` — list + detail + PDF
- [ ] `Invoices.jsx` — list + detail + PDF + email
- [ ] `ActivityLog.jsx` — infinite scroll timeline
- [ ] `Reports.jsx` — Recharts visualizations
- [ ] `NotFound.jsx` — 404 page

### Reusable Components
- [ ] `VendorCard.jsx`, `StatusBadge.jsx`, `ApprovalTimeline.jsx`
- [ ] `QuotationCompareTable.jsx`, `RFQItemsTable.jsx`, `InvoicePrintView.jsx`
- [ ] `ActivityFeed.jsx`, `LoadingSkeleton.jsx`, `EmptyState.jsx`
- [ ] `ConfirmModal.jsx`, `StepperProgress.jsx`, `FileUpload.jsx`
- [ ] `DateRangePicker.jsx`

### Offline + PWA
- [ ] `public/sw.js` — service worker
- [ ] `public/manifest.json` — PWA config

---

## 🔗 API Contract Quick Reference

> M3 should build frontend against these endpoints. Use mock data until backend is ready.

| Method | Endpoint | Auth | Module |
|--------|----------|------|--------|
| POST | `/api/auth/register` | Public | M1 |
| POST | `/api/auth/login` | Public | M1 |
| POST | `/api/auth/refresh` | Token | M1 |
| GET | `/api/vendors` | Officer+ | M1 |
| POST | `/api/vendors` | Admin | M1 |
| GET/PUT | `/api/vendors/:id` | Officer+/Admin | M1 |
| GET | `/api/rfq` | All | M1 |
| POST | `/api/rfq` | Officer | M1 |
| GET/PUT | `/api/rfq/:id` | All/Officer | M1 |
| POST | `/api/rfq/:rfqId/quotations` | Vendor | M1 |
| GET | `/api/rfq/:rfqId/quotations` | Officer+ | M1 |
| POST | `/api/quotations/:id/select` | Officer | M1 |
| GET | `/api/approvals` | Manager | M2 |
| POST | `/api/approvals/:id/approve` | Manager | M2 |
| POST | `/api/approvals/:id/reject` | Manager | M2 |
| GET | `/api/purchase-orders` | Officer+ | M2 |
| GET | `/api/purchase-orders/:id/pdf` | Officer+ | M2 |
| POST | `/api/invoices` | Officer | M2 |
| GET | `/api/invoices/:id/pdf` | Officer+ | M2 |
| POST | `/api/invoices/:id/send-email` | Officer | M2 |
| GET | `/api/reports/dashboard` | All | M2 |
| GET | `/api/reports/spend-trend` | Manager+ | M2 |
| GET | `/api/activity-logs` | Officer+ | M2 |

---

## 📝 Change Log

> Add entries below when you complete work. Format: `[DATE] [MEMBER] — Description`

### Completed Changes
```
[2026-06-06] M1 — Project structure scaffolded (168 empty files)
[2026-06-06] M1 — README.md created with full documentation
[2026-06-06] M1 — .gitignore, LICENSE, .editorconfig created
[2026-06-06] M1 — Initial commit pushed to main
```

### Known Issues / Blockers
```
(none yet)
```

### Design Decisions
```
- Monorepo structure: client/ + server/ + shared/
- Prisma as single schema source of truth
- Zod schemas shared between FE and BE via shared/ package
- JWT with refresh token rotation
- Socket.io for real-time notifications
- Puppeteer for PDF generation
- GST 18% default tax rate
```
