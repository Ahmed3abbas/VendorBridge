# VendorBridge — Full Implementation Plan

> 3 members · 3 devices · Zero merge conflicts

## Team Assignment

| Member | GitHub Username | Role | Works In |
|--------|----------------|------|----------|
| **M1** | `Ahmed3abbas` | Backend Core + DevOps | `server/src/{config,middlewares,modules/{auth,vendors,rfq,quotations}}`, `server/prisma/`, `docker-compose.yml`, `shared/` |
| **M2** | `Tirthmantri20` | Backend Features | `server/src/modules/{approvals,purchase-orders,invoices,activity-logs,reports}`, `server/src/{templates,utils}` |
| **M3** | `anujpatel002` | Frontend Lead | `client/` (entire directory) |

> [!IMPORTANT]
> **Zero-conflict guarantee**: Each member owns exclusive file territories. No two members touch the same file. The only shared touchpoint is `server/src/app.js` (route mounting) — M1 creates it first, M2 appends their routes in a later phase.

---

## Git Workflow

### Branch Strategy
```
main (protected — PR only)
 └── develop (integration branch)
      ├── feat/m1/backend-core     ← Ahmed3abbas
      ├── feat/m2/backend-features ← Tirthmantri20
      └── feat/m3/frontend         ← anujpatel002
```

### Setup Steps (M1 does this first)
```bash
git checkout -b develop
git push -u origin develop
# Then each member creates their branch FROM develop
```

### Merge Order
1. **M1 merges first** → `develop` (foundation that M2 depends on)
2. **M2 merges second** → `develop` (adds remaining server modules)
3. **M3 merges last** → `develop` (frontend connects to complete API)
4. Final: `develop` → `main` via PR

---

## Phase Breakdown

### Phase 1 — M1: Backend Core + DevOps (`Ahmed3abbas`)
**Branch**: `feat/m1/backend-core`
**Files owned** (EXCLUSIVE — only M1 touches these):

```
docker-compose.yml
server/package.json
server/.env.example
server/nodemon.json
server/Dockerfile
server/.eslintrc.cjs
server/.prettierrc
server/prisma/schema.prisma
server/prisma/seed.js
server/src/app.js
server/src/server.js
server/src/config/db.js
server/src/config/env.js
server/src/config/logger.js
server/src/config/mailer.js
server/src/config/socket.js
server/src/middlewares/auth.middleware.js
server/src/middlewares/role.middleware.js
server/src/middlewares/validate.middleware.js
server/src/middlewares/upload.middleware.js
server/src/middlewares/errorHandler.js
server/src/modules/auth/*
server/src/modules/vendors/*
server/src/modules/rfq/*
server/src/modules/quotations/*
shared/package.json
shared/schemas/index.js
shared/schemas/auth.schema.js
shared/schemas/vendor.schema.js
shared/schemas/rfq.schema.js
shared/schemas/quotation.schema.js
```

**Deliverables (in order)**:

1. **Docker + Prisma foundation**
   - `docker-compose.yml` — PostgreSQL 15 + pgAdmin
   - `server/package.json` — all backend dependencies
   - `server/prisma/schema.prisma` — complete 12-table schema with all enums, relations
   - Run `npx prisma migrate dev --name init`
   - `server/prisma/seed.js` — demo users, vendors, sample RFQ, quotations, PO, invoice

2. **Server core scaffold**
   - `server/src/config/env.js` — dotenv loader + validation
   - `server/src/config/db.js` — Prisma client singleton
   - `server/src/config/logger.js` — Winston setup
   - `server/src/config/mailer.js` — Nodemailer transport (Mailtrap for dev)
   - `server/src/config/socket.js` — Socket.io init + room management
   - `server/src/app.js` — Express setup, CORS, morgan, body-parser, all route mounts
   - `server/src/server.js` — HTTP server + Socket.io bootstrap

3. **Middlewares**
   - `auth.middleware.js` — JWT verification (Bearer token)
   - `role.middleware.js` — RBAC guard factory (`requireRole('ADMIN', 'MANAGER')`)
   - `validate.middleware.js` — Zod schema validation on req.body
   - `upload.middleware.js` — Multer config for file uploads
   - `errorHandler.js` — Global error handler with standard envelope

