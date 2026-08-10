'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-12 pt-24 sm:pt-36">
      {/* Deep Cinematic Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
        <div className="h-[500px] w-[800px] rounded-full bg-red-600/15 mix-blend-screen blur-[120px] transform -translate-y-1/2" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-5 py-2 text-sm font-medium text-red-400 backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.2)]"
        >
          <Ticket className="h-4 w-4" />
          Premium Cinema Experience
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter mb-8 text-white drop-shadow-2xl"
        >
          Book tickets for the <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 filter drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]">latest blockbusters</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg sm:text-xl text-zinc-400 mb-12 font-medium leading-relaxed"
        >
          Experience movies like never before. Browse showtimes, select your favorite luxury recliners, and enjoy crystal clear IMAX visuals with immersive Dolby Atmos sound.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          <Button size="lg" className="w-full sm:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] px-8 py-6 rounded-xl font-bold text-lg transition-all hover:scale-105">
            Browse Movies
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 rounded-xl font-bold border-zinc-800 bg-black/50 text-zinc-300 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all">
              View My Tickets
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
