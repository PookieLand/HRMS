import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AsgardeoProvider } from "@asgardeo/react";
import { Toaster } from "sonner";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { AlertProvider } from "./contexts/AlertContext.tsx";

import App from "./App.tsx";
import LoginPage from "./pages/login.tsx";
import ErrorRoutePage from "./pages/error-route.tsx";
import NotFoundPage from "./pages/404.tsx";
import ProfilePage from "./pages/profile.tsx";
import JWTTokenPage from "./pages/jwt-token.tsx";
import RouterErrorComponent from "./components/router-error.tsx";

import EmployeeList from "./pages/employees/list.tsx";
import AttendanceDashboard from "./pages/attendance/dashboard.tsx";
import LeaveApply from "./pages/leaves/apply.tsx";
import UserList from "./pages/users/list.tsx";
import AuditLogs from "./pages/audit/logs.tsx";
import NotificationList from "./pages/notifications/list.tsx";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: NotFoundPage,
  errorComponent: RouterErrorComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "HRMS - Home";
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "Login - HRMS";
  },
});

const errorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/error",
  component: ErrorRoutePage,
  beforeLoad: () => {
    document.title = "Error - HRMS";
  },
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "Profile - HRMS";
  },
});

const jwtTokenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jwt-token",
  component: JWTTokenPage,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "JWT Token - HRMS";
  },
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
  beforeLoad: () => {
    document.title = "404 Not Found - HRMS";
  },
});

// HRMS Routes
const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employees",
  component: EmployeeList,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "Employees - HRMS";
  },
});

const attendanceDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/attendance/dashboard",
  component: AttendanceDashboard,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "Attendance Dashboard - HRMS";
  },
});

const leavesApplyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaves/apply",
  component: LeaveApply,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "Apply for Leave - HRMS";
  },
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  component: UserList,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "User Management - HRMS";
  },
});

const auditLogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/audit/logs",
  component: AuditLogs,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "Audit Logs - HRMS";
  },
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationList,
  errorComponent: RouterErrorComponent,
  beforeLoad: () => {
    document.title = "Notifications - HRMS";
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  errorRoute,
  profileRoute,
  jwtTokenRoute,
  // HRMS Routes
  employeesRoute,
  attendanceDashboardRoute,
  leavesApplyRoute,
  usersRoute,
  auditLogsRoute,
  notificationsRoute,
  notFoundRoute,
]);

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFoundPage,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AsgardeoProvider
        clientId={import.meta.env.VITE_CLIENT_ID || ""}
        baseUrl={import.meta.env.VITE_ORG_BASE_URL || ""}
      >
        <AlertProvider>
          <Toaster position="top-right" richColors />
          <RouterProvider router={router} />
        </AlertProvider>
      </AsgardeoProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
