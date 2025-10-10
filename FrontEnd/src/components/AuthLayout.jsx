import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login as setAuth } from "../store/authSlice";
import API from "../api.js";

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);


  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      let isLoggedIn = false;
  
      if (token) {
        // only hit the API on initial load
        const res = await API.get("/auth/me");
        if (res.data.success) {
          dispatch(setAuth({ status: true, user: res.data.user }));
          isLoggedIn = true;
        } else {
          dispatch(setAuth({ status: false, user: null }));
        }
      } else {
        dispatch(setAuth({ status: false, user: null }));
      }
  
      if (authentication && !isLoggedIn) navigate("/login");
      if (!authentication && isLoggedIn) navigate("/");
    };
  
    checkAuth();
  }, [navigate, authentication, dispatch]);
  

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
