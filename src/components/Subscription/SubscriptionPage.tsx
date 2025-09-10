import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Loader2, CreditCard, ArrowLeft } from 'lucide-react';
import { useAuth, supabase } from '../../context/AuthContext';
import { products } from '../../stripe-config';
import { Link } from 'react-router-dom';

interface Subscription {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
}

export default function SubscriptionPage() {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id, current_period_end, cancel_at_period_end')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!session?.access_token) return;

    setCheckoutLoading(priceId);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/subscription`,
          mode,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return 'No subscription';
    
    switch (subscription.subscription_status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Trial';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      case 'incomplete':
        return 'Incomplete';
      default:
        return 'No subscription';
    }
  };

  const isSubscriptionActive = () => {
    return subscription?.subscription_status === 'active' || subscription?.subscription_status === 'trialing';
  };

  const getCurrentProduct = () => {
    if (!subscription?.price_id) return null;
    return products.find(p => p.priceId === subscription.price_id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-blue-900 font-medium">Loading subscription...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Subscription Plans</h1>
          <p className="text-gray-600">Choose the perfect plan for your pet grooming business</p>
        </div>

        {/* Current Subscription Status */}
        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Current Subscription</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Status: <span className={`${isSubscriptionActive() ? 'text-green-600' : 'text-gray-600'}`}>
                    {getSubscriptionStatus()}
                  </span>
                </p>
                {getCurrentProduct() && (
                  <p className="text-gray-600">Plan: {getCurrentProduct()?.name}</p>
                )}
                {subscription.current_period_end && (
                  <p className="text-gray-600">
                    {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on:{' '}
                    {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                  </p>
                )}
              </div>
              {isSubscriptionActive() && (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Active</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Available Plans */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
          {products.map((product, index) => {
            const isCurrentPlan = subscription?.price_id === product.priceId;
            const isActive = isSubscriptionActive() && isCurrentPlan;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
                  isCurrentPlan ? 'ring-2 ring-orange-400' : ''
                }`}
              >
                <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{product.name}</h3>
                      <p className="text-orange-100 mt-1">{product.description}</p>
                    </div>
                    {isCurrentPlan && (
                      <div className="bg-white/20 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium">Current Plan</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-blue-900 mb-2">
                      $247<span className="text-lg font-normal text-gray-600">/month</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">24/7 online booking system</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Automated WhatsApp notifications</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Customer management system</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Admin dashboard with analytics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Unlimited bookings</span>
                    </div>
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => handleCheckout(product.priceId, product.mode)}
                      disabled={checkoutLoading === product.priceId}
                      className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      {checkoutLoading === product.priceId ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>
                            {product.mode === 'subscription' ? 'Subscribe Now' : 'Buy Now'}
                          </span>
                        </>
                      )}
                    </button>
                  )}

                  {isActive && (
                    <div className="w-full bg-green-100 text-green-800 py-3 rounded-lg font-semibold text-center">
                      ✓ Currently Active
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            All plans include customer support and regular updates. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}