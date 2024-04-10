import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';
import {
  setPackageLocation,
  setError,
} from '../../../redux/slices/PackageSlice';
import PackageDrawer from './SelectPackageDrawer';

export const PackageLocation = (props) => {
  return (
    <>
      <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
          {props.title}
        </span>
        <PackageLocationList
          locationlist={props.locationlist}
          location_id={props.location_id}
        />
      </label>
    </>
  );
};

function PackageLocationList({ locationlist, location_id }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({ name: 'Select', id: 0 });
  const [isshow, setisshow] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const error = useSelector((state) => state.booking.error);
  const { packageLocation } = useSelector((state) => state.package);
  const router = useRouter();
  const { location_name, location_id: locationId } = router.query;
  /**
   * set location list
   * auto select location when location_id is not null
   * @param {*} locationlist
   */
  useEffect(() => {
    if (locationlist?.length > 0 && !packageLocation) {
      setItems(locationlist);
      if (location_name) {
        const data = locationlist?.filter((item) => {
          return item.id === locationId;
        });
        if (data && data.length > 0) {
          setSelected(data[0]);
          dispatch(setPackageLocation(data[0]));
        }
        return;
      }

      const data = filter(locationlist, (item) => {
        return item.id === location_id;
      });
      if (data && data.length > 0) {
        setSelected(data[0]);
        dispatch(setPackageLocation(data[0]));
      }
    } else if (packageLocation?.id) {
      setItems(locationlist);
      setSelected(packageLocation);
    }
  }, [locationlist]);
  /**
   * Open Modal
   */
  const openModal = () => {
    setisshow(true);
  };
  /**
   * Close Modal
   */
  const closeModal = () => {
    setisshow(false);
  };

  /**
   *  Change Location when select
   * @param {*} location
   */
  const changeList = (location) => {
    setSelected(location);
    if (location.name.toLowerCase() === 'select') {
      dispatch(setError('packageLocation'));
    } else {
      dispatch(setError(null));
      dispatch(setPackageLocation(location));
    }
    closeModal();
  };
  /**
   *
   * @param {*} handleSearch
   */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value && value.length > 0) {
      const data = filter(locationlist, (item) => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      });
      setItems(data);
    } else {
      setItems(locationlist);
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
        drawerLabel="Choose a Location"
      />
    </>
  );
}
