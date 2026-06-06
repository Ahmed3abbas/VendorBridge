# VendorBridge — B2B Procurement ERP System | Stitch AI Prompt

---

## Project Overview

**Application Name:** VendorBridge  
**Type:** Enterprise Resource Planning (ERP) — Procurement & Vendor Management Module  
**Platform:** Responsive Web Application (Desktop-first, tablet & mobile adaptive)  
**Target Users:** Procurement Officers, Finance Managers, Admins, and Vendor Representatives  
**Industry Context:** B2B procurement for mid-to-large enterprises operating in India (GST-compliant, INR currency)

---

## Global Design System

### Visual Language
- **Design Style:** Modern enterprise SaaS — clean, professional, and data-dense without feeling cluttered. Inspired by tools like SAP Ariba, Coupa, and Zoho Inventory but with a more contemporary, polished aesthetic.
- **Theme:** Dark mode primary (deep charcoal/near-black backgrounds `#0F1117`) with crisp white text, subtle card elevations, and accent-driven highlights. Support a light mode toggle in the top navbar.
- **Border Radius:** 8px for cards, 6px for inputs and buttons, 12px for modals.
- **Elevation:** Use subtle box-shadows (`0 1px 3px rgba(0,0,0,0.3)`) on cards; avoid heavy drop shadows.

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#0F1117` | Page background |
| `--bg-surface` | `#1A1D27` | Cards, panels, sidebar |
| `--bg-surface-hover` | `#242836` | Hovered rows, interactive surfaces |
| `--border-subtle` | `#2A2E3A` | Dividers, card borders, table lines |
| `--text-primary` | `#F1F3F5` | Headings, primary labels |
| `--text-secondary` | `#9CA3AF` | Subtitles, descriptions, muted text |
| `--accent-green` | `#22C55E` | Active states, success badges, sidebar highlight, primary CTA |
| `--accent-blue` | `#3B82F6` | Links, informational badges, stepper active |
| `--accent-amber` | `#F59E0B` | Warnings, pending statuses |
| `--accent-red` | `#EF4444` | Errors, blocked status, overdue indicators |
| `--accent-teal` | `#14B8A6` | Charts, secondary data viz accent |

### Typography
- **Font Family:** `Inter` (Google Fonts) — fallback: `system-ui, -apple-system, sans-serif`
- **Headings:** 
  - H1: 28px / 700 weight (page titles)
  - H2: 20px / 600 weight (section titles)
  - H3: 16px / 600 weight (card titles, table headers)
- **Body:** 14px / 400 weight
- **Caption/Meta:** 12px / 400 weight, `--text-secondary` color
- **Monospace (for IDs, GSTIN, PO numbers):** `JetBrains Mono` or `Fira Code`, 13px

### Iconography
- Use a consistent icon set such as **Lucide Icons** or **Phosphor Icons** (outline style, 20px default).
- Icons should appear alongside navigation labels, action buttons, status badges, and KPI cards.

### Spacing & Grid
- **Sidebar width:** 240px (collapsible to 64px icon-only mode)
- **Content area padding:** 32px
- **Card gap:** 16px–24px
- **Table row height:** 48px
- **Input height:** 40px

---

## Global Layout Shell (Screens 3–11)

All authenticated screens (3 through 11) share a **persistent layout shell** consisting of:

### Top Navigation Bar
- **Height:** 56px
- **Background:** Slightly elevated surface (`#141720`) with a subtle bottom border.
- **Left:** Application logo/wordmark **"VendorBridge"** in bold white text with a small green accent square/icon before the name.
- **Right:** 
  - Light/Dark mode toggle (sun/moon icon)
  - Notification bell icon with a red dot badge for unread items
  - User avatar circle (initials or profile photo) with a dropdown menu on click (Profile, Settings, Logout)

