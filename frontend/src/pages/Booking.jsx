import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, Users, DollarSign, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function BookingPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trips/${tripId}`);
      setTrip(response.data);
    } catch (err) {
      setError('Error loading trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const selectedFareId = trip.route?.fares?.[0]?.id || trip.route?.fare?.id;

      if (!selectedFareId) {
        setError('No fare is available for this route yet.');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/bookings`,
        {
          tripId: parseInt(tripId),
          fareId: selectedFareId,
          seatNumber: selectedSeat || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Booking confirmed! Proceeding to payment...');
      setTimeout(() => {
        navigate(`/payment/${response.data.booking.id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Trip not found</p>
      </div>
    );
  }

  const availableSeats = trip.availableSeats ?? ((trip.vehicle?.capacity || 0) - (trip.bookings?.length || 0));
  const farePrice = trip.route?.fares?.[0]?.price || trip.route?.fare?.price || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Booking</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Trip Details */}
          <div className="space-y-4 mb-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} />
              <div>
                <p className="text-gray-600 text-sm">Route</p>
                <p className="font-semibold text-gray-800">
                  {trip.route?.fromLocality?.name} to {trip.route?.toLocality?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="text-blue-600" size={20} />
              <div>
                <p className="text-gray-600 text-sm">Departure</p>
                <p className="font-semibold text-gray-800">
                  {new Date(trip.departureTime).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="text-blue-600" size={20} />
              <div>
                <p className="text-gray-600 text-sm">Vehicle Type</p>
                <p className="font-semibold text-gray-800">
                  {trip.route?.vehicleType?.name} (License: {trip.vehicle?.licensePlate})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="text-blue-600" size={20} />
              <div>
                <p className="text-gray-600 text-sm">Fare Price</p>
                <p className="font-semibold text-gray-800">GMD {farePrice}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBooking} className="space-y-6">
            {availableSeats > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Seat (Optional)
                </label>
                <input
                  type="text"
                  value={selectedSeat}
                  onChange={(e) => setSelectedSeat(e.target.value)}
                  placeholder="e.g., A1, B2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {availableSeats <= 0 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                This trip is fully booked. Please select another trip.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || availableSeats <= 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}