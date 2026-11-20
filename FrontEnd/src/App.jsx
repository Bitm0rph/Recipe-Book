import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import API from "./api";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined" || token === "null") {
        dispatch(logout());
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/users/auth/me");

        if (res.data && res.data.success) {
          dispatch(login({ userData: res.data.data, token }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Auth check failed:", error.response?.data || error.message);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-wrap content-between">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
