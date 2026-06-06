# Phase 2 — Backend Features
## Assigned to: @Tirthmantri20
## Branch: `feat/m2/backend-features`

> **You own**: `server/src/modules/{approvals,purchase-orders,invoices,activity-logs,reports}`, `server/src/{templates,utils}`, `server/src/middlewares/activityLogger.middleware.js`, `shared/schemas/{approval,po,invoice}`

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Ahmed3abbas/VendorBridge.git
cd VendorBridge

# 2. Create your branch from develop
git checkout develop
git pull origin develop
git checkout -b feat/m2/backend-features

# 3. Install server dependencies (M1 should have package.json ready)
cd server && npm install

# 4. Start working — commit often
# Example: git commit -m "feat(approvals): add approval state machine"
```

> **NOTE**: You can start coding immediately in parallel with M1. Your modules are completely independent. You'll need M1's Prisma schema to test DB queries, but you can write all the logic first and test after M1 pushes.

---

## Task Order (follow this sequence)

### Step 1: Utility Functions (Foundation for all your modules)

#### 1.1 — `server/src/utils/apiResponse.js`
```js
// Helper functions for consistent API responses
// sendSuccess(res, statusCode, data, message, pagination?)
// sendError(res, statusCode, code, message, fields?)

// Success: { success: true, data, message, pagination }
// Error: { success: false, error: { code, message, fields } }
```

#### 1.2 — `server/src/utils/asyncHandler.js`
```js
// Wraps async route handlers to automatically catch errors
// Usage: router.get('/', asyncHandler(async (req, res) => { ... }))
```

#### 1.3 — `server/src/utils/AppError.js`
```js
// Custom error class with statusCode and error code
// Usage: throw new AppError('Not found', 404, 'NOT_FOUND')
```

#### 1.4 — `server/src/utils/calculateTax.js`
```js
// calculateTax(subtotal, taxRate = 18)
// Returns: { subtotal, taxRate, taxAmount, total }
// taxAmount = subtotal * (taxRate / 100), rounded to 2 decimals
```

#### 1.5 — `server/src/utils/generatePONumber.js`
```js
// Generates PO-YYYY-NNNN format
// Query DB for last PO number of current year, increment
// e.g., PO-2024-0001, PO-2024-0002, ...
```

#### 1.6 — `server/src/utils/generateInvoiceNumber.js`
```js
// Generates INV-YYYY-NNNN format
// Same logic as PO number but for invoices
```

#### 1.7 — `server/src/utils/generatePDF.js`
```js
// Uses Puppeteer to render HTML template to PDF buffer
// generatePDF(templatePath, data) → Buffer
// 1. Read HTML template file
// 2. Replace template variables with data
// 3. Launch Puppeteer, set content, generate PDF
// 4. Return PDF buffer
```

#### 1.8 — `server/src/utils/sendEmail.js`
```js
// Wrapper around Nodemailer
// sendEmail({ to, subject, html, attachments? })
// Uses the mailer config from server/src/config/mailer.js (created by M1)
```

---

### Step 2: Activity Log Middleware + Module

#### 2.1 — `server/src/middlewares/activityLogger.middleware.js`
```js
// Middleware that auto-logs mutations (POST, PUT, DELETE)
// After response is sent, insert into activity_logs:
//   user_id, action (from route), entity_type, entity_id, metadata, ip_address
// Usage: router.post('/', activityLogger('CREATE_RFQ', 'RFQ'), controller.create)
```

#### 2.2 — Activity Logs Module
**Files**: `server/src/modules/activity-logs/activityLogs.{routes,controller,service}.js`

| Method | Path | Role | Logic |
|--------|------|------|-------|
| GET | `/api/activity-logs` | Officer+ | Paginated timeline. Filters: ?entityType=&entityId=&userId=&page=&limit= |

Service logic:
- Query activity_logs with joins to users table for actor name
- Support entity-scoped queries (e.g., all logs for RFQ #123)
- Return with pagination metadata

---

### Step 3: Approval Module
**Files**: `server/src/modules/approvals/approvals.{routes,controller,service}.js`

| Method | Path | Role | Logic |
|--------|------|------|-------|
| GET | `/api/approvals` | Manager | List PENDING approvals with quotation + vendor + RFQ context |
| GET | `/api/approvals/:id` | Manager | Full detail: quotation items, vendor profile, RFQ info |
| POST | `/api/approvals/:id/approve` | Manager | Set status=APPROVED, add remarks, auto-generate PO, emit socket event |
| POST | `/api/approvals/:id/reject` | Manager | Set status=REJECTED, add remarks, set quotation status=REJECTED |

**Critical business logic in `approve`**:
1. Validate approval exists and is PENDING
2. Update approval: status=APPROVED, remarks, acted_at=now()
3. Update quotation: status=SELECTED
4. Calculate tax: subtotal from quotation items, tax_rate=18%, compute tax_amount & total
5. Generate PO number using `generatePONumber()`
6. Create PurchaseOrder record with all amounts
7. Log activity
8. Emit socket event `approval:approved` to officer and vendor rooms

**Critical business logic in `reject`**:
1. Update approval: status=REJECTED, remarks, acted_at=now()
2. Update quotation: status=REJECTED
3. Optionally re-open RFQ status to OPEN
4. Log activity
5. Emit socket event `approval:rejected`

---

### Step 4: Purchase Order Module
**Files**: `server/src/modules/purchase-orders/po.{routes,controller,service}.js`

| Method | Path | Role | Logic |
|--------|------|------|-------|
| GET | `/api/purchase-orders` | Officer+ | List POs. Vendors see only their POs. ?status=&page=&limit= |
| GET | `/api/purchase-orders/:id` | Officer+ | Detail: vendor info, quotation items, tax breakdown |
| GET | `/api/purchase-orders/:id/pdf` | Officer+ | Generate PDF via Puppeteer using `templates/po.html`, stream as download |
| PUT | `/api/purchase-orders/:id/status` | Officer | Update status: ACKNOWLEDGED / COMPLETED / CANCELLED |

**PDF generation flow**:
1. Fetch PO with all relations (vendor, quotation items)
2. Load `templates/po.html`
3. Inject data into template (company name, PO number, items table, tax, total)
4. Call `generatePDF()` → get PDF buffer
5. Set headers: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename=PO-YYYY-NNNN.pdf`
6. Stream buffer to response