### Left Sidebar Navigation
- **Background:** `--bg-surface` (`#1A1D27`)
- **Width:** 240px fixed, with a collapse toggle at the bottom.
- **Navigation Items (top-to-bottom):**
  1. Dashboard (grid/home icon)
  2. Vendors (building/store icon)
  3. RFQ's (file-text/clipboard icon)
  4. Quotations (file-check/receipt icon)
  5. Approvals (check-circle/shield icon)
  6. Purchase Orders (shopping-cart/package icon)
  7. Invoices (file-invoice/receipt icon)
  8. Reports (bar-chart/pie-chart icon)
  9. Activity (clock/activity icon)
- **Active State:** The active navigation item has a green left border highlight (3px, `--accent-green`) and a slightly lighter background (`--bg-surface-hover`). The text turns white and bold.
- **Hover State:** Background shifts to `--bg-surface-hover`, text brightens.
- **Collapsed State:** Only icons visible, with tooltips on hover showing the label.

### Content Area
- **Background:** `--bg-primary`
- **Layout:** Scrollable main content pane to the right of the sidebar.
- **Breadcrumb (optional):** Small breadcrumb trail below the top bar for nested views (e.g., `RFQ's > Create RFQ`).

---

## Screen 1 — Login

### Purpose
Secure authentication entry point for all VendorBridge users.

### Layout
- **Full-page centered layout** — no sidebar or top bar.
- **Background:** Dark gradient or subtle abstract mesh pattern using `--bg-primary` tones.
- **Login Card:** Centered vertically and horizontally. Max-width: 420px. Background: `--bg-surface`. Border: 1px `--border-subtle`. Border-radius: 12px. Padding: 40px.

### Components (top to bottom within the card)
1. **Application Logo:** VendorBridge logo or wordmark centered at the top. If no logo, use a stylized "VB" monogram in a green-accented circle (64px diameter).
2. **Spacing:** 32px
3. **Username/Email Field:**
   - Label: "Email Address" (12px, `--text-secondary`, uppercase tracking)
   - Input: Full width, placeholder "you@company.com"
   - Left icon: Mail icon inside the input
4. **Spacing:** 16px
5. **Password Field:**
   - Label: "Password"
   - Input: Full width, placeholder "Enter your password"
   - Left icon: Lock icon
   - Right icon: Eye/eye-off toggle for password visibility
6. **Spacing:** 8px
7. **Forgot Password Link:** Right-aligned, small text, `--accent-blue` color. Text: "Forgot password?"
8. **Spacing:** 24px
9. **Login Button:** Full width, height 44px, background `--accent-green`, white bold text "Sign In", rounded 6px. Hover: slightly lighter green. Loading state: spinner replaces text.
10. **Spacing:** 16px
11. **Registration Link:** Center-aligned text: "Don't have an account? **Register here**" — "Register here" is `--accent-blue` and clickable, navigates to Screen 2.

### Interactions
- Form validation on submit: highlight empty/invalid fields with red border and error message below each field.
- Successful login navigates to Screen 3 (Dashboard).
- Support "Enter" key to submit the form.

---

## Screen 2 — Registration

### Purpose
Self-service user registration for new procurement officers and vendor contacts.

### Layout
- **Full-page centered layout** — no sidebar or top bar.
- **Registration Card:** Centered. Max-width: 560px. Same card styling as Login. Padding: 40px.

### Components (top to bottom)
1. **Avatar Upload Area:** 
   - Circular placeholder (80px diameter) with a camera/upload icon overlay.
   - Click to open file picker for profile photo.
   - Label below: "Upload Photo" (12px, `--text-secondary`)
2. **Spacing:** 24px
3. **Two-Column Row:**
   - **First Name** (left) — required, placeholder "Enter first name"
   - **Last Name** (right) — required, placeholder "Enter last name"
4. **Two-Column Row:**
   - **Email Address** (left) — required, placeholder "you@company.com", with email validation
   - **Phone Number** (right) — required, placeholder "+91 98765 43210", with country code prefix selector
5. **Two-Column Row:**
   - **Role** (left) — Dropdown select with options: "Procurement Officer", "Finance Manager", "Admin", "Vendor Representative"
   - **Country** (right) — Searchable dropdown, default "India"
