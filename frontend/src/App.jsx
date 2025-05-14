import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChangePassword from './components/Auth/ChangePassword';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import StoreOwnerDashboard from './components/Dashboard/StoreOwnerDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import StoreList from './components/Stores/StoreList';
import UserList from './components/Users/UserList';
import UserDetails from './components/Users/UserDetails';
import StoreForm from './components/Stores/StoreForm';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/admin/stores/new" element={<StoreForm />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/:id" element={<UserDetails />} />
              <Route path="/admin/stores" element={<StoreList />} />
              
              <Route path="/store-owner/dashboard" element={<StoreOwnerDashboard />} />
              
              <Route path="/stores" element={<StoreList />} />
              
              <Route path="/" element={<UserDashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;