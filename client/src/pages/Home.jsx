import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import { useEffect, useState } from 'react';

export default function Home() {

  const [ reviews, setReviews ] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch('/api/review/getreviews?limit=5');
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
      }
      if (!res.ok) {
        console.log(data.message);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-6 px-3 p-28 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to Book Review!</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you can find a variety of book reviews from all over the world.
        </p>
        <Link to={'/reviews'} className='text-sm sm:text-xs text-teal-500 font-bold hover:underline'>
          View All Reviews
        </Link>
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {reviews && reviews.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review}/>
              ))}
            </div>
            <Link to={'/reviews'} className='text-lg text-teal-500 hover:underline text-center'>
              View All Reviews
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
