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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
  keepLoggedIn: z.boolean().optional(),
});

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { keepLoggedIn: false },
  });

  const handleGetOTP = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await authAPI.sendOTP(data.email);
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to send OTP');
      } else {
        toast.error('Failed to send OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }
    setIsLoading(true);
    try {
      await authAPI.sendOTP(email);
      toast.success('OTP resent to your email!');
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || 'Failed to resend OTP');
      } else {
        toast.error('Failed to resend OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: { email: string; otp?: string; keepLoggedIn?: boolean }) => {
    setIsLoading(true);
    try {
      const response = await authAPI.verifyLoginOTP(data.email, data.otp || '');
      login(response.data.token, response.data.user);
      toast.success('Logged in successfully!');
    } catch (error: unknown) {
      if (typeof error === 'object' && error && 'response' in error) {
        const err = error as { response?: { status?: number; data?: { message?: string } } };
        if (err.response?.status === 404) {
          toast.error('User not found. Please sign up.');
        } else {
          toast.error(err.response?.data?.message || 'Failed to verify OTP');
        }
      } else {
        toast.error('Failed to verify OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={otpSent ? form.handleSubmit(handleLogin) : form.handleSubmit(handleGetOTP)}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
        <p className="mt-2 text-gray-600">Please login to continue to your account.</p>
      </div>
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
        <>
          <Input
            id="otp"
            label="OTP"
            type="text"
            placeholder="Enter OTP"
            maxLength={6}
            {...form.register('otp')}
            error={form.formState.errors.otp?.message}
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-blue-600 text-sm hover:underline"
              onClick={handleResendOTP}
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="keepLoggedIn"
              type="checkbox"
              {...form.register('keepLoggedIn')}
              className="h-4 w-4 border-gray-300 rounded"
            />
            <label htmlFor="keepLoggedIn" className="text-sm text-gray-700">
              Keep me logged in
            </label>
          </div>
        </>
      )}
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        {otpSent ? 'Sign In' : 'Get OTP'}
      </Button>

    </form>
  );
};