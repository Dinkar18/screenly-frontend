'use client';

import { useState, useMemo } from 'react';
import { Showtime } from '../types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
  selectedShowtimeId: string | null;
  onSelectShowtime: (showtimeId: string) => void;
}

export function ShowtimeSelector({ showtimes, selectedShowtimeId, onSelectShowtime }: ShowtimeSelectorProps) {
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Group showtimes by Date string (YYYY-MM-DD)
  const groupedShowtimes = useMemo(() => {
    const groups: Record<string, Showtime[]> = {};
    showtimes.forEach(st => {
      const d = new Date(st.startTime);
      const dateStr = d.toISOString().split('T')[0];
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(st);
    });
    
    // Sort groups by date
    const sortedDates = Object.keys(groups).sort();
    
    // Initialize selected date if not set
    if (!selectedDateStr && sortedDates.length > 0) {
      setSelectedDateStr(sortedDates[0]);
    }
    
    return { groups, sortedDates };
  }, [showtimes, selectedDateStr]);

  const { groups, sortedDates } = groupedShowtimes;
  const currentShowtimes = selectedDateStr ? groups[selectedDateStr] || [] : [];

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(d);
  };

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-500" />
          Select Date
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {sortedDates.map((dateStr) => {
            const isSelected = selectedDateStr === dateStr;
            const [weekday, monthDay] = formatShortDate(dateStr).split(', ');
            
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDateStr(dateStr)}
                className={cn(
                  "flex flex-col items-center justify-center shrink-0 w-20 h-24 rounded-xl border transition-all duration-300",
                  isSelected 
                    ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800"
                )}
              >
                <span className="text-xs uppercase tracking-wider font-semibold mb-1">{weekday}</span>
                <span className="text-xl font-bold">{monthDay.split(' ')[1]}</span>
                <span className="text-xs">{monthDay.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selector */}
      {selectedDateStr && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Times</h3>
          
          {currentShowtimes.length === 0 ? (
            <p className="text-zinc-500 text-sm">No showtimes available for this date.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentShowtimes.map((st) => {
                const isSelected = selectedShowtimeId === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => onSelectShowtime(st.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300",
                      isSelected
                        ? "bg-red-950/40 border-red-500 text-white ring-1 ring-red-500"
                        : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
                    )}
                  >
                    <span className="text-lg font-bold mb-1">{formatTime(st.startTime)}</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">{st.format}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
