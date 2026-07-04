// src/hooks/useAuth.js
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { authApi } from "../api/auth";
import { setCredentials, updateUser } from "../redux/authSlice";

// Backend returns a FLAT payload: { _id, name, email, role, token, message }
// Split the token out and treat the rest as the user object.
const toCredentials = (data) => {
  const { token, message, ...user } = data;
  return { token, user };
};

// Register — returns a token immediately (user still needs to verify OTP)
export function useRegister() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      dispatch(setCredentials(toCredentials(data)));
    },
  });
}

// Login
export function useLogin() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(setCredentials(toCredentials(data)));
    },
  });
}

// Verify OTP (requires an authenticated token from register/login)
export function useVerifyOTP() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: authApi.verifyOTP,
    onSuccess: () => {
      dispatch(updateUser({ verified: true }));
    },
  });
}