6. **Full-Width Field:**
   - **Additional Information** — Textarea (3 rows), placeholder "Department, designation, or any relevant details..."
7. **Spacing:** 24px
8. **Register Button:** Full width, `--accent-green`, white text "Create Account". Same styling as login button.
9. **Spacing:** 12px
10. **Login Link:** Center-aligned: "Already have an account? **Sign in**" — navigates to Screen 1.

### Interactions
- Client-side validation: all required fields validated before submission.
- Email uniqueness check (show inline error if already registered).
- On successful registration, show a success toast/notification and redirect to login.

---

## Screen 3 — Dashboard (Main Landing Page)

### Purpose
Executive overview of the procurement pipeline — KPIs, recent activity, spending trends, and quick-action shortcuts.

### Page Header
- **Title:** "Dashboard" (H1)
- **Subtitle:** "Welcome back, Procurement Officer — Today's Overview" (14px, `--text-secondary`)

### Section 1: KPI Summary Cards
- **Layout:** 4 cards in a single horizontal row (equal width, responsive — 2x2 on tablet, stacked on mobile).
- **Card Style:** `--bg-surface` background, 1px `--border-subtle` border, 16px padding.
- **Each card contains:**
  - A large numeric value (28px, bold, color-coded per KPI)
  - A descriptive label below (12px, `--text-secondary`)
  - A subtle icon in the top-right corner of the card

| KPI | Value | Color | Icon |
|---|---|---|---|
| Active RFQ's | 12 | `--accent-blue` | FileText |
| Pending Approvals | 5 | `--accent-amber` | Clock |
| PO's This Month | ₹2.3L | `--accent-green` | ShoppingCart |
| Overdue Invoices | 3 | `--accent-red` | AlertTriangle |

### Section 2: Recent Purchase Orders
- **Section Title:** "Recent Purchase Orders" (H2)
- **Component:** Data table with 4 columns.
- **Table Style:** `--bg-surface` background, header row with `--bg-surface-hover` background and `--text-secondary` text. Body rows alternate subtly or use hover highlight.

| Column | Sample Row 1 | Sample Row 2 | Sample Row 3 |
|---|---|---|---|
| PO# | PO-001 | PO-002 | PO-003 |
| Vendor | Infra Supplies | Tech Core LTD | OfficeNeed Co. |
| Amount (₹) | 87,000 | 1,40,000 | 34,900 |
| Status | Approved *(green badge)* | Pending *(amber badge)* | Draft *(gray badge)* |

- Status column uses colored pill badges.

### Section 3: Spending Trends — Last 6 Months
- **Section Title:** "Spending Trends — Last 6 Months" (H2)
- **Layout:** Positioned to the right of the Recent PO table (side-by-side on desktop).
- **Charts (use chart.js or recharts style):**
  - **Pie/Donut Chart:** Spend by category (IT, Furniture, Logistics, Stationery) with a legend.
  - **Line Chart:** Monthly spend trend line (Dec–May) with data points.
  - **Bar Chart:** Monthly PO count comparison.
- Charts should be clean and readable with `--accent-green`, `--accent-blue`, `--accent-teal`, and `--accent-amber` as the data series colors.

### Section 4: Quick Actions
- **Layout:** 3 action buttons in a horizontal row, separated by a subtle top divider line.
- **Button Style:** Outlined/ghost buttons with icons. Border: 1px `--border-subtle`. Hover: fill with `--bg-surface-hover`.

| Button | Icon | Action |
|---|---|---|
| + New RFQ | FilePlus | Navigate to Screen 5 |
| Add Vendor | UserPlus | Open Add Vendor modal/Navigate to vendor form |
| View Invoices | FileText | Navigate to Invoices section |

---

## Screen 4 — Vendors List

### Purpose
Central registry to browse, search, filter, and manage all supplier/vendor profiles.

### Page Header
- **Title:** "Vendors" (H1)
- **Subtitle:** "Manage supplier profiles and registrations" (14px, `--text-secondary`)
- **Top-Right CTA:** `+ Add Vendor` button — solid `--accent-green` background, white text, with a Plus icon.

