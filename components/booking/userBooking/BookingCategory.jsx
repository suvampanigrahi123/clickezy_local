import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingFor, setError } from '../../../redux/slices/bookingSlice';
import { filter } from 'lodash';
import Drawer from './SelectDrawer';

const BookingCategory = (props) => {
  return (
    <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
      <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
        {props.title}
      </span>
      <PhotoCategory
        photocategorylist={props.photocategorylist}
        error={props.error}
        cat_id={props.cat_id}
      />
    </label>
  );
};

export default BookingCategory;

function PhotoCategory({ photocategorylist, cat_id }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({ name: 'Select', id: 0 });
  const [isshow, setisshow] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const error = useSelector((state) => state.booking.error);
  const { studio } = useSelector((state) => state.booking);

  useEffect(() => {
    if (photocategorylist && photocategorylist.data?.length > 0) {
      setItems(photocategorylist.data);
      if (cat_id) {
        const data = filter(photocategorylist.data, (item) => {
          return item.id === cat_id;
        });
        if (data && data.length > 0) {
          setSelected(data[0]);
          dispatch(setBookingFor(data[0]));
        }
      } else if (studio?.studio_id) {
        const c = studio && studio?.details && studio?.details[0].category_id;
        const data = filter(photocategorylist.data, (item) => {
          return item.id === c;
        });
        if (data && data.length > 0) {
          setSelected(data[0]);
          dispatch(setBookingFor(data[0]));
        }
      } else {
        setSelected({ name: 'Select', id: '0' });
        dispatch(setBookingFor({ name: 'Select', id: '0' }));
      }
    }
  }, [photocategorylist, cat_id]);

  const changeList = (category) => {
    setSelected(category);
    if (category.name.toLowerCase() === 'select') {
      dispatch(setError('bookingFor'));
    } else {
      dispatch(setError(null));
      dispatch(setBookingFor(category));
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
      <Drawer
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
