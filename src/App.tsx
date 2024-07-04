import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './Features/Login/Index';
import MainPage from './Features/App/Index';
import AppLayout from './Components/AppLayout';

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
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
