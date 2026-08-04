import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoutes, getVehicles, createTrip } from '../services/trips.service';

const formatLocalDateTime = (date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date - tzOffset).toISOString().slice(0, 16);
};

const CreateTrip = () => {
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    routeId: '',
    vehicleId: '',
    departureTime: '',
    estimatedArrival: '',
  });
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getRoutes();
        setRoutes(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load routes.');
      } finally {
        setLoadingRoutes(false);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!formData.routeId) {
        setVehicles([]);
        return;
      }

      setLoadingVehicles(true);
      try {
        const data = await getVehicles(formData.routeId);
        setVehicles(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load vehicles for this route.');
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, [formData.routeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'routeId' ? { vehicleId: '' } : {}),
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await createTrip({
        routeId: Number(formData.routeId),
        vehicleId: Number(formData.vehicleId),
        departureTime: formData.departureTime,
        estimatedArrival: formData.estimatedArrival,
      });

      setSuccess('Trip created successfully.');
      setFormData({
        routeId: '',
        vehicleId: '',
        departureTime: '',
        estimatedArrival: '',
      });
      setVehicles([]);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create trip.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Create Trip</h1>

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Route</label>
            <select
              name="routeId"
              value={formData.routeId}
              onChange={handleChange}
              required
              disabled={loadingRoutes}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select route</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.fromLocality?.name} → {route.toLocality?.name} ({route.vehicleType?.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle</label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
              disabled={!formData.routeId || loadingVehicles}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.licensePlate} — {vehicle.vehicleType?.name} — {vehicle.route?.fromLocality?.name} → {vehicle.route?.toLocality?.name}
                </option>
              ))}
            </select>
            {!formData.routeId && (
              <p className="mt-2 text-sm text-slate-500">Choose a route first to load available vehicles.</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Departure Time</label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                min={formatLocalDateTime(new Date())}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Arrival</label>
              <input
                type="datetime-local"
                name="estimatedArrival"
                value={formData.estimatedArrival}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                min={formData.departureTime || formatLocalDateTime(new Date())}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || loadingRoutes || loadingVehicles}
            className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating trip...' : 'Create Trip'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
