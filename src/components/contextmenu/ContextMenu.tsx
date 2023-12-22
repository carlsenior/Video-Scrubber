import React, { useEffect, useRef } from "react";

const ContextMenu = ({
  closeMenu,
  position,
}: {
  closeMenu: () => void;
  position: {
    x: number;
    y: number;
  };
}) => {
  const menuRef = useRef(null);

  const handleShowMenu = (e: any) => {
    if (e.target != menuRef.current) {
      closeMenu();
    }
  };

  const splitMedia = () => {
    console.log("split");
  };

  useEffect(() => {
    window.addEventListener("click", handleShowMenu);
    return () => {
      window.removeEventListener("click", handleShowMenu);
    };
  });
  return (
    <div
      className="absolute left-0 top-0 bg-black z-30 rounded"
      ref={menuRef}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="flex justify-end p-1">
        <button
          onClick={closeMenu}
          type="button"
          className="text-[#fff] hover:text-[#000] hover:bg-gray-200 transition-all ease-linear p-1 rounded"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <ul className="menu flex flex-col shadow-xl overflow-hidden">
        <li
          onClick={splitMedia}
          className="flex cursor-pointer items-center hover:bg-gray-200 hover:text-gray-800 transition-all ease-linear dark:hover:bg-gray-800/50 p-2 w-full h-full text-white-700 relative min-w-[200px]"
        >
          <svg
            fill="currentColor"
            className="w-4 h-4 "
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/1999/xlink"
            viewBox="0 0 30.556 30.556"
          >
            <path
              d="M26.311,23.224c-0.812-1.416-2.072-2.375-3.402-2.736c-1.051-0.287-2.141-0.199-3.084,0.334l-2.805-4.904
		c1.736-3.463,5.633-11.227,6.332-12.451C24.258,1.884,22.637,0,22.637,0l-7.36,12.872L7.919,0c0,0-1.62,1.884-0.715,3.466
		c0.7,1.225,4.598,8.988,6.332,12.451l-2.804,4.904c-0.943-0.533-2.035-0.621-3.084-0.334c-1.332,0.361-2.591,1.32-3.403,2.736
		c-1.458,2.547-0.901,5.602,1.239,6.827c0.949,0.545,2.048,0.632,3.107,0.345c1.329-0.363,2.591-1.322,3.402-2.735
		c0.355-0.624,0.59-1.277,0.71-1.926v0.001c0.001-0.005,0.001-0.01,0.006-0.015c0.007-0.054,0.017-0.108,0.022-0.167
		c0.602-4.039,1.74-6.102,2.545-7.104c0.807,1.002,1.946,3.064,2.547,7.104c0.006,0.059,0.016,0.113,0.021,0.167
		c0.004,0.005,0.004,0.01,0.006,0.015v-0.001c0.121,0.648,0.355,1.302,0.709,1.926c0.812,1.413,2.074,2.372,3.404,2.735
		c1.059,0.287,2.158,0.2,3.109-0.345C27.213,28.825,27.768,25.771,26.311,23.224z M9.911,26.468
		c-0.46,0.803-1.189,1.408-1.948,1.615c-0.338,0.092-0.834,0.148-1.289-0.113c-0.97-0.555-1.129-2.186-0.346-3.556
		c0.468-0.812,1.177-1.403,1.95-1.614c0.335-0.091,0.831-0.146,1.288,0.113C10.537,23.47,10.695,25.097,9.911,26.468z M23.881,27.97
		c-0.455,0.262-0.949,0.205-1.287,0.113c-0.76-0.207-1.488-0.812-1.949-1.615c-0.783-1.371-0.625-2.998,0.346-3.555
		c0.457-0.26,0.953-0.204,1.289-0.113c0.771,0.211,1.482,0.802,1.947,1.614C25.01,25.784,24.852,27.415,23.881,27.97z"
            />
          </svg>
          <span>&nbsp;Split</span>
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
