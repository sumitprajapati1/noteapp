'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    if (token && userId) {
      const fetchUserData = async () => {
        try {
          document.cookie = `token=${token}; path=/`;
          const userData = {
            id: userId,
            name: name || '',
            email: email || ''
          };
          login(token, userData);
          toast.success('Successfully logged in with Google!');
          router.push('/');
        } catch {
          toast.error('Authentication failed');
          router.push('/');
        }
      };
      fetchUserData();
    } else {
      router.push('/');
    }
  }, [login, router, searchParams]); // Add all referenced dependencies

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
