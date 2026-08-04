import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Fares from "./pages/Fares";
import CreateFare from "./pages/CreateFare";
import CreateTrip from "./pages/CreateTrip";
import ManageTrips from "./pages/ManageTrips";
import Localities from "./pages/Localities";
import EditFare from './pages/EditFare';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import SearchTrips from './pages/SearchTrips';
import Booking from './pages/Booking';
import UserBookings from './pages/UserBookings';
import NotificationsCenter from './pages/NotificationsCenter';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/Payment';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/fares" element={<Fares />} />
        <Route path="/localities" element={<Localities />} />

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
          <Route path="/create-fare" element={<CreateFare />} />
          <Route path="/edit-fare/:id" element={<EditFare />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'OPERATOR']} />}>
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/manage-trips" element={<ManageTrips />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'OPERATOR', 'DRIVER']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['PASSENGER', 'ADMIN', 'SUPER_ADMIN', 'OPERATOR', 'DRIVER']} />}>
          <Route path="/search-trips" element={<SearchTrips />} />
          <Route path="/booking/:tripId" element={<Booking />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/my-bookings" element={<UserBookings />} />
          <Route path="/notifications" element={<NotificationsCenter />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App