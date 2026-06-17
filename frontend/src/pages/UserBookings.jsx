import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/bookings?status=${filter !== 'all' ? filter : ''}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(response.data.bookings);
    } catch (err) {
      setError('Error fetching bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'CANCELLED':
        return <XCircle className="text-red-600" size={20} />;
      case 'COMPLETED':
        return <CheckCircle className="text-blue-600" size={20} />;
      default:
        return <AlertCircle className="text-yellow-600" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      NO_SHOW: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'All Bookings' : status}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Bookings List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Booking Reference</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {booking.bookingReference}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      getStatusBadge(booking.status)
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="font-semibold text-gray-800">
                      {booking.fare?.fromLocality?.name} →{' '}
                      {booking.fare?.toLocality?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Departure</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(booking.trip?.departureTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="font-semibold text-gray-800">GMD {booking.totalPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      booking.paymentStatus === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                {booking.seatNumber && (
                  <p className="text-sm text-gray-600">
                    Seat: <span className="font-semibold">{booking.seatNumber}</span>
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}