import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Table, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashReviews() {

  const { currentUser } = useSelector((state) => state.user);
  const [ userReviews, setUserReviews ] = useState([]);
  const [ showMore, setShowMore ] = useState(true);
  const [ showModal, setShowModal] = useState(false);
  const [ reviewIdToDelete, setReviewIdToDelete ] = useState('');
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/review/getreviews?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserReviews(data.reviews);
          if (data.reviews.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchReviews();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userReviews.length;
    try {
      const res = await fetch(`/api/review/getreviews?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserReviews((prev) => [...prev, ...data.reviews]);
        if (data.reviews.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch (`/api/review/deletereview/${reviewIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserReviews((prev) => 
          prev.filter((review) => review.id !== reviewIdToDelete)
        )
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark: scrollbar-track-slate-700'>
      {userReviews.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Author</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Rating</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
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

                  <Table.Cell>
                    <span onClick={() => {
                      setShowModal(true);
                      setReviewIdToDelete(review._id);
                      }}
                      className='text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <Link className='text-teal-500 hover:underline' to={`/update-review/${review._id}`}>
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          { showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
              Show More
            </button>
          )}
        </>
      ) : (
        <div className='flex flex-col justify-center items-center gap-8 mt-24'>
          <p className='font-semibold text-xl'>You have no reviews yet.</p>
          <Link to={'/create-review'}>
            <Button size='lg' gradientDuoTone='tealToLime'>Create a review</Button>
          </Link>
        </div>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
