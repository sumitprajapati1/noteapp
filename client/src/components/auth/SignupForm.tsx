'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of Birth is required'),
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
});

export const SignupForm: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(signupSchema),
  });

  const handleSendOTP = async (data: { name: string; dateOfBirth: string; email: string }) => {
    setIsLoading(true);
    try {
      await authAPI.sendOTP(data.email);
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data: { name: string; dateOfBirth: string; email: string; otp?: string }) => {
    setIsLoading(true);
    try {
      const response = await authAPI.verifySignupOTP(
        data.email,
        data.otp || '',
        data.name,
        data.dateOfBirth
      );
      login(response.data.token, response.data.user);
      toast.success('Account created successfully!');
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('This email is already registered. Please log in or use a different email.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to verify OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = authAPI.googleLogin();
  };

  return (
    <form
      onSubmit={otpSent ? form.handleSubmit(handleVerifyOTP) : form.handleSubmit(handleSendOTP)}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
        <p className="mt-2 text-gray-600">Sign up to enjoy the feature of HD</p>
      </div>
      <Input
        id="name"
        label="Your Name"
        type="text"
        placeholder="Enter your name"
        {...form.register('name')}
        error={form.formState.errors.name?.message}
        disabled={otpSent}
      />
      <Input
        id="dateOfBirth"
        label="Date of Birth"
        type="date"
        placeholder="Select your date of birth"
        {...form.register('dateOfBirth')}
        error={form.formState.errors.dateOfBirth?.message}
        disabled={otpSent}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        {...form.register('email')}
        error={form.formState.errors.email?.message}
        disabled={otpSent}
      />
      {otpSent && (
        <Input
          id="otp"
          label="OTP"
          type="text"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          {...form.register('otp')}
          error={form.formState.errors.otp?.message}
        />
      )}
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        {otpSent ? 'Verify' : 'Get OTP'}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignup}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>
      
    </form>
  );
};