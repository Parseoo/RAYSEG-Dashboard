"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { LoginApi, setAuthHeader } from '@/lib/api/auth/auth-api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, setToken, isLogin } = useUserStore();

  // Si ya está logueado, redirigir al dashboard
  useEffect(() => {
    if (isLogin) {
      router.push('/');
    }
  }, [isLogin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Preparar los datos de login
      const loginData = {
        email: email,
        password: password
      };

      console.log('📤 Enviando petición de login:', {
        url: 'http://localhost:8001/api/auth/login',
        data: loginData
      });

      // Llamar al API de Django
      const response = await LoginApi(loginData);

      console.log('✅ Respuesta del servidor:', response.data);

      // Verificar si la respuesta es exitosa
      // Django devuelve: { message, user, tokens: { access, refresh } }
      if (response.data && (response.data.token || response.data.tokens)) {
        const user = response.data.user;
        
        // Extraer el token (puede ser "token" o "tokens.access")
        const accessToken = response.data.token || response.data.tokens?.access;
        const refreshToken = response.data.tokens?.refresh;

        if (!accessToken) {
          console.error('❌ No se encontró token en la respuesta');
          setError('Error: No se recibió token de autenticación');
          return;
        }

        console.log('🔑 Token extraído:', accessToken);
        console.log('👤 Usuario extraído:', user);

        // Configurar el header de autorización para futuras peticiones
        setAuthHeader(accessToken);

        // Guardar en el store de Zustand
        login({
          id: user.id || user.userId || user.user_id || '1',
          name: user.name || user.username || user.first_name || user.email,
          email: user.email,
          blocked: user.blocked || user.is_blocked || false,
          confirmed: user.confirmed || user.is_active || true,
        });
        setToken(accessToken);

        // Si hay refresh token, también guardarlo (opcional)
        if (refreshToken) {
          console.log('🔄 Refresh token disponible:', refreshToken);
          // Podrías guardarlo en localStorage si lo necesitas
          localStorage.setItem('refresh_token', refreshToken);
        }

        console.log('✅ Login exitoso, redirigiendo al dashboard...');

        // Redirigir al dashboard
        router.push('/');
      } else {
        console.error('❌ Respuesta del servidor inválida:', response.data);
        setError('Respuesta del servidor inválida: No se encontró token');
      }
    } catch (err: any) {
      console.error('❌ Error al iniciar sesión:', err);
      console.error('📋 Detalles del error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers
      });
      
      // Manejar diferentes tipos de errores
      if (err.response) {
        // El servidor respondió con un código de error
        const status = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error || err.response.data?.detail;
        
        if (status === 401) {
          // Error de autenticación
          setError(serverMessage || 'Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (status === 400) {
          // Error de validación
          setError(serverMessage || 'Datos inválidos. Verifica que el email y contraseña sean correctos.');
        } else if (status === 404) {
          // Endpoint no encontrado
          setError('Endpoint no encontrado. Verifica que el backend esté correctamente configurado.');
        } else {
          // Otro error del servidor
          setError(serverMessage || `Error del servidor (${status})`);
        }
        
        // Mostrar más detalles en consola
        console.log('🔍 Respuesta completa del error:', JSON.stringify(err.response.data, null, 2));
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8001');
      } else {
        // Algo más falló
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
            {/* Mensaje de error */}
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
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_color focus:border-transparent outline-none transition-all text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
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
