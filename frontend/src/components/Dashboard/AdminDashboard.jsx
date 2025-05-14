import React, { useState, useEffect, useContext } from 'react';
import { getDashboardStats } from '../../services/stores';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchStats = async () => {
        try {
          const response = await getDashboardStats();
          setStats(response.data);
        } catch (error) {
          setError('Failed to fetch dashboard stats');
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.usersCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Stores</h3>
          <p>{stats.storesCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <p>{stats.ratingsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;