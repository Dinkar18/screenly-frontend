'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay, Navigation } from 'swiper/modules';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface LatestReleases3DProps {
  movies: Movie[];
}

export function LatestReleases3D({ movies }: LatestReleases3DProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-red-900/5 mix-blend-screen blur-[100px] rounded-full pointer-events-none" />
      
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={Math.floor(movies.length / 2)}
        coverflowEffect={{
          rotate: 30, // Angle of side slides
          stretch: 0, // Space between slides (in px)
          depth: 250, // Depth offset in px (z-axis)
          modifier: 1, // Effect multiplier
          slideShadows: true, // Enables slide shadows
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
        className="w-full !overflow-visible"
        breakpoints={{
          // Responsive tweaks for coverflow
          320: {
            // @ts-ignore - Swiper types don't natively support module config in breakpoints sometimes
            coverflowEffect: { depth: 150, rotate: 20 }
          },
          768: {
            // @ts-ignore
            coverflowEffect: { depth: 250, rotate: 30 }
          }
        }}
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={movie.id} className="!w-[260px] md:!w-[300px] lg:!w-[340px]">
            {({ isActive }) => (
              <div className={`transition-all duration-500 h-full ${isActive ? 'scale-100' : 'scale-95 opacity-50 blur-[2px] grayscale-[30%]'}`}>
                <MovieCard movie={movie} index={index} />
              </div>
            )}
          </SwiperSlide>
        ))}
        
        <div className="swiper-pagination !-bottom-12 !relative mt-12"></div>
      </Swiper>
      
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: rgba(255, 255, 255, 0.3) !important;
          width: 10px !important;
          height: 10px !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background-color: #dc2626 !important;
          width: 30px !important;
          border-radius: 5px !important;
          box-shadow: 0 0 10px rgba(220, 38, 38, 0.6);
        }
        .swiper-3d .swiper-slide-shadow-left,
        .swiper-3d .swiper-slide-shadow-right {
          background-image: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)) !important;
          border-radius: 1rem;
        }
      `}</style>
    </div>
  );
}
