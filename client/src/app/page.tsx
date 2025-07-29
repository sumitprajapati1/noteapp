'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SignupForm } from '@/components/auth/SignupForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/Button';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {authMode === 'login' ? <LoginForm /> : <SignupForm />}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="font-medium text-blue-600 hover:text-blue-500 p-0 h-auto"
              >
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}