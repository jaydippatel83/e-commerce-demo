import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogin } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  // return the user to wherever ProtectedRoute bounced them from, else home
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    login.mutate(form, {
      onSuccess: (data) => {
        toast.success(`Welcome back, ${data.name}!`);
        navigate(from, { replace: true });
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__subtitle">Log in to continue shopping.</p>

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
            required
          />
        </label>

        <button className="auth__btn" type="submit" disabled={login.isPending}>
          {login.isPending ? "Logging in…" : "Login"}
        </button>

        {login.isError && (
          <p className="auth__error">{getErrorMessage(login.error)}</p>
        )}

        <p className="auth__alt">
          New to Trendora? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
