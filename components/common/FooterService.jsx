import React, { memo, useEffect } from 'react';
import useSWR from 'swr';
import * as api from '../../services/userService';
import Link from 'next/link';
import { setCategoryList } from '../../redux/slices/footerCategory';
import { useDispatch, useSelector } from 'react-redux';
const FooterService = () => {
  const dispatch = useDispatch();
  const { isCategoryExist, categoryList } = useSelector(
    (state) => state.footerCategory
  );
  const { data } = useSWR(!isCategoryExist && '/footer/categories', () =>
    api.getFooterCategories()
  );
  useEffect(() => {
    if (data) {
      dispatch(setCategoryList(data));
    }
  }, [data]);

  return (
    <>
      {categoryList?.slice(0, 6)?.map((cat, i) => (
        <Link
          href={{
            pathname: '/service',
            query: { id: cat?.category_id, name: cat?.category_name },
          }}
          className="flex-grow-0 flex-shrink-0 text-base text-white"
          key={i}
        >
          {cat?.category_name}
        </Link>
      ))}
    </>
  );
};

export default memo(FooterService);
