import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingFor, setError } from '../../../redux/slices/bookingSlice';
import { filter } from 'lodash';
import { setPackageFor } from '../../../redux/slices/PackageSlice';
import PackageDrawer from './SelectPackageDrawer';

const PackageCategory = (props) => {
  return (
    <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
      <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
        {props.title}
      </span>
      <PakcagePhotoCategory
        photocategorylist={props.photocategorylist}
        error={props.error}
        cat_id={props.cat_id}
      />
    </label>
  );
};

export default PackageCategory;

function PakcagePhotoCategory({ photocategorylist, cat_id }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({ name: 'Select', id: 0 });
  const [isshow, setisshow] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const error = useSelector((state) => state.package.error);
  const { studio } = useSelector((state) => state.package);
  useEffect(() => {
    if (photocategorylist && photocategorylist?.category_data?.length > 0) {
      setItems(photocategorylist?.category_data?.map((cat)=>{
        return {
          thumb:cat?.image,
          name:cat?.category_name,
          id:cat?.category_id
        }
      }));
      if (cat_id) {
        const data = filter(photocategorylist?.category_data, (item) => {
          return item.id === cat_id;
        });
        if (data && data.length > 0) {
          setSelected(data[0]);
          dispatch(setPackageFor(data[0]));
        }
      } else if (studio?.studio_id) {
        const c = studio && studio?.details && studio?.details[0].category_id;
        const data = filter(photocategorylist?.category_data, (item) => {
          return item.id === c;
        });
        if (data && data.length > 0) {
          setSelected(data[0]);
          dispatch(setPackageFor(data[0]));
        }
      } else {
        setSelected({ name: 'Select', id: '0' });
        dispatch(setPackageFor({ name: 'Select', id: '0' }));
      }
    }
  }, [photocategorylist, cat_id]);

  const changeList = (category) => {
    setSelected(category);
    if (category.name.toLowerCase() === 'select') {
      dispatch(setError('packageFor'));
    } else {
      dispatch(setError(null));
      dispatch(setPackageFor(category));
    }
    closeModal();
  };

  const openModal = () => {
    setisshow(true);
  };

  const closeModal = () => {
    setisshow(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value && value.length > 0) {
      const data = filter(photocategorylist?.data, (item) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      });
      setItems(data);
    } else {
      setItems(photocategorylist?.data);
    }
  };

  return (
    <>
      <PackageDrawer
        selected={selected}
        onChange={changeList}
        options={items}
        isShow={isshow}
        openModal={openModal}
        closeModal={closeModal}
        handleSearch={handleSearch}
        search={search}
        error={error}
      />
    </>
  );
}
