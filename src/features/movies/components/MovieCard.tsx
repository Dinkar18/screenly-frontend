'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Movie } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Film } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export function MovieCard({ movie, index }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);

  // Staggered animation based on index
  const cardVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link href={`/movie/${movie.id}`}>
        <Card className="group overflow-hidden border-border/50 bg-card hover:border-red-900/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)] h-full flex flex-col">
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            {movie.posterUrl && !imgError ? (
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-zinc-900 border border-zinc-800">
                <Film className="w-10 h-10 mb-2 opacity-20" />
                <span className="text-xs opacity-50">No Poster</span>
              </div>
            )}
            
            {/* Ambient hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          <CardContent className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-lg leading-tight mb-1 truncate">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-amber-500" />
                4.8
              </span>
              <span>•</span>
              <span className="uppercase tracking-wider">{movie.language || 'ENG'}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
