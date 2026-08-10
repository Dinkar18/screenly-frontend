'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function OTPForm() {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulate backend call
    setTimeout(() => {
      setIsVerifying(false);
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit verification code to your email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 flex flex-col items-center">
          <Label htmlFor="otp" className="sr-only">One Time Password</Label>
          <Input 
            id="otp"
            type="text" 
            placeholder="0 0 0 0 0 0" 
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
            className="bg-zinc-900/50 border-zinc-800 text-center text-3xl tracking-[1em] font-mono h-16"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700 text-white" 
          disabled={isVerifying || otp.length !== 6}
        >
          {isVerifying ? "Verifying..." : "Verify Account"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Didn't receive a code?{' '}
        <button className="text-red-500 hover:text-red-400 font-medium underline underline-offset-4">
          Resend
        </button>
      </div>
    </div>
  );
}