### Search Bar
- Full-width input below the header (within the content area).
- **Placeholder text:** "Search by name, GST number, category..."
- **Left icon:** Search (magnifying glass)
- **Right (optional):** Filter icon button to open advanced filters.

### Filter Tabs
- Horizontal tab bar below the search:

| Tab | Count |
|---|---|
| All | 28 |
| Active | 21 |
| Pending | 4 |
| Blocked | 3 |

- **Active tab** has a green bottom border and white text. Inactive tabs are `--text-secondary`.

### Vendor Data Table
- **Columns:**

| Column | Description | Width |
|---|---|---|
| Vendor Name | Company name | 20% |
| Category | e.g., Constructions, IT, Logistics | 15% |
| GST No. | Indian GSTIN format (e.g., 27AABCS1429B1Z0) | 20%, monospace font |
| Contact No. | Phone number | 15% |
| Status | Active / Pending / Blocked | 15% |
| Action | "View" button | 15% |

- **Sample Data:**

| Vendor Name | Category | GST No. | Contact No. | Status | Action |
|---|---|---|---|---|---|
| Infra Supplies Pvt Ltd | Constructions | 27AABCS1429B1Z0 | +91 98765 43210 | Active *(green badge)* | View |
| Tech Core LTD | IT | 27AABCS1429B2Z0 | +91 87654 32109 | Active *(green badge)* | View |
| FastLog Transport | Logistics | 27AABCS1429B3Z0 | +91 76543 21098 | Blocked *(red badge)* | View |

- **Status Badges:** Pill-shaped, color-coded (Green = Active, Amber = Pending, Red = Blocked).
- **"View" Button:** Small outlined button, navigates to a vendor detail page (not wireframed, but should feel clickable).
- **Pagination:** Show pagination controls at the bottom (Previous / Page numbers / Next) or infinite scroll with a "Load more" footer.

---

## Screen 5 — Create RFQ (Request for Quotation)

### Purpose
Multi-step form to create and send a new Request for Quotation to selected vendors.

### Page Header
- **Title:** "Create RFQ" (H1)
- **Subtitle:** "New request for quotation" (14px, `--text-secondary`)

### Multi-Step Stepper
- Horizontal stepper with 3 steps, showing progress.
- **Step indicators:** Numbered circles (1, 2, 3) connected by horizontal lines.
  - **Completed step:** Green filled circle with a checkmark, green line.
  - **Active/Current step:** Blue filled circle with the number, gray line ahead.
  - **Upcoming step:** Gray outlined circle.
- **Step Labels (below each circle):** Step 1: "RFQ Details", Step 2: "Line Items & Vendors", Step 3: "Review & Submit"

### Form Content — Two-Column Layout

**Left Column (RFQ Details):**

| Field | Type | Sample Value |
|---|---|---|
| RFQ Title* | Text input | "Office Furniture Procurement Q2" |
| Category | Dropdown | "Furniture" (options: IT, Furniture, Stationery, Logistics, etc.) |
| Deadline* | Date picker | "15 June 2025" |
| Description | Textarea (4 rows) | "Ergonomic chairs and standing desks for 3rd floor" |

**Right Column (Line Items & Vendors):**

**Line Items Table:**

| Item | Qty | Unit |
|---|---|---|
| Ergonomic Chair | 25 | NOS |
| Standing Desks | 10 | NOS |

- `+ Add Line Item` link/button below the table to append a new row.
- Each row has a delete (trash) icon on hover.

**Assign Vendors Section:**
- **Label:** "ASSIGN VENDORS" (12px, uppercase, `--text-secondary`)
- Listed vendors appear as removable chip/tags:
  - "Infra Supplies Pvt Ltd" ✕
  - "Techcore LTD" ✕
- `+ Add Vendor` link to open a vendor search/select dropdown.

**Attachments Section:**
- **Label:** "Attachments"
- Drag-and-drop zone: Dashed border, centered text "Drag & drop files or click to upload", with an Upload icon.
- Show uploaded file names with size and a remove button.

