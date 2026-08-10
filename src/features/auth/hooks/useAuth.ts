import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { LoginCredentials, RegisterCredentials } from '../types';
import axios from 'axios';

import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const { toast } = useToast();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials.email, credentials.password),
    onSuccess: async (data, variables) => {
      try {
        const role = data.role;
        setAuth({ email: data.email || variables.email || '', role });
        
        toast('Welcome back!', 'success');
        if (role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } catch (e) {
        toast('Failed to set user details after login', 'error');
      }
    },
    onError: (error) => {
      let msg = 'Login failed';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          msg = error.response.data.errors.join('\n');
        } else if (error.response?.data?.detail) {
          msg = error.response.data.detail;
        } else if (error.response?.data?.message) {
          msg = error.response.data.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast(msg, 'error');
    }
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials.name, credentials.email, credentials.password),
    onSuccess: () => {
      toast('Registration successful! Please check your email for OTP.', 'success');
    },
    onError: (error) => {
      let msg = 'Registration failed';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          msg = error.response.data.errors.join('\n');
        } else if (error.response?.data?.detail) {
          msg = error.response.data.detail;
        } else if (error.response?.data?.message) {
          msg = error.response.data.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast(msg, 'error');
    }
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast('Email verified successfully! Please login.', 'success');
      router.push('/login');
    },
    onError: (error) => {
      let msg = 'Verification failed';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          msg = error.response.data.errors.join('\n');
        } else if (error.response?.data?.detail) {
          msg = error.response.data.detail;
        } else if (error.response?.data?.message) {
          msg = error.response.data.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast(msg, 'error');
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast('Password reset link sent to your email', 'success');
    },
    onError: (error) => {
      let msg = 'Failed to send reset link';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          msg = error.response.data.errors.join('\n');
        } else if (error.response?.data?.detail) {
          msg = error.response.data.detail;
        } else if (error.response?.data?.message) {
          msg = error.response.data.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast(msg, 'error');
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { email: string; token: string; newPassword: string }) => 
      authApi.resetPassword(data.email, data.token, data.newPassword),
    onSuccess: () => {
      toast('Password reset successfully. Please login.', 'success');
      router.push('/login');
    },
    onError: (error) => {
      let msg = 'Failed to reset password';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          msg = error.response.data.errors.join('\n');
        } else if (error.response?.data?.detail) {
          msg = error.response.data.detail;
        } else if (error.response?.data?.message) {
          msg = error.response.data.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast(msg, 'error');
    }
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingResetLink: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    logout: async () => {
      try {
        await authApi.logout();
      } catch (e) {
        console.error('Logout failed', e);
      }
      logout(); // clear Zustand store
      toast('Logged out successfully', 'info');
      router.push('/login');
    }
  };
};
