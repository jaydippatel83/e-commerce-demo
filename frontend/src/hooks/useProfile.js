// src/hooks/useProfile.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { authApi } from "../api/auth";
import { updateUser, setCredentials } from "../redux/authSlice";

// The logged-in user's own profile (includes `verified`)
export function useMyProfile() {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: authApi.getMyProfile,
  });
}

// Update name / password — keeps Redux auth (and the fresh token) in sync
export function useUpdateProfile() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      const { token, ...user } = data;
      if (token) {
        dispatch(setCredentials({ token, user }));
      } else {
        dispatch(updateUser(user));
      }
    },
  });
}
