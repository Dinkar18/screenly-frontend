import HomePage from '@/features/home/components/HomePage';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
