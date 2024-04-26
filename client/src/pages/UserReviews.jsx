import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, Spinner, Table } from 'flowbite-react';

export default function UserReviews() {

  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ userData, setUserData ] = useState({});
  const [ userReviews, setUserReviews ] = useState();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setError(null);
          setLoading(false);
          setUserData(data);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchUser();

    const fetchUserReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/review/getreviews?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setError(null);
          setLoading(false);
          setUserReviews(data.reviews);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchUserReviews();
  }, [userId]);


  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl'/>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto flex flex-col gap-12 p-10'>
      { userReviews && userReviews.length > 0 &&  
        <>
          <div className="flex items-center gap-7 max-w-2xl mx-auto">
            <div>
              <img src={userData.profilePicture} alt={userData.username} className='rounded-full h-24 shadow-lg'/>
            </div>
            <div className='flex flex-col gap-2'>
              <h3 className='font-semibold text-xl'>{userData.username}</h3>
              <h5 className='text-lgs text-gray-400'>{userData.email}</h5>
            </div>
          </div>
          <div>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>updated date</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Author</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Rating</Table.HeadCell>
              </Table.Head>
              {userReviews.map((review) => (
                <Table.Body key={review._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {new Date(review.updatedAt).toLocaleDateString()}
                    </Table.Cell>

                    <Table.Cell className='truncate'>
                      <Link to={`/review/${review.slug}`}>
                        {review.title}
                      </Link>
                    </Table.Cell>

                    <Table.Cell className='truncate'>
                      {review.author}
                    </Table.Cell>

                    <Table.Cell>
                      {review.category}
                    </Table.Cell>

                    <Table.Cell>
                      {review.rating}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
        </>
      }

      {error && <Alert color='failure' className='mt-5'>{error}</Alert>}
    </div>
  )
}