4. **Auth module**
   - `auth.routes.js` — register, login, refresh, logout, forgot-password, reset-password
   - `auth.controller.js` — request handling, calls service
   - `auth.service.js` — bcrypt hashing, JWT sign/verify, token rotation

5. **Vendor module**
   - `vendors.routes.js` — CRUD + performance endpoint
   - `vendors.controller.js`
   - `vendors.service.js` — search, filter, category, status management, rating

6. **RFQ module**
   - `rfq.routes.js` — create, list, detail, update, close
   - `rfq.controller.js`
   - `rfq.service.js` — items management, vendor invitation, deadline logic

7. **Quotation module**
   - `quotations.routes.js` — submit, list/compare, edit, select winner
   - `quotations.controller.js`
   - `quotations.service.js` — one-per-vendor enforcement, comparison query, selection → approval creation

8. **Shared Zod schemas**
   - `shared/schemas/auth.schema.js` — login, register, password reset
   - `shared/schemas/vendor.schema.js` — create/update vendor
   - `shared/schemas/rfq.schema.js` — create/update RFQ with items
   - `shared/schemas/quotation.schema.js` — submit/update quotation
   - `shared/schemas/index.js` — re-export all

9. **Socket.io events** — emit on: RFQ created, quotation submitted, approval needed

---

### Phase 2 — M2: Backend Features (`Tirthmantri20`)
**Branch**: `feat/m2/backend-features`
**Files owned** (EXCLUSIVE — only M2 touches these):

```
server/src/modules/approvals/*
server/src/modules/purchase-orders/*
server/src/modules/invoices/*
server/src/modules/activity-logs/*
server/src/modules/reports/*
server/src/middlewares/activityLogger.middleware.js
server/src/templates/invoice.html
server/src/templates/po.html
server/src/templates/email-rfq-invite.html
server/src/templates/email-approval-notification.html
server/src/utils/apiResponse.js
server/src/utils/asyncHandler.js
server/src/utils/AppError.js
server/src/utils/generatePONumber.js
server/src/utils/generateInvoiceNumber.js
server/src/utils/calculateTax.js
server/src/utils/generatePDF.js
server/src/utils/sendEmail.js
shared/schemas/approval.schema.js
shared/schemas/po.schema.js
shared/schemas/invoice.schema.js
```