### Action Buttons (bottom-left)
- **Primary:** "Save & Send to Vendors" — `--accent-green` solid button. Triggers sending the RFQ to all assigned vendors.
- **Secondary:** "Save as Draft" — outlined/ghost button. Saves without sending.

---

## Screen 6 — Submit Quotation (Vendor Response)

### Purpose
Vendors use this screen to respond to an RFQ by submitting their pricing, delivery timelines, and terms.

### Page Header
- **Title:** "Submit Quotation" (H1)
- **Subtitle:** "RFQ: Office Furniture Procurement Q2 — Deadline: 15 June 2025" (14px, `--text-secondary`)

### RFQ Summary Card
- A read-only summary card at the top with a light info background (`--bg-surface` + left blue accent border).
- **Label:** "RFQ Summary"
- **Content:** "Ergonomic Chair × 25, Standing Desk × 10 — Category: Furniture"

### Quotation Table — "Your Quotation"
- **Section Title:** "Your Quotation" (H2)
- **Editable table** where the vendor fills in pricing:

| Column | Type | Row 1 | Row 2 |
|---|---|---|---|
| Item | Read-only text | Ergonomic Chair | Standing Desk |
| Qty | Read-only number | 25 | 10 |
| Unit Price (₹) | Editable input | 3,500 | 8,200 |
| Total (₹) | Auto-calculated | 87,500 | 82,000 |
| Delivery (Days) | Editable input | 7 | 14 |

### Tax & Terms Section (below the table, two-column)

**Left Column:**
- **Tax / GST %:** Input field, pre-filled "18" with "%" suffix.
- **Note / Terms:** Textarea (3 rows), placeholder "Payment terms, conditions..."  
  Sample: "Payment terms: 20 days net..."

**Right Column — Pricing Summary:**
- Read-only calculated summary card:

| Label | Value |
|---|---|
| Subtotal | ₹1,69,500 |
| GST (18%) | ₹30,510 |
| **Grand Total** | **₹2,00,010** |

- Grand Total should be visually emphasized (larger font, bold, or highlighted background).

### Action Buttons
- **Primary:** "Submit Quotation" — `--accent-green` solid button.
- **Secondary:** "Save Draft" — outlined button.

---

## Screen 7 — Quotation Comparison

### Purpose
Side-by-side comparison of all received vendor quotations for a specific RFQ, enabling the procurement officer to evaluate and select the best vendor.

### Page Header
- **Title:** "Quotation Comparison" (H1)
- **Subtitle:** "RFQ: Office Furniture Procurement Q2 — 3 quotations received" (14px, `--text-secondary`)

### Comparison Table
- **Layout:** A matrix/grid table comparing vendors across key criteria.
- **First column** lists the criteria labels. Each subsequent column represents a vendor.

| Criteria | Infra Supplies *(Lowest)* | Techcore LTD | Office Need Co. |
|---|---|---|---|
| Grand Total (₹) | **1,85,000** | 2,00,010 | 2,19,800 |
| GST % | 18 | 18 | 18 |
| Delivery (Days) | 10 | 14 | 7 |
| Vendor Rating | 4.5/5 ⭐ | 4.2/5 ⭐ | 3.8/5 ⭐ |
| Payment Terms | 30 days | 30 days | 15 days |

- **Lowest/Best Vendor Column:** The column with the lowest grand total should be visually highlighted with a green background tint or a green header badge reading "Lowest". The column header should read the vendor name + "(Lowest)" tag.
- **Other columns:** Standard `--bg-surface` styling.

### Selection Buttons (below each vendor column)
- **Lowest vendor:** "Select & Approve" — `--accent-green` solid button.
- **Other vendors:** "Select" — outlined/secondary button.

### Footer Note
- Informational note at the bottom in `--text-secondary`:  
  *"Selecting a vendor initiates the approval workflow."*

---

## Screen 8 — Approval Workflow

