# VendorBridge - Business Logic & Workflow Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Business Workflow](#business-workflow)
4. [Module-wise Features](#module-wise-features)
5. [Status Flow & State Management](#status-flow--state-management)
6. [Access Control Matrix](#access-control-matrix)

---

## System Overview

**VendorBridge** is a comprehensive Vendor Management and Procurement System designed to streamline the entire procurement lifecycle from RFQ creation to invoice payment. The system facilitates collaboration between internal stakeholders (Admin, Manager, Procurement Officer) and external vendors.

### Core Business Process Flow

```
RFQ Creation → Vendor Notification → Quotation Submission → Quote Comparison 
→ Quote Selection → Approval Request → Manager Approval → Purchase Order Generation 
→ PO Acknowledgment → Invoice Generation → Payment Processing
```

---

## User Roles & Permissions

The system supports four distinct user roles, each with specific responsibilities and access levels:

### 1. **ADMIN**
**Description:** System administrator with full access to all features and management capabilities.

**Primary Responsibilities:**
- Overall system management and configuration
- Vendor onboarding and management
- User management and role assignment
- Complete procurement oversight
- Reports and analytics access
- Approval authority

**Features & Access:**

| Feature | Permissions |
|---------|-------------|
| **Dashboard** | ✅ Full access - View all metrics, recent RFQs, POs |
| **Vendors** | ✅ Create, Read, Update, Delete vendors; View performance metrics |
| **RFQ Management** | ✅ Create, View, Update, Close, Cancel RFQs |
| **Quotations** | ✅ View all quotations, Compare quotes, Select winning bid |
| **Approvals** | ✅ View, Approve, Reject approval requests |
| **Purchase Orders** | ✅ View all POs, Update status, Download PDFs |
| **Invoices** | ✅ Generate, View, Send, Update status, Download PDFs |
| **Reports & Analytics** | ✅ Full access to spend trends, vendor performance reports |
| **Activity Log** | ✅ View all system activity and audit trails |

---

### 2. **MANAGER**
**Description:** Senior management role focused on approval workflows and strategic oversight.

**Primary Responsibilities:**
- Approve or reject quotations selected by Procurement Officers
- Monitor procurement spend and performance
- Review reports and analytics
- Strategic vendor relationship oversight

**Features & Access:**

| Feature | Permissions |
|---------|-------------|
| **Dashboard** | ✅ View metrics, pending approvals, recent activities |
| **Vendors** | ❌ No access |
| **RFQ Management** | ✅ View RFQs only (read-only) |
| **Quotations** | ✅ View quotations (read-only) |
| **Approvals** | ✅ View, Approve, Reject approval requests |
| **Purchase Orders** | ✅ View all POs (read-only), Download PDFs |
| **Invoices** | ✅ View invoices (read-only), Download PDFs |
| **Reports & Analytics** | ✅ Full access to all reports and analytics |
| **Activity Log** | ✅ View system activity logs |

---

### 3. **PROCUREMENT_OFFICER**
**Description:** Operational role responsible for day-to-day procurement activities and vendor coordination.

**Primary Responsibilities:**
- Create and manage RFQs
- Communicate with vendors
- Evaluate and compare vendor quotations
- Select winning quotations for approval
- Manage vendor database
- Process purchase orders and invoices
- Track order fulfillment

**Features & Access:**

| Feature | Permissions |
|---------|-------------|
| **Dashboard** | ✅ View metrics, active RFQs, recent POs |
| **Vendors** | ✅ View all vendors, View performance metrics (cannot create/delete) |
| **RFQ Management** | ✅ Create, View, Update, Close RFQs |
| **Quotations** | ✅ View quotations, Compare quotes, Select winning bid |
| **Approvals** | ❌ No access (cannot approve, only request approval) |
| **Purchase Orders** | ✅ View, Update status, Download PDFs |
| **Invoices** | ✅ Generate, View, Send, Update status, Download PDFs |
| **Reports & Analytics** | ❌ No access |
| **Activity Log** | ✅ View activity logs |

---

### 4. **VENDOR**
**Description:** External vendor users who respond to RFQs and manage their quotations.

**Primary Responsibilities:**
- View RFQs they are invited to
- Submit quotations with pricing and delivery details
- Update quotations before deadline
- View and acknowledge purchase orders issued to them
- Track invoice status

**Features & Access:**

| Feature | Permissions |
|---------|-------------|
| **Dashboard** | ✅ View own metrics (active RFQs, quotations, POs) |
| **Vendors** | ❌ No access |
| **RFQ Management** | ✅ View only RFQs where they are invited |
| **Quotations** | ✅ Submit, Update, View own quotations |
| **Approvals** | ❌ No access |
| **Purchase Orders** | ✅ View POs issued to them (read-only), Download PDFs |
| **Invoices** | ✅ View invoices related to their POs |
| **Reports & Analytics** | ❌ No access |
| **Activity Log** | ❌ No access |

---

## Business Workflow

### 1. **Vendor Onboarding Flow**

**Actors:** Admin

**Process:**
1. Admin creates new vendor account via `/vendors/new`
2. System captures: Company name, contact details, category, payment terms, tax information
3. Vendor receives credentials and can log in
4. Vendor status: ACTIVE (can participate in RFQs)
5. Admin can update status to INACTIVE or BLACKLISTED as needed

**Business Rules:**
- Only ADMIN role can create vendors
- Vendors must have unique email addresses
- BLACKLISTED vendors cannot participate in new RFQs
- Vendor performance metrics are tracked automatically

---

### 2. **RFQ (Request for Quotation) Lifecycle**

**Actors:** Admin, Procurement Officer, Vendors

**Process Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: RFQ Creation (Admin/Procurement Officer)                │
├─────────────────────────────────────────────────────────────────┤
│ • Create RFQ with title, description, deadline                  │
│ • Add line items (product name, quantity, unit, description)    │
│ • Select vendors to invite (minimum 1)                          │
│ • Upload supporting documents (optional)                        │
│ • System sends notifications to selected vendors                │
│ • Status: OPEN                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Vendor Response Period                                  │
├─────────────────────────────────────────────────────────────────┤
│ • Vendors receive email notifications                           │
│ • Vendors log in and view RFQ details                          │
│ • Vendors submit quotations before deadline                     │
│ • Quotations can be updated until deadline                      │
│ • Status: OPEN (accepting quotes)                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Quote Evaluation (Procurement Officer/Admin)            │
├─────────────────────────────────────────────────────────────────┤
│ • Review all submitted quotations                               │
│ • Use compare feature to analyze prices side-by-side           │
│ • System highlights lowest price per item                       │
│ • Evaluate based on: price, delivery date, vendor rating       │
│ • Select winning quotation                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: RFQ Closure                                             │
├─────────────────────────────────────────────────────────────────┤
│ • Officer can manually close RFQ after deadline                │
│ • Prevents new quotation submissions                            │
│ • Status: CLOSED                                                │
│ • Can also be CANCELLED if RFQ is no longer needed             │
└─────────────────────────────────────────────────────────────────┘
```

**Business Rules:**
- Minimum 1 vendor must be invited
- RFQ must have at least 1 line item
- Vendors can only see RFQs they are invited to
- Quotations cannot be submitted after deadline
- Closing RFQ is irreversible
- At least 2 quotations needed for comparison feature

---

### 3. **Quotation Submission & Selection Flow**

**Actors:** Vendors, Procurement Officer, Admin

**Process Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Quotation Submission (Vendor)                                   │
├─────────────────────────────────────────────────────────────────┤
│ • Vendor accesses RFQ from invitation                           │
│ • Reviews line items and requirements                           │
│ • Enters unit price for each item                              │
│ • Specifies delivery date                                       │
│ • Adds notes/terms (optional)                                   │
│ • System calculates total amount automatically                  │
│ • Can update quotation before RFQ deadline                      │
│ • Status: SUBMITTED                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Quote Comparison & Selection (Procurement Officer/Admin)        │
├─────────────────────────────────────────────────────────────────┤
│ • View all submitted quotations                                 │
│ • Compare prices in side-by-side table                         │
│ • System highlights lowest price per line item                  │
│ • Consider: Total cost, delivery date, vendor rating           │
│ • Select winning quotation                                      │
│ • System creates approval request for Manager                   │
│ • Selected quotation status: SELECTED                           │
│ • Other quotations remain as SUBMITTED (can select another)     │
└─────────────────────────────────────────────────────────────────┘
```

**Business Rules:**
- Vendors can only submit quotes for RFQs they're invited to
- Unit prices must be positive numbers
- Delivery date is mandatory
- Total is calculated automatically (sum of unit_price × quantity)
- Only SUBMITTED quotations can be SELECTED
- Selecting a quote auto-creates approval workflow

---

### 4. **Approval Workflow**

**Actors:** Manager, Admin

**Process Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Approval Request Creation (Automatic)                           │
├─────────────────────────────────────────────────────────────────┤
│ • Triggered when Procurement Officer selects a quotation        │
│ • System creates approval record                                │
│ • Notification sent to Managers and Admins                      │
│ • Status: PENDING                                               │
│ • Approval queue displays all pending approvals                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Manager Review                                                   │
├─────────────────────────────────────────────────────────────────┤
│ • Manager views approval details:                               │
│   - RFQ title and requirements                                  │
│   - Selected vendor name                                        │
│   - Quotation line items and pricing                           │
│   - Total amount                                                │
│   - Delivery date                                               │
│   - Approval timeline/history                                   │
│ • Two possible actions:                                         │
│   1. APPROVE: Generate Purchase Order                           │
│   2. REJECT: Send back to Procurement Officer                   │
│ • Optional remarks can be added                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Approval Decision Outcomes                                       │
├─────────────────────────────────────────────────────────────────┤
│ IF APPROVED:                                                    │
│   • Status: APPROVED                                            │
│   • Purchase Order automatically generated                      │
│   • PO sent to vendor                                           │
│   • Approval workflow completed                                 │
│                                                                 │
│ IF REJECTED:                                                    │
│   • Status: REJECTED                                            │
│   • Vendor notified of rejection                                │
│   • Procurement Officer can select another quotation            │
│   • Process returns to quote selection step                     │
└─────────────────────────────────────────────────────────────────┘
```

**Business Rules:**
- Only MANAGER and ADMIN roles can approve/reject
- Approval decision is final and cannot be reversed
- Remarks are optional but recommended for rejections
- Approval triggers automatic PO generation
- One approval per quotation selection

---

### 5. **Purchase Order (PO) Management**

**Actors:** System (auto-generation), Procurement Officer, Admin, Vendor

**Process Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│ PO Auto-Generation (System)                                     │
├─────────────────────────────────────────────────────────────────┤
│ • Triggered by Manager approval                                 │
│ • System generates unique PO number (auto-increment)            │
│ • PO contains:                                                  │
│   - PO number, issue date                                       │
│   - Vendor details                                              │
│   - Line items from quotation                                   │
│   - Subtotal, GST (18%), total amount                          │
│   - Delivery date                                               │
│ • Status: ISSUED                                                │
│ • Vendor receives email notification                            │
│ • PDF generation available                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Vendor Acknowledgment                                            │
├─────────────────────────────────────────────────────────────────┤
│ • Vendor logs in and views PO                                   │
│ • Downloads PO PDF                                              │
│ • Vendor confirms acceptance (external process)                 │
│ • Officer updates status to ACKNOWLEDGED                        │
│ • Status: ACKNOWLEDGED                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Order Fulfillment                                                │
├─────────────────────────────────────────────────────────────────┤
│ • Vendor delivers goods/services                                │
│ • Procurement Officer verifies delivery                         │
│ • Updates status to COMPLETED                                   │
│ • Status: COMPLETED                                             │
│ • Ready for invoice generation                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Status Transitions:**
- `ISSUED` → `ACKNOWLEDGED` (vendor confirms order)
- `ACKNOWLEDGED` → `COMPLETED` (delivery confirmed)
- `ISSUED` or `ACKNOWLEDGED` → `CANCELLED` (order cancelled)

**Business Rules:**
- PO number is auto-generated and unique
- Only ACKNOWLEDGED POs can generate invoices
- Tax (GST) is calculated at 18% automatically
- PDF download available for all POs
- Vendors can only view their own POs
- Status updates restricted to Admin and Procurement Officer

---

### 6. **Invoice Management**

**Actors:** Procurement Officer, Admin

**Process Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Invoice Generation (Procurement Officer/Admin)                  │
├─────────────────────────────────────────────────────────────────┤
│ • Select an ACKNOWLEDGED Purchase Order                         │
│ • System generates invoice with:                                │
│   - Unique invoice number (auto-generated)                      │
│   - PO reference                                                │
│   - Vendor details                                              │
│   - Line items (copied from PO)                                 │
│   - Subtotal, GST (18%), total amount                          │
│   - Invoice date                                                │
│ • Initial status: DRAFT                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Invoice Distribution                                             │
├─────────────────────────────────────────────────────────────────┤
│ • Officer reviews invoice details                               │
│ • Downloads PDF for records                                     │
│ • Sends invoice via email to vendor                            │
│ • Status updated to: SENT                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Payment Processing                                               │
├─────────────────────────────────────────────────────────────────┤
│ • Finance processes payment (external system)                   │
│ • Officer updates invoice status                                │
│ • Status: PAID (payment completed)                              │
│ • Status: OVERDUE (payment delayed past due date)              │
└─────────────────────────────────────────────────────────────────┘
```

**Status Transitions:**
- `DRAFT` → `SENT` (invoice sent to vendor)
- `SENT` → `PAID` (payment completed)
- `SENT` → `OVERDUE` (payment delayed)

**Business Rules:**
- Only ACKNOWLEDGED POs can generate invoices
- One invoice per PO
- Invoice number is auto-generated and unique
- Email notification sent to vendor on invoice creation
- PDF generation available
- Status updates restricted to Admin and Procurement Officer
- Vendors have read-only access to their invoices

---

## Module-wise Features

### 📊 Dashboard Module

**Purpose:** Central overview of key metrics and recent activities

**Role-based Views:**

| Metric/Feature | Admin | Manager | Procurement Officer | Vendor |
|----------------|-------|---------|---------------------|--------|
| Pending Approvals | ✅ | ✅ | ✅ (view only) | ❌ |
| Active RFQs | ✅ | ✅ | ✅ | ✅ (invited only) |
| Monthly POs Count | ✅ | ✅ | ✅ | ✅ (own POs) |
| Total Invoiced | ✅ | ✅ | ✅ | ✅ (own invoices) |
| Recent RFQ List | ✅ | ✅ | ✅ | ✅ (invited only) |
| Recent PO List | ✅ | ✅ | ✅ | ✅ (own POs) |
| Quick Actions | ✅ | ✅ | ✅ | ✅ (limited) |

**Key Features:**
- Real-time metrics cards with drill-down navigation
- Recent RFQs table (up to 5 most recent)
- Recent POs table (up to 5 most recent)
- Role-specific quick action buttons
- Responsive grid layout

---

### 🏪 Vendor Management Module

**Access:** Admin (full), Procurement Officer (read-only)

**Features:**

1. **Vendor List**
   - Filterable by status (ACTIVE, INACTIVE, BLACKLISTED)
   - Search by name or category
   - Paginated view
   - Sort by name, category, rating, created date
   - View vendor cards with key info

2. **Vendor Creation** (Admin only)
   - Company information form
   - Contact details
   - Category selection (11 predefined categories)
   - Payment terms
   - Tax information (GST, PAN, etc.)
   - Initial status: ACTIVE

3. **Vendor Detail View**
   - Complete vendor profile
   - Performance metrics:
     - Total spend
     - Total POs issued
     - Win rate (quotations selected / submitted)
     - On-time delivery percentage
     - Average rating
   - RFQ participation history
   - Update vendor information
   - Change vendor status

4. **Vendor Status Management**
   - ACTIVE: Can participate in RFQs
   - INACTIVE: Temporarily disabled, no new RFQs
   - BLACKLISTED: Permanently banned, cannot participate

**Business Logic:**
- Unique email per vendor
- Categories: Hardware, Software & IT, Logistics, Raw Materials, Office Supplies, Manufacturing, Consulting, Construction, Food & Beverages, Healthcare, Other
- Performance metrics auto-calculated from historical data
- Rating system based on delivery performance and quality

---

### 📋 RFQ Management Module

**Access:** All roles (with different permissions)

**Features:**

1. **RFQ List**
   - Filter by status (ALL, OPEN, CLOSED, CANCELLED)
   - Paginated view (15 per page)
   - Search functionality
   - Display: Title, Items count, Vendors invited, Deadline, Status, Quotes received
   - Click to view details

2. **RFQ Creation** (Admin, Procurement Officer only)
   - Multi-step wizard:
     - Step 1: RFQ Details (title, description, deadline)
     - Step 2: Line Items (product name, quantity, unit, description)
     - Step 3: Vendor Selection (search and select vendors)
     - Step 4: Review & Submit (optional file attachments)
   - Validation at each step
   - File upload support for specifications
   - Auto-notification to selected vendors

3. **RFQ Detail View**
   - Complete RFQ information
   - Line items table
   - Invited vendors list
   - Quotation submission status per vendor
   - Approval timeline
   - Supporting documents download
   - Action buttons (role-based):
     - Submit Quote (Vendor)
     - Compare Quotes (Officer/Admin)
     - Close RFQ (Officer/Admin)

4. **RFQ Status Management**
   - OPEN: Accepting quotations
   - CLOSED: No longer accepting quotes
   - CANCELLED: RFQ cancelled (procurement not needed)

---
### 💰 Quotation Management Module

**Access:** Vendors (submit), Officers/Admin (evaluate)

**Features:**

1. **Quotation Submission** (Vendor)
   - View RFQ details and line items
   - Enter unit price for each item
   - Specify delivery date
   - Add notes/terms
   - Auto-calculated total amount
   - Update before deadline
   - Validation: all prices required, delivery date mandatory

2. **Quotation Comparison** (Officer/Admin)
   - Side-by-side comparison table
   - All quotations for an RFQ displayed
   - Column per vendor
   - Row per line item
   - Lowest price highlighted in green
   - Total amount comparison
   - Delivery date comparison
   - Vendor rating displayed
   - Select winning quotation button

3. **Selection Logic**
   - One quotation can be SELECTED per RFQ
   - Selecting creates approval request automatically
   - Status changes: SUBMITTED → SELECTED
   - Notification sent to vendor
   - Approval workflow triggered

**Quotation Statuses:**
- DRAFT: Work in progress (not implemented in current version)
- SUBMITTED: Quote submitted to buyer
- SELECTED: Chosen as winning bid
- REJECTED: Explicitly rejected after selection

---

### ✅ Approval Module

**Access:** Manager, Admin only

**Features:**

1. **Approval Queue**
   - List of all pending approvals
   - Display: RFQ title, vendor name, total amount, delivery date
   - Status badge (PENDING, APPROVED, REJECTED)
   - Click to view details

2. **Approval Detail View**
   - Split panel layout:
     - Left: List of approvals
     - Right: Selected approval details
   - Workflow timeline showing approval history
   - Quotation line items breakdown
   - Vendor information
   - Total amount calculation
   - Action buttons: Approve, Reject

3. **Approval Actions**
   - **Approve:**
     - Optional remarks field
     - Confirmation modal
     - Auto-generates Purchase Order
     - Updates status to APPROVED
     - Sends notification to vendor
   - **Reject:**
     - Reason field (recommended)
     - Confirmation modal
     - Updates status to REJECTED
     - Notifies procurement officer and vendor
     - Officer can select another quotation

**Business Logic:**
- Only one pending approval per quotation
- Decision is final (no undo)
- Approval triggers PO generation workflow
- Timeline tracks all approval activities

---

### 🛒 Purchase Order Module

**Access:** All roles (different permissions)

**Features:**

1. **PO List**
   - Filter by status (ALL, ISSUED, ACKNOWLEDGED, COMPLETED, CANCELLED)
   - Display: PO number, vendor, total amount, status, date
   - Paginated view (20 per page)
   - Search by PO number or vendor
   - Click to view details

2. **PO Detail View**
   - Split panel layout (list + detail)
   - PO number (auto-generated unique)
   - Vendor details
   - Issue date and delivery date
   - Line items table
   - Pricing breakdown:
     - Subtotal
     - GST (18% auto-calculated)
     - Total amount
   - Status badge
   - Action buttons:
     - Download PDF
     - Update Status (Officer/Admin only)
     - Print

3. **PO Status Management** (Officer/Admin)
   - Status update dropdown
   - Available transitions based on current status:
     - ISSUED → ACKNOWLEDGED, CANCELLED
     - ACKNOWLEDGED → COMPLETED, CANCELLED
   - Confirmation required for status change

4. **PO PDF Generation**
   - Professional PDF format
   - Company letterhead
   - All PO details included
   - Downloadable by all authorized users

**Business Logic:**
- PO auto-generated on approval
- PO number format: PO-YYYYMMDD-XXXX (sequential)
- GST calculated at 18%
- One PO per approved quotation
- Vendors can only view their own POs
- Status changes tracked in activity log

---

### 🧾 Invoice Module

**Access:** Officers/Admin (full), Manager/Vendor (read-only)

**Features:**

1. **Invoice List**
   - Filter by status (ALL, DRAFT, SENT, PAID, OVERDUE)
   - Display: Invoice number, PO number, vendor, total, status
   - Paginated view (20 per page)
   - Search functionality
   - Click to view details

2. **Invoice Generation** (Officer/Admin)
   - Select from ACKNOWLEDGED POs
   - Modal with PO selection dropdown
   - Auto-generates invoice with:
     - Unique invoice number
     - PO reference and line items
     - Vendor details
     - Pricing (subtotal, GST 18%, total)
     - Invoice date
   - Initial status: DRAFT

3. **Invoice Detail View**
   - Split panel layout (list + detail)
   - Invoice number and vendor name
   - Invoice date
   - PO reference number
   - Pricing breakdown (subtotal, tax, total)
   - Status badge
   - Action buttons:
     - Download PDF
     - Print (browser print)
     - Send Email (Officer/Admin)
     - Update Status (Officer/Admin)

4. **Invoice Actions** (Officer/Admin)
   - **Send Email:** Sends invoice PDF to vendor email
   - **Update Status:** Dropdown with options (PAID, OVERDUE)
   - **Download PDF:** Generates and downloads invoice PDF

**Business Logic:**
- Only ACKNOWLEDGED POs can generate invoices
- Invoice number format: INV-YYYYMMDD-XXXX
- One invoice per PO (no duplicates)
- GST calculated at 18%
- Email notifications on status changes
- Vendors have read-only access to their invoices

---

### 📈 Reports & Analytics Module

**Access:** Admin, Manager only

**Features:**

1. **Spend Trend Analysis**
   - Bar chart showing monthly procurement spend
   - Date range filter (from/to dates)
   - X-axis: Month (YYYY-MM format)
   - Y-axis: Total spend amount
   - Export to CSV functionality

2. **PO Count Trend**
   - Line chart showing monthly PO count
   - Overlayed with spend trend for comparison
   - Date range filter
   - Export to CSV

3. **Vendor Performance Report**
   - Table format with columns:
     - Vendor name
     - Total spend (lifetime)
     - Total POs issued
     - Win rate (% of quotations selected)
     - On-time delivery %
   - Visual progress bars for percentages
   - Sort by any column
   - Export to CSV

4. **Dashboard Statistics**
   - Pending approvals count
   - Active RFQs count
   - Monthly PO count
   - Total invoiced amount (monthly)
   - Quick links to respective modules

**Business Logic:**
- Data aggregated from historical transactions
- Date filters applied to all reports
- Vendor performance auto-calculated
- CSV exports include all data (not just visible)
- Charts responsive and interactive

---

### 📜 Activity Log Module

**Access:** Admin, Manager, Procurement Officer

**Features:**

1. **Activity Timeline**
   - Chronological list of all system activities
   - Filter by:
     - Activity type (RFQ created, Quote submitted, PO generated, etc.)
     - Date range
     - User
     - Module
   - Display: Timestamp, user, action, entity, details
   - Paginated view

2. **Audit Trail**
   - Complete history of all actions
   - User attribution (who did what)
   - Timestamp with timezone
   - Before/after values for updates
   - IP address logging (if implemented)

**Activity Types Logged:**
- User login/logout
- RFQ creation, update, closure
- Quotation submission, selection
- Approval decisions (approve/reject)
- PO status changes
- Invoice generation, status updates
- Vendor status changes
- Email notifications sent

**Business Logic:**
- All write operations logged automatically
- Read-only for all users (no deletion)
- Retention policy: unlimited (or configurable)
- Searchable and filterable
- Export capability for compliance

---

## Status Flow & State Management

### RFQ Status Flow

```
[OPEN] ──(close)──> [CLOSED]
  │
  └──(cancel)──> [CANCELLED]
```

**State Transitions:**
- **OPEN → CLOSED:** Manual action by Officer/Admin when deadline passed or sufficient quotes received
- **OPEN → CANCELLED:** Manual action when procurement no longer needed
- **CLOSED/CANCELLED:** Terminal states (no further transitions)

---

### Quotation Status Flow

```
[DRAFT] ──(submit)──> [SUBMITTED] ──(select)──> [SELECTED]
                           │
                           └──(reject)──> [REJECTED]
```

**State Transitions:**
- **DRAFT → SUBMITTED:** Vendor completes and submits quotation
- **SUBMITTED → SELECTED:** Officer/Admin selects as winning bid
- **SUBMITTED → REJECTED:** Explicit rejection (or timeout)
- **SELECTED:** Triggers approval workflow

---

### Approval Status Flow

```
[PENDING] ──(approve)──> [APPROVED] ──(auto)──> PO Generation
    │
    └──(reject)──> [REJECTED]
```

**State Transitions:**
- **PENDING → APPROVED:** Manager/Admin approves quotation
- **PENDING → REJECTED:** Manager/Admin rejects quotation
- **APPROVED:** Triggers automatic PO generation
- **REJECTED:** Returns to procurement officer for new selection

---

### Purchase Order Status Flow

```
[ISSUED] ──(acknowledge)──> [ACKNOWLEDGED] ──(complete)──> [COMPLETED]
   │                              │
   └──(cancel)──────────────────┬─┘
                                │
                          [CANCELLED]
```

**State Transitions:**
- **ISSUED → ACKNOWLEDGED:** Vendor confirms order acceptance
- **ACKNOWLEDGED → COMPLETED:** Goods/services delivered and verified
- **ISSUED → CANCELLED:** Order cancelled before acknowledgment
- **ACKNOWLEDGED → CANCELLED:** Order cancelled after acknowledgment
- **COMPLETED:** Enables invoice generation

---

### Invoice Status Flow

```
[DRAFT] ──(send)──> [SENT] ──(pay)──> [PAID]
                       │
                       └──(overdue)──> [OVERDUE] ──(pay)──> [PAID]
```

**State Transitions:**
- **DRAFT → SENT:** Invoice sent to vendor via email
- **SENT → PAID:** Payment processed and confirmed
- **SENT → OVERDUE:** Payment not received by due date
- **OVERDUE → PAID:** Late payment processed
- **PAID:** Terminal state (invoice closed)

---

### Vendor Status Management

```
[ACTIVE] ──(deactivate)──> [INACTIVE] ──(activate)──> [ACTIVE]
   │                                                      │
   └──(blacklist)──> [BLACKLISTED]                      │
                            │                             │
                            └──(reactivate)──────────────┘
```

**State Transitions:**
- **ACTIVE → INACTIVE:** Temporary suspension (performance issues, contract renewal)
- **INACTIVE → ACTIVE:** Reactivation after issue resolution
- **ACTIVE → BLACKLISTED:** Permanent ban (fraud, major violations)
- **BLACKLISTED → ACTIVE:** Rare case, requires admin approval

**Business Impact:**
- **ACTIVE:** Can receive RFQs, submit quotations, receive POs
- **INACTIVE:** Cannot participate in new RFQs, existing commitments honored
- **BLACKLISTED:** Complete exclusion from all procurement activities

---

## Access Control Matrix

### API Endpoint Permissions

| Endpoint | Admin | Manager | Procurement Officer | Vendor |
|----------|-------|---------|---------------------|--------|
| **Authentication** |
| POST /auth/login | ✅ | ✅ | ✅ | ✅ |
| POST /auth/register | ✅ | ✅ | ✅ | ✅ |
| POST /auth/logout | ✅ | ✅ | ✅ | ✅ |
| POST /auth/refresh | ✅ | ✅ | ✅ | ✅ |
| **Vendors** |
| GET /vendors | ✅ | ❌ | ✅ | ❌ |
| POST /vendors | ✅ | ❌ | ❌ | ❌ |
| GET /vendors/:id | ✅ | ❌ | ✅ | ❌ |
| PUT /vendors/:id | ✅ | ❌ | ❌ | ❌ |
| GET /vendors/:id/performance | ✅ | ❌ | ✅ | ❌ |
| **RFQs** |
| GET /rfq | ✅ | ✅ | ✅ | ✅* |
| POST /rfq | ✅ | ❌ | ✅ | ❌ |
| GET /rfq/:id | ✅ | ✅ | ✅ | ✅* |
| PUT /rfq/:id | ✅ | ❌ | ✅ | ❌ |
| POST /rfq/:id/close | ✅ | ❌ | ✅ | ❌ |
| **Quotations** |
| GET /rfq/:id/quotations | ✅ | ✅ | ✅ | ✅* |
| POST /rfq/:id/quotations | ❌ | ❌ | ❌ | ✅ |
| PUT /quotations/:id | ❌ | ❌ | ❌ | ✅ |
| POST /quotations/:id/select | ✅ | ❌ | ✅ | ❌ |
| **Approvals** |
| GET /approvals | ✅ | ✅ | ❌ | ❌ |
| GET /approvals/:id | ✅ | ✅ | ❌ | ❌ |
| POST /approvals/:id/approve | ✅ | ✅ | ❌ | ❌ |
| POST /approvals/:id/reject | ✅ | ✅ | ❌ | ❌ |
| **Purchase Orders** |
| GET /purchase-orders | ✅ | ✅ | ✅ | ✅* |
| GET /purchase-orders/:id | ✅ | ✅ | ✅ | ✅* |
| PUT /purchase-orders/:id/status | ✅ | ❌ | ✅ | ❌ |
| GET /purchase-orders/:id/pdf | ✅ | ✅ | ✅ | ✅* |
| **Invoices** |
| POST /invoices | ✅ | ❌ | ✅ | ❌ |
| GET /invoices | ✅ | ✅ | ✅ | ✅* |
| GET /invoices/:id | ✅ | ✅ | ✅ | ✅* |
| PUT /invoices/:id/status | ✅ | ❌ | ✅ | ❌ |
| GET /invoices/:id/pdf | ✅ | ✅ | ✅ | ✅* |
| POST /invoices/:id/send-email | ✅ | ❌ | ✅ | ❌ |
| **Reports** |
| GET /reports/spend-trend | ✅ | ✅ | ❌ | ❌ |
| GET /reports/vendor-performance | ✅ | ✅ | ❌ | ❌ |
| GET /reports/dashboard-stats | ✅ | ✅ | ✅ | ✅ |
| **Activity Logs** |
| GET /activity-logs | ✅ | ✅ | ✅ | ❌ |

**Note:** ✅* indicates access restricted to own records only (e.g., vendors can only see RFQs they're invited to)

---

### UI Route Permissions

| Route | Admin | Manager | Procurement Officer | Vendor |
|-------|-------|---------|---------------------|--------|
| /dashboard | ✅ | ✅ | ✅ | ✅ |
| /vendors | ✅ | ❌ | ✅ (read-only) | ❌ |
| /vendors/new | ✅ | ❌ | ❌ | ❌ |
| /vendors/:id | ✅ | ❌ | ✅ (read-only) | ❌ |
| /rfq | ✅ | ✅ | ✅ | ✅ |
| /rfq/new | ✅ | ❌ | ✅ | ❌ |
| /rfq/:id | ✅ | ✅ | ✅ | ✅* |
| /rfq/:id/quote | ❌ | ❌ | ❌ | ✅ |
| /rfq/:id/compare | ✅ | ❌ | ✅ | ❌ |
| /approvals | ✅ | ✅ | ❌ | ❌ |
| /purchase-orders | ✅ | ✅ | ✅ | ✅ |
| /invoices | ✅ | ✅ | ✅ | ✅ |
| /reports | ✅ | ✅ | ❌ | ❌ |
| /activity-log | ✅ | ✅ | ✅ | ❌ |

---

## Key Business Rules Summary

### General Rules
1. **Authentication Required:** All features require login
2. **Role-Based Access:** Each role has specific permissions
3. **Data Isolation:** Vendors can only see their own data
4. **Audit Trail:** All actions logged for compliance
5. **Email Notifications:** Automated at key workflow points

### RFQ Rules
- Minimum 1 vendor must be invited
- Minimum 1 line item required
- Deadline must be in the future
- Cannot modify after vendors start submitting quotes
- Closing is irreversible

### Quotation Rules
- Vendors can only quote on invited RFQs
- All line items must be priced
- Delivery date is mandatory
- Can update before RFQ deadline
- Total calculated automatically (unit_price × quantity)

### Approval Rules
- Only one approval per selected quotation
- Decision is final (no undo)
- Manager/Admin roles only
- Approval auto-generates PO
- Rejection allows reselection

### Purchase Order Rules
- Auto-generated on approval
- Unique PO number (sequential)
- GST calculated at 18%
- One PO per quotation
- Status updates tracked
- Cannot delete issued POs

### Invoice Rules
- Only ACKNOWLEDGED POs can generate invoices
- One invoice per PO (no duplicates)
- Unique invoice number
- GST at 18%
- Email notification on generation
- Status updates restricted to Officer/Admin

### Vendor Management Rules
- Unique email per vendor
- Category from predefined list
- BLACKLISTED vendors excluded from new RFQs
- Performance metrics auto-calculated
- Only Admin can change status

### Notification Rules
- **RFQ Created:** Notify invited vendors
- **Quotation Submitted:** Notify procurement officer
- **Quotation Selected:** Notify vendor and manager
- **Approval Decision:** Notify procurement officer and vendor
- **PO Generated:** Notify vendor
- **Invoice Generated:** Notify vendor
- **Status Changes:** Notify relevant stakeholders

---

## Calculation & Formula Logic

### Quotation Total Calculation
```
Total = Σ(unit_price × quantity) for all line items
```

### Purchase Order Amount Calculation
```
Subtotal = Σ(unit_price × quantity)
GST (18%) = Subtotal × 0.18
Total Amount = Subtotal + GST
```

### Invoice Amount Calculation
```
Subtotal = Σ(unit_price × quantity) from PO items
Tax Amount (GST 18%) = Subtotal × 0.18
Total = Subtotal + Tax Amount
```

### Vendor Performance Metrics

**Win Rate:**
```
Win Rate (%) = (Number of Selected Quotations / Total Quotations Submitted) × 100
```

**On-Time Delivery Percentage:**
```
On-Time % = (POs Delivered On/Before Date / Total Completed POs) × 100
```

**Total Spend:**
```
Total Spend = Σ(PO Total Amount) for all completed POs with vendor
```

### Dashboard Metrics

**Monthly PO Count:**
```
Count of POs where created_date is in current month
```

**Total Invoiced (Monthly):**
```
Σ(Invoice Total) where invoice_date is in current month AND status IN ('SENT', 'PAID')
```

**Pending Approvals:**
```
Count of approvals where status = 'PENDING'
```

**Active RFQs:**
```
Count of RFQs where status = 'OPEN'
```

---

## Integration & Extension Points

### Email Notification System
- **Trigger Points:** RFQ creation, quotation submission, approval decisions, PO generation, invoice creation
- **Recipients:** Dynamic based on workflow context
- **Templates:** Role-specific email templates
- **Delivery:** Asynchronous via message queue (recommended)

### File Upload & Storage
- **Supported:** RFQ attachments (specifications, drawings, etc.)
- **Storage:** Cloud storage (S3) or local file system
- **Security:** Access control based on user role
- **Formats:** PDF, DOC, DOCX, XLS, XLSX, images

### PDF Generation
- **Documents:** Purchase Orders, Invoices
- **Layout:** Professional template with company branding
- **Content:** All relevant transaction details
- **Download:** Available to authorized roles

### Real-time Updates (WebSocket)
- **Purpose:** Live notifications, status updates
- **Implementation:** Socket.io or similar
- **Events:** New RFQ, quote submitted, approval decision, PO issued
- **Benefits:** Reduced page refresh, better UX

### Export Functionality
- **Reports:** CSV export for spend trends, vendor performance
- **Data:** Complete dataset (not just visible records)
- **Use Cases:** Excel analysis, data warehousing, compliance reporting

---

## Security Considerations

### Authentication & Authorization
- **JWT-based:** Access and refresh tokens
- **Token Expiry:** Configurable (default: 1h access, 7d refresh)
- **Role Verification:** Backend middleware validates roles
- **Session Management:** Secure token storage (httpOnly cookies or localStorage)

### Data Access Control
- **Row-Level Security:** Vendors see only their data
- **Role-Based Permissions:** Enforced at API and UI levels
- **Audit Logging:** All actions logged with user attribution

### Input Validation
- **Frontend:** React Hook Form with Zod validation
- **Backend:** Express validators or similar
- **Sanitization:** Prevent XSS, SQL injection

### File Upload Security
- **Type Validation:** Whitelist allowed file types
- **Size Limits:** Max file size enforced
- **Virus Scanning:** Recommended for production
- **Storage:** Secure, access-controlled storage

### API Rate Limiting
- **Protection:** Prevent abuse and DoS attacks
- **Implementation:** Redis-based rate limiter
- **Limits:** Per endpoint, per user/IP

---

## Future Enhancement Opportunities

### Phase 2 Features
1. **Multi-Currency Support:** Handle international vendors
2. **Advanced Negotiations:** Back-and-forth quote negotiations
3. **Contract Management:** Store and track vendor contracts
4. **Budget Tracking:** Department-wise budget management
5. **Purchase Requisitions:** Employee request → approval → RFQ flow
6. **Vendor Portal:** Dedicated self-service portal for vendors
7. **Mobile App:** iOS/Android apps for on-the-go access
8. **Advanced Analytics:** Predictive analytics, spend forecasting
9. **Integration:** ERP integration (SAP, Oracle, etc.)
10. **Automated Matching:** AI-powered vendor-RFQ matching

### Technical Improvements
1. **Caching:** Redis cache for frequent queries
2. **Search:** Elasticsearch for advanced search
3. **Batch Operations:** Bulk RFQ creation, mass email
4. **Workflow Engine:** Configurable approval workflows
5. **API Documentation:** Swagger/OpenAPI docs
6. **Webhooks:** External system notifications
7. **Performance Optimization:** Database indexing, query optimization
8. **Monitoring:** Application performance monitoring (APM)

---

## Technology Stack Overview

### Frontend
- **Framework:** React 18+ with Vite
- **Routing:** React Router v6
- **State Management:** Zustand (auth), React Query (server state)
- **Forms:** React Hook Form + Zod validation
- **UI Components:** Custom components + shadcn/ui inspired
- **Styling:** Tailwind CSS with custom design system
- **Charts:** Recharts for data visualization
- **HTTP Client:** Axios

### Backend (Inferred)
- **Runtime:** Node.js
- **Framework:** Express.js (likely)
- **Database:** PostgreSQL (likely, based on Prisma hints)
- **ORM:** Prisma (inferred from client structure)
- **Authentication:** JWT
- **File Upload:** Multer or similar
- **Email:** Nodemailer or SendGrid
- **PDF Generation:** PDFKit or Puppeteer

### Infrastructure
- **Web Server:** Nginx or similar
- **Database:** PostgreSQL
- **Cache:** Redis (recommended)
- **Storage:** AWS S3 or local filesystem
- **Deployment:** Docker containers (recommended)

---

## Glossary

**RFQ (Request for Quotation):** A procurement document requesting price quotes from vendors for specific goods/services.

**Quotation:** Vendor's response to an RFQ with pricing and delivery terms.

**Approval:** Management review and authorization of a selected quotation before PO generation.

**Purchase Order (PO):** Official order document issued to vendor after approval.

**Invoice:** Bill sent by vendor (or generated by system) for delivered goods/services.

**Line Item:** Individual product/service entry in an RFQ or quotation.

**GST (Goods and Services Tax):** 18% tax applied to procurement transactions.

**Win Rate:** Percentage of vendor's quotations that are selected.

**Vendor Performance:** Metrics tracking vendor quality, delivery, and pricing.

**Acknowledgment:** Vendor's confirmation of PO acceptance.

**Approval Queue:** List of quotations pending management approval.

**Status Badge:** Visual indicator of document/transaction state.

---

## Document Version

**Version:** 1.0  
**Last Updated:** June 6, 2026  
**Author:** System Analysis based on VendorBridge codebase  
**Status:** Current

---

## Appendix: Common User Scenarios

### Scenario 1: Creating and Awarding an RFQ (Happy Path)

**Actors:** Procurement Officer, Vendors, Manager

**Steps:**
1. Officer logs in and navigates to RFQ module
2. Clicks "Create RFQ" button
3. Fills out RFQ details in wizard:
   - Step 1: Title "Office Furniture Q3 2024", deadline: 2024-09-30
   - Step 2: Adds 3 line items (desks, chairs, filing cabinets)
   - Step 3: Selects 5 active vendors from furniture category
   - Step 4: Reviews and submits
4. System sends email notifications to 5 vendors
5. Vendors log in over next week and submit quotations
6. Vendor A: ₹500,000, delivery: 30 days
7. Vendor B: ₹480,000, delivery: 45 days
8. Vendor C: ₹520,000, delivery: 25 days
9. Officer uses compare feature to analyze quotes
10. Officer selects Vendor B (best overall value)
11. System creates approval request for Manager
12. Manager receives notification, reviews quotation
13. Manager approves with remark "Excellent value proposition"
14. System auto-generates PO (PO-20240820-001)
15. Vendor B receives PO via email
16. Vendor B acknowledges PO
17. Officer updates PO status to ACKNOWLEDGED
18. 45 days later, furniture delivered
19. Officer verifies delivery and updates PO to COMPLETED
20. Officer generates invoice for Vendor B
21. Invoice sent to vendor, status: SENT
22. Finance processes payment
23. Officer marks invoice as PAID
24. **Process complete** ✅

**Duration:** ~60 days from RFQ to payment

---

### Scenario 2: Quotation Rejection and Reselection

**Actors:** Procurement Officer, Vendor, Manager

**Steps:**
1. Officer creates RFQ for IT equipment
2. 3 vendors submit quotations
3. Officer selects Vendor X (lowest price)
4. Manager reviews and notices:
   - Vendor X has poor rating (2.5/5)
   - Delivery time too long (90 days)
   - Recent complaints about quality
5. Manager rejects with remarks: "Please select vendor with better track record"
6. System notifies officer of rejection
7. Officer reviews comparison again
8. Selects Vendor Y (slightly higher price but 4.5 rating, 30-day delivery)
9. New approval request created
10. Manager approves
11. PO generated for Vendor Y
12. **Process continues normally**

**Lesson:** Price isn't the only factor; quality and reliability matter

---

### Scenario 3: Vendor Performance Tracking

**Actors:** Admin, Procurement Officer

**Context:** Reviewing quarterly vendor performance

**Steps:**
1. Admin navigates to Reports module
2. Views Vendor Performance report
3. Observes metrics for all active vendors:
   - Vendor A: Total spend ₹5M, 25 POs, 80% win rate, 95% on-time delivery ⭐
   - Vendor B: Total spend ₹2M, 15 POs, 60% win rate, 70% on-time delivery ⚠️
   - Vendor C: Total spend ₹1M, 8 POs, 40% win rate, 50% on-time delivery ❌
4. Admin exports CSV for further analysis
5. Decision: 
   - Vendor A: Maintain ACTIVE status, preferred vendor
   - Vendor B: Keep ACTIVE but monitor closely
   - Vendor C: Change to INACTIVE, schedule performance review meeting
6. Admin updates Vendor C status to INACTIVE
7. Vendor C excluded from new RFQs until improvement

**Outcome:** Data-driven vendor management decisions

---

### Scenario 4: Emergency RFQ Closure

**Actors:** Procurement Officer

**Context:** Budget constraints or requirement change

**Steps:**
1. Officer creates RFQ for marketing materials
2. Invites 4 vendors with 2-week deadline
3. After 1 week, 2 vendors have submitted quotes
4. Budget gets cut due to company-wide cost reduction
5. Officer needs to cancel procurement
6. Officer opens RFQ detail page
7. Clicks "Close RFQ" button
8. Confirms closure in modal dialog
9. RFQ status changes to CLOSED
10. System prevents further quotation submissions
11. Email notifications sent to remaining vendors
12. Existing quotations preserved for future reference
13. No PO generated

**Note:** Closing is different from cancelling; closed RFQs can be referenced later

---

## Contact & Support

For questions about this documentation or the VendorBridge system:

**Technical Support:** support@vendorbridge.com  
**Business Inquiries:** sales@vendorbridge.com  
**Documentation Updates:** Submit via internal wiki or dev team

---

**End of Document**
