import React from 'react';
import { motion } from 'framer-motion';
import { User, PawPrint, Calendar, Clock, Phone, Edit } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Booking } from '../../types';
import { formatDateTime } from '../../utils/dates';
import BookingDetailModal from './BookingDetailModal';

interface BookingListProps {
  bookings: Booking[];
  statusFilter: string;
  onStatusFilterChange: (status: any) => void;
}

export default function BookingList({ bookings, statusFilter, onStatusFilterChange }: BookingListProps) {
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { updateBooking } = useAdmin();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBooking(bookingId, { status: newStatus as any });
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4 sm:mb-0">
          Booking List ({bookings.length})
        </h2>
        
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-4">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{formatDateTime(booking.date, booking.time)}</span>
                  </div>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status === 'pending' ? 'Pending' : 
                     booking.status === 'confirmed' ? 'Confirmed' : 
                     booking.status === 'completed' ? 'Completed' : 
                     booking.status === 'cancelled' ? 'Cancelled' : booking.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer.name}</p>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Phone className="w-3 h-3" />
                        <span>{booking.customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <PawPrint className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.pet.name}</p>
                      <p className="text-sm text-gray-500">{booking.pet.breed} - {booking.pet.size === 'pequeno' ? 'Small' : booking.pet.size === 'médio' ? 'Medium' : booking.pet.size === 'grande' ? 'Large' : booking.pet.size}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Services:</p>
                      <p className="font-medium">{booking.services.map(s => s.name).join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total:</p>
                      <p className="text-xl font-bold text-orange-600">
                        ${booking.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditBooking(booking)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {statusFilter === 'all' 
                ? 'No bookings registered yet.'
                : `No bookings with status "${statusFilter === 'pending' ? 'Pending' : 
                     statusFilter === 'confirmed' ? 'Confirmed' : 
                     statusFilter === 'completed' ? 'Completed' : 
                     statusFilter === 'cancelled' ? 'Cancelled' : statusFilter}".`
              }
            </p>
          </div>
        )}
      </div>
    </div>
    
    <BookingDetailModal
      booking={selectedBooking}
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedBooking(null);
      }}
    />
    </>
  );
}