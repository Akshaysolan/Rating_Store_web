import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../services/users';
import { createStore } from '../../services/stores';
import { AuthContext } from '../../context/AuthContext';

const StoreForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [storeOwners, setStoreOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchStoreOwners = async () => {
      try {
        const response = await getUsers();
        const owners = response.data.filter(u => u.role === 'store-owner');
        setStoreOwners(owners);
      } catch (error) {
        setError('Failed to fetch store owners');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreOwners();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !address || !ownerId) {
      setError('All fields are required');
      return;
    }

    try {
      await createStore({ name, email, address, ownerId });
      setSuccess('Store created successfully!');
      setTimeout(() => navigate('/admin/stores'), 1500);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create store');
    }
  };

  if (user?.role !== 'admin') {
    return <div className="error">Unauthorized - Admin access required</div>;
  }

  if (loading) return <div>Loading store owners...</div>;

  return (
    <div className="form-container">
      <h2>Create New Store</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Store Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength="3"
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            maxLength="400"
          />
        </div>

        <div className="form-group">
          <label>Store Owner</label>
          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            required
          >
            <option value="">Select Owner</option>
            {storeOwners.map(owner => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Create Store
        </button>
      </form>
    </div>
  );
};

export default StoreForm;