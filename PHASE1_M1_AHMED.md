# Phase 1 — Backend Core + DevOps
## Assigned to: @Ahmed3abbas
## Branch: `feat/m1/backend-core`

> **You own**: Everything in `server/` except M2's modules, plus `shared/schemas/{auth,vendor,rfq,quotation}`, plus `docker-compose.yml`

---

## 🚀 Getting Started

```bash
# 1. Create your branch
git checkout -b develop
git push -u origin develop
git checkout -b feat/m1/backend-core

# 2. Start working — commit often with conventional commits
# Example: git commit -m "feat(auth): add JWT login + refresh endpoints"
```

---

## Task Order (follow this sequence)

### Step 1: Docker + Dependencies
```bash
# 1.1 — docker-compose.yml (PostgreSQL + pgAdmin)
# 1.2 — cd server && npm init -y
# 1.3 — Install all backend deps:
npm install express cors helmet morgan dotenv prisma @prisma/client
npm install jsonwebtoken bcryptjs zod multer nodemailer socket.io puppeteer winston
npm install -D nodemon eslint prettier

# 1.4 — Initialize Prisma
npx prisma init
```

**Files to implement**:
- `docker-compose.yml`
- `server/package.json`
- `server/.env.example`
- `server/nodemon.json` (dev script: `nodemon src/server.js`)
- `server/.eslintrc.cjs`
- `server/.prettierrc`
- `server/Dockerfile`

### Step 2: Prisma Schema (ALL 12 tables)
**File**: `server/prisma/schema.prisma`

Tables to define:
1. `User` — id, email, password_hash, name, role (ADMIN/MANAGER/PROCUREMENT_OFFICER/VENDOR), is_active, created_at, updated_at
2. `Vendor` — id, name, gst_number, category, status (ACTIVE/BLACKLISTED/INACTIVE), rating, contact_email, contact_phone, address, user_id (optional FK)
3. `Rfq` — id, title, description, deadline, status (OPEN/CLOSED/CANCELLED), created_by (FK to User)
4. `RfqItem` — id, rfq_id (FK), product_name, quantity, unit, description
5. `RfqVendor` — id, rfq_id (FK), vendor_id (FK), invited_at
6. `Quotation` — id, rfq_id (FK), vendor_id (FK), total_amount, delivery_date, notes, status (DRAFT/SUBMITTED/SELECTED/REJECTED)
7. `QuotationItem` — id, quotation_id (FK), rfq_item_id (FK), unit_price, quantity, subtotal
8. `Approval` — id, quotation_id (FK), approver_id (FK to User), status (PENDING/APPROVED/REJECTED), remarks, acted_at
9. `PurchaseOrder` — id, po_number (unique), quotation_id (FK), vendor_id (FK), status (ISSUED/ACKNOWLEDGED/COMPLETED/CANCELLED), total_amount, tax_amount, tax_rate, issued_at
10. `Invoice` — id, invoice_number (unique), po_id (FK), subtotal, tax_rate, tax_amount, total, status (DRAFT/SENT/PAID/OVERDUE), sent_at
11. `ActivityLog` — id, user_id (FK), action, entity_type, entity_id, metadata (Json), ip_address, created_at
12. `Attachment` — id, entity_type, entity_id, file_name, file_path, mime_type, file_size, uploaded_by (FK)

```bash
# Run migration after schema is complete
npx prisma migrate dev --name init
```

### Step 3: Server Core Config
**Files**:
- `server/src/config/env.js` — load & validate env vars (PORT, DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, SMTP_*)
- `server/src/config/db.js` — `new PrismaClient()` singleton
- `server/src/config/logger.js` — Winston with console + file transports
- `server/src/config/mailer.js` — Nodemailer transport config
- `server/src/config/socket.js` — Socket.io setup with auth middleware, rooms per user

### Step 4: Express App + Server
**Files**:
- `server/src/app.js` — Express instance with:
  - CORS, helmet, morgan, body-parser
  - Mount M1 routes: `/api/auth`, `/api/vendors`, `/api/rfq`, `/api/quotations`
  - Add commented placeholders for M2 routes (approvals, PO, invoices, activity-logs, reports)
  - Global error handler
- `server/src/server.js` — HTTP server creation, Socket.io attach, listen on PORT

