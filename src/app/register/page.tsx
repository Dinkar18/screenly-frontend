import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Ticket } from 'lucide-react';
import Link from 'next/link';
import { PublicRoute } from '@/components/auth/PublicRoute';

export default function RegisterPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Cinematic Left Side */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" 
            alt="Cinema" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply" />
        </div>
        
        <Link href="/" className="relative z-10 flex items-center gap-2 group w-fit">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <Ticket className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Cine<span className="text-red-500">Reserve</span>
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4">"Join the premium cinema club today."</h2>
          <p className="text-zinc-400">Unlock early access to blockbuster tickets, priority seating, and exclusive rewards.</p>
        </div>
      </div>

      {/* Form Right Side */}
      <div className="flex flex-col justify-center items-center p-8 bg-background relative">
        <Link href="/" className="md:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
            <Ticket className="h-4 w-4 text-white" />
          </div>
        </Link>
        
        <RegisterForm />
      </div>
    </div>
    </PublicRoute>
  );
}
