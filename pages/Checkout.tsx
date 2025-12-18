import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Landmark, CheckCircle, Lock, Loader, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/supabaseOrders';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0 && !success) {
    navigate('/products');
    return null;
  }

  if (!user && !success) {
    navigate('/login');
    return null;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save order to database
    const result = await createOrder(user.id, items, total);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      clearCart();
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-slate-400 mb-8">
            Thank you for your purchase. Your digital assets are now ready for download.
          </p>
          <button
            onClick={() => navigate('/downloads')}
            className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            Go to Downloads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-400">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Lock size={16} className="mr-2 text-brand-400" /> Payment Method
              </h3>

              <div className="space-y-4">
                <label className="flex items-center p-4 border border-brand-500/50 bg-brand-900/10 rounded-lg cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="text-brand-600 focus:ring-brand-500" />
                  <div className="ml-3 flex items-center">
                    <CreditCard size={20} className="text-slate-300 mr-2" />
                    <span className="text-white font-medium">Credit Card</span>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-slate-700 rounded-lg opacity-50 cursor-not-allowed">
                  <input type="radio" name="payment" disabled className="text-brand-600" />
                  <div className="ml-3 flex items-center">
                    <Landmark size={20} className="text-slate-300 mr-2" />
                    <span className="text-slate-400">Bank Transfer</span>
                  </div>
                </label>
              </div>

              <form onSubmit={handlePayment} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" disabled className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" disabled className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">CVC</label>
                    <input type="text" placeholder="123" disabled className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3 bg-white text-slate-950 font-bold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-300 truncate max-w-[180px]">{item.title}</span>
                    <span className="text-white">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                <span className="text-slate-400">Total</span>
                <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;