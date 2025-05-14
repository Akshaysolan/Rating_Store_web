import React, { useState, useEffect, useContext } from 'react';
import { getStoreRatings } from '../../services/stores';
import { AuthContext } from '../../context/AuthContext';

const StoreOwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.role === 'store-owner') {
      const fetchRatings = async () => {
        try {
          const response = await getStoreRatings();
          setRatings(response.data.ratings);
          setAverageRating(response.data.averageRating);
        } catch (error) {
          setError('Failed to fetch store ratings');
        } finally {
          setLoading(false);
        }
      };
      fetchRatings();
    }
  }, [user]);

  if (!user || user.role !== 'store-owner') {
    return <div>Unauthorized</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <h2>My Store Dashboard</h2>
      <div className="store-stats">
        <h3>Average Rating: {averageRating.toFixed(1)}</h3>
        <h3>Total Ratings: {ratings.length}</h3>
      </div>
      <div className="ratings-list">
        <h3>Ratings</h3>
        {ratings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.id}>
                  <td>{rating.user_name}</td>
                  <td>{rating.rating}</td>
                  <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No ratings yet</p>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;