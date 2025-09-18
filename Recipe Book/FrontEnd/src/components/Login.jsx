import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login as loginUser } from "../services/auth";
import Button from "./Button";
import Input from "./Input";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    try {
      // Call backend login API
      const { user, token } = await loginUser(data.email, data.password);

    if (user && token) {
      dispatch(authLogin({ userData: user, token }));
      navigate("/");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 px-4 py-12">
      <div className="w-full max-w-lg bg-gray-400 rounded-xl p-10 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Log in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>

        {error && (
          <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit(login)} className="mt-6 space-y-5">
          <Input
            label="Email:"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: true,
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Invalid email address",
              },
            })}
          />

          <Input
            label="Password:"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />

          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
