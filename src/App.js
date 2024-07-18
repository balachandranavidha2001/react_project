import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Dashboard from './components/Dashboard';
import Logout from './Logout';
import Topbar from './Topbar';
import CompanyDetails from './components/CompanyDetails';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/components/companydetails/:companyUid" element={<CompanyDetails />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/topbar" element={<Topbar />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
