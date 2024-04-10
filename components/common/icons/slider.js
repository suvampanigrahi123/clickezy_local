const SliderIcon = (props) => (
  <svg
    width="360"
    height="15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="0">
        <stop id="gradient-grey" offset="0%" stopColor="#EAEEF4" />
        <stop id="gradient-stop" offset="0%" stopColor="#ff5757" />
      </linearGradient>
    </defs>
    <path
      d="M0 7.65377C0 6.22069 1.1207 5.01982 2.5 5L177.5 2.5L352.776 0.000723075C356.75 -0.0563631 360 3.27402 360 7.40212C360 11.5262 356.756 14.855 352.786 14.8037L177.5 13L2.5 10.5C1.11931 10.4821 0 9.08826 0 7.65377Z"
      fill="#ffffff"
      fillOpacity="0.16"
    />
  </svg>
);

export default SliderIcon;
