import LoginPage from './Features/Login/Index';
import MainPage from './Features/App/Index';
import AppLayout from './Components/AppLayout';
import ProfilePage from './Features/Profile/Index';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CompanyPage from './Features/Companies/Index';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage/>,
    },
    {
      path: "/login",
      element: <LoginPage/>,
    },
    {
      path: "/app",
      element: <AppLayout><MainPage/></AppLayout>,
    },
    {
      path: "/app/my_profile",
      element: <AppLayout><ProfilePage/></AppLayout>,
    },
    {
      path: "/app/companies",
      element: <AppLayout><CompanyPage/></AppLayout>,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
