import * as React from "react";
function SvgHome(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={24}
      viewBox="0 -960 960 960"
      width={24}
      fill="currentColor"
      {...props}
    >
      <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160zm320-350z" />
    </svg>
  );
}
export default SvgHome;
