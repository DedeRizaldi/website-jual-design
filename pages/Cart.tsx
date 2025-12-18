import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart: React.FC = () => {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-slate-600 mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-400 mb-8">Looks like you haven't added any designs yet.</p>
        <Link
          to="/products"
          className="px-6 py-3 bg-brand-600 text-white font-medium rounded-full hover:bg-brand-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg bg-slate-800"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-white font-medium">{item.title}</h3>
                  <p className="text-sm text-brand-400">{item.category}</p>
                </div>
                <div className="text-right mx-4">
                  <div className="text-white font-bold">${item.price.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxes</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-slate-800 mt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center px-6 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-900/20"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={clearCart}
                className="w-full mt-4 text-sm text-slate-500 hover:text-white"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;