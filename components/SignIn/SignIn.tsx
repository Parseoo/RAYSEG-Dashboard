"use client"

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Enviar petición al backend
      const response = await fetch(`${process.env.HOST_API}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          name
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error en el registro');
        return;
      }

      const data = await response.json();

      // Redirigir al login después del registro exitoso
      router.push('/sign-in');
    } catch (err: any) {
      setError('Error al procesar el registro. Intenta nuevamente.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6'>Registrarse</h2>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4'>
            <p className='text-sm text-red-800'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='name' className='block text-md font-medium text-gray-700 mb-3'>Nombre</label>
            <Input
              title='Ingresa tu nombre'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='username' className='block text-md font-medium text-gray-700 mb-3'>Usuario</label>
            <Input
              title='Ingresa tu usuario'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='email' className='block text-md font-medium text-gray-700 mb-3'>Correo electrónico</label>
            <Input
              title='Ingresa tu correo'
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-md font-medium text-gray-700 mb-3'>Contraseña</label>
            <Input
              title='Ingresa tu contraseña'
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='flex items-center'>
            <input
              id='rememberMe'
              name='rememberMe'
              type='checkbox'
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor='rememberMe' className='ml-2 block text-sm text-gray-900'>
              Recordarme por 30 días
            </label>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>

        <p className='mt-6 text-center text-sm text-gray-600'>
          ¿Ya tienes cuenta?{' '}
          <a href='/sign-in' className='font-medium text-indigo-600 hover:text-indigo-500'>
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
