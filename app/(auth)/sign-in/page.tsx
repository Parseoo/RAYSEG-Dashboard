"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { LoginApi, setAuthHeader } from '@/lib/api/auth/auth-api';
import { LoginForm } from '@/lib/@type';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useUserStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('session_expired') === 'true') {
      setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      // Limpiar el parámetro de la URL
      router.replace('/sign-in');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loginData: LoginForm = {
        email: email,
        password: password
      };

      const response = await LoginApi(loginData);
      console.log('Login Response:', response);

      if (response.data && (response.data.tokens.access || response.data.tokens)) {
        const user = response.data.user;
        const accessToken = response.data.tokens?.access;
        const refreshToken = response.data.tokens?.refresh;

        if (!accessToken) {
          setError('Error: No se recibió token de autenticación');
          return;
        }

        setAuthHeader(accessToken);

        // Mapear el usuario de la respuesta al formato de nuestro store
        login({
          id: user.id,
          email: user.email,
          name: user.name,
          paternal_last_name: user.paternal_last_name,
          maternal_last_name: user.maternal_last_name,
          is_active: user.is_active,
          is_staff: user.is_staff,
          is_superuser: user.is_superuser
        }, accessToken);

        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }

        router.push('/');
      } else {
        setError('Respuesta del servidor inválida: No se encontró token');
      }
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error || err.response.data?.detail;

        if (status === 401) {
          setError(serverMessage || 'Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (status === 400) {
          setError(serverMessage || 'Datos inválidos. Verifica que el email y contraseña sean correctos.');
        } else if (status === 404) {
          setError('Endpoint no encontrado. Verifica que el backend esté correctamente configurado.');
        } else {
          setError(serverMessage || `Error del servidor (${status})`);
        }
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      } else {
        setError('Error al procesar la solicitud');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Logo RAYSEG"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Iniciar sesión</h2>
            <p className="text-gray-500 text-sm">
              Accede al panel para administrar propiedades, leads y el contenido de tu sitio inmobiliario.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@inmobiliaria.com"
                  required
                  disabled={isLoading}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_color focus:border-transparent outline-none transition-all text-gray-800 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="block w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_color focus:border-transparent outline-none transition-all text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                Recordarme
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary_color text-white py-3 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary_color focus:ring-offset-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Acceso exclusivo para usuarios de la plataforma de gestión inmobiliaria.
          </p>
        </div>
      </div>
    </div>
  );
}
