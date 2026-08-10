import { Film, Monitor, Star } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-24 border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          <div className="flex flex-col items-center p-8 rounded-3xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm hover:border-red-900/50 hover:bg-zinc-900/80 transition-all duration-300">
            <div className="h-16 w-16 rounded-2xl bg-red-950/50 border border-red-900/50 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <Monitor className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">IMAX Experience</h3>
            <p className="text-zinc-400 text-base leading-relaxed">
              Crystal clear, laser-projected visuals on the biggest screens in the city.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-8 rounded-3xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm hover:border-red-900/50 hover:bg-zinc-900/80 transition-all duration-300">
            <div className="h-16 w-16 rounded-2xl bg-red-950/50 border border-red-900/50 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <Film className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Early Access</h3>
            <p className="text-zinc-400 text-base leading-relaxed">
              Book tickets for highly anticipated blockbuster premieres before anyone else.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-8 rounded-3xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm hover:border-red-900/50 hover:bg-zinc-900/80 transition-all duration-300">
            <div className="h-16 w-16 rounded-2xl bg-red-950/50 border border-red-900/50 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <Star className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Luxury Recliners</h3>
            <p className="text-zinc-400 text-base leading-relaxed">
              Plush leather seating with dine-in service delivered straight to your seat.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