> [!NOTE]
> M2 can start immediately in parallel with M1. The modules are self-contained. M2 writes their route files but the final route mounting in `app.js` is done during merge (M1 will leave clearly marked placeholder comments for M2's routes).

**Deliverables (in order)**:

1. **Utility functions** (used by all M2 modules)
   - `apiResponse.js` — `sendSuccess(res, data, message)` / `sendError(res, code, message)`
   - `asyncHandler.js` — wraps async controllers to catch errors
   - `AppError.js` — custom error class with status codes
   - `calculateTax.js` — GST 18% calculation (subtotal, tax, total)
   - `generatePONumber.js` — auto-increment PO-YYYY-NNNN
   - `generateInvoiceNumber.js` — auto-increment INV-YYYY-NNNN
   - `generatePDF.js` — Puppeteer HTML→PDF renderer
   - `sendEmail.js` — Nodemailer wrapper with template support

2. **Activity log middleware + module**
   - `activityLogger.middleware.js` — auto-inserts into activity_logs on mutations
   - `activityLogs.routes.js` — paginated timeline, entity filter
   - `activityLogs.controller.js`
   - `activityLogs.service.js` — query with entityType, entityId, userId filters

3. **Approval module**
   - `approvals.routes.js` — list pending, detail, approve, reject
   - `approvals.controller.js`
   - `approvals.service.js` — state machine (PENDING → APPROVED/REJECTED), on APPROVED → auto-generate PO

4. **Purchase Order module**
   - `po.routes.js` — list, detail, PDF download, status update
   - `po.controller.js`
   - `po.service.js` — auto-generation from approved quotation, PO number generation, tax calculation

5. **Invoice module**
   - `invoices.routes.js` — generate, list, detail, PDF, send-email, status update
   - `invoices.controller.js`
   - `invoices.service.js` — generate from PO, tax breakdown, PDF generation, email delivery

6. **Reports module**
   - `reports.routes.js` — dashboard, spend-trend, vendor-performance
   - `reports.controller.js`
   - `reports.service.js` — aggregation queries, monthly totals, vendor rankings

7. **HTML templates**
   - `templates/invoice.html` — GST-compliant invoice layout for Puppeteer
   - `templates/po.html` — Purchase order layout
   - `templates/email-rfq-invite.html` — Vendor invitation email
   - `templates/email-approval-notification.html` — Approval status email

8. **Shared Zod schemas**
   - `shared/schemas/approval.schema.js`
   - `shared/schemas/po.schema.js`
   - `shared/schemas/invoice.schema.js`

---

### Phase 3 — M3: Frontend (`anujpatel002`)
**Branch**: `feat/m3/frontend`
**Files owned** (EXCLUSIVE — only M3 touches these):

```
client/    (entire directory — 100% owned by M3)
```

> [!NOTE]
> M3 starts immediately. Build all pages with **mock data first**, then swap to real API calls once M1/M2's APIs are merged to develop. Use the API contract from the plan (endpoints, request/response shapes) to build mocks.

**Deliverables (in order)**:

1. **Project setup**
   - `package.json` — React 18, Vite, TailwindCSS, shadcn/ui, React Router, TanStack Query, Zustand, React Hook Form, Zod, Recharts, socket.io-client, Lucide icons, Axios
   - `vite.config.js` — proxy to backend on port 5000
   - `tailwind.config.js` + `postcss.config.js`
   - `index.html` — meta tags, font imports
   - `components.json` — shadcn/ui configuration
   - Run `npx shadcn@latest init` + add components

2. **Design system + layout**
   - `src/index.css` — Tailwind directives + CSS custom properties
   - `src/components/ui/*` — Button, Input, Card, Badge, Table, Dialog, Select, Textarea, Toast, Tabs, Dropdown, Skeleton, Avatar, Label, Separator (via shadcn)
   - `src/components/layout/AppLayout.jsx` — sidebar + topbar wrapper
   - `src/components/layout/Sidebar.jsx` — role-based navigation
   - `src/components/layout/Topbar.jsx` — user info + notification bell
   - `src/components/layout/NotificationBell.jsx` — socket.io connected
   - `src/components/layout/ProtectedRoute.jsx` — RBAC route guard

3. **Routing + state**
   - `src/router.jsx` — all routes with lazy loading + role guards
   - `src/store/authStore.js` — JWT token, user object, login/logout actions
   - `src/store/notificationStore.js` — notifications list, unread count
   - `src/utils/cn.js` — clsx + tailwind-merge helper
   - `src/utils/constants.js` — API base URL, role enums, status colors
   - `src/utils/formatCurrency.js` — ₹ formatter
   - `src/utils/formatDate.js` — date/time display helpers

4. **API layer + hooks**
   - `src/api/axios.config.js` — baseURL, JWT interceptor, token refresh, error redirect
   - `src/api/auth.api.js` through `src/api/reports.api.js` — all 9 API files
   - `src/hooks/useAuth.js` through `src/hooks/useReports.js` — all 8 React Query hooks
   - `src/hooks/useSocket.js` — socket.io connection + event handlers

5. **Auth pages**
   - `Login.jsx` — email/password, Zod validation, role-based redirect
   - `Register.jsx` — name, email, password, role selector
   - `ForgotPassword.jsx` — email input, OTP verification flow

6. **Core pages**
   - `Dashboard.jsx` — 4 metric cards + recent tables + quick actions
   - `vendors/VendorList.jsx` — searchable table, status filter tabs, TanStack Table
   - `vendors/VendorDetail.jsx` — vendor profile, linked RFQs/POs, rating
   - `vendors/VendorCreate.jsx` — create/edit vendor form
   - `rfq/RFQList.jsx` — RFQ table with status badges
   - `rfq/RFQCreate.jsx` — multi-step form (Details → Items → Vendors → Review)
   - `rfq/RFQDetail.jsx` — RFQ info, items, invited vendors, quotations

7. **Advanced pages**
   - `quotations/QuoteSubmit.jsx` — vendor quotation form with line items
   - `quotations/QuoteCompare.jsx` — side-by-side comparison, lowest price highlight
   - `Approvals.jsx` — pending list + approve/reject panel with remarks
   - `PurchaseOrders.jsx` — PO list + detail + PDF download button
   - `Invoices.jsx` — invoice list + detail + PDF/email actions
   - `ActivityLog.jsx` — timeline feed with infinite scroll
   - `Reports.jsx` — Recharts (spend bar, PO trend line, vendor table)
   - `NotFound.jsx` — 404 page

8. **Reusable components**
   - `VendorCard.jsx`, `StatusBadge.jsx`, `ApprovalTimeline.jsx`
   - `QuotationCompareTable.jsx`, `RFQItemsTable.jsx`, `InvoicePrintView.jsx`
   - `ActivityFeed.jsx`, `LoadingSkeleton.jsx`, `EmptyState.jsx`
   - `ConfirmModal.jsx`, `StepperProgress.jsx`, `FileUpload.jsx`, `DateRangePicker.jsx`

9. **Offline + PWA**
   - `public/sw.js` — cache dashboard + vendor list
   - `public/manifest.json` — PWA manifest

---

## File Ownership Map (Conflict Prevention)

```
┌─────────────────────────────────────────────────┐
│  AHMED3ABBAS (M1)           — Blue zone         │
│  server/prisma/*                                │
│  server/src/config/*                            │
│  server/src/middlewares/* (except activityLogger)│
│  server/src/modules/auth/*                      │
│  server/src/modules/vendors/*                   │
│  server/src/modules/rfq/*                       │
│  server/src/modules/quotations/*                │
│  server/src/app.js + server.js                  │
│  docker-compose.yml, server/package.json        │
│  shared/schemas/{auth,vendor,rfq,quotation}     │
├─────────────────────────────────────────────────┤
│  TIRTHMANTRI20 (M2)        — Green zone         │
│  server/src/modules/approvals/*                 │
│  server/src/modules/purchase-orders/*            │
│  server/src/modules/invoices/*                  │
│  server/src/modules/activity-logs/*             │
│  server/src/modules/reports/*                   │
│  server/src/middlewares/activityLogger*          │
│  server/src/templates/*                         │
│  server/src/utils/*                             │
│  shared/schemas/{approval,po,invoice}           │
├─────────────────────────────────────────────────┤
│  ANUJPATEL002 (M3)         — Amber zone         │
│  client/* (ENTIRE directory)                    │
│  No backend files whatsoever                    │
└─────────────────────────────────────────────────┘
```

> [!WARNING]
> **`server/src/app.js` coordination**: M1 creates `app.js` and mounts M1's routes. M1 also adds commented placeholder lines for M2's routes:
> ```js
> // === M2 ROUTES (uncomment after merge) ===
> // app.use('/api/approvals', approvalsRoutes);
> // app.use('/api/purchase-orders', poRoutes);
> // app.use('/api/invoices', invoicesRoutes);
> // app.use('/api/activity-logs', activityLogsRoutes);
> // app.use('/api/reports', reportsRoutes);
> ```
> When M2 merges, they uncomment these lines and add the imports. This is the **only file** both touch, and the change is trivial.

---

## Verification Plan

### Automated Tests
```bash
# M1 — test auth + vendor + RFQ APIs
cd server && npm test

# M2 — test approval workflow + PO generation
cd server && npm test

# M3 — frontend build verification
cd client && npm run build
```

### Manual Verification
1. `docker compose up` — everything starts cleanly
2. Login as each of the 5 demo users
3. Full workflow: Create RFQ → Submit quotations → Compare → Select → Approve → PO generated → Invoice → PDF download
4. Socket.io notifications fire on approval events
5. Mobile responsive check at 768px+

### Integration Smoke Test
```bash
# After all 3 branches merged to develop:
docker compose down -v && docker compose up -d
cd server && npx prisma migrate dev && npx prisma db seed
cd client && npm run dev
# Walk through full procurement cycle
```