### Step 5: Middlewares
**Files**:
- `auth.middleware.js` — verify JWT from `Authorization: Bearer <token>`, attach `req.user`
- `role.middleware.js` — `requireRole(...roles)` factory function
- `validate.middleware.js` — `validate(zodSchema)` middleware
- `upload.middleware.js` — Multer config (dest: `uploads/`, limits: 10MB, file types)
- `errorHandler.js` — catch-all, return `{ success: false, error: { code, message } }`

### Step 6: Auth Module
**Files**: `server/src/modules/auth/auth.{routes,controller,service}.js`

Endpoints:
| Method | Path | Auth | Logic |
|--------|------|------|-------|
| POST | `/register` | Public | Hash password (bcrypt 12 rounds), create user, return tokens |
| POST | `/login` | Public | Verify credentials, return access_token (15min) + refresh_token (7d) + user |
| POST | `/refresh` | Refresh token | Rotate access token, invalidate old refresh |
| POST | `/logout` | JWT | Blacklist refresh token |
| POST | `/forgot-password` | Public | Generate OTP, send via email |
| POST | `/reset-password` | OTP | Verify OTP, set new password |

### Step 7: Vendor Module
**Files**: `server/src/modules/vendors/vendors.{routes,controller,service}.js`

Endpoints:
| Method | Path | Role | Logic |
|--------|------|------|-------|
| GET | `/` | Officer+ | List with ?search, ?category, ?status, ?page, ?limit |
| POST | `/` | Admin | Create vendor with GST, contact details |
| GET | `/:id` | Officer+ | Detail + linked RFQs, POs, computed rating |
| PUT | `/:id` | Admin | Update profile or status |
| GET | `/:id/performance` | Manager+ | Avg delivery, win rate, total spend |

### Step 8: RFQ Module
**Files**: `server/src/modules/rfq/rfq.{routes,controller,service}.js`

Endpoints:
| Method | Path | Role | Logic |
|--------|------|------|-------|
| GET | `/` | All | List (vendors see only their invitations) |
| POST | `/` | Officer | Create with items[], deadline, vendorIds[], attachment |
| GET | `/:id` | All | Detail: items, vendors, attachments, quotations |
| PUT | `/:id` | Officer | Update title/deadline/vendors (forbidden if CLOSED) |
| POST | `/:id/close` | Officer | Close RFQ to new quotations |

### Step 9: Quotation Module
**Files**: `server/src/modules/quotations/quotations.{routes,controller,service}.js`

Endpoints:
| Method | Path | Role | Logic |
|--------|------|------|-------|
| POST | `/rfq/:rfqId/quotations` | Vendor | Submit with items[], deliveryDate, notes (one per vendor per RFQ) |
| GET | `/rfq/:rfqId/quotations` | Officer+ | All quotations for comparison |
| PUT | `/quotations/:id` | Vendor | Edit (only while RFQ OPEN + before deadline) |
| POST | `/quotations/:id/select` | Officer | Select winner → create Approval (PENDING) + socket emit |

### Step 10: Shared Zod Schemas
**Files**: `shared/schemas/{auth,vendor,rfq,quotation,index}.schema.js`
- Export validation schemas that match request bodies
- These will be imported by both server (validate middleware) and client (React Hook Form)

### Step 11: Seed Data
**File**: `server/prisma/seed.js`

Create demo data:
- 5 users: admin@demo.com, officer@demo.com, manager@demo.com, vendor1@demo.com, vendor2@demo.com (all password: Demo@1234)
- 2 vendors: Tech Supplies Ltd (IT), Office Pro India (Stationery)
- 1 RFQ: "Office Laptops Q3 2024", 10 units, both vendors invited
- 2 quotations: Vendor1 ₹85,000/unit 7-day, Vendor2 ₹79,500/unit 10-day
- 1 PO: PO-2024-0001, Vendor2 selected
- 1 Invoice: INV-2024-0001, status SENT, GST 18%

---

## ✅ Done Checklist
After completing everything above:
- [ ] All APIs tested manually (Postman/curl)
- [ ] `docker compose up` starts cleanly
- [ ] `npx prisma migrate dev` runs on fresh DB
- [ ] `npx prisma db seed` populates demo data
- [ ] Push branch and create PR to `develop`
- [ ] Update `CONTEXT.md` with completed items

```bash
git add -A
git commit -m "feat: complete backend core — auth, vendors, RFQ, quotations, Prisma, Docker"
git push -u origin feat/m1/backend-core
# Create PR: feat/m1/backend-core → develop
```