### Purpose
Multi-level approval pipeline for a selected vendor quotation before a Purchase Order is generated.

### Page Header
- **Title:** "Approval Workflow" (H1)
- **Subtitle:** "RFQ: Office Furniture Q2 — Vendor: Infra Supplies — ₹1,85,400" (14px, `--text-secondary`)

### Workflow Stepper (Horizontal, 4 Steps)
| Step | Label | State |
|---|---|---|
| 1 | Submitted | Completed (green circle + checkmark) |
| 2 | L1 Review | Completed (green circle + checkmark) |
| 3 | L2 Approval | Active/Current (blue circle, pulsing or highlighted) |
| 4 | Generate PO | Upcoming (gray outlined circle) |

- Lines between completed steps are green; the line from active to upcoming is gray/dashed.

### Two-Column Content

**Left Column — Approval Chain:**
- **Section Title:** "APPROVAL CHAIN" (12px, uppercase, `--text-secondary`)
- **Approver 1:** 
  - Avatar circle (initials "RM") + Name: **Rahul Mehta** (Procurement Head)
  - Status: "Approved on May 30, 10:32 AM" — green checkmark icon
- **Approver 2:**
  - Avatar circle (initials "PS") + Name: **Priya Shah** (Finance Manager)
  - Status: "Awaiting Approval" — amber clock icon, pulsing dot animation
- **Approval Remarks:**
  - Textarea input: "Add your comments or conditions..."

**Right Column — Quotation Summary Card:**
- **Section Title:** "QUOTATION SUMMARY" (12px, uppercase)
- Read-only summary:

| Field | Value |
|---|---|
| Vendor | Infra Supplies Pvt Ltd |
| Total (₹) | 1,85,400 |
| Delivery | 10 Days |
| Rating | 4.5/5 ⭐ |

### Action Buttons (bottom of the page)
- **Approve:** `--accent-green` solid button with a checkmark icon.
- **Reject:** `--accent-red` outlined button with an X icon.
- Both buttons should trigger a confirmation modal before executing.

---

## Screen 9 — Purchase Order & Invoice

### Purpose
Auto-generated Purchase Order document with full invoice details, printable and exportable.

### Page Header
- **Title:** "Purchase Order & Invoice" (H1)
- **Subtitle:** "PO-2025-0068 — Auto-generated after approval" (14px, `--text-secondary`, monospace for PO number)
- **Top-Right Action Buttons (3 buttons, outlined style):**
  - 📄 "Download PDF"
  - 🖨️ "Print"
  - ✉️ "Email Invoice"

### Document Card (styled like a formal invoice/PO document)
- **Background:** White (`#FFFFFF`) or very light surface for document-like feel inside the dark UI.
- **Text color:** Dark text on this white card for print readability.
- **Border:** 1px subtle border, slight shadow for a floating document effect.

**Header Section (two columns inside the document card):**

| Bill To | Vendor |
|---|---|
| Your Organization Name | Infra Supplies Pvt Ltd |
| 123 Business Park, Ahmedabad | 456, Industrial Estate, Surat |
| GSTIN: 25383438AFB *(monospace)* | GSTIN: 343434DB4523 *(monospace)* |

**Reference Details:**

| Field | Value |
|---|---|
| PO Number | PO-2025-0068 |
| PO Date | 21 May, 2025 |
| Invoice Date | 22 May, 2025 |
| Due Date | 21 June, 2025 |

**Line Items Table:**

| Item | Qty | Unit Price (₹) | Total (₹) |
|---|---|---|---|
| Ergonomic Chair | 25 | 3,500 | 87,500 |
| Standing Desk (Tech Core LTD) | 10 | 8,200 | 82,000 |

**Totals Section (right-aligned):**

| | Amount (₹) |
|---|---|
| Subtotal | 1,69,500 |
| CGST (9%) | 15,255 |
| SGST (9%) | 15,255 |
| **Grand Total** | **₹2,00,010** |

