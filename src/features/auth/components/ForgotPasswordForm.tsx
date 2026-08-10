'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, isSendingResetLink, resetPassword, isResettingPassword } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      // Error handled by useAuth toast
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ email, token, newPassword });
    } catch (err) {
      // Error handled by useAuth toast
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Enter OTP</h1>
          <p className="text-sm text-muted-foreground">
            We've sent an OTP to <span className="font-medium text-white">{email}</span>.
          </p>
        </div>
        
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">OTP Token</Label>
            <Input 
              id="token"
              type="text" 
              placeholder="Enter 6-digit OTP" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="bg-zinc-900/50 border-zinc-800 tracking-widest text-center text-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input 
              id="newPassword"
              type="password" 
              placeholder="••••••••" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="bg-zinc-900/50 border-zinc-800"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-4" 
            disabled={isResettingPassword}
          >
            {isResettingPassword ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <button 
            type="button" 
            onClick={() => setSubmitted(false)}
            className="text-red-500 hover:text-red-400 font-medium underline underline-offset-4"
          >
            Change email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
        <p className="text-sm text-muted-foreground">
          No worries, we'll send you an OTP to reset it.
        </p>
      </div>

      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email" 
            placeholder="m@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-900/50 border-zinc-800"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700 text-white mt-4" 
          disabled={isSendingResetLink}
        >
          {isSendingResetLink ? "Sending OTP..." : "Send Reset OTP"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href="/login" className="text-red-500 hover:text-red-400 font-medium underline underline-offset-4">
          Back to log in
        </Link>
      </div>
    </div>
  );
}
