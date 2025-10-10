import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import API from "../../api";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      // Call backend logout API
      await API.post("/users/logout");
  
      // Clear local state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
  
      // Reset Redux state
      dispatch(logout());
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
