import { orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAttribute } from '../../redux/eComSlices/attributeSlice';

const Attributes = ({ attributes }) => {
  const dispatch = useDispatch();
  const [checkAttributes, setCheckAttributes] = useState();

  const attribute = orderBy(
    attributes,
    [(e) => e.is_variation_set === 1],
    ['desc']
  ).filter((o) => o.is_show);

  const checkAttribute = (value, attr) => {
    setCheckAttributes((prev) => ({ ...prev, [attr]: value }));
  };
  useEffect(() => {
    const isAttributePresent = () => {
      dispatch(setAttribute(checkAttributes));
    };
    if (checkAttribute) {
      isAttributePresent();
    }
  }, [checkAttributes]);
  return (
    <>
      {attribute?.map((attr) => (
        <div
          className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2"
          key={attr.attribute_id}
        >
          {attr.is_variation_set === 1 && (
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
              <p className="flex-grow-0 flex-shrink-0 w-[342px] text-sm font-semibold text-left capitalize text-white">
                {attr.attribute_name}
              </p>
              <ul className="flex gap-2 attribute">
                {attr.values?.map((attrValue) => (
                  <li
                    className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2"
                    key={attrValue.attr_value_id}
                  >
                    <input
                      className="hidden"
                      type="radio"
                      name={attr.attribute_name}
                      id={attrValue.attr_value_id}
                      onClick={() =>
                        checkAttribute(attrValue, attr.attribute_name)
                      }
                    />
                    <label
                      className="flex justify-center items-center bg-transparent border-2 border-gray-500 text-white rounded-md cursor-pointer hover:bg-slate-950 px-3 py-2"
                      htmlFor={attrValue.attr_value_id}
                    >
                      {attrValue.attr_value}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {attr.is_variation_set === 0 && (
            <p className="flex-grow-0 flex-shrink-0 w-[342px] text-sm text-left">
              <span className="flex-grow-0 flex-shrink-0 w-[342px] text-sm font-semibold text-left capitalize text-white">
                {attr.attribute_name} :
              </span>
              <span className="flex-grow-0 flex-shrink-0 w-[342px] text-sm text-left text-white/80">
                {' '}
                {attr.values.map((item) => item.attr_value)}
              </span>
            </p>
          )}
        </div>
      ))}
    </>
  );
};

export default Attributes;
