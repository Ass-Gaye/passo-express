import { useEffect, useState } from 'react';
import { getAllTrips, updateTrip, deleteTrip } from '../services/trips.service';

const formatLocalDateTime = (date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date - tzOffset).toISOString().slice(0, 16);
};

const ManageTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTripId, setEditingTripId] = useState(null);
  const [editData, setEditData] = useState({ status: '', departureTime: '', estimatedArrival: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTrips = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getAllTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to load trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadTrips = async () => {
      await fetchTrips();
    };

    loadTrips();
  }, []);

  const handleEditClick = (trip) => {
    setEditingTripId(trip.id);
    setEditData({
      status: trip.status,
      departureTime: formatLocalDateTime(new Date(trip.departureTime)),
      estimatedArrival: formatLocalDateTime(new Date(trip.estimatedArrival)),
    });
    setSuccess('');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingTripId(null);
    setEditData({ status: '', departureTime: '', estimatedArrival: '' });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSave = async (tripId) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await updateTrip(tripId, {
        status: editData.status,
        departureTime: editData.departureTime,
        estimatedArrival: editData.estimatedArrival,
      });
      setSuccess('Trip updated successfully.');
      setEditingTripId(null);
      await fetchTrips();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to update trip.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Delete this trip? This cannot be undone.')) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await deleteTrip(tripId);
      setSuccess('Trip deleted successfully.');
      await fetchTrips();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to delete trip.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">Manage Trips</h1>
          <p className="mt-2 text-slate-600">Update trip schedules, status, or delete trips from the system.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
            {success}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-xl">Loading trips...</div>
        ) : trips.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-xl">No trips available.</div>
        ) : (
          <div className="space-y-6">
            {trips.map((trip) => (
              <div key={trip.id} className="rounded-3xl bg-white p-6 shadow-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">
                      {trip.route?.fromLocality?.name} → {trip.route?.toLocality?.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      Vehicle: {trip.vehicle?.licensePlate} — {trip.vehicle?.vehicleType?.name}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      Departure: {new Date(trip.departureTime).toLocaleString()} · Estimated Arrival: {new Date(trip.estimatedArrival).toLocaleString()}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      Status: <span className="font-semibold">{trip.status}</span> · Available Seats: {trip.availableSeats ?? 'N/A'}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleEditClick(trip)}
                      className="rounded-2xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                    >
                      {editingTripId === trip.id ? 'Editing' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      disabled={submitting}
                      className="rounded-2xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {editingTripId === trip.id && (
                  <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                    <div className="grid gap-6 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="ONGOING">Ongoing</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="DELAYED">Delayed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Departure Time</label>
                        <input
                          type="datetime-local"
                          name="departureTime"
                          value={editData.departureTime}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Arrival</label>
                        <input
                          type="datetime-local"
                          name="estimatedArrival"
                          value={editData.estimatedArrival}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleSave(trip.id)}
                        disabled={submitting}
                        className="rounded-2xl bg-emerald-600 px-5 py-3 text-white transition hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        type="button"
                        className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 transition hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTrips;
