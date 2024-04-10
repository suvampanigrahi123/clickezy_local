import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';
import { StarIcon as SolidStar } from '@heroicons/react/20/solid';
const StudioRating = ({ studio_rating }) => {
  let rating;
  const totalStars = 5;
  let activeStars;
  if (studio_rating === undefined) {
    rating = 0;
  } else {
    activeStars = Math.floor(+studio_rating);
    rating = (+studio_rating)?.toFixed(1);
  }

  return (
    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
      <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative">
        <>
          {[...new Array(totalStars)].map((arr, index) => {
            return index < activeStars ? (
              <SolidStar key={index} color="#E09100" className="h-4 w-4" />
            ) : (
              <OutlineStar key={index} color="#E09100" className="h-4 w-4" />
            );
          })}
        </>
      </div>
      <p className="flex-grow-0 flex-shrink-0 text-xs text-left capitalize text-[#2fa3ff]">
        {rating}
      </p>
    </div>
  );
};

export default StudioRating;
