 
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth';

 
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: authApi.getUsers,
    staleTime: 60_000,
  });
}
 
export function useUserProfile(id) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => authApi.getUserProfile(id),
    enabled: !!id,
  });
}