### Payment Status Footer (below the document card)
- **Status Badge:** "Pending Payment" — amber/orange pill badge.
- **Action Link:** "Mark as Paid" — `--accent-green` text link. Clicking opens a confirmation dialog.

---

## Screen 10 — Activity & Logs

### Purpose
Immutable audit trail of all procurement activities — ensures compliance and traceability.

### Page Header
- **Title:** "Activity & Logs" (H1)
- **Subtitle:** "Procurement audit trail" (14px, `--text-secondary`)

### Filter Tabs
- Horizontal pill-shaped filter buttons:

| Tab | State |
|---|---|
| All | Active (filled `--accent-green` background, white text) |
| RFQ | Inactive |
| Approvals | Inactive |
| Invoices | Inactive |
| Vendors | Inactive |

### Activity Timeline
- Vertical timeline with a thin line running along the left side.
- Each entry is a card-like row:

**Entry Structure:**
- **Left:** Icon circle (color-coded by type)
- **Center:** 
  - **Title line** (bold): Brief description of the event
  - **Timestamp** (12px, `--text-secondary`): Date and time
- **Divider:** Subtle horizontal line between entries.

**Sample Entries:**

| Icon/Color | Event | Timestamp |
|---|---|---|
| ✅ Green circle | **Quotation selected** — Infra Supplies Pvt Ltd selected for Office Furniture Q2 | 23 May 2025, 4:15 PM |
| 🕐 Amber circle | **Approval pending** — PO-2024 awaiting L2 approval by Priya Shah | 22 May 2025, 04:15 AM |
| 📄 Blue circle | **RFQ published** — Office Furniture Q2 sent to 3 vendors | 19 May 2025 |
| 🔴 Red circle | **Vendor added** — FastLog Transport registered, pending verification | 18 May 2025, 3:20 PM |

### Design Note
- **Important callout card (right side or top banner):** A subtle `--bg-surface` card with an info icon:  
  *"Audit logs are immutable. Entries are write-once — no edit or delete operations. Your database schema must enforce this (no soft-delete on log records)."*
- This note is for developer awareness; in the UI, it can be a small banner or tooltip.

---

## Screen 11 — Reports & Analytics

### Purpose
Data-driven procurement insights with KPIs, category breakdowns, vendor rankings, and monthly trend analysis.

### Page Header
- **Title:** "Reports & Analytics" (H1)
- **Subtitle:** "Procurement Insights — May 2025" (14px, `--text-secondary`)
- **Top-Right Controls:**
  - **Month Picker:** Dropdown or date picker showing "May 2025", filterable by month.
  - **Export Button:** Outlined button "Export" with a download icon. Exports data as CSV/PDF.

### Section 1: KPI Summary Cards
- Same layout as Dashboard KPI cards (4 cards, horizontal row):

| KPI | Value | Color |
|---|---|---|
| Total Spend | ₹12.4L | `--accent-green` |
| Active Vendors | 28 | `--accent-blue` |
| PO Fulfillment | 94% | `--accent-amber` |
| Overdue Invoices | 3 | `--accent-red` |

### Section 2: Two-Column Analytics

**Left Column — Spend by Category:**
- **Section Title:** "SPEND BY CATEGORY" (12px, uppercase)
- Horizontal bar chart or progress bar visualization:

| Category | Spend (₹) | Bar Color |
|---|---|---|
| IT Hardware | 4.8L | `--accent-blue` |
| Furniture | 3.2L | `--accent-green` |
| Stationery | 2.1L | `--accent-teal` |
| Logistics | 2.3L | `--accent-amber` |

- Each row shows: Category name, amount, and a proportional colored progress bar.

**Right Column — Top Vendors by Spend:**
- **Section Title:** "TOP VENDORS BY SPEND" (12px, uppercase)
- Small data table:

| Vendor | Spend (₹) | POs |
|---|---|---|
| TechCore Ltd | 4,20,000 | 6 |
| Infra Supplies | 3,10,000 | 4 |
| FastLog | 1,90,000 | 3 |

