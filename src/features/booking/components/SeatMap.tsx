'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingApi } from '../api/booking';
import { Seat } from '../types';
import { Loader2 } from 'lucide-react';
import { PaymentDialog } from './PaymentDialog';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface SeatMapProps {
  showtimeId: string;
  basePrice?: number;
}

export function SeatMap({ showtimeId, basePrice = 15 }: SeatMapProps) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setSeats([]); // Reset seats when showtime changes

    bookingApi.getSeats(showtimeId).then((data: any) => {
      if (isMounted) {
        const mappedSeats = data.map((s: any) => {
          // Clean standard: Backend explicitly provides separate fields
          let rowNum = s.rowNumber ? String(s.rowNumber) : '1';
          let colNum = s.seatLetter || 'A';
          
          // Graceful fallback for backward compatibility while backend deploys
          if (!s.rowNumber && s.seatIdentifier) {
            const match = s.seatIdentifier.match(/^(\d+)([a-zA-Z]+)$/);
            rowNum = match ? match[1] : '1';
            colNum = match ? match[2].toUpperCase() : 'A';
          }
          
          return {
            id: s.showtimeSeatId,
            row: rowNum,
            number: colNum,
            tier: 'standard', // Keep everything standard as requested
            price: basePrice, // Use dynamic price from Showtime
            status: s.status ? s.status.toLowerCase() : 'available'
          };
        });

        setSeats(mappedSeats);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [showtimeId]);

  const selectedSeats = seats.filter(s => s.status === 'selected');
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const toggleSeat = (seatId: string) => {
    setSeats(prev => prev.map(seat => {
      if (seat.id === seatId) {
        if (seat.status === 'sold' || seat.status === 'reserved' || seat.status === 'booked') return seat; 
        
        if (seat.status === 'selected') {
          return { ...seat, status: 'available' };
        }
        
        if (selectedSeats.length >= 6) {
          toast('You can only select up to 6 seats', 'error');
          return seat;
        }
        
        return { ...seat, status: 'selected' };
      }
      return seat;
    }));
  };

  const handleBookingClick = async () => {
    if (selectedSeats.length === 0) return;
    
    setIsProcessingBooking(true);
    try {
      // 1. Create the booking on backend
      const bookingData = {
        showtimeId: showtimeId,
        showtimeSeatIds: selectedSeats.map(s => s.id)
      };
      
      const booking = await bookingApi.createBooking(bookingData);
      setBookingId(booking.id);
      
      // 2. Fetch payment intent from backend
      const intentRes = await bookingApi.createPaymentIntent(booking.id);
      setClientSecret(intentRes.clientSecret);
      
      // 3. Open the Stripe payment dialog
      setShowPaymentDialog(true);
    } catch (error: any) {
      if (error.response?.status === 409) {
        const conflictMsg =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.error ||
          'One or more selected seats are no longer available. Please select different seats.';
        toast(conflictMsg, 'error');
      } else {
        toast(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            error.response?.data?.error ||
            'Failed to initialize booking',
          'error'
        );
      }
    } finally {
      setIsProcessingBooking(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!bookingId) return;
    
    toast('Payment successful! Confirming your tickets...', 'success');
    
    // Race Condition Fix: Wait 3 seconds for the Stripe Webhook to finish updating
    // the backend database to CONFIRMED before redirecting the user to the dashboard.
    setTimeout(() => {
      // Force React Query to clear its cache so it fetches the new ticket from the server
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      setShowPaymentDialog(false);
      router.push('/dashboard');
    }, 3000);
  };

  const handlePaymentError = (msg: string) => {
    toast(`Payment failed: ${msg}`, 'error');
  };

  const handlePaymentDialogClose = (open: boolean) => {
    if (!open) {
      // User cancelled payment
      setShowPaymentDialog(false);
      toast('Payment cancelled. Your seats are still reserved for a short time.', 'info');
      
      // We could ideally trigger a backend call to cancel the booking here
      // But they will expire anyway
    }
  };

  const renderRow = (rowSeats: Seat[], rowId: string) => {
    // Sort seats by length first (A before AA), then alphabetically
    const sortedSeats = [...rowSeats].sort((a, b) => {
      if (a.number.length !== b.number.length) return a.number.length - b.number.length;
      return a.number.localeCompare(b.number);
    });

    return (
      <div key={rowId} className="flex items-center justify-center gap-4 mb-3 w-full">
        <div className="w-6 text-white/40 font-bold text-center text-sm">{rowId}</div>
        <div className="flex gap-2">
          {sortedSeats.map(seat => {
            const isUnavailable = seat.status === 'sold' || seat.status === 'reserved' || seat.status === 'booked';
            
            return (
              <motion.button
                key={seat.id}
                whileTap={!isUnavailable ? { scale: 0.9 } : {}}
                onClick={() => toggleSeat(seat.id)}
                disabled={isUnavailable}
                aria-label={`Seat ${rowId}${seat.number}, ${isUnavailable ? 'Unavailable' : seat.status === 'selected' ? 'Selected' : 'Available'}`}
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-t-xl rounded-b-sm font-bold text-xs transition-all border flex items-center justify-center
                  ${isUnavailable
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border-zinc-700 opacity-60' 
                    : seat.status === 'selected'
                      ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-105'
                      : 'bg-zinc-700/80 text-white/90 border-zinc-500 hover:border-red-400 hover:bg-zinc-600'
                  }
                `}
              >
                {!isUnavailable ? seat.number : 'X'}
              </motion.button>
            );
          })}
        </div>
        <div className="w-6 text-white/40 font-bold text-center text-sm">{rowId}</div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-red-500 mb-4" />
        <p className="text-zinc-500 font-medium">Loading seat map...</p>
      </div>
    );
  }

  // Group seats by Tier
  const vipSeats = seats.filter(s => s.tier === 'vip');
  const premiumSeats = seats.filter(s => s.tier === 'premium');
  const standardSeats = seats.filter(s => s.tier === 'standard');

  const getRows = (tierSeats: Seat[]) => {
    const rows = new Set(tierSeats.map(s => s.row));
    return Array.from(rows).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Screen */}
      <div className="w-4/5 h-12 border-t-2 border-red-500/30 rounded-[50%] mb-20 shadow-[0_-15px_40px_rgba(220,38,38,0.1)] flex justify-center pt-2 relative">
        <span className="text-red-500/50 tracking-[0.4em] text-xs font-bold uppercase absolute -top-4 bg-background px-4">Screen</span>
      </div>

      <div className="w-full flex flex-col items-center overflow-x-auto pb-8 hide-scrollbar">
        <div className="min-w-max px-4">
          
          {vipSeats.length > 0 && (
            <>
              <div className="text-red-500/60 text-xs uppercase font-bold tracking-widest mb-4 mt-2 text-center w-full">VIP Recliner - $25</div>
              {getRows(vipSeats).map(row => renderRow(vipSeats.filter(s => s.row === row), row))}
            </>
          )}

          {premiumSeats.length > 0 && (
            <>
              <div className="text-red-500/60 text-xs uppercase font-bold tracking-widest mb-4 mt-8 text-center w-full">Premium - $18</div>
              {getRows(premiumSeats).map(row => renderRow(premiumSeats.filter(s => s.row === row), row))}
            </>
          )}

          {standardSeats.length > 0 && (
            <>
              <div className="text-red-500/60 text-xs uppercase font-bold tracking-widest mb-4 mt-8 text-center w-full">Standard - ₹{basePrice}</div>
              {getRows(standardSeats).map(row => renderRow(standardSeats.filter(s => s.row === row), row))}
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 mb-8 bg-zinc-900/50 px-8 py-4 rounded-full border border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md border border-zinc-500 bg-zinc-700/80"></div>
          <span className="text-sm text-zinc-300 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
          <span className="text-sm text-white font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center opacity-80">
            <span className="text-zinc-600 text-[10px] font-bold">X</span>
          </div>
          <span className="text-sm text-zinc-500 font-medium">Sold</span>
        </div>
      </div>

      {/* Checkout Footer */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-md border-t border-red-900/30 p-4 sm:p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-50"
          >
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
                </h3>
                <p className="text-zinc-400 text-sm font-medium">
                  Seats: {selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}
                </p>
              </div>
              <Button 
                onClick={handleBookingClick}
                disabled={isProcessingBooking}
                size="lg"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-12 py-6 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-105 transition-all uppercase tracking-wider disabled:opacity-70 disabled:hover:scale-100"
              >
                {isProcessingBooking ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : `Pay ₹${totalPrice}`}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentDialog 
        isOpen={showPaymentDialog}
        onOpenChange={handlePaymentDialogClose}
        clientSecret={clientSecret}
        totalPrice={totalPrice}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
