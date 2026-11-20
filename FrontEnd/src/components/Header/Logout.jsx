import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import API from "../../api";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      // Call backend logout API
      await API.post("/users/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Always clear local state and reset Redux state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(logout());
    }
  };

  return (
    <button
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full cursor-pointer"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
