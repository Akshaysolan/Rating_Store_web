import React from 'react';
import Rating from '../Rating';

const StoreItem = ({ store, onRatingSubmit }) => {
  return (
    <div className="store-item">
      <h3>{store.name}</h3>
      <p><strong>Address:</strong> {store.address}</p>
      <p><strong>Email:</strong> {store.email}</p>
      <Rating
        storeId={store.id}
        userRating={store.userRating}
        averageRating={store.average_rating}
        onRatingSubmit={(newAverage) => onRatingSubmit(store.id, newAverage)}
      />
    </div>
  );
};

export default StoreItem;