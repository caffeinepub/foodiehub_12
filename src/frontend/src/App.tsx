import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { CartProvider } from "./context/CartContext";
import AdminPage from "./pages/AdminPage";
import DeliveryPage from "./pages/DeliveryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ManagePage from "./pages/ManagePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrdersPage from "./pages/OrdersPage";

const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <Outlet />
      <Toaster />
    </CartProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const deliveryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/delivery",
  component: DeliveryPage,
});

const manageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/manage",
  component: ManagePage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-orders",
  component: MyOrdersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute,
  deliveryRoute,
  manageRoute,
  ordersRoute,
  myOrdersRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
