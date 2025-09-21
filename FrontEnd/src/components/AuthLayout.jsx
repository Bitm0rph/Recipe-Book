import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login as setAuth } from "../store/authSlice"; // <-- create this in Redux
import axios from "axios";

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);

  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Check if token exists
        const token = localStorage.getItem("token");
        if (token) {
          // 2. Verify token with backend
          const res = await axios.get("http://localhost:3000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data.success) {
            // 3. Update Redux auth state
            dispatch(setAuth({ status: true, user: res.data.user }));
          } else {
            dispatch(setAuth({ status: false, user: null }));
          }
        } else {
          dispatch(setAuth({ status: false, user: null }));
        }

        // 4. Redirect logic
        if (authentication && authStatus !== true) {
          navigate("/login");
        } else if (!authentication && authStatus === true) {
          navigate("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        dispatch(setAuth({ status: false, user: null }));
        if (authentication) navigate("/login");
      } finally {
        setLoader(false);
      }
    };

    checkAuth();
  }, [authStatus, navigate, authentication, dispatch]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
