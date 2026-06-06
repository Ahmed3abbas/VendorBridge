# VendorBridge — Procurement & Vendor Management ERP

> A full-stack procurement platform that digitizes the entire procurement lifecycle — from vendor onboarding, RFQ creation, quotation comparison, multi-level approval, purchase order generation, to GST-compliant invoice delivery.

---

## 🚀 Tech Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| **Frontend**    | React 18 + Vite + TailwindCSS + shadcn/ui |
| **Backend**     | Node.js 20 LTS + Express.js             |
| **Database**    | PostgreSQL 15                            |
| **ORM**         | Prisma 5                                 |
| **Auth**        | JWT (jsonwebtoken + bcryptjs)            |
| **Real-time**   | Socket.io                                |
| **PDF**         | Puppeteer                                |
| **Email**       | Nodemailer                               |
| **Validation**  | Zod (shared FE + BE)                    |
| **State**       | Zustand + TanStack Query (React Query)  |
| **Charts**      | Recharts                                 |
| **Deployment**  | Docker Compose (Local)                   |

---

## 📁 Project Structure

```
VendorBridge/
├── .gitignore
├── .editorconfig
├── README.md
├── LICENSE
├── docker-compose.yml
│
├── client/                              # React Frontend (Vite SPA)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── components.json                  # shadcn/ui config
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── Dockerfile
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   │   └── sw.js                        # Service Worker (offline support)
│   │
│   └── src/
│       ├── main.jsx                     # Entry point
│       ├── App.jsx                      # Root component
│       ├── App.css
│       ├── index.css                    # Global styles + Tailwind directives
│       ├── router.jsx                   # React Router v6 config
│       │
│       ├── api/                         # Axios hooks per module
│       │   ├── axios.config.js          # Base URL, interceptors, JWT header
│       │   ├── auth.api.js
│       │   ├── vendors.api.js
│       │   ├── rfq.api.js
│       │   ├── quotations.api.js
│       │   ├── approvals.api.js
│       │   ├── po.api.js
│       │   ├── invoices.api.js
│       │   └── reports.api.js
│       │
│       ├── components/                  # Reusable UI components
│       │   ├── ui/                      # shadcn base components
│       │   │   ├── Button.jsx
│       │   │   ├── Input.jsx
│       │   │   ├── Card.jsx
│       │   │   ├── Badge.jsx
│       │   │   ├── Table.jsx
│       │   │   ├── Dialog.jsx
│       │   │   ├── Select.jsx
│       │   │   ├── Textarea.jsx
│       │   │   ├── Toast.jsx
│       │   │   ├── Tabs.jsx
│       │   │   ├── Dropdown.jsx
│       │   │   ├── Skeleton.jsx
│       │   │   ├── Avatar.jsx
│       │   │   ├── Label.jsx
│       │   │   └── Separator.jsx
│       │   │
│       │   ├── layout/
│       │   │   ├── AppLayout.jsx        # Main layout wrapper
│       │   │   ├── Sidebar.jsx
│       │   │   ├── Topbar.jsx
│       │   │   ├── NotificationBell.jsx
│       │   │   └── ProtectedRoute.jsx   # RBAC route guard
│       │   │
│       │   ├── VendorCard.jsx
│       │   ├── QuotationCompareTable.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── ApprovalTimeline.jsx
│       │   ├── InvoicePrintView.jsx
│       │   ├── RFQItemsTable.jsx
│       │   ├── ActivityFeed.jsx
│       │   ├── LoadingSkeleton.jsx
│       │   ├── EmptyState.jsx
│       │   ├── ConfirmModal.jsx
│       │   ├── StepperProgress.jsx
│       │   ├── FileUpload.jsx
│       │   └── DateRangePicker.jsx
│       │
│       ├── pages/                       # One file per screen
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   └── ForgotPassword.jsx
│       │   ├── Dashboard.jsx
│       │   ├── vendors/
│       │   │   ├── VendorList.jsx
│       │   │   ├── VendorDetail.jsx
│       │   │   └── VendorCreate.jsx
│       │   ├── rfq/
│       │   │   ├── RFQList.jsx
│       │   │   ├── RFQCreate.jsx
│       │   │   └── RFQDetail.jsx
│       │   ├── quotations/
│       │   │   ├── QuoteSubmit.jsx
│       │   │   └── QuoteCompare.jsx
│       │   ├── Approvals.jsx
│       │   ├── PurchaseOrders.jsx
│       │   ├── Invoices.jsx
│       │   ├── ActivityLog.jsx
│       │   ├── Reports.jsx
│       │   └── NotFound.jsx
│       │
│       ├── store/                       # Zustand global state
│       │   ├── authStore.js
│       │   └── notificationStore.js
│       │
│       ├── hooks/                       # React Query custom hooks
│       │   ├── useAuth.js
│       │   ├── useVendors.js
│       │   ├── useRFQ.js
│       │   ├── useInvoice.js
│       │   ├── useApprovals.js
│       │   ├── usePurchaseOrders.js
│       │   ├── useSocket.js
│       │   └── useReports.js
│       │
│       └── utils/
│           ├── formatCurrency.js
│           ├── formatDate.js
│           ├── constants.js
│           └── cn.js                    # clsx + tailwind-merge helper
│
├── server/                              # Node.js + Express Backend
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── nodemon.json
│   ├── Dockerfile
│   │
│   ├── prisma/
│   │   ├── schema.prisma               # Single source of truth (12 tables)
│   │   ├── seed.js                     # Demo data seeder
│   │   └── migrations/                 # Auto-generated by Prisma
│   │
│   └── src/
│       ├── app.js                       # Express setup, middleware, route mount
│       ├── server.js                    # HTTP + Socket.io bootstrap
│       │
│       ├── config/
│       │   ├── db.js                    # Prisma client singleton
│       │   ├── env.js                   # Environment variable loader
│       │   ├── logger.js               # Winston structured logging
│       │   ├── mailer.js               # Nodemailer SMTP transport
│       │   └── socket.js               # Socket.io init + room management
│       │
│       ├── middlewares/
│       │   ├── auth.middleware.js       # JWT verification
│       │   ├── role.middleware.js       # RBAC guard factory
│       │   ├── validate.middleware.js   # Zod req.body validation
│       │   ├── upload.middleware.js     # Multer multipart config
│       │   ├── activityLogger.middleware.js  # Auto audit trail
│       │   └── errorHandler.js         # Global error handler
│       │
│       ├── modules/                     # Self-contained feature modules
│       │   ├── auth/
│       │   │   ├── auth.routes.js
│       │   │   ├── auth.controller.js
│       │   │   └── auth.service.js
│       │   ├── vendors/
│       │   │   ├── vendors.routes.js
│       │   │   ├── vendors.controller.js
│       │   │   └── vendors.service.js
│       │   ├── rfq/
│       │   │   ├── rfq.routes.js
│       │   │   ├── rfq.controller.js
│       │   │   └── rfq.service.js
│       │   ├── quotations/
│       │   │   ├── quotations.routes.js
│       │   │   ├── quotations.controller.js
│       │   │   └── quotations.service.js
│       │   ├── approvals/
│       │   │   ├── approvals.routes.js
│       │   │   ├── approvals.controller.js
│       │   │   └── approvals.service.js
│       │   ├── purchase-orders/
│       │   │   ├── po.routes.js
│       │   │   ├── po.controller.js
│       │   │   └── po.service.js
│       │   ├── invoices/
│       │   │   ├── invoices.routes.js
│       │   │   ├── invoices.controller.js
│       │   │   └── invoices.service.js
│       │   ├── activity-logs/
│       │   │   ├── activityLogs.routes.js
│       │   │   ├── activityLogs.controller.js
│       │   │   └── activityLogs.service.js
│       │   └── reports/
│       │       ├── reports.routes.js
│       │       ├── reports.controller.js
│       │       └── reports.service.js
│       │
│       ├── templates/                   # HTML templates for PDF generation
│       │   ├── invoice.html             # GST-compliant invoice template
│       │   ├── po.html                  # Purchase order template
│       │   ├── email-rfq-invite.html
│       │   └── email-approval-notification.html
│       │
│       ├── uploads/                     # Multer file destination
│       │   └── .gitkeep
│       │
│       └── utils/
│           ├── apiResponse.js           # Standard response envelope
│           ├── asyncHandler.js          # Async error wrapper
│           ├── AppError.js              # Custom error class
│           ├── generatePONumber.js      # PO-YYYY-NNNN generator
│           ├── generateInvoiceNumber.js # INV-YYYY-NNNN generator
│           ├── calculateTax.js          # GST calculation
│           ├── generatePDF.js           # Puppeteer PDF renderer
│           └── sendEmail.js             # Email utility wrapper
│
└── shared/                              # Shared between FE + BE
    ├── package.json
    └── schemas/                         # Zod validation schemas
        ├── index.js                     # Re-export all schemas
        ├── auth.schema.js
        ├── vendor.schema.js
        ├── rfq.schema.js
        ├── quotation.schema.js
        ├── approval.schema.js
        ├── po.schema.js
        └── invoice.schema.js
```

