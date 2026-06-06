# Phase 3 — Frontend (Complete React Application)
## Assigned to: @anujpatel002
## Branch: `feat/m3/frontend`

> **You own**: `client/` — the ENTIRE directory. No backend files. You have 100% ownership of all frontend code.

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Ahmed3abbas/VendorBridge.git
cd VendorBridge

# 2. Create your branch from develop
git checkout develop
git pull origin develop
git checkout -b feat/m3/frontend

# 3. Set up the React project
cd client
npm create vite@latest ./ -- --template react
npm install

# 4. Install all dependencies (see Step 1 below)
# 5. Start working — commit often
# Example: git commit -m "feat(ui): add sidebar and topbar layout"
```

> **IMPORTANT**: You can start building immediately with **mock data**. Don't wait for backend. Use the API contract in `CONTEXT.md` to know the exact request/response shapes. Swap mocks for real API calls when M1/M2 merge.

---

## Task Order (follow this sequence)

### Step 1: Project Setup + Dependencies

```bash
cd client

# Core
npm install react-router-dom@6 axios

# State management
npm install @tanstack/react-query zustand

# Forms + validation
npm install react-hook-form @hookform/resolvers zod

# Tables
npm install @tanstack/react-table

# Charts
npm install recharts

# Real-time
npm install socket.io-client

# Icons
npm install lucide-react

# Utilities
npm install clsx tailwind-merge date-fns

# Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite

# shadcn/ui
npx shadcn@latest init
# Then add components:
npx shadcn@latest add button input card badge table dialog select textarea tabs dropdown-menu skeleton avatar label separator toast
```

**Config files to set up**:
- `vite.config.js` — add proxy: `'/api': 'http://localhost:5000'`
- `tailwind.config.js` — extend theme with VendorBridge colors
- `postcss.config.js`
- `index.html` — add Google Fonts (Inter), meta description, title
- `components.json` — shadcn configuration

---

### Step 2: Design System + Global Styles

#### 2.1 — `src/index.css`
```css
/* Tailwind directives */
@import "tailwindcss";

/* Custom properties for VendorBridge theme */
:root {
  --primary: #1A56DB;       /* Blue */
  --primary-light: #EBF2FF;
  --success: #057A55;       /* Green */
  --warning: #B45309;       /* Amber */
  --danger: #C81E1E;        /* Red */
  --purple: #6C2BD9;
  --background: #F3F4F6;
  --sidebar-bg: #0F172A;    /* Dark navy */
  --sidebar-text: #94A3B8;
}
```

#### 2.2 — `src/utils/cn.js`
```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) { return twMerge(clsx(inputs)); }
```

#### 2.3 — `src/utils/constants.js`
- API_BASE_URL
- Role enums: ADMIN, MANAGER, PROCUREMENT_OFFICER, VENDOR
- Status color maps for badges
- Navigation items per role

#### 2.4 — `src/utils/formatCurrency.js`
```js
// formatCurrency(amount) → "₹1,25,000.00" (Indian format)
```

#### 2.5 — `src/utils/formatDate.js`
```js
// formatDate(date) → "06 Jun 2024"
// formatDateTime(date) → "06 Jun 2024, 3:45 PM"
// timeAgo(date) → "2 hours ago"
```

---

### Step 3: Layout Components

#### 3.1 — `src/components/layout/AppLayout.jsx`
- Sidebar (left, fixed) + Topbar (top) + Main content area
- Responsive: sidebar collapses to icon-only on mobile

#### 3.2 — `src/components/layout/Sidebar.jsx`
- VendorBridge logo at top
- Navigation links based on user role:
  - **All**: Dashboard
  - **Admin**: Vendors, RFQs, Approvals, POs, Invoices, Activity Log, Reports
  - **Manager**: Dashboard, RFQs, Approvals, POs, Invoices, Reports
  - **Officer**: Dashboard, Vendors, RFQs, Quotations, POs, Invoices, Activity Log
  - **Vendor**: Dashboard, My RFQs, My Quotations, My POs
- Active state highlighting
- Lucide icons for each link

#### 3.3 — `src/components/layout/Topbar.jsx`
- Page title (dynamic based on route)
- Search bar (optional)
- NotificationBell component
- User avatar + name + role badge
- Logout button

#### 3.4 — `src/components/layout/NotificationBell.jsx`
- Bell icon with unread count badge
- Dropdown showing recent notifications
- Connected to socket.io via `useSocket` hook
- Clicking notification navigates to relevant page

#### 3.5 — `src/components/layout/ProtectedRoute.jsx`
```jsx
// Wraps routes to check:
// 1. Is user authenticated? (has valid token)
// 2. Does user have required role?
// If not → redirect to /login
// Usage: <ProtectedRoute roles={['ADMIN', 'MANAGER']}><Approvals /></ProtectedRoute>
```

---

### Step 4: Routing

#### `src/router.jsx`
```
/login                          → Login
/register                       → Register
/forgot-password                → ForgotPassword

