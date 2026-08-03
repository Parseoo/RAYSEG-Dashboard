import { useQuery, useMutation } from "@tanstack/react-query";
import { GetProfileApi, LogoutApi, LoginApi, RegisterApi, setAuthHeader, clearAuthHeader } from "./auth-api";
import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import { LoginForm, RegisterForm } from "@/lib/@type";

export const useGetProfile = () => useQuery({
  queryKey: ['profile'],
  queryFn: GetProfileApi,
  retry: 1,
  refetchOnWindowFocus: false,
});

export const useLogin = () => {
  const { setToken, login } = useUserStore();
  const router = useRouter();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: (data: LoginForm) => LoginApi(data),
    onSuccess: (response) => {
      if (response.data && (response.data.tokens?.access || response.data.tokens)) {
        const user = response.data.user;
        const accessToken = response.data.tokens?.access;
        const refreshToken = response.data.tokens?.refresh;

        if (!accessToken) {
          throw new Error("No access token received");
        }

        setAuthHeader(accessToken);

        // Update store
        login(user, accessToken);

        // Persist refresh token (access token stored by Zustand persist)
        if (typeof window !== 'undefined') {
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
        }

        router.push('/');
      } else {
        // Force error if response structure is invalid
        throw new Error("Invalid response from server");
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  })
}

export const useRegister = () => {
  const { setToken, login } = useUserStore();
  const router = useRouter();

  return useMutation({
    mutationKey: ['register'],
    mutationFn: (data: RegisterForm) => RegisterApi(data),
    onSuccess: (response) => {
      console.log('Registration successful');
      // Assuming register automatically logs in or returns similar structure
      if (response.data && (response.data.tokens?.access)) {
        const user = response.data.user;
        const accessToken = response.data.tokens?.access;
        setAuthHeader(accessToken);
        login(user, accessToken);
        router.push('/');
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  })
}

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