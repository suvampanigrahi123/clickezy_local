const SelectBox = ({
  title,
  name,
  options,
  onChange,
  defaultValue = null,
  error = null,
  value = '',
}) => {
  return (
    <>
      <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
        <div className="flex justify-between items-center w-full">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
            {title}
          </span>
          {error && <small className="text-xs text-red-500">{error}</small>}
        </div>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
            <select
              name={name}
              value={value}
              onChange={onChange}
              className="formInput w-full"
              {...(defaultValue && {
                defaultValue: defaultValue,
              })}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </label>
    </>
  );
};

export default SelectBox;
