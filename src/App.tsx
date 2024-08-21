import LoginPage from "./Features/Login/Index";
import MainPage from "./Features/App/Index";
import AppLayout from "./Components/AppLayout";
import ProfilePage from "./Features/Profile/Index";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CompanyPage from "./Features/Companies/Index";
import DiagnosisPage from "./Features/Diagnosis/Index";
import ArlPage from "./Features/Arls/Index";
import DiagnosisTimeLinePage from "./Features/DiagnosisTimeLine/Index";
import CorporateGroupPage from "./Features/CorporateGroup/Index";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/app",
      element: <ProtectedRoute />, // Rutas protegidas debajo de /app
      children: [
        {
          element: <AppLayout />, // AppLayout recibe los children
          children: [
            { path: "", element: <MainPage /> },
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
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
