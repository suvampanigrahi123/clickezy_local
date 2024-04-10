import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setDefaultAttributes,
  setPrice,
} from '../../redux/eComSlices/attributeSlice';

const DefaultAttributes = ({ attributes }) => {
  const dispatch = useDispatch();
  // const attribute = filter(attributes, (o) => o.is_default === 1);
  useEffect(() => {
    if (attributes) {
      dispatch(setDefaultAttributes(attributes));
      dispatch(setPrice(attributes?.price));
    }
  }, [attributes]);

  return (
    <>
      <div>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
          <ul className="flex flex-col gap-2 list-disc list-inside text-slate-900 dark:text-slate-200">
            {Object.entries(attributes?.attribute_value)?.map(
              ([key, value], index) => (
                <li key={index} className="flex items-center self-stretch ">
                  <svg
                    className="w-3.5 h-3.5 mr-2 text-green-500 dark:text-green-400 flex-shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span className="flex  text-white">{key}</span> &nbsp;
                  <span className="flex  text-white rounded-md ">{value}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default DefaultAttributes;
