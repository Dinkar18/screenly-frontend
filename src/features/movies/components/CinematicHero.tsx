'use client';

import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import Link from 'next/link';

interface CinematicHeroProps {
  movie: {
    id: string;
    title: string;
    description: string;
    bg: string;
    logo?: string;
  };
}

export function CinematicHero({ movie }: CinematicHeroProps) {
  return (
    <section className="relative w-full h-[85vh] md:h-[95vh] mb-12">
      <div className="absolute inset-0 z-0 bg-black">
        <motion.img 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          src={movie.bg} 
          alt={movie.title} 
          className="w-full h-full object-cover opacity-60" 
        />
        {/* Netflix-style gradient fades */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>
      
      <div className="relative z-10 w-full h-full flex items-center px-4 md:px-12 max-w-[1800px] mx-auto">
        <div className="max-w-2xl pt-24 md:pt-0">
          {movie.logo ? (
            <motion.img 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              src={movie.logo} 
              alt={movie.title} 
              className="h-24 md:h-32 mb-6 object-contain"
            />
          ) : (
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold text-white mb-4 text-shadow-cinematic"
            >
              {movie.title}
            </motion.h1>
          )}
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg md:text-2xl mb-8 line-clamp-3 text-shadow-cinematic font-medium"
          >
            {movie.description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              href={`/movie/${movie.id}`} 
              className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 md:py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all duration-300 glow-red hover:scale-105"
            >
              <Play className="w-6 h-6 fill-white" />
              Book Tickets
            </Link>
            <button 
              className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-3 md:py-4 rounded-lg font-bold text-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-md"
            >
              <Info className="w-6 h-6" />
              More Info
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
