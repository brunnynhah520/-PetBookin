import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Crown, Calendar, Settings, LogOut, CreditCard } from 'lucide-react';
import { useAuth, supabase } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { products } from '../../stripe-config';

interface Subscription {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
}

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getCurrentProduct = () => {
    if (!subscription?.price_id) return null;
    return products.find(product => 
      product.prices.some(price => price.id === subscription.price_id)
    );
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return 'No subscription';
    
    switch (subscription.subscription_status) {
      case 'active':
        return 'PetBookin Pro - Active';
      case 'trialing':
        return 'PetBookin Pro - Trial';
      case 'past_due':
        return 'PetBookin Pro - Past Due';
      case 'canceled':
        return 'PetBookin Pro - Canceled';
      case 'incomplete':
        return 'PetBookin Pro - Incomplete';
      default:
        return 'No active subscription';
    }
  };

  const isSubscriptionActive = () => {
    return subscription?.subscription_status === 'active' || subscription?.subscription_status === 'trialing';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Welcome back!</h1>
                  <p className="text-blue-100">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Subscription Status */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Subscription Status</h2>
              {loading ? (
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`rounded-lg p-4 border-2 ${
                  isSubscriptionActive() 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Crown className={`w-6 h-6 ${
                      isSubscriptionActive() ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <p className="font-semibold text-gray-900">{getSubscriptionStatus()}</p>
                      {getCurrentProduct() && (
                        <p className="text-gray-600">Plan: {getCurrentProduct()!.name}</p>
                      )}
                      {subscription?.current_period_end && (
                        <p className="text-sm text-gray-600">
                          {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on:{' '}
                          {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/"
                className="bg-gradient-to-r from-orange-400 to-pink-400 text-white p-6 rounded-xl hover:from-orange-500 hover:to-pink-500 transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">Book Appointment</h3>
                    <p className="text-sm text-orange-100">Schedule a new booking</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/subscription"
                className="bg-gradient-to-r from-blue-400 to-purple-400 text-white p-6 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">Manage Subscription</h3>
                    <p className="text-sm text-blue-100">View and update your plan</p>
                  </div>
                </div>
              </Link>

              {isSubscriptionActive() && (
                <Link
                  to="/admin"
                  className="bg-gradient-to-r from-green-400 to-teal-400 text-white p-6 rounded-xl hover:from-green-500 hover:to-teal-500 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">Admin Panel</h3>
                      <p className="text-sm text-green-100">Manage your business</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Subscription CTA */}
            {!isSubscriptionActive() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900">Upgrade to PetBookin Pro</h3>
                    <p className="text-orange-700">Get access to the admin dashboard and premium features</p>
                  </div>
                  <Link
                    to="/subscription"
                    className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors font-medium"
                  >
                    Upgrade Now
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}