'use client';

import { useMovies } from '@/features/movies/hooks/useMovies';
import { FilterBar } from '@/features/movies/components/FilterBar';
import { LatestReleases3D } from '@/features/movies/components/LatestReleases3D';
import { HeroSection } from '@/features/home/components/HeroSection';
import { FeaturesSection } from '@/features/home/components/FeaturesSection';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const [page, setPage] = useState(0);
  const { data: moviesData, isLoading } = useMovies(page, 10);
  const movies = moviesData?.content || [];
  const totalPages = moviesData?.totalPages || 1;
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const [activeGenre, setActiveGenre] = useState('All');

  const filteredMovies = useMemo(() => {
    if (!movies) return [];
    
    // Standard Strategy/Predicate pattern for filtering
    const predicates = [
      (m: any) => activeGenre === 'All' || (m.genre && m.genre.toLowerCase().includes(activeGenre.toLowerCase())),
      (m: any) => search === '' || (m.title && m.title.toLowerCase().includes(search.toLowerCase()))
    ];

    return movies.filter((movie) => predicates.every(predicate => predicate(movie)));
  }, [movies, activeGenre, search]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <HeroSection />

      {/* Movies List Section (3D Carousel) */}
      <section className="py-24 relative z-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 relative z-10">
            <div>
              <h2 className="text-4xl font-bold mb-3 text-white">Now Showing</h2>
              <p className="text-zinc-400 text-lg">Find movies playing in theaters near you.</p>
            </div>
          </div>
          
          <FilterBar 
            activeGenre={activeGenre}
            onGenreChange={setActiveGenre}
          />
        </div>

        {/* The 3D Coverflow stretches full width */}
        <div className="w-full mt-4">
          {isLoading ? (
            <div className="flex justify-center gap-6 overflow-hidden px-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`aspect-[2/3] w-[260px] md:w-[300px] lg:w-[340px] bg-zinc-900 animate-pulse rounded-2xl border border-zinc-800 shrink-0 ${i !== 2 ? 'opacity-50 scale-90' : 'scale-100 z-10 shadow-2xl'}`} />
              ))}
            </div>
          ) : (
            <>
              {filteredMovies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
                  <p className="text-zinc-500">Try adjusting your filters, format, or search query.</p>
                </div>
              ) : (
                <LatestReleases3D movies={filteredMovies} />
              )}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-12 pb-4">
                  <button
                    onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                    disabled={page === 0}
                    className="flex items-center gap-1 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-white text-sm font-medium rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-zinc-500 text-sm font-medium px-2">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={page >= totalPages - 1}
                    className="flex items-center gap-1 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-900 text-white text-sm font-medium rounded-full transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <FeaturesSection />
    </div>
  );
}
