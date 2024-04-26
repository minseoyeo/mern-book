import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';

export default function Search() {

  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl
      });
    }
    const fetchReviews = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/review/getreviews?${searchQuery}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }
      if (res.ok) {
        setReviews(data.reviews);
        setLoading(false);
        if (data.reviews.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchReviews();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    };
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order});
    };
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({...sidebarData, category}); 
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfReviews = reviews.length;
    const startIndex = numberOfReviews;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/review/getreviews?${searchQuery}`);
    if (!res.ok) {
      return;
    };
    if (res.ok) {
      const data = await res.json();
      setReviews([...reviews, ...data.reviews]);
      if (data.reviews.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:felx-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <TextInput
              placeholder='Search'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select id='sort' onChange={handleChange} value={sidebarData.sort}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select id='category' onChange={handleChange} value={sidebarData.category}>
              <option value="uncategorized">Uncategorized</option>
              <option value="romance">Romance</option>
              <option value="sci-fi">Sci-fi</option>
              <option value="action">Action</option>
              <option value="fiction">Fiction</option>
              <option value="nonFiction">Non Fiction</option>
              <option value="thriller">Thriller</option>
              <option value="mystery">Mystery</option>
              <option value="fantasy">Fantasy</option>
              <option value="horror">Horror</option>
              <option value="history">History</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Review Results:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && !error && reviews.length === 0 && (
            <p className='text-xl text-gray-500'>No reviews found.</p>
          )}
          {loading && !error && (
            <p className='text-xl text-gray-500'>Loading...</p>
          )}
          {!loading && !error && reviews && reviews.map((review) => (
            <ReviewCard key={review._id} review={review}/>
          ))}
          {showMore && (
            <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>Show More</button>
          )}
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  )
}
