import React from 'react';
import './App.css'; 
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/DashBoard/Home';
import Expense from './pages/DashBoard/Expense';
import Income from './pages/DashBoard/Income';
import DashboardLayout from './layout/DashboardLayout'; 
import Group from './pages/Group/Group';
import AddGroup from './pages/Group/AddGroup';
import Invite from './pages/Group/Invite';
import Setting from './pages/Setting/Setting';

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    return isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <SignUp />,
    },
    
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                index: true, 
                element: <Home />,
            },
            {
                path: 'expense',
                element: <Expense />,
            },
            {
                path: 'income',
                element: <Income />,
            },
            {
                path: 'group/:groupId',
                element: <Group />,
            },
            {
                path: 'group/create',
                element: <AddGroup />,
            },
            {
                path: 'group/invite',
                element: <Invite />,
            },
            {
                path: 'setting',
                element: <Setting />,
            },
            //SettingSetting
        ]
    },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;

