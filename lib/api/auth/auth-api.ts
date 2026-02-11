import { LoginForm, RegisterForm, ResetPasswordForm, LoginResponse } from "@/lib/@type";
import { httpClient } from "@/lib/api/fetch-client";

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

// Login API
export async function LoginApi(data: LoginForm) {
  return httpClient.post<LoginResponse>('/api/auth/login', data);
}

// Register API
export async function RegisterApi(data: RegisterForm) {
  return httpClient.post('/api/auth/register', data);
}

export async function ResetPasswordApi(data: ResetPasswordForm) {
  return httpClient.patch('/api/auth/reset-password', data);
}

export async function GetProfileApi() {
  return httpClient.get('/api/auth/me');
}

// Refresh Token API
export async function RefreshTokenApi(refreshToken: string) {
  return httpClient.post('/api/auth/refresh', { refresh: refreshToken });
}

export async function LogoutApi(refresh_token: string) {
  return httpClient.post('/api/auth/logout', { refresh: refresh_token });
}

httpClient.addResponseInterceptor(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (error?.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          return httpClient.request(originalRequest.url, {
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

      if (!refreshToken) {
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in';
        }
        return Promise.reject(error);
      }

      try {
        const response = await RefreshTokenApi(refreshToken);
        const newAccessToken = response.data.access || response.data.tokens?.access;
        const newRefreshToken = response.data.refresh || response.data.tokens?.refresh;

        if (typeof window !== 'undefined') {
          localStorage.setItem('jwtToken', newAccessToken);
          if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
        }

        setAuthHeader(newAccessToken);
        processQueue(null, newAccessToken);

        return httpClient.request(originalRequest.url, {
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('refresh_token');
          window.location.href = '/sign-in';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
