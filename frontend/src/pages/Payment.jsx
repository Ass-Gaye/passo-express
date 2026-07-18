import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Loader, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const intentResponse = await axios.post(
        `${API_URL}/api/payments/intent`,
        {
          bookingId: Number(bookingId),
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPaymentId(intentResponse.data.payment.id);

      const confirmResponse = await axios.post(
        `${API_URL}/api/payments/confirm`,
        {
          paymentId: intentResponse.data.payment.id,
          transactionId: intentResponse.data.payment.transactionId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(confirmResponse.data.message || 'Payment completed successfully');
      setTimeout(() => navigate('/my-bookings'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment could not be completed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">Complete Payment</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CARD">Card</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="WALLET">Wallet</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin" size={18} />
                  Processing...
                </span>
              ) : (
                'Pay Now'
              )}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-500">
            {paymentId
              ? `Payment record created for booking ${bookingId}`
              : 'This checkout is ready for test payments in the current environment.'}
          </p>
        </div>
      </div>
    </div>
  );
}
