import { moviesApi } from '@/features/movies/api/movies';
import { notFound } from 'next/navigation';
import { Clock, Star, Calendar, Tag, Play } from 'lucide-react';
import Link from 'next/link';
import { BookingEngine } from '@/features/booking/components/BookingEngine';

export const dynamic = 'force-dynamic';

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function MovieDetailPage({ params }: MoviePageProps) {
  let movie;
  try {
    const resolvedParams = await params;
    movie = await moviesApi.getMovieById(resolvedParams.id);
  } catch (error) {
    return notFound();
  }

  if (!movie) {
    return notFound();
  }

  return (
    <div className="w-full flex flex-col -mt-16 pt-16 bg-background pb-32">
      {/* Cinematic Backdrop Banner */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
          ) : (
            <div className="w-full h-full bg-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center pt-8">
          <Link href="/" className="absolute top-8 left-4 sm:left-8 text-zinc-400 hover:text-white font-medium flex items-center gap-2 transition-colors">
            &larr; Back to Movies
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-end w-full">
            {/* Poster */}
            <div className="hidden md:block w-64 lg:w-80 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-border/50 shrink-0 transform translate-y-12">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-800" />
              )}
            </div>
            
            {/* Title & Info */}
            <div className="pb-4 md:pb-12 text-center md:text-left">
              <div className="bg-red-950/40 border border-red-900/50 backdrop-blur-md text-red-500 font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-sm mb-6">
                <Star className="h-4 w-4 fill-red-500" /> 
                <span className="text-white">8.5/10</span>
                <span className="text-red-500/70">| 12.4K Votes</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <span className="bg-white/10 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-white">IMAX</span>
                <span className="bg-white/10 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-white">4DX</span>
                <span className="bg-white/10 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-white">{movie.language || 'ENG'}</span>
              </div>
              
              <p className="text-zinc-300 max-w-3xl text-lg mb-8 line-clamp-4 md:line-clamp-none leading-relaxed">
                {movie.description}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-zinc-400 text-sm font-medium">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-500" /> {movie.durationMinutes} mins</span>
                <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-red-500" /> {movie.genre}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-500" /> {new Date(movie.releaseDate).toLocaleDateString()}</span>
                
                <button className="flex items-center gap-2 text-white hover:text-red-400 ml-4 transition-colors">
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-white" />
                  </div>
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Section */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12 md:mt-24">
        <BookingEngine movieId={movie.id.toString()} />
      </div>
    </div>
  );
}
