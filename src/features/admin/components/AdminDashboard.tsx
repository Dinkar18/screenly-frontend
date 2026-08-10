'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Film, Search, Calendar, Clock, Image as ImageIcon, Type, Sparkles, Building2, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMovieForm } from '@/features/admin/hooks/useMovieForm';
import { PosterPreview } from '@/features/admin/components/PosterPreview';
import { TheaterManager } from '@/features/admin/components/TheaterManager';
import { ScreenManager } from '@/features/admin/components/ScreenManager';
import { ShowtimeManager } from '@/features/admin/components/ShowtimeManager';

import { MovieManager } from '@/features/admin/components/MovieManager';

type Tab = 'movies' | 'theaters' | 'screens' | 'showtimes';

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('movies');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'movies', label: 'Movies', icon: <Film className="w-4 h-4" /> },
    { id: 'theaters', label: 'Theaters', icon: <Building2 className="w-4 h-4" /> },
    { id: 'screens', label: 'Screens', icon: <Monitor className="w-4 h-4" /> },
    { id: 'showtimes', label: 'Showtimes', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-950 flex items-center justify-center border border-red-900/50">
            <Film className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Cinema CMS</h1>
            <p className="text-zinc-400 text-sm">Manage movies, showtimes, and theaters</p>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800 self-start md:self-auto overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Content based on Active Tab */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'movies' && <MovieManager />}
          {activeTab === 'theaters' && <TheaterManager />}
          {activeTab === 'screens' && <ScreenManager />}
          {activeTab === 'showtimes' && <ShowtimeManager />}

        </div>

        {/* Right Column: Contextual Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {activeTab !== 'movies' && (
            <div className="bg-zinc-900/50 border border-border/50 p-6 rounded-2xl backdrop-blur-sm sticky top-24">
              <h3 className="font-bold text-white mb-2">Inventory Management</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Ensure you create Theaters and Screens before scheduling Showtimes.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className={`mt-0.5 rounded-full p-1 ${activeTab === 'theaters' ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
                    <Building2 className="w-3 h-3" />
                  </div>
                  <span className={activeTab === 'theaters' ? 'text-white' : 'text-zinc-500'}>1. Add a Theater location</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`mt-0.5 rounded-full p-1 ${activeTab === 'screens' ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
                    <Monitor className="w-3 h-3" />
                  </div>
                  <span className={activeTab === 'screens' ? 'text-white' : 'text-zinc-500'}>2. Add physical Screens to the theater</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={`mt-0.5 rounded-full p-1 ${activeTab === 'showtimes' ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
                    <Calendar className="w-3 h-3" />
                  </div>
                  <span className={activeTab === 'showtimes' ? 'text-white' : 'text-zinc-500'}>3. Schedule movie showtimes on those screens</span>
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
