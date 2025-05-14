import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../services/users';
import { AuthContext } from '../../context/AuthContext';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await getUserDetails(id);
        setUser(response.data);
      } catch (error) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, currentUser, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-details">
      <h2>User Details</h2>
      <div className="details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {user.role === 'store-owner' && (
          <p><strong>Average Rating:</strong> {user.averageRating || 'N/A'}</p>
        )}
      </div>
      <button onClick={() => navigate('/admin/users')}>Back to Users</button>
    </div>
  );
};

export default UserDetails;