import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function submit(e) {
    e.preventDefault();
    // TODO: signup logic
    nav("/login");
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
