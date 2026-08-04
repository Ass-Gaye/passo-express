import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Users, Calendar, DollarSign, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function SearchTrips() {
  const navigate = useNavigate();
  const [fromLocality, setFromLocality] = useState('');
  const [toLocality, setToLocality] = useState('');
  const [date, setDate] = useState('');
  const [trips, setTrips] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch localities on mount
  useEffect(() => {
    fetchLocalities();
  }, []);

  const fetchLocalities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/localities`);
      setLocalities(response.data);
    } catch (err) {
      console.error('Error fetching localities:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setHasSearched(true);
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/api/trips/available`, {
        params: {
          fromLocalityId: parseInt(fromLocality),
          toLocalityId: parseInt(toLocality),
          date,
        },
      });
      setTrips(response.data);
    } catch (err) {
      setError('Error searching trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Trips</h2>
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <select
                value={fromLocality}
                onChange={(e) => setFromLocality(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select locality</option>
                {localities.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select
                value={toLocality}
                onChange={(e) => setToLocality(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select locality</option>
                {localities.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Trips List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
          ) : !hasSearched ? (
            <div className="rounded-2xl border border-dashed border-blue-200 bg-white/70 p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-800">Find your next trip</p>
              <p className="mt-2 text-sm text-gray-600">
                Select a route and date to see available journeys.
              </p>
            </div>
          ) : trips.length > 0 ? (
            trips.map((trip) => {
              const availableSeats =
                trip.availableSeats !== null && trip.availableSeats !== undefined
                  ? trip.availableSeats
                  : Math.max((trip.vehicle?.capacity || 0) - (trip.bookings?.length || 0), 0);
              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Route</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {trip.route?.fromLocality?.name} →{' '}
                        {trip.route?.toLocality?.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Departure</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {new Date(trip.departureTime).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-blue-600" />
                        <div>
                          <p className="text-gray-500 text-sm">Available Seats</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {trip.availableSeats === null ? 'Available' : availableSeats > 0 ? availableSeats : 'Full'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm">Vehicle Type</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {trip.route?.vehicleType?.name}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/booking/${trip.id}`)}
                        disabled={availableSeats <= 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-800">No trips available</p>
              <p className="mt-2 text-sm text-gray-600">
                There are no journeys matching your route and date yet. Try a different date or route.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}