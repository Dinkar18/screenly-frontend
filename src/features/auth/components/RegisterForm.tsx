'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState('');
  
  const { register, isRegistering, verifyEmail, isVerifyingEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError('');
    if (name && email && password) {
      try {
        await register({ name, email, password });
        setSubmitted(true);
      } catch (err) {
        // Error handled by useAuth toast
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      try {
        await verifyEmail(token);
      } catch (err) {
        // Error handled by useAuth toast
      }
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Verify Email</h1>
          <p className="text-sm text-muted-foreground">
            We've sent an OTP to <span className="font-medium text-white">{email}</span>.
          </p>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-4">
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

          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white mt-4" 
            disabled={isVerifyingEmail}
          >
            {isVerifyingEmail ? "Verifying..." : "Verify Account"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <button 
            type="button" 
            onClick={() => setSubmitted(false)}
            className="text-red-500 hover:text-red-400 font-medium underline underline-offset-4"
          >
            Change details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name"
            type="text" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-zinc-900/50 border-zinc-800"
          />
        </div>

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
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password"
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-zinc-900/50 border-zinc-800"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword"
            type="password" 
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`bg-zinc-900/50 border-zinc-800 ${passwordError ? 'border-red-500' : ''}`}
          />
          {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700 text-white mt-2" 
          disabled={isRegistering}
        >
          {isRegistering ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-red-500 hover:text-red-400 font-medium underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}
