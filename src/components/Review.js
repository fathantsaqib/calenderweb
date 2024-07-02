import React, { useState } from 'react';
import axios from 'axios';
import './review.css';

function Review() {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState('');

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    const reviewData = {
      user_id: 1, // Ganti dengan user_id yang sesuai
      rating,
      komentar
    };

    console.log('Submitting review:', reviewData); // Log data yang akan dikirim

    try {
      const response = await axios.post('/api/reviews', reviewData);
      console.log('Response:', response.data); // Log respons dari server
      alert("Review submitted successfully");
    } catch (error) {
      console.error('Error submitting review:', error.response ? error.response.data : error.message);
      alert("Error submitting review");
    }
  };

  return (
    <div className="review-container">
      <h2>Your rating</h2>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'star filled' : 'star'}
            onClick={() => handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      <h3>Additional feedback</h3>
      <textarea
        placeholder="If you have any additional feedback, please type it in here..."
        value={komentar}
        onChange={(e) => setKomentar(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit feedback</button>
    </div>
  );
}

export default Review;