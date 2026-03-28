# FoodieHub

## Current State
FoodieHub is a food ordering platform with:
- `/` - Customer-facing homepage
- `/admin` - Admin panel (menu management + orders table)
- `/delivery` - Delivery Manager (Kanban board)
- `/login` - Login page

## Requested Changes (Diff)

### Add
- New `/manage` route and `ManagePage` component
- Management Hub dashboard with:
  - Stats overview: Total Revenue, Total Orders, Active Menu Items, Pending Orders, Out for Delivery, Delivered
  - Quick action cards: Menu Management (→ /admin), Delivery Manager (→ /delivery), View Live Site (→ /)
  - Recent Orders table (last 5-10 orders with name, total, status, time)
  - Menu summary: item count by category
  - A clean navigation sidebar or top nav with links to all management sections

### Modify
- `App.tsx`: Add `/manage` route
- `AdminPage.tsx`: Add link to `/manage` in header
- `DeliveryPage.tsx`: Add link to `/manage` in header

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/ManagePage.tsx` with full management hub UI
2. Add `/manage` route to `App.tsx`
3. Add "Management Hub" link in AdminPage header
4. Add "Management Hub" link in DeliveryPage header
