import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './Features/Login/Index';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage/>,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
