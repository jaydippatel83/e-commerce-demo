import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const register = useRegister();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    register.mutate(form, {
      // register returns a token → user is authed → send them to verify OTP
      onSuccess: () => navigate("/verify-otp"),
    });
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Create your account</h1>
        <p className="auth__subtitle">Join Trendora — fashion for every you.</p>

        <label className="auth__field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="auth__field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="auth__field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>

        <button className="auth__btn" type="submit" disabled={register.isPending}>
          {register.isPending ? "Creating account…" : "Register"}
        </button>

        {register.isError && (
          <p className="auth__error">{getErrorMessage(register.error)}</p>
        )}

        <p className="auth__alt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
