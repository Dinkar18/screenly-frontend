'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutFormProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
  totalPrice: number;
}

function CheckoutForm({ onSuccess, onError, totalPrice }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    
    // In this simplified flow, we are using confirmPayment with redirect: "if_required"
    // Since we handle the backend confirmation separately, we just need Stripe to process the card.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard',
      },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      onError('Payment status unknown');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 text-lg"
      >
        {isProcessing ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
        ) : (
          `Pay $${totalPrice}`
        )}
      </Button>
    </form>
  );
}

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clientSecret: string | null;
  totalPrice: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function PaymentDialog({ isOpen, onOpenChange, clientSecret, totalPrice, onSuccess, onError }: PaymentDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 p-6 shadow-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white"
        >
          X
        </button>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Complete Payment</h2>
          <p className="text-sm text-zinc-400">Secure checkout powered by Stripe.</p>
        </div>
        
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
            <CheckoutForm 
              onSuccess={onSuccess} 
              onError={onError} 
              totalPrice={totalPrice}
            />
          </Elements>
        ) : (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        )}
      </div>
    </div>
  );
}
