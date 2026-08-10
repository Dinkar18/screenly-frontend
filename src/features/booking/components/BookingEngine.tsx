'use client';

import { useState, useEffect } from 'react';
import { ShowtimeSelector } from './ShowtimeSelector';
import { SeatMap } from './SeatMap';
import { bookingApi } from '../api/booking';
import { Showtime } from '../types';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingEngineProps {
  movieId: string;
}

export function BookingEngine({ movieId }: BookingEngineProps) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookingApi.getShowtimes(movieId).then(data => {
      setShowtimes(data);
      if (data.length > 0) {
        // We let ShowtimeSelector set the first available date
        // But for time, we can leave it null until user clicks one
      }
      setIsLoading(false);
    });
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="bg-card rounded-2xl p-6 md:p-8 shadow-xl border border-border/50">
        <ShowtimeSelector 
          showtimes={showtimes}
          selectedShowtimeId={selectedShowtimeId}
          onSelectShowtime={setSelectedShowtimeId}
        />
      </div>

      <AnimatePresence mode="wait">
        {selectedShowtimeId ? (
          <motion.div 
            key="seatmap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-2xl p-6 md:p-10 shadow-xl border border-border/50"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">Select Your Seats</h2>
            <SeatMap 
              showtimeId={selectedShowtimeId} 
              basePrice={showtimes.find(s => s.id === selectedShowtimeId)?.price || 15} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[400px] flex items-center justify-center border-2 border-dashed border-border/50 rounded-2xl bg-zinc-900/30"
          >
            <p className="text-zinc-500 font-medium">Please select a showtime to view available seats.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
