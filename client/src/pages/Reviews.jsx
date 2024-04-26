import React, { useEffect, useState } from 'react';
import { Alert, Spinner } from 'flowbite-react';
import ReviewCard from '../components/ReviewCard';

export default function Reviews() {

  const [error, setError] = useState(null);;
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/review/getreviews');
        const data = await res.json();
        setReviews(data);
        setLoading(false);
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
        }
        if (res.ok) {
          setError(null);
          setLoading(false);
          setReviews(data.reviews);
        }
      } catch (error) {
        console.log(error.message);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl'/>
      </div>
    )
  }

  return (
    <div className='max-w-4xl flex flex-col gap-10 mx-auto p-3'>
      <h1 className='font-bold text-3xl mt-4 text-teal-400'>Reviews</h1>
      <div className='flex flex-wrap gap-8 justify-center items-center'>
        {reviews && reviews.length > 0 && reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
      {error && <Alert color='failure'>{error}</Alert>}
    </div>
  )
}
