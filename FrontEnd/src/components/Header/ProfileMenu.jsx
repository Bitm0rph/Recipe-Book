import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import LogoutBtn from "./Logout";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const menuRef = useRef(null);
  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const avatar = user?.avatar && !avatarLoadFailed
    ? (
      <img
        src={user.avatar}
        alt=""
        className="h-10 w-10 rounded-full object-cover"
        onError={() => setAvatarLoadFailed(true)}
      />
    )
    : <FaUserCircle className="h-10 w-10 text-gray-500" aria-hidden="true" />;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="profile-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        {avatar}
      </button>

      {isOpen && (
        <div
          id="profile-menu"
          className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            {avatar}
            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900">
                {user?.username || "Recipe Book user"}
              </p>
              <p className="truncate text-sm text-gray-600">{user?.email || ""}</p>
            </div>
          </div>
          <div className="pt-3">
            <LogoutBtn />
          </div>
        </div>
      )}
    </div>
  );
}
