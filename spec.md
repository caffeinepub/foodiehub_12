# FoodieHub

## Current State
FoodieHub is a live food ordering platform. Customers can browse the menu, add to cart, and place orders. The admin tools (Order Manager at `/orders`, Delivery Manager at `/delivery`, Management Hub at `/manage`) are login-protected. There is no customer-facing way to check the status of their past orders.

The backend exposes `getAllOrders()` returning all orders with fields: id, customerName, address, phone, items (JSON string), totalAmount, status, createdAt.

## Requested Changes (Diff)

### Add
- A new page `/my-orders` — "My Orders" for customers to look up their delivery history by phone number.
  - No login required. Customer enters their phone number and sees all matching orders.
  - Shows order status (with colored badges: Pending/Confirmed/Out for Delivery/Delivered/Cancelled), items ordered, total amount, date, and address.
  - Orders sorted by newest first.
  - Expandable row or card to show item details.
  - Live status tracking so customers can see where their order is.
- A "My Orders" link in the Navbar (alongside existing links) linking to `/my-orders`.
- A "Track My Order" button or link somewhere visible on the homepage (e.g. in HeroSection or below the cart button in navbar).

### Modify
- `App.tsx`: Add the `/my-orders` route.
- `Navbar.tsx`: Add "My Orders" nav link.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/pages/MyOrdersPage.tsx`:
   - Phone number input form.
   - On submit, call `getAllOrders()` (via existing `useAllOrders` hook), filter by phone number match.
   - Display filtered orders as cards/list with status badge, items, date, total.
   - "No orders found" empty state with friendly message.
2. Update `App.tsx` to import and register `/my-orders` route.
3. Update `Navbar.tsx` to add "My Orders" link visible in nav and on mobile.
