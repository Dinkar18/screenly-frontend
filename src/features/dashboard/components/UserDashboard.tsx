'use client';

import { TicketStub } from '@/features/booking/components/TicketStub';
import { User, Settings, LogOut, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookings } from '@/features/booking/hooks/useBookings';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  
  const [page, setPage] = useState(0);
  const { data: bookingsData, isLoading } = useBookings(page);

  const bookings = bookingsData?.content || [];
  const totalPages = bookingsData?.totalPages || 1;

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null; // or a loading skeleton

  const userNameInitials = user.email.substring(0, 2).toUpperCase();
  const userName = user.email.split('@')[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 min-h-screen flex flex-col md:flex-row gap-10">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-card border border-border/50 rounded-2xl p-6 sticky top-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              {userNameInitials}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-white font-bold truncate">{userName}</h2>
              <p className="text-zinc-500 text-sm truncate">{user.email}</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-red-950/20 text-red-500 border border-red-900/30 rounded-xl transition-colors font-medium">
              <Ticket className="w-5 h-5" />
              My Bookings
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors font-medium">
              <User className="w-5 h-5" />
              Profile details
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors font-medium">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>
          
          <div className="mt-8 pt-8 border-t border-border/50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-500 hover:bg-red-950/20 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
        <p className="text-zinc-400 mb-8">View your upcoming and past movie tickets.</p>
        
        {isLoading ? (
          <div className="space-y-6">
            <div className="w-full h-40 bg-zinc-900 animate-pulse rounded-xl" />
            <div className="w-full h-40 bg-zinc-900 animate-pulse rounded-xl" />
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <TicketStub 
                key={booking.id}
                movieTitle={booking.movieTitle || 'Unknown Movie'}
                theater={booking.theaterName || 'Screenly Premium'}
                date={booking.showtime ? new Date(booking.showtime).toLocaleDateString() : 'Unknown Date'}
                time={booking.showtime ? new Date(booking.showtime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Unknown Time'}
                seats={booking.bookedSeats || []}
                screen={booking.screenName || 'Standard'}
                posterUrl={'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80'}
              />
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-zinc-400 text-sm font-medium">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={page >= totalPages - 1}
                  className="flex items-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
            <Ticket className="w-16 h-16 text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No tickets yet</h3>
            <p className="text-zinc-500 text-center max-w-sm mb-6">
              You haven't booked any movies. It's time to grab some popcorn and enjoy the big screen!
            </p>
            <Link href="/">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
                Browse Movies
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
