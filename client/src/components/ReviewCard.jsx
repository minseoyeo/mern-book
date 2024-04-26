import { Link } from "react-router-dom";

export default function ReviewCard({ review }) {
  return (
    <div className="hover:shadow-lg items-center justify-center max-w-72 max-h-44 p-4 flex flex-col relative border-2 border-teal-500 rounded-lg">
      <Link to={`/review/${review.slug}`} className="flex flex-col gap-3">
        <div className="flex flex-col gap-4">
          <div className="px-3">
            <h3 className="text-xl font-semibold line-clamp-1">{review.title}</h3>
            <h4 className="text-lg font-medium line-clamp-1">{review.author}</h4>
          </div>
        </div>
        <div className="flex justify-between gap-3 font-medium">
          <div className="flex gap-1">
            <p>rating:</p>
            <p>{review.rating}</p>
          </div>
          <p>{review.category}</p>
        </div>
      </Link>
    </div>
  )
}
