'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Ticket, User, Menu, Search, X, LogOut, Film } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

import { useDebounce } from '@/hooks/useDebounce';
import { useMovies } from '@/features/movies/hooks/useMovies';
import { useMemo } from 'react';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: moviesData } = useMovies();
  const movies = moviesData?.content || [];

  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery || !movies) return [];
    return movies.filter((m: any) => m.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())).slice(0, 5);
  }, [debouncedSearchQuery, movies]);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all">
              <Film className="h-4 w-4 text-white animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              Screen<span className="text-red-500">ly</span>
            </span>
          </Link>

          {/* Desktop Nav & Search */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
            
            {/* Search Bar */}
            <div className="flex items-center justify-end flex-1 mr-4">
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 300, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="relative overflow-visible"
                  >
                    <input 
                      type="text" 
                      placeholder="Search movies..."
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
                          setIsSearchOpen(false);
                        }
                      }}
                      className="w-full bg-zinc-900/80 border border-zinc-700 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <button 
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {/* Auto-suggestion Dropdown */}
                    {searchResults.length > 0 && isSearchOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50">
                        {searchResults.map((movie: any) => (
                          <Link 
                            key={movie.id} 
                            href={`/movie/${movie.id}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-zinc-900 transition-colors border-b border-zinc-800/50 last:border-0"
                          >
                            <img src={movie.posterUrl} alt={movie.title} className="w-10 h-14 object-cover rounded bg-zinc-800" />
                            <div>
                              <p className="text-white text-sm font-medium">{movie.title}</p>
                              <p className="text-zinc-500 text-xs">{movie.genre}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0">
              Movies
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0">
              My Bookings
            </Link>
            
            <div className="w-px h-6 bg-border mx-2 shrink-0"></div>
            
            {user ? (
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm font-medium text-zinc-300">
                  {user.name || user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2 text-red-500 hover:text-red-400 hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="shrink-0">
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <User className="h-4 w-4" />
                    Log In
                  </Button>
                </Link>
                <Link href="/register" className="shrink-0">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Search */}
          <div className="md:hidden flex items-center gap-2">

            <button className="p-2 text-zinc-400">
              <Search className="h-5 w-5" />
            </button>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
