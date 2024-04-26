import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen flex items-cneter justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font-semibold text-center my-7'>About Book Review</h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to this Book Review! 
            </p>
            <p>
              In this website, You can find books that you've been wanting to read!
            </p>
            <p>
              Before, you read the book by yourself, you can search about the book's reviews about how other people read about that!
            </p>
            <p>
              And also, You can share your own review about the book that you've read!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
