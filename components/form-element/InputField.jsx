const InputField = ({
  value = '',
  defaultValue = null,
  className = '',
  name = '',
  placeholder = '',
  type = 'text',
  onChange,
  readonly = '',
  error = null,
  min = '',
  max = '',
  disabled = '',
  autoComplete,
}) => (
  <>
    <input
      type={type}
      value={value}
      name={name}
      className={className}
      placeholder={placeholder}
      onChange={onChange}
      readOnly={readonly}
      disabled={disabled}
      min={min}
      max={max}
      autoComplete={autoComplete ? 'on' : 'off'}
      {...(defaultValue && { defaultValue })}
    />

    {error && <small className="text-red-500">{error}</small>}
  </>
);

export default InputField;
