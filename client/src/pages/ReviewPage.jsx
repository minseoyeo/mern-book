import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, Button, Spinner } from 'flowbite-react';
import CommentSection from '../components/CommentSection';
import ReviewCard from '../components/ReviewCard';

export default function ReviewPage() {
  const { reviewSlug } = useParams();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ review, setReview ] = useState(null);
  const [ recentReviews, setRecentReviews ] = useState(null);
  const [ user, setUser] = useState();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/review/getreviews?slug=${reviewSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if(res.ok) {
          setReview(data.reviews[0]);
          setError(null);
          setLoading(false)
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchReview(); 

    const fetchUser = async () => {
      try {
        setLoading(true);
        const reviewInfo = await fetch (`/api/review/getreviews?slug=${reviewSlug}`);
        const reviewData = await reviewInfo.json();
        const reviewId = reviewData.reviews[0]._id;
        const res = await fetch (`/api/review/getuserinfo/${reviewId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
        }
        if (res.ok) {
          setError(null);
          setLoading(false);
          setUser(data);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.log(error.message);
      }
    }
    fetchUser();
  }, [reviewSlug]);

  useEffect(() => {
    try {
      const fetchRecentReviews = async () => {
        const res = await fetch(`/api/review/getreviews?limit=4`);
        const data = await res.json();
        if (res.ok) {
          setRecentReviews(data.reviews);
        }
      };
      fetchRecentReviews();
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl'/>
      </div>
    )
  }

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{review && review.title}</h1>
      <p className='self-center font-serif'>{review && review.author}</p>
      <Link className='self-center mt-5' to={`/search?category=${review && review.category}`}>
        <Button color='gray' pill size='xs'>{review && review.category}</Button>
      </Link>
      <div className='flex justify-between p-2 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm'>
        <p className='italic'>{review && new Date(review.createdAt).toLocaleDateString()}</p>
        { user &&
          <Link className='hover:underline font-medium' to={`/${user._id}`}>
            <p>{user.username}</p>
          </Link>
        }
      </div>
      <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: review && review.content}}></div>
      
      <CommentSection reviewId={review._id}/>
      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-2xl mt-5 font-semibold'>Recent Articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentReviews && recentReviews.length > 0 && recentReviews.map((review) => <ReviewCard key={review._id} review={review}/>)}
        </div>
      </div>
      {error && <Alert color='failure'>{error}</Alert>}
    </main>
  )
}
