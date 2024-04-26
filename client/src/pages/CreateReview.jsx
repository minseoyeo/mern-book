import { Select, TextInput, Button, Alert } from 'flowbite-react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

export default function CreateReview() {

  const [ formData, setFormData ] = useState({});
  const [ createError, setCreateError ] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.message);
        return;
      } 
      if (res.ok) {
        setCreateError(null);
        navigate(`/review/${data.slug}`);
      }
    } catch (error) {
      setCreateError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a Review</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <div className="flex flex-col gap-4 flex-1">
            <TextInput
              type='text'
              placeholder='Title'
              required
              id='title'
              className='flex-1'
              onChange={(e) => setFormData({ ...formData, title: e.target.value})}
            />
            <TextInput
              type='text'
              placeholder='Author'
              required
              id='author'
              className='flex-1'
              onChange={(e) => setFormData({ ...formData, author: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-4 flex-2">
            <Select
              onChange={(e) => setFormData({ ...formData, category: e.target.value})}
            >
              <option value="uncategorized">Select a category</option>
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
            <Select
              onChange={(e) => setFormData({ ...formData, rating: e.target.value})}
            >
              <option value="rating">Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
          </div>
        </div>
        <ReactQuill
          theme='snow'
          className='h-72 mb-12'
          required
          onChange={(value) => setFormData({ ...formData, content: value})}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>Create</Button>
        {createError && <Alert className='mt-5' color='failure'>{createError}</Alert>}
      </form>
    </div>
  )
}
