import React, { useState, useEffect, useContext } from 'react';
import { getStores, getFilteredStores } from '../../services/stores';
import StoreItem from './StoreItem';
import { AuthContext } from '../../context/AuthContext';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    address: ''
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        let response;
        if (filters.name || filters.address) {
          response = await getFilteredStores(filters);
        } else {
          response = await getStores();
        }
        setStores(response.data);
      } catch (error) {
        setError('Failed to fetch stores');
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingSubmit = (storeId, newAverage) => {
    setStores(prev => prev.map(store => 
      store.id === storeId ? { ...store, average_rating: newAverage } : store
    ));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="store-list">
      <h2>Stores</h2>
      <div className="filters">
        <input
          type="text"
          name="name"
          placeholder="Filter by name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Filter by address"
          value={filters.address}
          onChange={handleFilterChange}
        />
      </div>
      {stores.length > 0 ? (
        <div className="stores">
          {stores.map(store => (
            <StoreItem 
              key={store.id} 
              store={store} 
              onRatingSubmit={handleRatingSubmit}
            />
          ))}
        </div>
      ) : (
        <p>No stores found</p>
      )}
    </div>
  );
};

export default StoreList;