import { useQuery, useMutation } from "@tanstack/react-query";
import { GetProfileApi, LogoutApi, clearAuthHeader } from "./auth-api";
import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";

export const useGetProfile = () => useQuery({
  queryKey: ['profile'],
  queryFn: GetProfileApi,
  retry: 1,
  refetchOnWindowFocus: false,
});

export const useLogout = () => {
  const { logout } = useUserStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('refresh_token')
        : null;

      if (refreshToken) {
        await LogoutApi(refreshToken);
      }
    },
    onSuccess: () => {
      // Clear auth state
      logout();
      clearAuthHeader();

      // Redirect to sign-in
      router.push('/sign-in');
      console.log("Successful logout");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if API fails, clear local state and redirect
      logout();
      clearAuthHeader();
      router.push('/sign-in');
    },
  });
};
