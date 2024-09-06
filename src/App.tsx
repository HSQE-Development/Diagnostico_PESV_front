import LoginPage from "./Features/Login/Index";
import MainPage from "./Features/App/Index";
import AppLayout from "./Components/AppLayout";
import ProfilePage from "./Features/Profile/Index";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import CompanyPage from "./Features/Companies/Index";
import DiagnosisPage from "./Features/Diagnosis/Index";
import ArlPage from "./Features/Arls/Index";
import DiagnosisTimeLinePage from "./Features/DiagnosisTimeLine/Index";
import CorporateGroupPage from "./Features/CorporateGroup/Index";
import ProtectedRoute from "./Components/ProtectedRoute";
import ExternalRoute from "./Components/ExternalRoute";
import ExternalLayout from "./Components/ExternalLayout";
import ExternalPage from "./Features/ExternalCompany/Index";
import UsersPage from "./Features/Users/Index";
import ChangePasswordPage from "./Features/ChangePassword/Index";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/app" replace />, // Redirige a /app
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/change_password",
      element: <ChangePasswordPage />,
    },
    {
      path: "/app",
      element: <ProtectedRoute />, // Rutas protegidas debajo de /app
      children: [
        {
          element: <AppLayout />,
          children: [
            { path: "", element: <MainPage /> },
            { path: "users", element: <UsersPage /> },
            { path: "my_profile", element: <ProfilePage /> },
            { path: "companies", element: <CompanyPage /> },
            {
              path: "companies/diagnosis/:idCompany",
              element: <DiagnosisPage />,
            },
            {
              path: "companies/diagnosis/history/:idCompany",
              element: <DiagnosisTimeLinePage />,
            },
            { path: "arls", element: <ArlPage /> },
            { path: "corporate_group", element: <CorporateGroupPage /> },
          ],
        },
      ],
    },
    {
      path: "/external-use",
      element: <ExternalRoute />,
      children: [
        {
          element: <ExternalLayout />,
          children: [
            { path: "", element: <ExternalPage /> },
            { path: "my_profile", element: <ProfilePage useExternal /> },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
