import * as React from 'react';

function RestoreIcon(props) {
  return (
    <svg
      aria-hidden="true"
      data-prefix="far"
      data-icon="window-restore"
      className="prefix__svg-inline--fa prefix__fa-window-restore prefix__fa-w-16"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={props.width}
      height={props.height}
      style={props.style}
    >
      <path
        fill={props.color}
        d="M464 0H144c-26.5 0-48 21.5-48 48v48H48c-26.5 0-48 21.5-48 48v320c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48h48c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-96 464H48V256h320v208zm96-96h-48V144c0-26.5-21.5-48-48-48H144V48h320v320z"
      />
    </svg>
  );
}

export default RestoreIcon;