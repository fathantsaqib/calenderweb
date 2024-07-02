import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './review.css';
import { createReview, getReview } from '../services/Api';

function Review() {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [latestReview, setLatestReview] = useState(null);
  const navigate = useNavigate();

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    const user_id = localStorage.getItem('user_id');
    const reviewData = {
      user_id,
      rating,
      komentar
    };

    console.log('Submitting review:', reviewData);

    try {
      const response = await createReview(reviewData);
      console.log('Response:', response.data);
      alert("Review submitted successfully");
      fetchReview();
    } catch (error) {
      console.error('Error submitting review:', error.response ? error.response.data : error.message);
      alert("Error submitting review");
    }
  };

  const fetchReview = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      const response = await getReview(user_id);
      setLatestReview(response.data);
    } catch (error) {
      console.error('Error fetching latest review:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  return (
    <div className="create-review-container">
    <button className="back-button" onClick={() => navigate('/home')}>Back</button>
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
      {latestReview && (
        <div className="latest-review">
          <h3>Latest Review</h3>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= latestReview.rating ? 'star filled' : 'star'}
              >
                ★
              </span>
            ))}
          </div>
          <p>{latestReview.komentar}</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default Review;