import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { submitRating } from '../services/stores';

const Rating = ({ storeId, userRating, averageRating, onRatingSubmit }) => {
  const [rating, setRating] = useState(userRating || 0);
  const [hover, setHover] = useState(0);
  const { user } = useContext(AuthContext);

  const handleRating = async (selectedRating) => {
    if (!user) return;

    try {
      setRating(selectedRating);
      const response = await submitRating(storeId, selectedRating);
      onRatingSubmit(response.data.averageRating);
    } catch (error) {
      console.error('Rating submission failed:', error);
    }
  };

  return (
    <div className="rating">
      <div className="average-rating">
        Average: {typeof averageRating === 'number' ? averageRating.toFixed(1) : 'No ratings yet'}
      </div>
      {user && (
        <div className="user-rating">
          <span>Your rating: </span>
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <button
                key={ratingValue}
                className={`star ${ratingValue <= (hover || rating) ? 'filled' : ''}`}
                onClick={() => handleRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rating;