### Section 3: Monthly Trend
- **Section Title:** "MONTHLY TREND" (12px, uppercase)
- **Vertical bar chart** showing monthly procurement spend (Dec through May).
- Bars use `--accent-blue` with hover tooltips showing the exact amount.
- X-axis: Month labels (Dec, Jan, Feb, Mar, Apr, May)
- Y-axis: Spend in Lakhs (₹)
- The bar for the current/latest month (May) should be slightly taller/brighter to indicate current period.

---

## Cross-Cutting Requirements

### Navigation Flow
```
Login (1) → Dashboard (3)
Registration (2) → Login (1)
Dashboard (3) → [Any sidebar item]
Dashboard Quick Actions → Create RFQ (5), Vendors (4), Invoices (9)
Vendors (4) → Add Vendor (modal)
Create RFQ (5) → Quotations (6) [vendor receives]
Quotation Comparison (7) → Approval Workflow (8)
Approval Workflow (8) → PO & Invoice (9) [on final approval]
All screens → Activity & Logs (10) [events recorded automatically]
```

### Status Badge System
Use consistent pill-shaped badges across all screens:
| Status | Background | Text Color |
|---|---|---|
| Active / Approved | `#22C55E20` | `--accent-green` |
| Pending / Awaiting | `#F59E0B20` | `--accent-amber` |
| Draft | `#9CA3AF20` | `--text-secondary` |
| Blocked / Rejected / Overdue | `#EF444420` | `--accent-red` |

### Responsive Behavior
- **Desktop (≥1280px):** Full sidebar + multi-column content layouts as described.
- **Tablet (768px–1279px):** Sidebar collapses to icon-only mode. Content reflows to single-column or stacked cards where needed.
- **Mobile (< 768px):** Sidebar becomes a hamburger menu drawer overlay. Tables become scrollable horizontally or transform into stacked card views.

### Micro-Interactions & Animations
- **Page transitions:** Subtle fade-in (200ms) when navigating between screens.
- **Card hover:** Slight scale (1.01) + shadow increase.
- **Button click:** Brief scale-down (0.98) then snap back.
- **Loading states:** Skeleton loaders matching card/table shapes while data loads.
- **Toast notifications:** Slide in from top-right for success/error/info messages (auto-dismiss after 4 seconds).
- **Stepper progress:** Animate the green fill on connecting lines when a step completes.

### Accessibility
- All interactive elements must have visible focus indicators (2px `--accent-blue` outline).
- Color is never the sole indicator of status — always pair with text labels or icons.
- Minimum contrast ratio of 4.5:1 for all text.
- All form inputs have associated labels (visible or `aria-label`).
- Tables have proper `<thead>`, `<tbody>`, and scope attributes.

### Empty States
For screens with no data yet (e.g., no vendors, no RFQs), show:
- A centered illustration or icon (muted, outlined style).
- A descriptive message: "No vendors found" / "No RFQs created yet."
- A CTA button: "+ Add your first vendor" / "+ Create your first RFQ."

---

## Summary of All Screens

| # | Screen Name | Key Purpose |
|---|---|---|
| 1 | Login | User authentication |
| 2 | Registration | New user sign-up with role selection |
| 3 | Dashboard | KPI overview, recent POs, spending trends, quick actions |
| 4 | Vendors List | Search, filter, and manage supplier profiles |
| 5 | Create RFQ | Multi-step form to create and send quotation requests |
| 6 | Submit Quotation | Vendor response form with pricing and terms |
| 7 | Quotation Comparison | Side-by-side vendor comparison matrix |
| 8 | Approval Workflow | Multi-level approval pipeline with status tracking |
| 9 | PO & Invoice | Auto-generated purchase order document with GST breakdown |
| 10 | Activity & Logs | Immutable procurement audit trail |
| 11 | Reports & Analytics | Procurement KPIs, category spend, vendor rankings, trends |

---

*Generate all 11 screens as a cohesive, production-quality ERP application. Ensure visual consistency across all screens through the shared design system, navigation shell, and component library defined above. The application should feel like a real, enterprise-grade procurement tool — not a prototype.*
