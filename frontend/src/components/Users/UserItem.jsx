import React from 'react';
import { Link } from 'react-router-dom';

const UserItem = ({ user }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.address}</td>
      <td>{user.role}</td>
      <td>
        <Link to={`/admin/users/${user.id}`}>View Details</Link>
      </td>
    </tr>
  );
};

export default UserItem;