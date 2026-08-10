'use client';

import { cn } from '@/lib/utils';
import { Settings2 } from 'lucide-react';

export const GENRES = ['All', 'Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Family', 'Crime', 'Fantasy', 'History'];

interface FilterBarProps {
  activeGenre: string;
  onGenreChange: (genre: string) => void;
}

export function FilterBar({ activeGenre, onGenreChange }: FilterBarProps) {

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-border/50 mb-8 backdrop-blur-sm">
      
      {/* Genres */}
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-2 md:hidden">
          <Settings2 className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Genres</span>
        </div>
        <div className="flex flex-wrap gap-2 pb-2">
          {GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 border",
                activeGenre === genre
                  ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  : "bg-zinc-800/50 text-zinc-400 border-transparent hover:bg-zinc-800 hover:text-white"
              )}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