---

### Step 5: Invoice Module
**Files**: `server/src/modules/invoices/invoices.{routes,controller,service}.js`

| Method | Path | Role | Logic |
|--------|------|------|-------|
| POST | `/api/invoices` | Officer | Generate from PO. Body: { poId, taxRate? }. Auto-compute totals |
| GET | `/api/invoices` | Officer+ | List with ?status= filter |
| GET | `/api/invoices/:id` | Officer+ | Detail with full line items + tax breakdown |
| GET | `/api/invoices/:id/pdf` | Officer+ | Puppeteer PDF using `templates/invoice.html` |
| POST | `/api/invoices/:id/send-email` | Officer | Email PDF to vendor contact. Status → SENT |
| PUT | `/api/invoices/:id/status` | Officer | Mark as PAID / OVERDUE |

**Invoice generation logic**:
1. Fetch PO with quotation items and vendor
2. Generate invoice number using `generateInvoiceNumber()`
3. Calculate: subtotal (sum of items), taxRate (default 18%), taxAmount, total
4. Create Invoice record
5. Log activity

**Email sending logic**:
1. Generate PDF buffer
2. Get vendor contact_email from PO relation
3. Call `sendEmail()` with PDF as attachment
4. Update invoice status to SENT, set sent_at
5. Log activity

---

### Step 6: Reports Module
**Files**: `server/src/modules/reports/reports.{routes,controller,service}.js`

| Method | Path | Role | Logic |
|--------|------|------|-------|
| GET | `/api/reports/dashboard` | All | Aggregated counts: pending approvals, active RFQs, recent POs, recent invoices. Role-filtered. |
| GET | `/api/reports/spend-trend` | Manager+ | Monthly spend totals for last 12 months. Group by month from PO issued_at. |
| GET | `/api/reports/vendor-performance` | Manager+ | Per-vendor: avg delivery days, win rate, total spend, on-time %, # of POs |

**Dashboard query (role-aware)**:
- Admin/Manager: see all
- Officer: see their created RFQs and related data
- Vendor: see their invitations, POs, invoices only

---

### Step 7: HTML Templates

#### 7.1 — `server/src/templates/invoice.html`
GST-compliant invoice layout:
- Company header (VendorBridge logo/name)
- Invoice number, date, due date
- Vendor details (name, GST, address)
- Items table (description, qty, unit price, subtotal)
- Tax breakdown (subtotal, CGST 9%, SGST 9% or IGST 18%, total)
- Footer with terms & conditions

#### 7.2 — `server/src/templates/po.html`
Purchase order layout:
- PO number, issue date
- Vendor details
- Items table with quantities and prices
- Total with tax
- Authorization signature line

#### 7.3 — `server/src/templates/email-rfq-invite.html`
- Subject: "You've been invited to submit a quotation"
- RFQ title, deadline, items summary
- CTA button: "View RFQ & Submit Quote"

#### 7.4 — `server/src/templates/email-approval-notification.html`
- Subject: "Quotation [Approved/Rejected]"
- RFQ title, vendor name, decision, remarks
- Link to view PO (if approved)

---

### Step 8: Shared Zod Schemas
**Files**: `shared/schemas/{approval,po,invoice}.schema.js`

- `approval.schema.js` — approve/reject body (remarks string)
- `po.schema.js` — status update (ACKNOWLEDGED/COMPLETED/CANCELLED)
- `invoice.schema.js` — generate body (poId, taxRate?), status update (PAID/OVERDUE)

---

## ⚠️ Integration with M1's Code

When merging to `develop` (after M1 has merged):

1. **`server/src/app.js`** — Uncomment M2's route imports and mount points:
   ```js
   import approvalsRoutes from './modules/approvals/approvals.routes.js';
   import poRoutes from './modules/purchase-orders/po.routes.js';
   import invoicesRoutes from './modules/invoices/invoices.routes.js';
   import activityLogsRoutes from './modules/activity-logs/activityLogs.routes.js';
   import reportsRoutes from './modules/reports/reports.routes.js';

   app.use('/api/approvals', approvalsRoutes);
   app.use('/api/purchase-orders', poRoutes);
   app.use('/api/invoices', invoicesRoutes);
   app.use('/api/activity-logs', activityLogsRoutes);
   app.use('/api/reports', reportsRoutes);
   ```

2. **Use M1's utilities**: Import from `config/db.js`, `config/mailer.js`, `config/socket.js`, middlewares

---

## ✅ Done Checklist
- [ ] All 8 utility functions working
- [ ] Activity log middleware tested
- [ ] Approval → PO auto-generation tested end-to-end
- [ ] PO PDF generates correctly
- [ ] Invoice PDF generates correctly
- [ ] Email sends (test with Mailtrap)
- [ ] Reports return correct aggregations
- [ ] All templates render properly
- [ ] Push branch and create PR to `develop`
- [ ] Update `CONTEXT.md` with completed items

```bash
git add -A
git commit -m "feat: complete backend features — approvals, PO, invoices, PDF, email, reports"
git push -u origin feat/m2/backend-features
# Create PR: feat/m2/backend-features → develop (after M1's PR is merged)
```