---

## 🗄️ Database Schema (12 Tables)

| Table              | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `users`            | Authentication & role management          |
| `vendors`          | Vendor registry with GST & contacts       |
| `rfqs`             | Request for Quotation records             |
| `rfq_items`        | Line items within an RFQ                  |
| `rfq_vendors`      | Junction: vendors invited to RFQs         |
| `quotations`       | Vendor response to an RFQ                 |
| `quotation_items`  | Line-level pricing per quotation          |
| `approvals`        | Approval workflow state per quotation     |
| `purchase_orders`  | Official PO generated on approval         |
| `invoices`         | Tax invoice generated from PO             |
| `activity_logs`    | Audit trail for all procurement events    |
| `attachments`      | Files attached to RFQs or POs             |

---

## 👥 User Roles

| Role                   | Key Permissions                              |
| ---------------------- | -------------------------------------------- |
| **Admin**              | Full system access, user & vendor management |
| **Manager**            | Approve/reject procurement, view reports     |
| **Procurement Officer**| Create RFQs, compare quotes, manage POs      |
| **Vendor**             | View invited RFQs, submit quotations         |

---

## 🔄 Core Procurement Workflow

```
1. Officer creates RFQ → 2. Vendors submit quotes → 3. Compare side-by-side
→ 4. Select winner → 5. Manager approves → 6. PO auto-generated
→ 7. Invoice created → 8. PDF download / email send
```

---

## 🛠️ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/VendorBridge.git
cd VendorBridge

# 2. Start PostgreSQL via Docker
docker compose up -d db

# 3. Install dependencies
cd server && npm install
cd ../client && npm install
cd ../shared && npm install

# 4. Configure environment
cp server/.env.example server/.env
# Edit server/.env with your JWT secrets

# 5. Run database migrations & seed
cd server
npx prisma migrate dev
npx prisma db seed

# 6. Start development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

---

## 📋 Demo Credentials

| Role      | Email               | Password    |
| --------- | ------------------- | ----------- |
| Admin     | admin@demo.com      | Demo@1234   |
| Officer   | officer@demo.com    | Demo@1234   |
| Manager   | manager@demo.com    | Demo@1234   |
| Vendor 1  | vendor1@demo.com    | Demo@1234   |
| Vendor 2  | vendor2@demo.com    | Demo@1234   |

---

## 📄 License

MIT
