import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyOTP } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const verifyOTP = useVerifyOTP();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOTP.mutate(
      { otp },
      {
        onSuccess: () => {
          toast.success("Email verified successfully!");
          setTimeout(() => navigate("/"), 1200);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Verify your email</h1>
        <p className="auth__subtitle">
          Enter the 6-digit code we sent to your inbox.
        </p>

        <label className="auth__field">
          <span>OTP</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            required
          />
        </label>

        <button className="auth__btn" type="submit" disabled={verifyOTP.isPending}>
          {verifyOTP.isPending ? "Verifying…" : "Verify"}
        </button>

        {verifyOTP.isSuccess && (
          <p className="auth__success">OTP verified! Redirecting…</p>
        )}
        {verifyOTP.isError && (
          <p className="auth__error">{getErrorMessage(verifyOTP.error)}</p>
        )}
      </form>
    </div>
  );
}

export default VerifyOTP;