/ (AppLayout wrapper)
  /dashboard                    → Dashboard
  /vendors                      → VendorList        (Admin, Officer)
  /vendors/:id                  → VendorDetail       (Admin, Officer)
  /vendors/new                  → VendorCreate       (Admin)
  /rfq                          → RFQList            (All)
  /rfq/new                      → RFQCreate          (Officer)
  /rfq/:id                      → RFQDetail          (All)
  /rfq/:rfqId/quote             → QuoteSubmit        (Vendor)
  /rfq/:rfqId/compare           → QuoteCompare       (Officer)
  /approvals                    → Approvals          (Manager, Admin)
  /purchase-orders              → PurchaseOrders     (Officer+)
  /invoices                     → Invoices           (Officer+)
  /activity-log                 → ActivityLog        (Officer+)
  /reports                      → Reports            (Manager+)
  *                             → NotFound
```

---

### Step 5: State Management

#### `src/store/authStore.js` (Zustand)
```js
// State: { user, accessToken, refreshToken, isAuthenticated }
// Actions: login(tokens, user), logout(), updateToken(newAccessToken)
// Persist to localStorage
```

#### `src/store/notificationStore.js` (Zustand)
```js
// State: { notifications[], unreadCount }
// Actions: addNotification(n), markAsRead(id), clearAll()
```

---

### Step 6: API Layer

#### `src/api/axios.config.js`
- Create Axios instance with baseURL
- Request interceptor: attach `Authorization: Bearer <token>` from authStore
- Response interceptor: on 401 → try token refresh → if fails → redirect to /login
- Error formatting

#### API Files (one per module)
Each file exports functions that call Axios:
```js
// Example: src/api/vendors.api.js
export const getVendors = (params) => api.get('/api/vendors', { params });
export const getVendor = (id) => api.get(`/api/vendors/${id}`);
export const createVendor = (data) => api.post('/api/vendors', data);
export const updateVendor = (id, data) => api.put(`/api/vendors/${id}`, data);
```

Create all 9 API files: auth, vendors, rfq, quotations, approvals, po, invoices, reports (+ activity logs in reports)

#### React Query Hooks
Each hook wraps API calls with TanStack Query:
```js
// Example: src/hooks/useVendors.js
export const useVendors = (params) =>
  useQuery({ queryKey: ['vendors', params], queryFn: () => getVendors(params) });

export const useCreateVendor = () =>
  useMutation({ mutationFn: createVendor, onSuccess: () => queryClient.invalidateQueries(['vendors']) });
