import { LoginForm, LoginResponse, AuthUserResponse } from "@/lib/@type";
import { httpClient } from "@/lib/api/fetch-client";
import { useUserStore } from "@/lib/store/userStore";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const setAuthHeader = (token: string) => {
  httpClient.setDefaultHeader('Authorization', `Bearer ${token}`);
};

export const clearAuthHeader = () => {
  httpClient.removeDefaultHeader('Authorization');
};

// Iniciar sesión
export async function LoginApi(data: LoginForm) {
  return httpClient.post<LoginResponse>('/api/auth/login', data);
}

// Obtener perfil
export async function GetProfileApi() {
  return httpClient.get<AuthUserResponse>('/api/auth/me');
}

// Refrescar token
export async function RefreshTokenApi(refreshToken: string) {
  return httpClient.post('/api/auth/refresh', { refresh_token: refreshToken });
}

// Cerrar sesión
export async function LogoutApi(refresh_token: string) {
  return httpClient.post('/api/auth/logout', { refresh_token: refresh_token });
}

httpClient.addRequestInterceptor((config) => {
  if (typeof window !== 'undefined') {
    const token = useUserStore.getState().token;
    if (token) {
      const hasAuth = Object.keys(config.headers || {}).some(
        (key) => key.toLowerCase() === 'authorization'
      );
      if (!hasAuth) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }
  }
  return config;
});

const handleSessionExpired = () => {
  if (typeof window !== 'undefined') {
    const store = useUserStore.getState();
    store.setSessionExpired(true);
    store.logout();
    clearAuthHeader();
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refresh_token');
    // The Layout component will detect the state change and handle the redirect
  }
};

const retryOriginalRequest = (originalRequest: any, token: string) => {
  return httpClient.request(originalRequest.url, {
    ...originalRequest,
    headers: {
      ...originalRequest.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

const refreshAccessToken = async (originalRequest: any, refreshToken: string) => {
  try {
    const response = await RefreshTokenApi(refreshToken);
    // Backend returns { access, refresh } directly (TokenResponseSchema)
    const newAccessToken = response.data.access;
    const newRefreshToken = response.data.refresh;

    if (typeof window !== 'undefined' && newRefreshToken) {
      localStorage.setItem('refresh_token', newRefreshToken);
    }

    setAuthHeader(newAccessToken);
    useUserStore.getState().setToken(newAccessToken);
    processQueue(null, newAccessToken);

    return retryOriginalRequest(originalRequest, newAccessToken);
  } catch (refreshError) {
    processQueue(refreshError, null);
    handleSessionExpired();
    throw refreshError;
  } finally {
    isRefreshing = false;
  }
};

httpClient.addResponseInterceptor(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (error?.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      throw error;
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => retryOriginalRequest(originalRequest, token as string));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken =
      typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

    if (!refreshToken) {
      isRefreshing = false;
      handleSessionExpired();
      throw error;
    }

    return refreshAccessToken(originalRequest, refreshToken);
  }
);
