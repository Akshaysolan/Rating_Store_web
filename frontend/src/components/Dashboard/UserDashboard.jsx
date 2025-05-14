import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}</h2>
      <div className="user-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default UserDashboard;