```

Create all 8 hook files.

#### `src/hooks/useSocket.js`
- Connect to Socket.io server on mount
- Join user's room
- Listen for events: `rfq:created`, `quotation:submitted`, `approval:approved`, `approval:rejected`
- Add to notificationStore on event

---

### Step 7: Auth Pages

#### `Login.jsx`
- Centered card on dark gradient background
- Email + password fields with Zod validation
- Password show/hide toggle
- Loading spinner on submit
- Error toast on failure
- Role-based redirect on success (Admin → Dashboard, Vendor → My RFQs, etc.)
- Links to Register and Forgot Password

#### `Register.jsx`
- Name, email, password, confirm password
- Role dropdown (Admin, Manager, Officer, Vendor)
- Zod validation with inline field errors
- Redirect to login on success

#### `ForgotPassword.jsx`
- Step 1: Enter email
- Step 2: Enter OTP received via email
- Step 3: Set new password
- Stepper progress bar

---

### Step 8: Dashboard Page

#### `Dashboard.jsx`
- **4 metric cards** (top row): Pending Approvals, Active RFQs, This Month's POs, Total Invoiced
  - Each card: icon, value, label, % change indicator
  - Card colors: blue, green, amber, purple
- **Recent RFQs table** (5 rows): Title, Status badge, Deadline, Quotes received
- **Recent POs table** (5 rows): PO Number, Vendor, Amount, Status
- **Quick action buttons**: "Create New RFQ", "Review Approvals"
- Role-filtered: vendors see their own data only

---

### Step 9: Vendor Pages

#### `VendorList.jsx`
- Search bar (name/GST search)
- Status filter tabs: All | Active | Inactive | Blacklisted
- Category filter chips
- TanStack Table with columns: Name, GST, Category, Status, Rating, Contact
- Pagination
- "Add Vendor" button (Admin only)
- Click row → navigate to VendorDetail

#### `VendorDetail.jsx`
- Vendor profile card (name, GST, category, status, rating, contact info)
- Tabs: Overview | RFQs | Purchase Orders | Performance
- Performance tab: delivery time chart, win rate, total spend

#### `VendorCreate.jsx`
- Form: name, GST number, category (dropdown), contact email, phone, address
- Zod validation
- Submit → create vendor → redirect to list

---

### Step 10: RFQ Pages

#### `RFQList.jsx`
- Status filter tabs: All | Open | Closed | Cancelled
- Table: Title, Items count, Vendors invited, Deadline, Status badge, Quotes received
- "Create RFQ" button (Officer only)

#### `RFQCreate.jsx` (Multi-step form)
- **Step 1 — Details**: Title, description, deadline (date picker)
- **Step 2 — Items**: Dynamic rows (add/remove). Each row: product name, quantity, unit, description
- **Step 3 — Vendors**: Multi-select vendor list with search. Show category/rating for each.
- **Step 4 — Review**: Summary of all fields. File attachment (drag-and-drop). Submit button.
- `StepperProgress` component shows current step
- React Hook Form with Zod validation per step

#### `RFQDetail.jsx`
- RFQ info: title, description, deadline, status, created by
- Items table
- Invited vendors list with status (invited / quoted)
- Quotations section (if any submitted)
- "Compare Quotations" button (if 2+ quotes)
- "Close RFQ" button (Officer)

---

### Step 11: Quotation Pages

#### `QuoteSubmit.jsx` (Vendor view)
- RFQ details displayed at top (read-only)
- Items table with editable unit_price column per row
- Delivery date picker
- Notes textarea
- Auto-calculated subtotal per row and grand total
- Submit button
- Edit mode: if quote already submitted and RFQ still OPEN

#### `QuoteCompare.jsx` (Officer view)
- Pinned left column: Item names
- Scrollable vendor columns: each vendor's unit prices
- **Lowest price per row highlighted in green**
- Total row at bottom
- Delivery date comparison
- Vendor rating display
- "Select This Vendor" button per column → confirms → creates approval

---

### Step 12: Approval, PO, Invoice, Activity, Reports Pages

#### `Approvals.jsx`
- Pending approval cards/table
- Each card: RFQ title, vendor name, quotation total, delivery date
- Click → expand to show full quotation items + vendor profile
- Approval timeline component (RFQ Created → Quote Submitted → Pending Approval)
- Remarks textarea
- Approve (green) / Reject (red) buttons with ConfirmModal

#### `PurchaseOrders.jsx`
- PO table: PO Number, Vendor, Amount, Tax, Total, Status, Date
- Status filter tabs
- Click row → detail view: items, vendor info, tax breakdown
- "Download PDF" button → calls `/api/purchase-orders/:id/pdf`
- Status update dropdown (Officer)

#### `Invoices.jsx`
- Invoice table: Invoice Number, PO Number, Vendor, Total, Status, Date
- Status filter
- Detail view: full line items, tax breakdown
- Actions: Download PDF, Print (window.print with InvoicePrintView), Send Email
- Status update: mark as PAID / OVERDUE

#### `ActivityLog.jsx`
- Timeline feed of all procurement events
- Each entry: actor avatar, action description, timestamp, entity link
- Infinite scroll (load more on scroll bottom)
- Filters: entity type dropdown, user dropdown, date range

#### `Reports.jsx`
- **Monthly Spend** — Recharts BarChart (12 months)
- **PO Trend** — Recharts LineChart
- **Vendor Performance Table** — name, total spend, PO count, avg delivery, win rate, on-time %
- Date range picker filter
- "Export CSV" button (client-side using Papa Parse or manual)

#### `NotFound.jsx`
- 404 page with illustration
- "Go to Dashboard" button

---

### Step 13: Reusable Components

- `VendorCard.jsx` — compact vendor info card (name, category, rating, status badge)
- `StatusBadge.jsx` — colored badge based on status string (OPEN=blue, APPROVED=green, etc.)
- `ApprovalTimeline.jsx` — vertical timeline showing workflow steps
- `QuotationCompareTable.jsx` — the comparison table component
- `RFQItemsTable.jsx` — items table (used in RFQ detail and quotation forms)
- `InvoicePrintView.jsx` — print-optimized invoice layout (hidden, shown on window.print)
- `ActivityFeed.jsx` — reusable activity timeline feed
- `LoadingSkeleton.jsx` — shimmer loading state
- `EmptyState.jsx` — icon + message + optional CTA for empty lists
- `ConfirmModal.jsx` — "Are you sure?" dialog with action
- `StepperProgress.jsx` — multi-step form progress indicator
- `FileUpload.jsx` — drag-and-drop file upload with preview
- `DateRangePicker.jsx` — date range selector for reports

---

### Step 14: Offline + PWA

#### `public/sw.js`
- Cache dashboard API response
- Cache vendor list
- Serve cached data when offline
- Show "offline" banner in topbar

#### `public/manifest.json`
```json
{
  "name": "VendorBridge",
  "short_name": "VendorBridge",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#1A56DB"
}
```

---

## 🎨 Design Guidelines

- **Color palette**: Blue primary (#1A56DB), dark sidebar (#0F172A), light backgrounds (#F3F4F6)
- **Font**: Inter (Google Fonts) — weight 400, 500, 600, 700
- **Border radius**: 8px for cards, 6px for inputs, 4px for badges
- **Shadows**: subtle shadow-sm on cards, shadow-lg on modals
- **Status colors**: Blue=Open/Pending, Green=Active/Approved, Amber=Warning, Red=Rejected/Cancelled, Purple=Manager actions
- **Empty states**: always show icon + descriptive message + action button
- **Loading**: skeleton shimmer, never a blank screen
- **Responsive**: works at 768px+ (tablet landscape and above)

---

## ✅ Done Checklist
- [ ] `npm run build` completes without errors
- [ ] Login flow works (with mock or real API)
- [ ] All 16 pages render correctly
- [ ] Role-based routing works (wrong role → redirect)
- [ ] Forms validate with inline errors
- [ ] Empty states on all list pages
- [ ] Loading skeletons on all data pages
- [ ] Mobile responsive (768px+)
- [ ] PDF download buttons work (after API integration)
- [ ] Push branch and create PR to `develop`
- [ ] Update `CONTEXT.md` with completed items

```bash
git add -A
git commit -m "feat: complete frontend — all pages, components, routing, state management"
git push -u origin feat/m3/frontend
# Create PR: feat/m3/frontend → develop (after M1 + M2 PRs are merged)
```
