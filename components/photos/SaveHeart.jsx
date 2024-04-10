import { HeartIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import * as api from '../../services/userService';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/router';

const Likebutton = ({ heartCount, isLiked, imageId, mutate }) => {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [toggle, setToggle] = useState(isLiked);
  const [isActive, setIsActive] = useState(false);
  const [heart, setHeart] = useState(heartCount || 0);
  const { userId } = useUser();
  const [view, setView] = useState(false);
  useEffect(() => {
    setHeart(heartCount);
    setToggle(isLiked);
  }, [heartCount, isLiked]);

  const handleLikeDislike = (e) => {
    e.preventDefault();
    if (isActive) {
      return;
    }
    setToggle(!toggle);
    if (toggle) {
      setLiked(!liked);
      saveLike(0);
      setHeart((prev) => prev - 1);
    } else {
      setLiked(!liked);
      saveLike(1);
      setHeart((prev) => prev + 1);
    }
  };

  const saveLike = async (payload) => {
    try {
      if (!userId) {
        router.push('/login');
        return;
      }
      setIsActive(true);
      const data = await api.saveHeart({
        is_heart: payload,
        user_id: userId,
        image_id: imageId,
      });
      if (Number(payload) === 1) {
        const payload = {
          user_id: userId,
          image_id: imageId,
        };
      }
      setView(true);
      if (data && data.status_code === 200) {
        setLiked(true);
        // mutate();
        setIsActive(false);
      } else {
        setIsActive(false);
      }
    } catch (error) {
      setIsActive(false);
      console.log(error);
    }
  };

  useEffect(() => {
    const ViewCount = async (payload) => {
      await api.sendViewCount(payload);
    };
    if (!userId) {
      return;
    }
    if (userId && view) {
      const payload = {
        user_id: userId,
        image_id: imageId,
      };
      ViewCount(payload);
    }
  }, [view]);

  return (
    <>
      <button
        className="group flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1 cursor-pointer"
        onClick={handleLikeDislike}
        disabled={isActive}
      >
        <HeartIcon
          className={`w-4 h-4 like-icon ${
            toggle ? 'text-red-600 liked' : 'text-white'
          }`}
        />
        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-white">
          {heart}
        </p>
      </button>
    </>
  );
};

export default Likebutton;
