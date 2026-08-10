import { QrCode } from 'lucide-react';

interface TicketStubProps {
  movieTitle: string;
  theater: string;
  date: string;
  time: string;
  seats: string[];
  screen: string;
  posterUrl?: string;
}

export function TicketStub({ movieTitle, theater, date, time, seats, screen, posterUrl }: TicketStubProps) {
  return (
    <div className="flex w-full max-w-2xl bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 relative">
      
      {/* Left side: Movie Info */}
      <div className="flex-1 p-6 relative">
        <div className="absolute top-0 right-0 bottom-0 w-8 flex flex-col justify-between items-center -mr-4 py-2 z-10">
            {/* Perforated edge circles */}
            {[...Array(6)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-background rounded-full border border-zinc-800/50"></div>
            ))}
        </div>
        
        <div className="flex gap-4">
          {posterUrl && (
            <div className="w-20 aspect-[2/3] rounded bg-zinc-800 flex-shrink-0 overflow-hidden shadow-md">
              <img src={posterUrl} alt={movieTitle} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 leading-tight">{movieTitle}</h3>
              <p className="text-zinc-400 text-sm">{theater}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Date</p>
                <p className="text-sm font-semibold text-zinc-200">{date}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Time</p>
                <p className="text-sm font-semibold text-zinc-200">{time}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Screen</p>
                <p className="text-sm font-semibold text-zinc-200">{screen}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Seats</p>
                <p className="text-sm font-semibold text-red-500">{seats.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Tear-off stub */}
      <div className="w-32 bg-red-950/20 border-l border-dashed border-zinc-700 flex flex-col items-center justify-center p-4 relative">
        <div className="w-16 h-16 bg-white p-1 rounded-sm mb-3">
           <QrCode className="w-full h-full text-black" />
        </div>
        <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase rotate-90 absolute right-2 transform origin-center whitespace-nowrap">
          Scan Entry
        </p>
      </div>
    </div>
  );
}
