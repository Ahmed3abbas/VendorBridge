---
name: Deep Industry
colors:
  surface: '#1A1D27'
  surface-dim: '#111319'
  surface-bright: '#373940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#191b22'
  surface-container: '#1e1f26'
  surface-container-high: '#282a30'
  surface-container-highest: '#33343b'
  on-surface: '#e2e2eb'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#e2e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#4ae176'
  primary: '#4be277'
  on-primary: '#003915'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#006e2f'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#ffb5ab'
  on-tertiary: '#60130d'
  tertiary-container: '#ff8b7c'
  on-tertiary-container: '#76231b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a9'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#7f2a21'
  background: '#111319'
  on-background: '#e2e2eb'
  surface-variant: '#33343b'
  surface-hover: '#242836'
  nav-top: '#141720'
  border-subtle: '#2A2E3A'
  text-primary: '#F1F3F5'
  text-secondary: '#9CA3AF'
  accent-amber: '#F59E0B'
  accent-red: '#EF4444'
  accent-teal: '#14B8A6'
  print-white: '#FFFFFF'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  sidebar-width: 240px
  sidebar-collapsed: 64px
  top-nav-height: 56px
  container-padding: 32px
  table-row-height: 48px
  input-height: 40px
---

## Brand & Style

The design system is engineered for the high-stakes environment of B2B procurement, where precision, speed, and data integrity are paramount. The brand personality is **Technical, Professional, and Authoritative**, designed to instill confidence in users managing complex supply chains and multi-million dollar transactions.

### Design Movement: Technical Minimalism
The aesthetic blends **Modern Corporate** efficiency with **Technical** precision. It utilizes a deep-space dark mode to reduce eye strain during long-term analytical work, punctuated by high-chroma functional accents that guide the eye to critical status changes. 

**Key Principles:**
- **Data Density:** Information is prioritized over white space, using tight 8px-based spacing to ensure maximum visibility of records.
- **Functional Color:** Color is never decorative; it is a dedicated semantic tool used to communicate status (Success, Pending, Warning, Error).
- **Technical Utility:** The inclusion of monospaced fonts for identifiers and specialized "Paper Mode" surfaces for financial documents bridges the gap between digital ERP efficiency and physical compliance requirements.

## Colors

The palette is optimized for a dark-first experience, focusing on high-contrast readability and semantic clarity.

### Functional Logic
- **Primary (Success):** Green is used for both brand identity and "Success" states, symbolizing growth and completed transactions.
- **Secondary (Info):** Blue is reserved for interactive elements like links, focus states, and neutral informational callouts.
- **Semantic Accents:** Amber and Red are strictly controlled to signal "Warning/Pending" and "Danger/Error" respectively.
- **Neutral Stack:** The background (`#0F1117`) and surface (`#1A1D27`) colors provide a deep hierarchy that separates the UI shell from content modules.
- **Print Context:** A specific `print-white` token is provided for internal document cards (PO/Invoices) to simulate the physical document and ensure legibility during screen-to-paper transitions.

### Status Badge Transparency
Badges use a 12% alpha-channel version of their respective accent colors to create "tinted" backgrounds that remain legible against the dark surface without overwhelming the primary text.

## Typography

This design system employs a dual-font strategy to differentiate between UI navigation and technical data.

- **Inter (UI/Body):** Chosen for its exceptional legibility in dark mode. It handles the bulk of the interface, from navigation to descriptive text.
- **JetBrains Mono (Technical/Data):** This monospaced font is used exclusively for GSTINs, PO numbers, IDs, and transactional values. The fixed character width ensures that columns of numbers align perfectly in high-density tables, aiding in rapid visual auditing.

**Hierarchy Rules:**
- **Page Titles:** Use `headline-lg` to anchor the top-left of every main view.
- **Column Headers:** Use `label-caps` in uppercase with `text-secondary` color for clear distinction from row data.
- **Identifier Strings:** Always use `data-mono` to signify that a string is a unique system ID or technical reference.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid** model. The sidebar and top navigation are fixed-position shells, while the main content area utilizes a fluid grid to maximize the visibility of wide data tables on large enterprise monitors.

### Spacing Rhythm
The system is built on a strict **8px grid**. All padding, margins, and component heights must be multiples of 8. 
- **Standard Padding:** 24px within cards; 32px for global page margins.
- **Tight Padding:** 8px or 16px for internal component clusters like button groups or form fields.

### Breakpoints
- **Desktop (1280px+):** Full 12-column grid, sidebar expanded.
- **Tablet (768px - 1279px):** Sidebar collapses to icon-only (64px). Content margins reduce to 24px.
- **Mobile (<767px):** Sidebar moves to a hidden drawer overlay. Data tables must enable horizontal scrolling or switch to list-card views.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** rather than heavy shadows. In a dark UI, light is used sparingly to imply height.

- **Level 0 (Base):** `#0F1117` - The canvas on which all elements sit.
- **Level 1 (Top Nav):** `#141720` - A subtle lift from the base to define the global navigation shell.
- **Level 2 (Cards/Sidebar):** `#1A1D27` - The primary surface for content. These elements feature a `1px solid #2A2E3A` border to define edges clearly.
- **Shadows:** Use a single, soft ambient shadow for cards: `0 1px 3px rgba(0,0,0,0.3)`.
- **Active States:** Interactive surfaces (like hovered table rows) shift to `#242836` to provide immediate tactile feedback.

## Shapes

The shape language balances modern software aesthetics with professional restraint.

- **Cards & Modals:** Use an **8px (rounded-lg)** radius. This provides a clean, modern look without feeling overly playful.
- **Inputs & Buttons:** Use a **6px** radius. The slightly sharper corners compared to cards help these interactive elements feel "integrated" and precise.
- **Status Badges:** Use a **Pill (full-round)** shape. This distinctive geometry allows badges to stand out instantly from the rectangular grid of the tables and forms.
- **Focus States:** A 2px solid Blue focus ring with a 2px offset must be present on all keyboard-navigable elements.

## Components

### High-Density Data Tables
Tables are the core of the experience. Row heights are fixed at 48px. Use alternating `border-subtle` dividers. Cell text uses `body-sm`, while ID columns switch to `data-mono`.

### KPI Cards
KPI cards sit at the top of dashboards. They feature a `headline-md` value in the relevant semantic color (e.g., Amber for "Pending Amount") and a `label-caps` title. 

### Pill-Shaped Status Badges
Status indicators must always use the 12% background tint.
- **Success:** `#22C55E` text on `#22C55E20` background.
- **Warning:** `#F59E0B` text on `#F59E0B20` background.
- **Danger:** `#EF4444` text on `#EF444420` background.

### Multi-Step Steppers
Used for procurement workflows. Active steps are highlighted with a Blue circle and bold text. Completed steps use a Green checkmark icon. Connector lines between steps use `border-subtle`.

### Input Fields
Inputs use `#1A1D27` background with a `1px solid #2A2E3A` border. Placeholder text uses `text-secondary`. On focus, the border transitions to Blue.

### Buttons
- **Primary:** Background `#22C55E`, Text `#0F1117` (High contrast).
- **Secondary:** Transparent background, `1px solid #2A2E3A` border, Text `text-primary`.
- **Interaction:** On click, all buttons scale to `0.98` to provide a physical "press" sensation.