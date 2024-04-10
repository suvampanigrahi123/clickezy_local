import useSwr from 'swr';
import * as api from '../../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setDefaultEquipments } from '../../../redux/slices/bookingSlice';
export const BookingEquipment = ({ title }) => {
  const dispatch = useDispatch();
  const { bookingFor, studio } = useSelector((state) => state.booking);

  const { data: defaultEquipment, isLoading } = useSwr(
    studio?.studio_id &&
      bookingFor?.id && ['defaultEquipment', bookingFor?.id, studio?.studio_id],
    () =>
      api.getDefaultEquipments({
        studio_id: studio?.studio_id,
        cat_id: bookingFor?.id,
      })
  );
  useEffect(() => {
    if (defaultEquipment?.data?.length > 0) {
      dispatch(setDefaultEquipments(defaultEquipment?.data));
    } else {
      dispatch(setDefaultEquipments([]));
    }
  }, [defaultEquipment]);
  return (
    <>
      {!isLoading && defaultEquipment?.data?.length > 0 && (
        <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
            {title}
          </span>
          <EquipmentList equipmentlist={defaultEquipment?.data} />
        </label>
      )}
    </>
  );
};

function EquipmentList({ equipmentlist }) {
  return (
    <div className="flex flex-wrap gap-[0.5rem] items-baseline  ">
      {equipmentlist &&
        equipmentlist?.map((equip, index) => (
          <div key={index}>
            <ul className="max-w-md  text-gray-500 list-inside dark:text-gray-400">
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5 text-green-500 dark:text-green-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div className="text-xs font-medium text-center text-white">
                  {`${equip.name}`} &nbsp;
                </div>

                <div className="text-xs font-medium text-center text-white">{`(${equip.type})`}</div>
              </li>
            </ul>
          </div>
        ))}
    </div>
  );
}
