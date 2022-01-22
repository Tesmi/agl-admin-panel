import * as React from 'react';

function MinimizeIcon(props) {
  return (
    <svg
      aria-hidden="true"
      data-prefix="fas"
      data-icon="window-minimize"
      className="prefix__svg-inline--fa prefix__fa-window-minimize prefix__fa-w-16"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={props.width}
      height={props.height}
      style={props.style}
    >
      <path
        fill={props.color}
        d="M464 352H48c-26.5 0-48 21.5-48 48v32c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-32c0-26.5-21.5-48-48-48z"
      />
    </svg>
  );
}

export default MinimizeIcon;
