"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { login, setToken, isLogin } = useUserStore();

  // Si ya está logueado, redirigir al dashboard
  useEffect(() => {
    if (isLogin) {
      router.push('/');
    }
  }, [isLogin, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí iría la lógica de autenticación
    // Por ahora solo simulamos el login
    const mockUser = {
      id: '1',
      name: 'Admin Principal',
      email: email || 'admin@inmogestion.mx',
      blocked: false,
      confirmed: true,
    };

    login(mockUser);
    setToken('mock-token-12345');

    router.push('/');
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
                  className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder:text-gray-400"
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
                  className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
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

            <button type="submit"
              className="w-full bg-property_purple hover:bg-property_purple/90 text-white py-3 rounded-lg font-medium
             focus:outline-none focus:ring-2 focus:ring-property_purple focus:ring-offset-2
             transition-all shadow-sm"
            >
              Iniciar sesión
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
