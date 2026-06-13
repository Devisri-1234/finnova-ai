import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] =
  useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            formData
          ),
        }
      );

      if (res.ok) {
        navigate("/dashboard");
      } else {
        alert("Login Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-slate-700 rounded-3xl p-10">

        <h1 className="text-5xl font-extrabold text-center mb-3 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          FinNova AI
        </h1>

        <p className="text-center text-slate-400 mb-8">
          Welcome Back
        </p>

        <form
  onSubmit={loginUser}
  className="space-y-5"
>

  <input
    type="text"
    name="username"
    placeholder="Username"
    value={formData.username}
    onChange={handleChange}
    required
    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white"
  />

  <input
    type="email"
    name="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    required
    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white"
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white"
  />

  <button
    type="submit"
    className="w-full bg-gradient-to-r from-green-500 to-cyan-600 p-4 rounded-xl font-bold"
  >
    Login
  </button>

</form>

        <p className="text-center mt-6 text-slate-400">
          New User?

          <Link
            to="/register"
            className="text-cyan-400 ml-2"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;